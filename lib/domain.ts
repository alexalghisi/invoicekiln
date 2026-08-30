export function lineCents(qty: number, unitCents: number): number {
  return qty * unitCents;
}

export function invoiceTotal(lines: { qty: number; unitCents: number }[], taxBps: number): {
  subtotal: number;
  tax: number;
  total: number;
} {
  const subtotal = lines.reduce((sum, line) => sum + lineCents(line.qty, line.unitCents), 0);
  const tax = Math.round((subtotal * taxBps) / 10_000);
  return { subtotal, tax, total: subtotal + tax };
}

export function formatCents(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  return `${sign}$${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
}
