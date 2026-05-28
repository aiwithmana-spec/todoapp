"use client";

import LogoUpload from "@/components/LogoUpload";
import type { BillerInfo } from "@/types/quote";

interface BillerFormProps {
  biller: BillerInfo;
  logo: string | null;
  onBiller: (key: keyof BillerInfo, value: string | boolean) => void;
  onLogo: (logo: string | null) => void;
}

export default function BillerForm({ biller, logo, onBiller, onLogo }: BillerFormProps) {
  return (
    <div className="bg-white rounded-2xl border-[1.5px] border-[var(--color-border-strong)] p-6 mb-4">
      <h2 className="text-[15px] font-semibold mb-5 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[var(--color-brand)] inline-block" />
        Your Business Details
      </h2>
      <LogoUpload logo={logo} onLogo={onLogo} />
      <div className="mb-4">
        <label>Business Name</label>
        <input placeholder="e.g. Kiwi Builders Ltd" value={biller.name} onChange={(e) => onBiller("name", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label>Street Address</label>
          <input placeholder="123 Main Street" value={biller.address} onChange={(e) => onBiller("address", e.target.value)} />
        </div>
        <div>
          <label>City / Town</label>
          <input placeholder="Auckland" value={biller.city} onChange={(e) => onBiller("city", e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <label>Phone</label>
          <input placeholder="09 123 4567" value={biller.phone} onChange={(e) => onBiller("phone", e.target.value)} />
        </div>
        <div>
          <label>Email</label>
          <input placeholder="hello@business.co.nz" value={biller.email} onChange={(e) => onBiller("email", e.target.value)} />
        </div>
        <div>
          <label>IRD Number</label>
          <input placeholder="123-456-789" value={biller.ird} onChange={(e) => onBiller("ird", e.target.value)} />
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <label className="tgl">
          <input type="checkbox" checked={biller.gst} onChange={(e) => onBiller("gst", e.target.checked)} />
          <span className="tsl" />
        </label>
        <span className="text-[14px] text-[var(--color-ink-dim)]">GST Registered (15%)</span>
        {biller.gst && (
          <span className="inline-flex gap-1 bg-[var(--color-brand-bg)] text-[var(--color-brand-dark)] px-3 py-1 rounded-full text-[12px] font-medium">
            ✓ GST included
          </span>
        )}
      </div>
    </div>
  );
}
