"use client";

import { VALIDITY } from "@/types/quote";
import type { ClientInfo, Validity } from "@/types/quote";

interface ClientFormProps {
  client: ClientInfo;
  validUntil: string;
  onClient: (key: keyof ClientInfo, value: string) => void;
  onValidUntil: (v: Validity) => void;
}

export default function ClientForm({
  client,
  validUntil,
  onClient,
  onValidUntil,
}: ClientFormProps) {
  return (
    <div className="card">
      <div className="st">
        <span className="dot" />
        Client Details
      </div>
      <div className="r2" style={{ marginBottom: 10 }}>
        <div className="f">
          <label>Company / Name</label>
          <input
            placeholder="ABC Limited"
            value={client.name}
            onChange={(e) => onClient("name", e.target.value)}
          />
        </div>
        <div className="f">
          <label>Attention (optional)</label>
          <input
            placeholder="Attn: Jane Smith"
            value={client.attn}
            onChange={(e) => onClient("attn", e.target.value)}
          />
        </div>
      </div>
      <div className="r2" style={{ marginBottom: 10 }}>
        <div className="f">
          <label>Address</label>
          <input
            placeholder="456 Queen Street"
            value={client.address}
            onChange={(e) => onClient("address", e.target.value)}
          />
        </div>
        <div className="f">
          <label>City</label>
          <input
            placeholder="Wellington"
            value={client.city}
            onChange={(e) => onClient("city", e.target.value)}
          />
        </div>
      </div>
      <div className="r2" style={{ marginBottom: 10 }}>
        <div className="f">
          <label>Email</label>
          <input
            placeholder="client@company.co.nz"
            value={client.email}
            onChange={(e) => onClient("email", e.target.value)}
          />
        </div>
        <div className="f">
          <label>Phone</label>
          <input
            placeholder="04 987 6543"
            value={client.phone}
            onChange={(e) => onClient("phone", e.target.value)}
          />
        </div>
      </div>
      <div className="f">
        <label>Quote Validity</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
          {VALIDITY.map((v) => (
            <button
              key={v}
              className="pill"
              onClick={() => onValidUntil(v)}
              style={{
                background: validUntil === v ? "#1A1915" : "#fff",
                color: validUntil === v ? "#fff" : "#4A4940",
                borderColor: validUntil === v ? "#1A1915" : "#E2E0D8",
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
