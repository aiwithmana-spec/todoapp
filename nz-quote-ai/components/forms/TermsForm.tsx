"use client";

interface TermsFormProps {
  notes: string;
  terms: string;
  onNotes: (v: string) => void;
  onTerms: (v: string) => void;
}

export default function TermsForm({ notes, terms, onNotes, onTerms }: TermsFormProps) {
  return (
    <div className="bg-white rounded-2xl border-[1.5px] border-[var(--color-border-strong)] p-6 mb-4">
      <h2 className="text-[15px] font-semibold mb-5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[var(--color-brand)] inline-block" />
        Notes &amp; Terms
      </h2>
      <div className="mb-4">
        <label>Notes to Client</label>
        <textarea value={notes} onChange={(e) => onNotes(e.target.value)} rows={4} />
      </div>
      <div className="mb-5">
        <label>Payment Terms</label>
        <textarea value={terms} onChange={(e) => onTerms(e.target.value)} rows={3} />
      </div>
      <div className="bg-[var(--color-surface)] rounded-[10px] p-4 text-[13px] text-[var(--color-ink-dim)] leading-[1.9]">
        <strong className="text-[var(--color-ink-dim)]">NZ compliance reminders</strong>
        <br />
        • Quotes not binding until accepted in writing
        <br />
        • Consumer Guarantees Act applies for consumer work
        <br />
        • GST invoices required for transactions over $50 if GST registered
        <br />
        • Retain records for 7 years (Tax Administration Act)
      </div>
    </div>
  );
}
