"use client";

import LogoUpload from "@/components/LogoUpload";
import type { BillerInfo } from "@/types/quote";

interface BillerFormProps {
  biller: BillerInfo;
  logo: string | null;
  onBiller: (key: keyof BillerInfo, value: string | boolean) => void;
  onLogo: (logo: string | null) => void;
}

export default function BillerForm({
  biller,
  logo,
  onBiller,
  onLogo,
}: BillerFormProps) {
  return (
    <div className="card">
      <div className="st">
        <span className="dot" />
        Your Business Details
      </div>
      <LogoUpload logo={logo} onLogo={onLogo} />
      <div className="f">
        <label>Business Name</label>
        <input
          placeholder="e.g. Kiwi Builders Ltd"
          value={biller.name}
          onChange={(e) => onBiller("name", e.target.value)}
        />
      </div>
      <div className="r2" style={{ marginBottom: 10 }}>
        <div className="f">
          <label>Street Address</label>
          <input
            placeholder="123 Main Street"
            value={biller.address}
            onChange={(e) => onBiller("address", e.target.value)}
          />
        </div>
        <div className="f">
          <label>City / Town</label>
          <input
            placeholder="Auckland"
            value={biller.city}
            onChange={(e) => onBiller("city", e.target.value)}
          />
        </div>
      </div>
      <div className="r3" style={{ marginBottom: 10 }}>
        <div className="f">
          <label>Phone</label>
          <input
            placeholder="09 123 4567"
            value={biller.phone}
            onChange={(e) => onBiller("phone", e.target.value)}
          />
        </div>
        <div className="f">
          <label>Email</label>
          <input
            placeholder="hello@business.co.nz"
            value={biller.email}
            onChange={(e) => onBiller("email", e.target.value)}
          />
        </div>
        <div className="f">
          <label>IRD Number</label>
          <input
            placeholder="123-456-789"
            value={biller.ird}
            onChange={(e) => onBiller("ird", e.target.value)}
          />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
        <label className="tgl">
          <input
            type="checkbox"
            checked={biller.gst}
            onChange={(e) => onBiller("gst", e.target.checked)}
          />
          <span className="tsl" />
        </label>
        <span style={{ fontSize: 14, color: "#4A4940" }}>GST Registered (15%)</span>
        {biller.gst && (
          <span
            style={{
              display: "inline-flex",
              gap: 4,
              background: "#E8F4EE",
              color: "#2F6049",
              padding: "2px 8px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            ✓ GST included
          </span>
        )}
      </div>
    </div>
  );
}
