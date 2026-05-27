"use client";

import { useRef, useState } from "react";

const MAX_BYTES = 2 * 1024 * 1024;

interface LogoUploadProps {
  logo: string | null;
  onLogo: (logo: string | null) => void;
}

export default function LogoUpload({ logo, onLogo }: LogoUploadProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState("");
  const [drag, setDrag] = useState(false);

  function process(file: File | undefined | null) {
    setErr("");
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/svg+xml"].includes(file.type)) {
      setErr("Only PNG, JPG or SVG files are supported.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setErr("File too large. Max 2 MB.");
      return;
    }
    const r = new FileReader();
    r.onload = (e) => onLogo(e.target?.result as string);
    r.readAsDataURL(file);
  }

  return (
    <div style={{ marginBottom: 14 }}>
      <label>Business Logo</label>
      {logo ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 16px",
            border: "1.5px solid #E2E0D8",
            borderRadius: 10,
            background: "#FAFAF8",
          }}
        >
          <div
            style={{
              width: 120,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff",
              borderRadius: 6,
              border: "1px solid #E8E6E0",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt="logo"
              style={{
                maxWidth: 112,
                maxHeight: 52,
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{ fontSize: 13, fontWeight: 500, color: "#1A1915", marginBottom: 3 }}
            >
              Logo uploaded ✓
            </div>
            <div style={{ fontSize: 12, color: "#9A9890" }}>
              Appears top-left on the quote
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => ref.current?.click()}
              style={{
                padding: "6px 12px",
                borderRadius: 7,
                border: "1.5px solid #E2E0D8",
                background: "#fff",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                color: "#4A4940",
              }}
            >
              Replace
            </button>
            <button
              onClick={() => {
                onLogo(null);
                setErr("");
              }}
              style={{
                padding: "6px 12px",
                borderRadius: 7,
                border: "1.5px solid #F0C4BD",
                background: "#FDF7F6",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                color: "#C0392B",
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => ref.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            process(e.dataTransfer.files[0]);
          }}
          style={{
            border: `1.5px dashed ${drag ? "#3D7A5E" : "#C8C6BE"}`,
            borderRadius: 10,
            padding: "24px 20px",
            textAlign: "center",
            cursor: "pointer",
            background: drag ? "#F0F9F4" : "#FAFAF8",
            transition: "all 0.15s",
          }}
        >
          <div style={{ fontSize: 22, marginBottom: 7, opacity: 0.45 }}>🖼</div>
          <div
            style={{ fontSize: 13, fontWeight: 500, color: "#4A4940", marginBottom: 3 }}
          >
            Click to upload or drag &amp; drop
          </div>
          <div style={{ fontSize: 12, color: "#9A9890" }}>PNG, JPG or SVG · Max 2 MB</div>
        </div>
      )}
      {err && (
        <div
          style={{
            marginTop: 8,
            padding: "8px 12px",
            borderRadius: 7,
            background: "#FDF0EE",
            border: "1px solid #F0C4BD",
            fontSize: 12,
            color: "#C0392B",
          }}
        >
          {err}
        </div>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        onChange={(e) => process(e.target.files?.[0])}
        style={{ display: "none" }}
      />
    </div>
  );
}
