export const UNITS = [
  "each",
  "hr",
  "day",
  "m²",
  "m³",
  "m",
  "kg",
  "L",
  "item",
  "lot",
] as const;
export type Unit = (typeof UNITS)[number];

export const VALIDITY = [
  "7 days",
  "14 days",
  "30 days",
  "60 days",
  "90 days",
] as const;
export type Validity = (typeof VALIDITY)[number];

export interface BillerInfo {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  ird: string;
  gst: boolean;
}

export interface ClientInfo {
  name: string;
  attn: string;
  address: string;
  city: string;
  email: string;
  phone: string;
}

export interface LineItem {
  id: number;
  desc: string;
  qty: number | string;
  unit: Unit;
  rate: number | string;
}

export interface QuoteDocProps {
  biller: BillerInfo;
  client: ClientInfo;
  lines: LineItem[];
  logo: string | null;
  qNum: string;
  rev: number;
  issueDate: string;
  validUntil: string;
  notes: string;
  terms: string;
  sub: number;
  gst: number;
  total: number;
}
