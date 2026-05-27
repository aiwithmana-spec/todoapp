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
    <div className="mb-3.5">
      <label>Business Logo</label>
      {logo ? (
        <div className="flex items-center gap-3.5 p-3.5 border-[1.5px] border-[var(--color-border)] rounded-[10px] bg-[var(--color-surface-card)]">
          <div className="w-[120px] h-[60px] flex items-center justify-center bg-white rounded-[6px] border border-[var(--color-border-strong)] overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt="logo"
              className="max-w-[112px] max-h-[52px] object-contain block"
            />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-medium text-[var(--color-ink)] mb-0.5">
              Logo uploaded ✓
            </p>
            <p className="text-[12px] text-[var(--color-ink-muted)]">
              Appears top-left on the quote
            </p>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => ref.current?.click()}
              className="px-3 py-1.5 rounded-[7px] border-[1.5px] border-[var(--color-border)] bg-white text-[12px] font-medium cursor-pointer text-[var(--color-ink-dim)] hover:bg-[var(--color-surface)] transition-colors"
            >
              Replace
            </button>
            <button
              onClick={() => {
                onLogo(null);
                setErr("");
              }}
              className="px-3 py-1.5 rounded-[7px] border-[1.5px] border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] text-[12px] font-medium cursor-pointer text-[var(--color-danger)] hover:opacity-80 transition-opacity"
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
          className={`border-[1.5px] border-dashed rounded-[10px] p-6 text-center cursor-pointer transition-all
            ${drag ? "border-[var(--color-brand)] bg-[var(--color-brand-bg)]" : "border-[#C8C6BE] bg-[var(--color-surface-card)]"}`}
        >
          <div className="text-[22px] mb-1.5 opacity-45">🖼</div>
          <p className="text-[13px] font-medium text-[var(--color-ink-dim)] mb-0.5">
            Click to upload or drag &amp; drop
          </p>
          <p className="text-[12px] text-[var(--color-ink-muted)]">
            PNG, JPG or SVG · Max 2 MB
          </p>
        </div>
      )}
      {err && (
        <div className="mt-2 px-3 py-2 rounded-[7px] bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] text-[12px] text-[var(--color-danger)]">
          {err}
        </div>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        onChange={(e) => process(e.target.files?.[0])}
        className="hidden"
      />
    </div>
  );
}
