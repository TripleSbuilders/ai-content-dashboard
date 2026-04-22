import { beforeEach, describe, expect, it, vi } from "vitest";

const listAllKits = vi.fn();
const listKits = vi.fn();
const getKitById = vi.fn();
const getKitByIdAny = vi.fn();
const serializeKit = vi.fn();
const getLatestFailuresForKits = vi.fn();
const getLatestFailureForKit = vi.fn();

vi.mock("./kitRepository.js", () => ({
  deleteKitByIdWithAudit: vi.fn(),
  getKitById,
  getKitByIdAny,
  getLatestSuccessfulKitForOwner: vi.fn(),
  getPendingKitByBriefHash: vi.fn(),
  listAllKits,
  listKits,
  patchKitUiPreferences: vi.fn(),
  persistKit: vi.fn(),
  serializeKit,
  updateKit: vi.fn(),
}));

vi.mock("./kitFailureLogRepository.js", () => ({
  logKitFailure: vi.fn(),
  getLatestFailureForKit,
  getLatestFailuresForKits,
}));

describe("kitGenerationService failure reason exposure", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds failure_reason only for failed rows in admin list", async () => {
    const createdAt = new Date("2026-04-20T10:00:00.000Z");
    listAllKits.mockResolvedValueOnce([
      { id: "k-failed", delivery_status: "failed_generation" },
      { id: "k-done", delivery_status: "done" },
    ]);
    getLatestFailuresForKits.mockResolvedValueOnce({
      "k-failed": {
        kitId: "k-failed",
        phase: "generate",
        errorCode: "MODEL_TIMEOUT",
        errorMessage: "timeout",
        correlationId: "corr-1",
        createdAt,
      },
      "k-done": {
        kitId: "k-done",
        phase: "generate",
        errorCode: "MODEL_TIMEOUT",
        errorMessage: "timeout",
        correlationId: "corr-2",
        createdAt,
      },
    });

    const { listKitsService } = await import("./kitGenerationService.js");
    const result = await listKitsService(undefined, { includeUsage: true });
    const failed = result.find((row: { id: string }) => row.id === "k-failed");
    const done = result.find((row: { id: string }) => row.id === "k-done");

    expect(failed.failure_reason?.code).toBe("MODEL_TIMEOUT");
    expect(typeof failed.failure_reason?.hint).toBe("string");
    expect(done.failure_reason).toBeUndefined();
  });

  it("does not fetch failure logs for non-admin list path", async () => {
    const owner = { deviceId: "d-1", userId: null };
    listKits.mockResolvedValueOnce([{ id: "k-owned" }]);

    const { listKitsService } = await import("./kitGenerationService.js");
    await listKitsService(owner, { includeUsage: false });

    expect(getLatestFailuresForKits).not.toHaveBeenCalled();
  });

  it("does not include failureReason for admin get-by-id when kit is not failed", async () => {
    getKitByIdAny.mockResolvedValueOnce({
      id: "k-done",
      deliveryStatus: "done",
    });
    getLatestFailureForKit.mockResolvedValueOnce({
      kitId: "k-done",
      phase: "generate",
      errorCode: "MODEL_TIMEOUT",
      errorMessage: "timeout",
      correlationId: "corr-3",
      createdAt: new Date("2026-04-20T10:00:00.000Z"),
    });
    serializeKit.mockReturnValueOnce({ id: "k-done", delivery_status: "done" });

    const { getKitByIdService } = await import("./kitGenerationService.js");
    await getKitByIdService("k-done", undefined, { includeUsage: true });

    expect(serializeKit).toHaveBeenCalledWith(
      expect.objectContaining({ id: "k-done" }),
      expect.objectContaining({ includeUsage: true, failureReason: null })
    );
  });
});
