#!/usr/bin/env python3
"""
~/Downloads/visaphotosSSフォルダ内の画像からClaude APIで日付を読み取り、
日付順にソートしてGoogle Slidesに1枚ずつ貼り付けるスクリプト。

事前準備:
1. pip install -r requirements_visa_slides.txt
2. Google Cloud Consoleで OAuth 2.0 クライアントIDを作成し、
   credentials.json をこのスクリプトと同じディレクトリに配置
3. Google Slides API と Google Drive API を有効化
4. 環境変数 ANTHROPIC_API_KEY にClaude APIキーを設定
"""

import os
import sys
import base64
import mimetypes
import re
from datetime import datetime
from pathlib import Path

import anthropic
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

SCOPES = [
    "https://www.googleapis.com/auth/presentations",
    "https://www.googleapis.com/auth/drive.file",
]

IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp", ".tiff", ".tif"}
IMAGE_FOLDER = os.path.expanduser("~/Downloads/visaphotosSSフォルダ")
CREDENTIALS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "credentials.json")
TOKEN_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "token.json")


def get_image_files(folder: str) -> list[Path]:
    folder_path = Path(folder)
    if not folder_path.exists():
        print(f"エラー: フォルダが見つかりません: {folder}")
        sys.exit(1)
    files = [f for f in folder_path.iterdir() if f.suffix.lower() in IMAGE_EXTENSIONS]
    if not files:
        print(f"エラー: 画像ファイルが見つかりません: {folder}")
        sys.exit(1)
    print(f"{len(files)}枚の画像を検出しました")
    return files


def read_date_from_image(client: anthropic.Anthropic, image_path: Path) -> str | None:
    mime_type = mimetypes.guess_type(str(image_path))[0] or "image/jpeg"
    with open(image_path, "rb") as f:
        image_data = base64.standard_b64encode(f.read()).decode("utf-8")

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=256,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {"type": "base64", "media_type": mime_type, "data": image_data},
                    },
                    {
                        "type": "text",
                        "text": (
                            "この画像に写っている日付を読み取ってください。"
                            "日付が見つかった場合は YYYY-MM-DD 形式のみで回答してください。"
                            "複数ある場合は最も目立つものを1つだけ返してください。"
                            "日付が見つからない場合は NOT_FOUND とだけ回答してください。"
                        ),
                    },
                ],
            }
        ],
    )

    text = response.content[0].text.strip()
    match = re.search(r"\d{4}-\d{2}-\d{2}", text)
    if match:
        return match.group(0)
    print(f"  日付が見つかりませんでした: {image_path.name} (応答: {text})")
    return None


def authenticate_google():
    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(CREDENTIALS_FILE):
                print(f"エラー: {CREDENTIALS_FILE} が見つかりません。")
                print("Google Cloud ConsoleからOAuth 2.0クライアントIDの認証情報をダウンロードしてください。")
                sys.exit(1)
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_FILE, "w") as token:
            token.write(creds.to_json())
    return creds


def upload_image_to_drive(drive_service, image_path: Path) -> str:
    mime_type = mimetypes.guess_type(str(image_path))[0] or "image/jpeg"
    file_metadata = {"name": image_path.name}
    media = MediaFileUpload(str(image_path), mimetype=mime_type)
    file = drive_service.files().create(body=file_metadata, media_body=media, fields="id").execute()
    file_id = file.get("id")
    drive_service.permissions().create(
        fileId=file_id, body={"type": "anyone", "role": "reader"}
    ).execute()
    return file_id


def create_slides(creds, sorted_images: list[tuple[str | None, Path]]):
    slides_service = build("slides", "v1", credentials=creds)
    drive_service = build("drive", "v3", credentials=creds)

    presentation = slides_service.presentations().create(
        body={"title": "Visa Photos - 日付順"}
    ).execute()
    presentation_id = presentation["presentationId"]
    print(f"\nGoogle Slides作成完了: https://docs.google.com/presentation/d/{presentation_id}")

    existing_slides = presentation.get("slides", [])
    if existing_slides:
        first_slide_id = existing_slides[0]["objectId"]
    else:
        first_slide_id = None

    requests = []
    for i, (date_str, image_path) in enumerate(sorted_images):
        slide_id = f"slide_{i}"
        image_id = f"image_{i}"
        text_id = f"text_{i}"

        requests.append({"createSlide": {"objectId": slide_id, "insertionIndex": i + (1 if first_slide_id else 0)}})

        print(f"  画像をDriveにアップロード中: {image_path.name}")
        file_id = upload_image_to_drive(drive_service, image_path)
        image_url = f"https://drive.google.com/uc?id={file_id}"

        requests.append({
            "createImage": {
                "objectId": image_id,
                "url": image_url,
                "elementProperties": {
                    "pageObjectId": slide_id,
                    "size": {
                        "width": {"magnitude": 500, "unit": "PT"},
                        "height": {"magnitude": 375, "unit": "PT"},
                    },
                    "transform": {
                        "scaleX": 1, "scaleY": 1,
                        "translateX": 55, "translateY": 30,
                        "unit": "PT",
                    },
                },
            }
        })

        label = date_str if date_str else "日付不明"
        requests.append({
            "createShape": {
                "objectId": text_id,
                "shapeType": "TEXT_BOX",
                "elementProperties": {
                    "pageObjectId": slide_id,
                    "size": {
                        "width": {"magnitude": 300, "unit": "PT"},
                        "height": {"magnitude": 30, "unit": "PT"},
                    },
                    "transform": {
                        "scaleX": 1, "scaleY": 1,
                        "translateX": 200, "translateY": 415,
                        "unit": "PT",
                    },
                },
            }
        })
        requests.append({
            "insertText": {
                "objectId": text_id,
                "text": f"{label}  ({image_path.name})",
            }
        })
        requests.append({
            "updateTextStyle": {
                "objectId": text_id,
                "style": {"fontSize": {"magnitude": 14, "unit": "PT"}, "bold": True},
                "fields": "fontSize,bold",
            }
        })
        requests.append({
            "updateParagraphStyle": {
                "objectId": text_id,
                "style": {"alignment": "CENTER"},
                "fields": "alignment",
            }
        })

    if first_slide_id:
        requests.append({"deleteObject": {"objectId": first_slide_id}})

    slides_service.presentations().batchUpdate(
        presentationId=presentation_id, body={"requests": requests}
    ).execute()

    print(f"\n完了! {len(sorted_images)}枚のスライドを作成しました。")
    print(f"URL: https://docs.google.com/presentation/d/{presentation_id}")


def main():
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("エラー: 環境変数 ANTHROPIC_API_KEY を設定してください。")
        sys.exit(1)

    images = get_image_files(IMAGE_FOLDER)

    print("\nClaude APIで各画像の日付を読み取り中...")
    client = anthropic.Anthropic()
    dated_images: list[tuple[str | None, Path]] = []
    for img in images:
        print(f"  処理中: {img.name}")
        date_str = read_date_from_image(client, img)
        if date_str:
            print(f"  → 日付: {date_str}")
        dated_images.append((date_str, img))

    dated_images.sort(key=lambda x: (x[0] is None, x[0] or ""))
    print("\n日付順にソート完了:")
    for date_str, img in dated_images:
        print(f"  {date_str or '日付不明':>12}  {img.name}")

    print("\nGoogle認証中...")
    creds = authenticate_google()

    print("Google Slidesを作成中...")
    create_slides(creds, dated_images)


if __name__ == "__main__":
    main()
