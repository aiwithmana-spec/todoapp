"use client";

import { useState } from "react";
import { PROJECT_TYPES } from "@/types/quote";
import type { AiGenerateResponse, LineItem, ProjectType } from "@/types/quote";
import { newLine, nzd } from "@/utils/format";

interface AiGenerateModalProps {
  onApply: (lines: LineItem[], notes?: string) => void;
  onClose: () => void;
}

export default function AiGenerateModal({ onApply, onClose }: AiGenerateModalProps) {
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("Construction & Trades");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<AiGenerateResponse | null>(null);

  async function handleGenerate() {
    if (!description.trim()) {
      setError("Please describe your project first.");
      return;
    }
    setError("");
    setLoading(true);
    setPreview(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, projectType }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "AI generation failed");
      }
      const data: AiGenerateResponse = await res.json();
      setPreview(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleApply() {
    if (!preview) return;
    const lines: LineItem[] = preview.lines.map((l) => ({
      ...newLine(),
      desc: l.desc,
      qty: l.qty,
      unit: l.unit,
      rate: l.rate,
    }));
    onApply(lines, preview.notes);
  }

  return (
    <div
      className="fixed inset-0 bg-black/65 z-[200] overflow-y-auto p-8 flex items-start justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-xl bg-white rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[var(--color-ink)]">
          <div className="flex items-center gap-2.5">
            <span className="text-[18px]">✨</span>
            <div>
              <p className="text-white font-semibold text-[15px] leading-tight">AI Quote Generator</p>
              <p className="text-[#6A6960] text-[12px]">Powered by Claude · NZ market rates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#6A6960] hover:text-white text-[20px] leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Project type */}
          <div>
            <label>Project Type</label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value as ProjectType)}
            >
              {PROJECT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label>Describe Your Project</label>
            <textarea
              rows={4}
              placeholder="e.g. Install new bathroom tiling in a 5×3m bathroom, including removing old tiles, waterproofing membrane, laying 300mm ceramic floor tiles, and grouting."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="mt-1 text-[11px] text-[var(--color-ink-muted)]">
              The more detail you provide, the better the line items will be.
            </p>
          </div>

          {error && (
            <div className="px-3 py-2 rounded-lg bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] text-[12px] text-[var(--color-danger)]">
              {error}
            </div>
          )}

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 rounded-xl font-semibold text-[14px] transition-all cursor-pointer disabled:opacity-60"
            style={{ background: "var(--color-brand)", color: "#fff", border: "none" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating with AI…
              </span>
            ) : (
              "✨ Generate Line Items"
            )}
          </button>

          {/* Preview */}
          {preview && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[12px] font-600 text-[var(--color-brand-dark)]">
                  ✓ {preview.lines.length} line items generated — review before applying
                </p>
              </div>
              <div className="border border-[var(--color-border-strong)] rounded-xl overflow-hidden">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="bg-[var(--color-surface)]">
                      <th className="text-left px-3 py-2 font-500 text-[var(--color-ink-faint)] text-[10px] uppercase tracking-wider">Description</th>
                      <th className="text-center px-2 py-2 font-500 text-[var(--color-ink-faint)] text-[10px] uppercase tracking-wider">Qty</th>
                      <th className="text-center px-2 py-2 font-500 text-[var(--color-ink-faint)] text-[10px] uppercase tracking-wider">Unit</th>
                      <th className="text-right px-3 py-2 font-500 text-[var(--color-ink-faint)] text-[10px] uppercase tracking-wider">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.lines.map((l, i) => (
                      <tr key={i} className="border-t border-[var(--color-border-strong)]">
                        <td className="px-3 py-2 text-[var(--color-ink)]">{l.desc}</td>
                        <td className="px-2 py-2 text-center font-[var(--font-mono)] text-[var(--color-ink-dim)]">{l.qty}</td>
                        <td className="px-2 py-2 text-center text-[var(--color-ink-muted)]">{l.unit}</td>
                        <td className="px-3 py-2 text-right font-[var(--font-mono)] text-[var(--color-ink)]">{nzd(l.rate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {preview.notes && (
                <div className="mt-2 px-3 py-2 rounded-lg bg-[var(--color-brand-bg)] text-[12px] text-[var(--color-brand-dark)]">
                  <strong>Note:</strong> {preview.notes}
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleApply}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-[14px] cursor-pointer"
                  style={{ background: "var(--color-ink)", color: "#fff", border: "none" }}
                >
                  Apply to Quote
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl font-medium text-[13px] cursor-pointer border border-[var(--color-border)] bg-white text-[var(--color-ink-dim)] hover:bg-[var(--color-surface)] transition-colors disabled:opacity-50"
                >
                  Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
