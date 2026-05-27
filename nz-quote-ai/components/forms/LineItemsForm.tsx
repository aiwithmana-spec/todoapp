"use client";

import { UNITS } from "@/types/quote";
import type { LineItem } from "@/types/quote";
import { nzd } from "@/utils/format";

interface LineItemsFormProps {
  lines: LineItem[];
  gstRegistered: boolean;
  sub: number;
  gstAmt: number;
  total: number;
  onUpdate: (id: number, key: keyof LineItem, value: string | number) => void;
  onAdd: () => void;
  onRemove: (id: number) => void;
  onAiGenerate: () => void;
}

export default function LineItemsForm({
  lines,
  gstRegistered,
  sub,
  gstAmt,
  total,
  onUpdate,
  onAdd,
  onRemove,
  onAiGenerate,
}: LineItemsFormProps) {
  return (
    <div className="bg-white rounded-2xl border-[1.5px] border-[var(--color-border-strong)] p-5 mb-3.5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[14px] font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--color-brand)] inline-block" />
          Line Items
        </h2>
        <button
          onClick={onAiGenerate}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold cursor-pointer transition-all hover:opacity-90"
          style={{ background: "var(--color-brand)", color: "#fff", border: "none" }}
        >
          ✨ Generate with AI
        </button>
      </div>

      {/* Column headers */}
      <div className="grid gap-1.5 mb-1.5" style={{ gridTemplateColumns: "1fr 65px 80px 95px 100px 32px" }}>
        {["Description", "Qty", "Unit", "Rate (excl. GST)", "Amount", ""].map((h, i) => (
          <span
            key={i}
            className="text-[10px] font-semibold text-[var(--color-ink-faint)] uppercase tracking-wide"
            style={i >= 4 ? { textAlign: "right" } : {}}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Line rows */}
      {lines.map((l) => {
        const amt = (parseFloat(String(l.qty)) || 0) * (parseFloat(String(l.rate)) || 0);
        return (
          <div key={l.id} className="grid items-center gap-1.5 mb-1.5" style={{ gridTemplateColumns: "1fr 65px 80px 95px 100px 32px" }}>
            <input placeholder="Labour, materials…" value={l.desc} onChange={(e) => onUpdate(l.id, "desc", e.target.value)} />
            <input type="number" min="0" step="0.5" value={l.qty} onChange={(e) => onUpdate(l.id, "qty", e.target.value)} style={{ textAlign: "center" }} />
            <select value={l.unit} onChange={(e) => onUpdate(l.id, "unit", e.target.value)}>
              {UNITS.map((u) => <option key={u}>{u}</option>)}
            </select>
            <input type="number" min="0" step="0.01" placeholder="0.00" value={l.rate} onChange={(e) => onUpdate(l.id, "rate", e.target.value)} style={{ textAlign: "right" }} />
            <div style={{ textAlign: "right", fontSize: 13, padding: "9px 0", fontFamily: "var(--font-dm-mono,'DM Mono',monospace)" }}>{nzd(amt)}</div>
            <button
              onClick={() => onRemove(l.id)}
              disabled={lines.length === 1}
              className="text-[var(--color-danger)] text-[16px] bg-transparent border-none cursor-pointer p-1 rounded-[5px] hover:bg-[var(--color-danger-bg)] transition-colors disabled:opacity-30"
            >
              ×
            </button>
          </div>
        );
      })}

      <button
        onClick={onAdd}
        className="mt-2 px-3.5 py-2 bg-white border-[1.5px] border-[var(--color-border)] rounded-lg text-[13px] cursor-pointer text-[var(--color-ink-dim)] hover:bg-[var(--color-surface)] transition-colors"
      >
        + Add Line
      </button>

      {/* Totals */}
      <div className="mt-5 ml-auto w-[290px] border-t border-[var(--color-border-strong)] pt-3.5">
        <div className="flex justify-between py-1 text-[13px] text-[var(--color-ink-dim)]">
          <span>Subtotal (excl. GST)</span>
          <span style={{ fontFamily: "var(--font-dm-mono,'DM Mono',monospace)" }}>{nzd(sub)}</span>
        </div>
        {gstRegistered && (
          <div className="flex justify-between py-1 text-[13px] text-[var(--color-ink-dim)]">
            <span>GST (15%)</span>
            <span style={{ fontFamily: "var(--font-dm-mono,'DM Mono',monospace)" }}>{nzd(gstAmt)}</span>
          </div>
        )}
        <div className="flex justify-between border-t-2 border-[var(--color-ink)] pt-3 mt-2 text-[17px] font-semibold">
          <span>Total{gstRegistered ? " (incl. GST)" : ""}</span>
          <span style={{ fontFamily: "var(--font-dm-mono,'DM Mono',monospace)" }}>{nzd(total)}</span>
        </div>
      </div>
    </div>
  );
}
