"use client";

import { useState } from "react";
import QuoteDoc from "@/components/QuoteDoc";
import BillerForm from "@/components/forms/BillerForm";
import ClientForm from "@/components/forms/ClientForm";
import LineItemsForm from "@/components/forms/LineItemsForm";
import TermsForm from "@/components/forms/TermsForm";
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

const DEFAULT_BILLER: BillerInfo = {
  name: "",
  address: "",
  city: "",
  phone: "",
  email: "",
  ird: "",
  gst: true,
};
const DEFAULT_CLIENT: ClientInfo = {
  name: "",
  attn: "",
  address: "",
  city: "",
  email: "",
  phone: "",
};

export default function QuoteBuilder() {
  const [biller, setBiller] = useState<BillerInfo>(DEFAULT_BILLER);
  const [client, setClient] = useState<ClientInfo>(DEFAULT_CLIENT);
  const [lines, setLines] = useState<LineItem[]>([newLine()]);
  const [logo, setLogo] = useState<string | null>(null);
  const [qNum] = useState<string>(genQ);
  const [rev, setRev] = useState(0);
  const [issueDate, setIssueDate] = useState(today);
  const [validUntil, setValidUntil] = useState<string>("30 days");
  const [notes, setNotes] = useState(
    "Thank you for the opportunity to quote. Please don't hesitate to get in touch if you have any questions."
  );
  const [terms, setTerms] = useState(
    "Payment due within 20 working days of invoice date. Late payments may incur interest at 1.5% per month."
  );
  const [tab, setTab] = useState<Tab>("biller");
  const [preview, setPreview] = useState(false);

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
    setBiller(DEFAULT_BILLER);
    setClient(DEFAULT_CLIENT);
    setLines([newLine()]);
    setLogo(null);
    setRev(0);
  }

  const sub = calcSub(lines);
  const gstAmt = biller.gst ? sub * GST : 0;
  const total = sub + gstAmt;

  const docProps = {
    biller,
    client,
    lines,
    logo,
    qNum,
    rev,
    issueDate,
    validUntil,
    notes,
    terms,
    sub,
    gst: gstAmt,
    total,
  };

  return (
    <div>
      {/* Top nav bar */}
      <div
        className="no-print"
        style={{
          background: "#1A1915",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 52,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>
            NZ Quote Builder
          </span>
          <span style={{ color: "#4A4A40", fontSize: 12 }}>
            GST-ready · NZD · Logo support
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="pill"
            style={{
              background: "#fff",
              color: "#1A1915",
              borderColor: "#E2E0D8",
              fontSize: 12,
            }}
            onClick={() => setPreview(true)}
          >
            👁 Preview
          </button>
          <button
            className="pill"
            style={{
              background: "#3D7A5E",
              color: "#fff",
              borderColor: "#3D7A5E",
              fontSize: 12,
            }}
            onClick={() => {
              setPreview(true);
              setTimeout(() => window.print(), 400);
            }}
          >
            ⬇ Save PDF
          </button>
        </div>
      </div>

      {/* Main editor */}
      <div
        className="no-print"
        style={{ maxWidth: 860, margin: "0 auto", padding: "20px 14px" }}
      >
        {/* Quote header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div>
            <div className="mono" style={{ fontSize: 20, fontWeight: 500 }}>
              {qNum}
              {rev > 0 ? ` Rev.${rev}` : ""}
            </div>
            <div style={{ fontSize: 12, color: "#9A9890", marginTop: 2 }}>
              Issued {issueDate} · Valid {validUntil}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <label style={{ fontSize: 12, color: "#9A9890", marginBottom: 0 }}>
              Issue date
            </label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              style={{ width: 140, padding: "6px 10px" }}
            />
            <button
              className="pill"
              style={{
                background: "#fff",
                borderColor: "#E2E0D8",
                color: "#4A4940",
                fontSize: 12,
              }}
              onClick={() => setRev((r) => r + 1)}
            >
              + Revision
            </button>
            <button
              className="pill"
              style={{
                background: "#fff",
                borderColor: "#E2E0D8",
                color: "#9A9890",
                fontSize: 12,
              }}
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Tab selector */}
        <div
          className="card"
          style={{ padding: "10px 14px", display: "flex", gap: 4, marginBottom: 14 }}
        >
          {TABS.map(([id, lbl]) => (
            <button
              key={id}
              className={`nb${tab === id ? " act" : ""}`}
              onClick={() => setTab(id)}
            >
              {lbl}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        {tab === "biller" && (
          <BillerForm
            biller={biller}
            logo={logo}
            onBiller={handleBiller}
            onLogo={setLogo}
          />
        )}
        {tab === "client" && (
          <ClientForm
            client={client}
            validUntil={validUntil}
            onClient={handleClient}
            onValidUntil={(v: Validity) => setValidUntil(v)}
          />
        )}
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
          />
        )}
        {tab === "terms" && (
          <TermsForm
            notes={notes}
            terms={terms}
            onNotes={setNotes}
            onTerms={setTerms}
          />
        )}
      </div>

      {/* Preview modal */}
      {preview && (
        <div
          className="modal no-print"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreview(false);
          }}
        >
          <div className="mbox">
            <div
              style={{
                background: "#1A1915",
                color: "#fff",
                padding: "16px 28px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 15 }}>Quote Preview</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="pill"
                  style={{
                    background: "#3D7A5E",
                    color: "#fff",
                    borderColor: "#3D7A5E",
                    fontSize: 12,
                  }}
                  onClick={() => window.print()}
                >
                  ⬇ Save as PDF
                </button>
                <button
                  className="pill"
                  style={{
                    background: "#333",
                    color: "#fff",
                    borderColor: "#333",
                    fontSize: 12,
                  }}
                  onClick={() => setPreview(false)}
                >
                  ✕ Close
                </button>
              </div>
            </div>
            <QuoteDoc {...docProps} />
          </div>
        </div>
      )}

      {/* Print-only output */}
      <div className="print-only">
        <QuoteDoc {...docProps} />
      </div>
    </div>
  );
}
