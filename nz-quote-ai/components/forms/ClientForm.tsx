"use client";

import { VALIDITY } from "@/types/quote";
import type { ClientInfo, Validity } from "@/types/quote";

interface ClientFormProps {
  client: ClientInfo;
  validUntil: string;
  onClient: (key: keyof ClientInfo, value: string) => void;
  onValidUntil: (v: Validity) => void;
}

export default function ClientForm({ client, validUntil, onClient, onValidUntil }: ClientFormProps) {
  return (
    <div className="bg-white rounded-2xl border-[1.5px] border-[var(--color-border-strong)] p-6 mb-4">
      <h2 className="text-[15px] font-semibold mb-5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[var(--color-brand)] inline-block" />
        Client Details
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label>Company / Name</label>
          <input placeholder="ABC Limited" value={client.name} onChange={(e) => onClient("name", e.target.value)} />
        </div>
        <div>
          <label>Attention (optional)</label>
          <input placeholder="Attn: Jane Smith" value={client.attn} onChange={(e) => onClient("attn", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label>Address</label>
          <input placeholder="456 Queen Street" value={client.address} onChange={(e) => onClient("address", e.target.value)} />
        </div>
        <div>
          <label>City</label>
          <input placeholder="Wellington" value={client.city} onChange={(e) => onClient("city", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label>Email</label>
          <input placeholder="client@company.co.nz" value={client.email} onChange={(e) => onClient("email", e.target.value)} />
        </div>
        <div>
          <label>Phone</label>
          <input placeholder="04 987 6543" value={client.phone} onChange={(e) => onClient("phone", e.target.value)} />
        </div>
      </div>
      <div>
        <label>Quote Validity</label>
        <div className="flex gap-2 flex-wrap mt-2">
          {VALIDITY.map((v) => (
            <button
              key={v}
              onClick={() => onValidUntil(v)}
              className="px-4 py-1.5 rounded-full border-[1.5px] text-[13px] font-medium cursor-pointer transition-all"
              style={{
                background: validUntil === v ? "var(--color-ink)" : "#fff",
                color: validUntil === v ? "#fff" : "var(--color-ink-dim)",
                borderColor: validUntil === v ? "var(--color-ink)" : "var(--color-border)",
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
