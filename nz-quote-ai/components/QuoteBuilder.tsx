"use client";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import QuoteDoc from "@/components/QuoteDoc";
import BillerForm from "@/components/forms/BillerForm";
import ClientForm from "@/components/forms/ClientForm";
import LineItemsForm from "@/components/forms/LineItemsForm";
import TermsForm from "@/components/forms/TermsForm";
import AiGenerateModal from "@/components/AiGenerateModal";
import type { BillerInfo, ClientInfo, LineItem, Validity } from "@/types/quote";
import { genQ, today, newLine, calcSub } from "@/utils/format";

const GST = 0.15;

type Tab = "biller" | "client" | "lines" | "terms";
const TABS: [Tab, string][] = [
  ["biller", "Your Business"],
  ["client", "Client"],
  ["lines", "Line Items"],
  ["terms", "Notes & Terms"],
];

const INIT_BILLER: BillerInfo = { name: "", address: "", city: "", phone: "", email: "", ird: "", gst: true };
const INIT_CLIENT: ClientInfo = { name: "", attn: "", address: "", city: "", email: "", phone: "" };

export default function QuoteBuilder() {
  const [biller, setBiller] = useState<BillerInfo>(INIT_BILLER);
  const [client, setClient] = useState<ClientInfo>(INIT_CLIENT);
  const [lines, setLines] = useState<LineItem[]>([newLine()]);
  const [logo, setLogo] = useState<string | null>(null);
  const [qNum] = useState<string>(genQ);
  const [rev, setRev] = useState(0);
  const [issueDate, setIssueDate] = useState(today);
  const [validUntil, setValidUntil] = useState("30 days");
  const [notes, setNotes] = useState(
    "Thank you for the opportunity to quote. Please don't hesitate to get in touch if you have any questions."
  );
  const [terms, setTerms] = useState(
    "Payment due within 20 working days of invoice date. Late payments may incur interest at 1.5% per month."
  );
  const [tab, setTab] = useState<Tab>("biller");
  const [preview, setPreview] = useState(false);
  const [showAi, setShowAi] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef: printRef, documentTitle: qNum });

  const sub = calcSub(lines);
  const gstAmt = biller.gst ? sub * GST : 0;
  const total = sub + gstAmt;

  const docProps = { biller, client, lines, logo, qNum, rev, issueDate, validUntil, notes, terms, sub, gst: gstAmt, total };

  function handleBiller(key: keyof BillerInfo, value: string | boolean) {
    setBiller((b) => ({ ...b, [key]: value }));
  }
  function handleClient(key: keyof ClientInfo, value: string) {
    setClient((c) => ({ ...c, [key]: value }));
  }
  function handleLineUpdate(id: number, key: keyof LineItem, value: string | number) {
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, [key]: value } : l)));
  }
  function handleReset() {
    setBiller(INIT_BILLER);
    setClient(INIT_CLIENT);
    setLines([newLine()]);
    setLogo(null);
    setRev(0);
  }
  function handleAiApply(aiLines: LineItem[], aiNotes?: string) {
    setLines(aiLines);
    if (aiNotes) setNotes(aiNotes);
    setShowAi(false);
    setTab("lines");
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-surface)" }}>
      {/* Top nav — full-width dark bar, inner content aligned to editor width */}
      <div
        className="no-print sticky top-0 z-50"
        style={{ background: "var(--color-ink)" }}
      >
        <div className="max-w-[960px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white font-semibold text-[15px]">NZ Quote Builder AI</span>
            <span className="hidden sm:inline text-[#4A4A40] text-[12px]">GST-ready · NZD · Powered by Claude</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPreview(true)}
              className="px-4 py-1.5 rounded-full border-[1.5px] border-[var(--color-border)] bg-white text-[var(--color-ink)] text-[12px] font-medium cursor-pointer hover:bg-[var(--color-surface)] transition-colors"
            >
              👁 Preview
            </button>
            <button
              onClick={() => { setPreview(true); setTimeout(() => handlePrint(), 400); }}
              className="px-4 py-1.5 rounded-full border-[1.5px] text-[12px] font-medium cursor-pointer transition-colors"
              style={{ background: "var(--color-brand)", color: "#fff", borderColor: "var(--color-brand)" }}
            >
              ⬇ Save PDF
            </button>
          </div>
        </div>
      </div>

      {/* Editor — same max-width as nav inner content */}
      <div className="no-print max-w-[960px] mx-auto px-6 py-6">
        {/* Quote header row */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[22px] font-medium" style={{ fontFamily: "var(--font-dm-mono,'DM Mono',monospace)" }}>
              {qNum}{rev > 0 ? ` Rev.${rev}` : ""}
            </div>
            <div className="text-[13px] text-[var(--color-ink-muted)] mt-1">
              Issued {issueDate} · Valid {validUntil}
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <label className="text-[12px] text-[var(--color-ink-muted)] mb-0">Issue date</label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              style={{ width: 148, padding: "7px 10px" }}
            />
            <button
              onClick={() => setRev((r) => r + 1)}
              className="px-4 py-1.5 rounded-full border-[1.5px] border-[var(--color-border)] bg-white text-[12px] font-medium cursor-pointer text-[var(--color-ink-dim)] hover:bg-[var(--color-surface)] transition-colors"
            >
              + Revision
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-1.5 rounded-full border-[1.5px] border-[var(--color-border)] bg-white text-[12px] cursor-pointer text-[var(--color-ink-muted)] hover:bg-[var(--color-surface)] transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="bg-white rounded-2xl border-[1.5px] border-[var(--color-border-strong)] p-2 flex gap-1 mb-4">
          {TABS.map(([id, lbl]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="px-5 py-2 rounded-full border-none cursor-pointer text-[13px] font-medium transition-all"
              style={{
                background: tab === id ? "var(--color-ink)" : "transparent",
                color: tab === id ? "#fff" : "var(--color-ink-dim)",
              }}
            >
              {lbl}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        {tab === "biller" && <BillerForm biller={biller} logo={logo} onBiller={handleBiller} onLogo={setLogo} />}
        {tab === "client" && <ClientForm client={client} validUntil={validUntil} onClient={handleClient} onValidUntil={(v: Validity) => setValidUntil(v)} />}
        {tab === "lines" && (
          <LineItemsForm
            lines={lines}
            gstRegistered={biller.gst}
            sub={sub}
            gstAmt={gstAmt}
            total={total}
            onUpdate={handleLineUpdate}
            onAdd={() => setLines((ls) => [...ls, newLine()])}
            onRemove={(id) => setLines((ls) => ls.filter((x) => x.id !== id))}
            onAiGenerate={() => setShowAi(true)}
          />
        )}
        {tab === "terms" && <TermsForm notes={notes} terms={terms} onNotes={setNotes} onTerms={setTerms} />}
      </div>

      {/* Preview modal */}
      {preview && (
        <div
          className="modal no-print fixed inset-0 bg-black/65 z-[100] overflow-y-auto p-8"
          onClick={(e) => { if (e.target === e.currentTarget) setPreview(false); }}
        >
          <div className="max-w-[760px] mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div
              className="flex justify-between items-center px-7 py-4"
              style={{ background: "var(--color-ink)" }}
            >
              <span className="text-white font-semibold text-[15px]">Quote Preview</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePrint()}
                  className="px-3 py-1 rounded-full border-[1.5px] text-[12px] font-medium cursor-pointer"
                  style={{ background: "var(--color-brand)", color: "#fff", borderColor: "var(--color-brand)" }}
                >
                  ⬇ Save as PDF
                </button>
                <button
                  onClick={() => setPreview(false)}
                  className="px-3 py-1 rounded-full border-[1.5px] border-[#333] bg-[#333] text-white text-[12px] font-medium cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>
            </div>
            <QuoteDoc ref={printRef} {...docProps} />
          </div>
        </div>
      )}

      {/* Print-only output */}
      {!preview && (
        <div className="print-only">
          <QuoteDoc ref={printRef} {...docProps} />
        </div>
      )}

      {/* AI Generate Modal */}
      {showAi && <AiGenerateModal onApply={handleAiApply} onClose={() => setShowAi(false)} />}
    </div>
  );
}
