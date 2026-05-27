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
}: LineItemsFormProps) {
  return (
    <div className="card">
      <div className="st">
        <span className="dot" />
        Line Items
      </div>
      <div className="lg" style={{ marginBottom: 6 }}>
        {["Description", "Qty", "Unit", "Rate (excl. GST)", "Amount", ""].map(
          (h, i) => (
            <span
              key={i}
              className="lh"
              style={i >= 4 ? { textAlign: "right" } : {}}
            >
              {h}
            </span>
          )
        )}
      </div>
      {lines.map((l) => {
        const amt =
          (parseFloat(String(l.qty)) || 0) * (parseFloat(String(l.rate)) || 0);
        return (
          <div key={l.id} className="lg">
            <input
              placeholder="Labour, materials…"
              value={l.desc}
              onChange={(e) => onUpdate(l.id, "desc", e.target.value)}
            />
            <input
              type="number"
              min="0"
              step="0.5"
              value={l.qty}
              onChange={(e) => onUpdate(l.id, "qty", e.target.value)}
              style={{ textAlign: "center" }}
            />
            <select
              value={l.unit}
              onChange={(e) => onUpdate(l.id, "unit", e.target.value)}
            >
              {UNITS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={l.rate}
              onChange={(e) => onUpdate(l.id, "rate", e.target.value)}
              style={{ textAlign: "right" }}
            />
            <div
              className="mono"
              style={{ textAlign: "right", fontSize: 13, padding: "9px 0" }}
            >
              {nzd(amt)}
            </div>
            <button
              onClick={() => onRemove(l.id)}
              disabled={lines.length === 1}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 16,
                color: "#C0392B",
                padding: "5px",
                borderRadius: 5,
                opacity: lines.length === 1 ? 0.3 : 1,
              }}
            >
              ×
            </button>
          </div>
        );
      })}
      <button
        onClick={onAdd}
        style={{
          marginTop: 8,
          background: "#fff",
          border: "1.5px solid #E2E0D8",
          borderRadius: 8,
          padding: "8px 14px",
          fontFamily: "inherit",
          fontSize: 13,
          cursor: "pointer",
          color: "#4A4940",
        }}
      >
        + Add Line
      </button>
      <div
        style={{
          marginTop: 20,
          marginLeft: "auto",
          width: 290,
          borderTop: "1px solid #E8E6E0",
          paddingTop: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "5px 0",
            fontSize: 13,
            color: "#4A4940",
          }}
        >
          <span>Subtotal (excl. GST)</span>
          <span className="mono">{nzd(sub)}</span>
        </div>
        {gstRegistered && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "5px 0",
              fontSize: 13,
              color: "#4A4940",
            }}
          >
            <span>GST (15%)</span>
            <span className="mono">{nzd(gstAmt)}</span>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "2px solid #1A1915",
            paddingTop: 12,
            marginTop: 8,
            fontSize: 17,
            fontWeight: 600,
          }}
        >
          <span>Total{gstRegistered ? " (incl. GST)" : ""}</span>
          <span className="mono">{nzd(total)}</span>
        </div>
      </div>
    </div>
  );
}
