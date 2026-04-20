import { beforeEach, describe, expect, it, vi } from "vitest";
import { inspect } from "node:util";

const getAuthUser = vi.fn();
const ensureUserFromSupabase = vi.fn();
const whereSelectSpy = vi.fn();
const whereUpdateSpy = vi.fn();

const selectRows = [
  {
    id: "n1",
    userId: "user-a",
    title: "Ready",
    body: "kit ready",
    kind: "kit_success",
    kitId: "k1",
    readAt: null,
    createdAt: new Date("2026-04-20T00:00:00.000Z"),
  },
];

const selectBuilder = {
  from: vi.fn(() => selectBuilder),
  where: vi.fn((arg: unknown) => {
    whereSelectSpy(arg);
    return selectBuilder;
  }),
  orderBy: vi.fn(() => selectBuilder),
  limit: vi.fn(async () => selectRows),
};

const updateQueryBuilder = {
  returning: vi.fn(async () => [{ id: "n1" }]),
};

const updateBuilder = {
  set: vi.fn(() => ({
    where: vi.fn((arg: unknown) => {
      whereUpdateSpy(arg);
      return updateQueryBuilder;
    }),
  })),
};

const db = {
  select: vi.fn(() => selectBuilder),
  update: vi.fn(() => updateBuilder),
};

vi.mock("../db/index.js", () => ({
  db,
}));

vi.mock("../middleware/userAuth.js", () => ({
  getAuthUser,
}));

vi.mock("../services/subscriptionService.js", () => ({
  ensureUserFromSupabase,
}));

describe("features notifications ownership isolation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAuthUser.mockReturnValue({
      supabaseUserId: "supabase-user-a",
      email: "a@example.com",
      displayName: "User A",
    });
    ensureUserFromSupabase.mockResolvedValue({ id: "user-a" });
  });

  it("scopes notifications list by user_id", async () => {
    const { createFeaturesRouter } = await import("./features.js");
    const app = createFeaturesRouter(async (_c, next) => next());

    const res = await app.request("/notifications");
    expect(res.status).toBe(200);

    const whereArg = whereSelectSpy.mock.calls[0]?.[0];
    expect(inspect(whereArg)).toMatch(/user_id/i);
  });

  it("scopes read-all and read-one updates by user_id", async () => {
    const { createFeaturesRouter } = await import("./features.js");
    const app = createFeaturesRouter(async (_c, next) => next());

    const readAll = await app.request("/notifications/read-all", { method: "PATCH" });
    expect(readAll.status).toBe(200);

    const readOne = await app.request("/notifications/n1/read", { method: "PATCH" });
    expect(readOne.status).toBe(200);

    expect(whereUpdateSpy).toHaveBeenCalledTimes(2);
    expect(ensureUserFromSupabase).toHaveBeenCalledTimes(2);
  });
});
