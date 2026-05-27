import { forwardRef } from "react";
import type { QuoteDocProps } from "@/types/quote";
import { nzd } from "@/utils/format";

const QuoteDoc = forwardRef<HTMLDivElement, QuoteDocProps>(function QuoteDoc(
  { biller, client, lines, logo, qNum, rev, issueDate, validUntil, notes, terms, sub, gst, total },
  ref
) {
  const rows = lines.filter((l) => l.desc || l.rate);
  const display = rows.length ? rows : lines;

  return (
    <div
      ref={ref}
      style={{
        padding: "44px 48px",
        background: "#fff",
        fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36 }}>
        <div>
          {logo ? (
            <div className="quote-logo" style={{ marginBottom: 10 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt={biller.name ? `${biller.name} logo` : "logo"} style={{ maxWidth: 160, maxHeight: 80, objectFit: "contain", display: "block" }} />
            </div>
          ) : (
            <div style={{ fontSize: 34, fontWeight: 300, letterSpacing: "-1px", color: "#1A1915", marginBottom: 8 }}>QUOTE</div>
          )}
          {biller.name && <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 2 }}>{biller.name}</div>}
          {(biller.address || biller.city) && (
            <div style={{ fontSize: 12, color: "#7A7970", marginTop: 3 }}>
              {[biller.address, biller.city].filter(Boolean).join(", ")}
            </div>
          )}
          {biller.phone && <div style={{ fontSize: 12, color: "#7A7970" }}>{biller.phone}</div>}
          {biller.email && <div style={{ fontSize: 12, color: "#7A7970" }}>{biller.email}</div>}
          {biller.ird && <div style={{ fontSize: 12, color: "#7A7970" }}>IRD: {biller.ird}</div>}
          {biller.gst && <div style={{ fontSize: 12, color: "#3D7A5E", marginTop: 3 }}>GST Registered</div>}
        </div>
        <div style={{ textAlign: "right" }}>
          {logo && (
            <div style={{ fontSize: 11, color: "#B0AFA8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>
              Quote
            </div>
          )}
          <div style={{ fontFamily: "var(--font-dm-mono, 'DM Mono', monospace)", fontSize: 20, fontWeight: 500, color: "#1A1915", marginBottom: 4 }}>
            {qNum}{rev > 0 ? ` Rev.${rev}` : ""}
          </div>
          <div style={{ fontSize: 12, color: "#7A7970", lineHeight: 1.8 }}>
            Issued: {issueDate}<br />Valid for: {validUntil}
          </div>
        </div>
      </div>

      {/* Validity banner */}
      <div style={{ background: "#E8F4EE", borderRadius: 8, padding: "10px 14px", marginBottom: 28, display: "flex", gap: 8, fontSize: 13, color: "#2F6049" }}>
        ⏱ This quote is valid for <strong style={{ margin: "0 3px" }}>{validUntil}</strong> from{" "}
        <strong style={{ margin: "0 3px" }}>{issueDate}</strong>
      </div>

      {/* From / Prepared for */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#B0AFA8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>From</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{biller.name || "—"}</div>
          <div style={{ fontSize: 12, color: "#4A4940" }}>{[biller.address, biller.city].filter(Boolean).join(", ")}</div>
          {biller.ird && <div style={{ fontSize: 12, color: "#4A4940" }}>IRD: {biller.ird}</div>}
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#B0AFA8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Prepared for</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{client.name || "—"}</div>
          {client.attn && <div style={{ fontSize: 12, color: "#4A4940" }}>{client.attn}</div>}
          <div style={{ fontSize: 12, color: "#4A4940" }}>{[client.address, client.city].filter(Boolean).join(", ")}</div>
          {client.email && <div style={{ fontSize: 12, color: "#4A4940" }}>{client.email}</div>}
        </div>
      </div>

      {/* Line items table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
        <thead>
          <tr>
            {([ ["Description","45%","left"], ["Qty","8%","center"], ["Unit","8%","center"], ["Rate","14%","right"], ["Amount","14%","right"] ] as [string, string, string][]).map(([h, w, a]) => (
              <th key={h} style={{ fontSize: 10, fontWeight: 600, color: "#B0AFA8", textTransform: "uppercase", letterSpacing: "0.06em", padding: "8px 0", borderBottom: "1.5px solid #E8E6E0", textAlign: a as "left" | "center" | "right", width: w }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {display.map((l) => {
            const amt = (parseFloat(String(l.qty)) || 0) * (parseFloat(String(l.rate)) || 0);
            return (
              <tr key={l.id}>
                <td style={{ padding: "11px 8px 11px 0", fontSize: 13, borderBottom: "1px solid #F0EEE8" }}>{l.desc || "—"}</td>
                <td style={{ padding: "11px 0", fontSize: 13, borderBottom: "1px solid #F0EEE8", textAlign: "center", fontFamily: "var(--font-dm-mono,'DM Mono',monospace)" }}>{l.qty}</td>
                <td style={{ padding: "11px 0", fontSize: 12, borderBottom: "1px solid #F0EEE8", textAlign: "center", color: "#7A7970" }}>{l.unit}</td>
                <td style={{ padding: "11px 0", fontSize: 13, borderBottom: "1px solid #F0EEE8", textAlign: "right", fontFamily: "var(--font-dm-mono,'DM Mono',monospace)" }}>{nzd(l.rate)}</td>
                <td style={{ padding: "11px 0", fontSize: 13, borderBottom: "1px solid #F0EEE8", textAlign: "right", fontFamily: "var(--font-dm-mono,'DM Mono',monospace)" }}>{nzd(amt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ marginLeft: "auto", width: 280, borderTop: "1px solid #E8E6E0", paddingTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13, color: "#4A4940" }}>
          <span>Subtotal (excl. GST)</span>
          <span style={{ fontFamily: "var(--font-dm-mono,'DM Mono',monospace)" }}>{nzd(sub)}</span>
        </div>
        {biller.gst && (
          <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13, color: "#4A4940" }}>
            <span>GST (15%)</span>
            <span style={{ fontFamily: "var(--font-dm-mono,'DM Mono',monospace)" }}>{nzd(gst)}</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #1A1915", paddingTop: 12, marginTop: 8, fontSize: 18, fontWeight: 600 }}>
          <span>Total{biller.gst ? " (incl. GST)" : ""}</span>
          <span style={{ fontFamily: "var(--font-dm-mono,'DM Mono',monospace)" }}>{nzd(total)}</span>
        </div>
      </div>

      {/* Notes & Terms */}
      <div style={{ marginTop: 36, borderTop: "1px solid #E8E6E0", paddingTop: 22, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#B0AFA8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Notes</div>
          <p style={{ fontSize: 12, color: "#4A4940", lineHeight: 1.7 }}>{notes || "—"}</p>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#B0AFA8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Payment Terms</div>
          <p style={{ fontSize: 12, color: "#4A4940", lineHeight: 1.7 }}>{terms || "—"}</p>
          {biller.gst && <p style={{ marginTop: 6, fontSize: 11, color: "#B0AFA8" }}>All amounts include GST at 15%</p>}
        </div>
      </div>

      {/* Signature lines */}
      <div style={{ marginTop: 36, borderTop: "1px solid #E8E6E0", paddingTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {["Authorised by", "Accepted by client"].map((t) => (
          <div key={t}>
            <div style={{ fontSize: 10, color: "#B0AFA8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 40 }}>{t}</div>
            <div style={{ borderTop: "1px solid #1A1915", paddingTop: 6, fontSize: 11, color: "#9A9890" }}>Signature &amp; Date</div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default QuoteDoc;
