import { beforeEach, describe, expect, it, vi } from "vitest";

const isAgencyAdminRequest = vi.fn();
const getAuthUser = vi.fn();

vi.mock("../middleware/agencyAdminAuth.js", () => ({
  isAgencyAdminRequest,
}));

vi.mock("../middleware/userAuth.js", () => ({
  getAuthUser,
}));

vi.mock("../db/index.js", () => ({
  db: {},
}));

describe("admin plans auth boundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isAgencyAdminRequest.mockResolvedValue(false);
    getAuthUser.mockReturnValue(null);
    process.env.API_SECRET = "service-secret";
  });

  it("rejects API_SECRET bearer-only access to admin endpoints", async () => {
    const { createAdminPlansRouter } = await import("./adminPlans.js");
    const app = createAdminPlansRouter(async (_c, next) => next());

    const res = await app.request("/api/admin/users", {
      headers: {
        Authorization: "Bearer service-secret",
      },
    });

    expect(res.status).toBe(401);
  });
});
