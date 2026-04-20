import { describe, expect, it } from "vitest";
import { normalizeCopyText, shouldUseUnicodeClipboard, toUnicodeClipboardText } from "./unicodeClipboard";

describe("unicodeClipboard", () => {
  it("converts short markdown emphasis into unicode alternatives", () => {
    const result = toUnicodeClipboardText("**Boost** your *brand* `now`");
    expect(result).toContain("𝗕");
    expect(result).toContain("𝘣");
    expect(result).toContain("「now」");
  });

  it("keeps long text untouched for readability guardrails", () => {
    const long = `${"x".repeat(321)} **bold**`;
    expect(shouldUseUnicodeClipboard(long)).toBe(false);
    expect(toUnicodeClipboardText(long)).toBe(long);
  });

  it("normalizes line endings and trims trailing spaces", () => {
    expect(normalizeCopyText("a\r\nb  \n")).toBe("a\nb");
  });
});
