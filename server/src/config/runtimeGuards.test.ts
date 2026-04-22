import { describe, expect, it } from "vitest";
import { assertSafeCorsOriginForRuntime } from "./runtimeGuards.js";

describe("assertSafeCorsOriginForRuntime", () => {
  it("throws in production when CORS_ORIGIN is wildcard", () => {
    expect(() => assertSafeCorsOriginForRuntime("production", "*")).toThrow(
      /Refusing to start/i,
    );
  });

  it("allows explicit origins in production", () => {
    expect(() =>
      assertSafeCorsOriginForRuntime("production", "https://app.example.com"),
    ).not.toThrow();
  });

  it("allows wildcard in non-production", () => {
    expect(() => assertSafeCorsOriginForRuntime("development", "*")).not.toThrow();
  });
});
