import { describe, expect, it } from "vitest";
import { formatCents, invoiceTotal } from "./domain";

describe("invoiceTotal", () => {
  it("applies 800 bps as 8 percent", () => {
    expect(invoiceTotal([{ qty: 2, unitCents: 5000 }], 800)).toEqual({
      subtotal: 10000,
      tax: 800,
      total: 10800,
    });
  });
});

describe("formatCents", () => {
  it("pads cents", () => {
    expect(formatCents(105)).toBe("$1.05");
  });
});
