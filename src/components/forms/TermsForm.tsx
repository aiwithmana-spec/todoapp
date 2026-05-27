"use client";

interface TermsFormProps {
  notes: string;
  terms: string;
  onNotes: (v: string) => void;
  onTerms: (v: string) => void;
}

export default function TermsForm({
  notes,
  terms,
  onNotes,
  onTerms,
}: TermsFormProps) {
  return (
    <div className="card">
      <div className="st">
        <span className="dot" />
        Notes &amp; Terms
      </div>
      <div className="f">
        <label>Notes to Client</label>
        <textarea
          value={notes}
          onChange={(e) => onNotes(e.target.value)}
          rows={4}
        />
      </div>
      <div className="f">
        <label>Payment Terms</label>
        <textarea
          value={terms}
          onChange={(e) => onTerms(e.target.value)}
          rows={3}
        />
      </div>
      <div
        style={{
          background: "#F7F6F2",
          borderRadius: 10,
          padding: "14px 16px",
          fontSize: 12,
          color: "#7A7970",
          lineHeight: 1.8,
        }}
      >
        <strong style={{ color: "#4A4940" }}>NZ compliance reminders</strong>
        <br />
        • Quotes not binding until accepted in writing
        <br />
        • Consumer Guarantees Act applies for consumer work
        <br />
        • GST invoices required for transactions over $50 if GST registered
        <br />• Retain records for 7 years (Tax Administration Act)
      </div>
    </div>
  );
}
