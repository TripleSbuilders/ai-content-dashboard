import { beforeEach, describe, expect, it, vi } from "vitest";

const isAgencyAdminRequest = vi.fn();
const getAuthUser = vi.fn();
const dbSelect = vi.fn();
const dbFrom = vi.fn();
const dbWhere = vi.fn();
const dbLimit = vi.fn();

vi.mock("../middleware/agencyAdminAuth.js", () => ({
  isAgencyAdminRequest,
}));

vi.mock("../middleware/userAuth.js", () => ({
  getAuthUser,
}));

vi.mock("../db/schema.js", () => ({
  users: {
    isAdmin: "is_admin",
    supabaseUserId: "supabase_user_id",
  },
}));

vi.mock("../db/index.js", () => ({
  db: {
    select: dbSelect,
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: (_a: unknown, _b: unknown) => ({ _tag: "eq" }),
}));

async function appRequest(path: string, init?: RequestInit) {
  const { createAnalyticsRouter } = await import("./analytics.js");
  const app = createAnalyticsRouter(async (_c, next) => next());
  return app.request(path, init);
}

describe("analytics routes auth boundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isAgencyAdminRequest.mockResolvedValue(false);
    getAuthUser.mockReturnValue(null);
    dbSelect.mockReturnValue({
      from: dbFrom,
    });
    dbFrom.mockReturnValue({
      where: dbWhere,
    });
    dbWhere.mockReturnValue({
      limit: dbLimit,
    });
    dbLimit.mockResolvedValue([]);
  });

  it("keeps wizard-events ingestion open", async () => {
    const res = await appRequest("/analytics/wizard-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        events: [{ name: "wizard_opened", ts: Date.now() }],
      }),
    });
    expect(res.status).toBe(202);
  });

  it("rejects summary endpoint when unauthenticated", async () => {
    const res = await appRequest("/analytics/wizard-summary");
    expect(res.status).toBe(401);
  });

  it("allows summary endpoint for agency admin session", async () => {
    isAgencyAdminRequest.mockResolvedValue(true);
    const ingest = await appRequest("/analytics/wizard-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        events: [{ name: "wizard_opened", ts: Date.now() }],
      }),
    });
    expect(ingest.status).toBe(202);
    const res = await appRequest("/analytics/wizard-summary");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.byName.wizard_opened).toBeGreaterThan(0);
  });

  it("allows summary endpoint for authenticated admin user", async () => {
    getAuthUser.mockReturnValue({ supabaseUserId: "supabase-user-1" });
    dbLimit.mockResolvedValue([{ isAdmin: true }]);
    const res = await appRequest("/analytics/wizard-summary");
    expect(res.status).toBe(200);
  });
});

