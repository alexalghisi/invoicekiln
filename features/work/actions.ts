"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";

export async function setStatusAction(id: string, status: "sent" | "paid") {
  const user = await requireUser();
  const db = await getDb();
  await db.query("update invoices set status = $1 where id = $2 and organization_id = $3", [status, id, user.organizationId]);
  revalidatePath("/app");
}
