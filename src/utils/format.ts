import type { LineItem } from "@/types/quote";

export function nzd(n: number | string): string {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
  }).format(parseFloat(String(n)) || 0);
}

export function genQ(): string {
  const d = new Date();
  return `Q${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${String(Math.floor(Math.random() * 900) + 100)}`;
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function newLine(): LineItem {
  return { id: Math.random(), desc: "", qty: 1, unit: "each", rate: "" };
}

export function calcSub(lines: LineItem[]): number {
  return lines.reduce(
    (s, l) =>
      (parseFloat(String(l.qty)) || 0) * (parseFloat(String(l.rate)) || 0) + s,
    0
  );
}
