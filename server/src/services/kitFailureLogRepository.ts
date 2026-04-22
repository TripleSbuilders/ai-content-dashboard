import { nanoid } from "nanoid";
import { kitFailureLogs } from "../db/schema.js";
import { desc, eq, inArray } from "drizzle-orm";

type LogFailureInput = {
  kitId?: string;
  phase: "generate" | "retry" | "regenerate" | "content_package_chain";
  errorCode: string;
  errorMessage: string;
  correlationId: string;
  modelUsed: string;
  meta?: Record<string, unknown>;
};

export async function logKitFailure(db: any, input: LogFailureInput): Promise<void> {
  await db.insert(kitFailureLogs).values({
    id: nanoid(),
    kitId: input.kitId ?? null,
    phase: input.phase,
    errorCode: input.errorCode,
    errorMessage: input.errorMessage,
    correlationId: input.correlationId,
    modelUsed: input.modelUsed,
    metaJson: JSON.stringify(input.meta ?? {}),
    createdAt: new Date(),
  });
}

export type FailureLogView = {
  kitId: string;
  phase: string;
  errorCode: string;
  errorMessage: string;
  correlationId: string;
  createdAt: Date;
};

export async function getLatestFailureForKit(db: any, kitId: string): Promise<FailureLogView | null> {
  const row = (
    await db
      .select()
      .from(kitFailureLogs)
      .where(eq(kitFailureLogs.kitId, kitId))
      .orderBy(desc(kitFailureLogs.createdAt))
      .limit(1)
  )[0];
  if (!row?.kitId) return null;
  return {
    kitId: row.kitId,
    phase: row.phase,
    errorCode: row.errorCode,
    errorMessage: row.errorMessage,
    correlationId: row.correlationId,
    createdAt: row.createdAt,
  };
}

export async function getLatestFailuresForKits(db: any, kitIds: string[]): Promise<Record<string, FailureLogView>> {
  const normalized = Array.from(new Set(kitIds.map((id) => String(id ?? "").trim()).filter(Boolean)));
  if (!normalized.length) return {};
  const rows = await db
    .select()
    .from(kitFailureLogs)
    .where(inArray(kitFailureLogs.kitId, normalized))
    .orderBy(desc(kitFailureLogs.createdAt));

  const byKit: Record<string, FailureLogView> = {};
  for (const row of rows) {
    if (!row.kitId || byKit[row.kitId]) continue;
    byKit[row.kitId] = {
      kitId: row.kitId,
      phase: row.phase,
      errorCode: row.errorCode,
      errorMessage: row.errorMessage,
      correlationId: row.correlationId,
      createdAt: row.createdAt,
    };
  }
  return byKit;
}
