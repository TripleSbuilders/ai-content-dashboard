import { describe, expect, it } from "vitest";
import { resolveViewerHotkeyAction } from "./useViewerHotkeys";

describe("resolveViewerHotkeyAction", () => {
  it("maps ctrl/cmd shortcuts to expected actions", () => {
    const copy = { key: "c", ctrlKey: true, metaKey: false, repeat: false, target: null } as KeyboardEvent;
    const regenerate = { key: "r", ctrlKey: false, metaKey: true, repeat: false, target: null } as KeyboardEvent;
    const approve = { key: "Enter", ctrlKey: true, metaKey: false, repeat: false, target: null } as KeyboardEvent;
    expect(resolveViewerHotkeyAction(copy)).toBe("copy");
    expect(resolveViewerHotkeyAction(regenerate)).toBe("regenerate");
    expect(resolveViewerHotkeyAction(approve)).toBe("approve_or_save");
  });

  it("ignores repeated events", () => {
    const event = { key: "c", ctrlKey: true, metaKey: false, repeat: true, target: null } as KeyboardEvent;
    expect(resolveViewerHotkeyAction(event)).toBe(null);
  });
});
