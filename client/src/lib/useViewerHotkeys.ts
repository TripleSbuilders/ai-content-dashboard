import { useEffect } from "react";

type ViewerHotkeyActions = {
  onCopy: () => void;
  onRegenerate: () => void;
  onApproveOrSave: () => void;
};

export function isEditableTarget(target: EventTarget | null): boolean {
  if (typeof HTMLElement === "undefined") return false;
  if (!(target instanceof HTMLElement)) return false;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return true;
  return target.isContentEditable;
}

export type ViewerHotkeyAction = "copy" | "regenerate" | "approve_or_save" | null;

export function resolveViewerHotkeyAction(event: KeyboardEvent): ViewerHotkeyAction {
  if (!(event.ctrlKey || event.metaKey) || event.repeat || isEditableTarget(event.target)) return null;
  const key = event.key.toLowerCase();
  if (key === "c") return "copy";
  if (key === "r") return "regenerate";
  if (event.key === "Enter") return "approve_or_save";
  return null;
}

export function useViewerHotkeys({ onCopy, onRegenerate, onApproveOrSave }: ViewerHotkeyActions): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const action = resolveViewerHotkeyAction(event);
      if (action === "copy") {
        event.preventDefault();
        onCopy();
        return;
      }

      if (action === "regenerate") {
        event.preventDefault();
        onRegenerate();
        return;
      }

      if (action === "approve_or_save") {
        event.preventDefault();
        onApproveOrSave();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onApproveOrSave, onCopy, onRegenerate]);
}
