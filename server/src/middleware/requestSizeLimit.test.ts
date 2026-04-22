import { describe, expect, it } from "vitest";
import { Hono } from "hono";
import { requestSizeLimit } from "./requestSizeLimit.js";

describe("requestSizeLimit", () => {
  it("allows requests when content-length is under threshold", async () => {
    const app = new Hono();
    app.use("/api/*", requestSizeLimit(128));
    app.post("/api/demo", (c) => c.json({ ok: true }));

    const res = await app.request("/api/demo", {
      method: "POST",
      headers: { "content-type": "application/json", "content-length": "64" },
      body: JSON.stringify({ hello: "world" }),
    });
    expect(res.status).toBe(200);
  });

  it("rejects requests when content-length exceeds threshold", async () => {
    const app = new Hono();
    app.use("/api/*", requestSizeLimit(16));
    app.post("/api/demo", (c) => c.json({ ok: true }));

    const res = await app.request("/api/demo", {
      method: "POST",
      headers: { "content-type": "application/json", "content-length": "64" },
      body: JSON.stringify({ hello: "world" }),
    });
    expect(res.status).toBe(413);
  });
});

