import { useState } from "react";
import { ApiError } from "../../../api";
import { generateKitStream, type KitGenerationStreamEvent } from "../../../api";
import type { WizardEventPayload, WizardType } from "../../../lib/wizardAnalytics";
import type { BriefForm } from "../../../types";

export function useWizardSubmission(params: {
  draftKey: string;
  wizardType: WizardType;
  step: number;
  stepOrder: string[];
  createIdempotencyKey: () => string;
  clearDraft: () => void;
  navigateToKit: (kitId: string) => void;
  clampCounts: (form: BriefForm) => BriefForm;
  emit: (event: Omit<WizardEventPayload, "ts">) => void;
  getElapsedMs: () => number;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamStatus, setStreamStatus] = useState<string>("starting");
  const [streamMessage, setStreamMessage] = useState<string>("");
  const [streamProgress, setStreamProgress] = useState(0);
  const [streamSnapshot, setStreamSnapshot] = useState<Record<string, unknown> | null>(null);

  const onValidSubmit = async (form: BriefForm) => {
    setError(null);
    setLoading(true);
    params.emit({
      name: "wizard_generate_clicked",
      wizard_type: params.wizardType,
      draft_key: params.draftKey,
      step_index: params.step,
      step_id: params.stepOrder[params.step],
      elapsed_time_ms: params.getElapsedMs(),
    });
    try {
      const payload = params.clampCounts(form);
      const kit = await generateKitStream(payload, params.createIdempotencyKey(), (evt: KitGenerationStreamEvent) => {
        if (evt.type === "status") {
          setStreamStatus(evt.status);
          if (evt.message) setStreamMessage(evt.message);
          return;
        }
        if (evt.type === "partial") {
          setStreamProgress(Math.max(0, Math.min(1, evt.progress)));
          setStreamSnapshot(evt.snapshot);
          return;
        }
        if (evt.type === "error") {
          setError(evt.message);
        }
      });
      params.clearDraft();
      params.emit({
        name: "kit_created_success",
        wizard_type: params.wizardType,
        draft_key: params.draftKey,
        kit_id: kit.id,
        elapsed_time_ms: params.getElapsedMs(),
      });
      params.navigateToKit(kit.id);
    } catch (e) {
      const safeMessage = e instanceof ApiError ? e.message : "Failed to generate kit. Please try again.";
      setError(safeMessage);
      params.emit({
        name: "kit_created_failed",
        wizard_type: params.wizardType,
        draft_key: params.draftKey,
        error: safeMessage,
        elapsed_time_ms: params.getElapsedMs(),
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    onValidSubmit,
    streamStatus,
    streamMessage,
    streamProgress,
    streamSnapshot,
  };
}
