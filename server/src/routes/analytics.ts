import { Hono } from "hono";
import { z } from "zod";
import type { Next } from "hono";
import { isAgencyAdminRequest } from "../middleware/agencyAdminAuth.js";
import { getAuthUser } from "../middleware/userAuth.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

const eventSchema = z.object({
  name: z.string().min(1),
  ts: z.number().int().nonnegative(),
  wizard_type: z.string().optional(),
  draft_key: z.string().optional(),
  step_id: z.string().optional(),
  step_index: z.number().int().optional(),
  total_steps: z.number().int().optional(),
  validation_state: z.enum(["passed", "failed"]).optional(),
  elapsed_time_ms: z.number().optional(),
  kit_id: z.string().optional(),
  error: z.string().optional(),
  restored_draft: z.boolean().optional(),
  experiment_variant: z.enum(["A", "B"]).optional(),
});

const payloadSchema = z.object({
  events: z.array(eventSchema).min(1).max(100),
});

type StoredEvent = z.infer<typeof eventSchema>;

const memoryStore: StoredEvent[] = [];
const MAX_EVENTS = 5000;

async function requireAdminAccess(c: import("hono").Context): Promise<Response | null> {
  if (await isAgencyAdminRequest(c)) return null;
  const authUser = getAuthUser(c);
  if (!authUser) return c.json({ error: "Unauthorized" }, 401);
  const current = (
    await db
      .select({
        isAdmin: users.isAdmin,
      })
      .from(users)
      .where(eq(users.supabaseUserId, authUser.supabaseUserId))
      .limit(1)
  )[0];
  if (!current?.isAdmin) return c.json({ error: "Admin access required." }, 403);
  return null;
}

export function createAnalyticsRouter(mw?: (c: import("hono").Context, next: Next) => Promise<void | Response>) {
  const app = new Hono();

  if (mw) {
    app.use("/analytics/*", mw);
  }

  app.post("/analytics/wizard-events", async (c) => {
    let body: z.infer<typeof payloadSchema>;
    try {
      body = payloadSchema.parse(await c.req.json());
    } catch {
      return c.json({ error: "Invalid analytics payload" }, 400);
    }

    memoryStore.push(...body.events);
    if (memoryStore.length > MAX_EVENTS) {
      memoryStore.splice(0, memoryStore.length - MAX_EVENTS);
    }

    return c.json({ ok: true, accepted: body.events.length }, 202);
  });

  app.get("/analytics/wizard-summary", async (c) => {
    const blocked = await requireAdminAccess(c);
    if (blocked) return blocked;
    const total = memoryStore.length;
    const byName = memoryStore.reduce<Record<string, number>>((acc, e) => {
      acc[e.name] = (acc[e.name] ?? 0) + 1;
      return acc;
    }, {});
    return c.json({ ok: true, total, byName });
  });

  return app;
}

