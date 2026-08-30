import { PGlite } from "@electric-sql/pglite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { SCHEMA_SQL } from "../lib/db/schema-sql";
import { hashPassword } from "../lib/auth/password";

const email = "demo@invoicekiln.dev";
const orgId = "org_demo";
const userId = "user_demo";

async function main() {
  mkdirSync(path.join(process.cwd(), ".data"), { recursive: true });
  const db = new PGlite(path.join(process.cwd(), ".data", "pglite"));
  await db.waitReady;
  await db.exec(SCHEMA_SQL);
  const passwordHash = await hashPassword("DemoPass123!");
  await db.query("insert into users (id, email, password_hash) values ($1, $2, $3) on conflict (email) do nothing", [userId, email, passwordHash]);
  await db.query("insert into profiles (user_id, display_name) values ($1, $2) on conflict (user_id) do nothing", [userId, "Alex Demo"]);
  await db.query("insert into organizations (id, name, slug) values ($1, $2, $3) on conflict (id) do nothing", [orgId, "Kiln Studio", "invoicekiln"]);
  await db.query("insert into organization_members (id, organization_id, user_id, role) values ($1, $2, $3, $4) on conflict do nothing", ["mem_1", orgId, userId, "owner"]);

  await db.query("insert into clients (id, organization_id, name) values ($1,$2,$3)", ["cl1", orgId, "Northshore Books"]);
  await db.query("insert into invoices (id, organization_id, client_id, status, tax_bps) values ($1,$2,$3,$4,$5)", ["inv1", orgId, "cl1", "draft", 800]);
  await db.query("insert into line_items (id, invoice_id, description, qty, unit_cents) values ($1,$2,$3,$4,$5)", ["li1", "inv1", "Brand system", 1, 180000]);
  await db.query("insert into line_items (id, invoice_id, description, qty, unit_cents) values ($1,$2,$3,$4,$5)", ["li2", "inv1", "Poster set", 2, 4500]);
  console.log("Seeded InvoiceKiln");
}

main();
