import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { formatCents, invoiceTotal } from "@/lib/domain";
import { setStatusAction } from "@/features/work/actions";
import { Button } from "@/components/ui/button";

export default async function InvoicesPage() {
  const user = await requireUser();
  const db = await getDb();
  const invoices = await db.query<{ id: string; status: string; tax_bps: number; client: string }>(
    `select i.id, i.status, i.tax_bps, c.name as client
       from invoices i join clients c on c.id = i.client_id
      where i.organization_id = $1`,
    [user.organizationId],
  );
  const lines = await db.query<{ invoice_id: string; qty: number; unit_cents: number; description: string }>(
    "select invoice_id, qty, unit_cents, description from line_items",
  );
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Invoices</h1>
      <ul className="space-y-3">
        {invoices.rows.map((inv) => {
          const total = invoiceTotal(
            lines.rows.filter((l) => l.invoice_id === inv.id).map((l) => ({ qty: l.qty, unitCents: l.unit_cents })),
            inv.tax_bps,
          );
          return (
            <li key={inv.id} className="rounded-xl border border-border bg-card p-4 text-sm">
              <p className="font-medium">{inv.client} · {inv.status} · {formatCents(total.total)}</p>
              <ul className="mt-2 text-muted-foreground">
                {lines.rows.filter((l) => l.invoice_id === inv.id).map((l) => (
                  <li key={l.description}>{l.qty} × {l.description}</li>
                ))}
              </ul>
              <div className="mt-3 flex gap-1">
                <form action={setStatusAction.bind(null, inv.id, "sent")}><Button size="sm" variant="outline">Mark sent</Button></form>
                <form action={setStatusAction.bind(null, inv.id, "paid")}><Button size="sm">Mark paid</Button></form>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
