import { describe, expect, it } from "vitest";
import { HttpError, failureHintForCode, safeClientError, toFailureCode } from "./serviceErrors.js";

describe("serviceErrors", () => {
  it("maps known failure patterns to safe codes", () => {
    expect(toFailureCode(new Error("Missing GEMINI_API_KEY."))).toBe("API_KEY_MISSING");
    expect(toFailureCode(new Error("request timeout from model"))).toBe("MODEL_TIMEOUT");
    expect(toFailureCode(new Error("Model returned invalid regenerate payload."))).toBe("INVALID_MODEL_JSON");
    expect(toFailureCode(new Error("content_package_chain failed"))).toBe("CONTENT_PACKAGE_CHAIN_FAILED");
  });

  it("uses fallback code for unknown errors", () => {
    expect(toFailureCode(new Error("something odd happened"), "RETRY_FAILED")).toBe("RETRY_FAILED");
  });

  it("returns safe client message behavior unchanged", () => {
    expect(safeClientError(new HttpError(400, "Bad input"))).toBe("Bad input");
    expect(safeClientError(new Error("internal boom"))).toBe("Generation failed. Please retry.");
  });

  it("provides stable hints for exposed codes", () => {
    expect(failureHintForCode("API_KEY_MISSING")).toContain("key");
    expect(failureHintForCode("INVALID_MODEL_JSON")).toContain("format");
  });
});

