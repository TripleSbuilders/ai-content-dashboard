import { useState } from "react";
import { generateKit } from "../../../api";
import type { BriefForm } from "../../../types";

export function useWizardSubmission(params: {
  draftKey: string;
  wizardType: string;
  step: number;
  stepOrder: string[];
  idempotencyKey: string;
  clearDraft: () => void;
  navigateToKit: (kitId: string) => void;
  clampCounts: (form: BriefForm) => BriefForm;
  emit: (event: any) => void;
  getElapsedMs: () => number;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const kit = await generateKit(payload, params.idempotencyKey);
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
      setError(String(e));
      params.emit({
        name: "kit_created_failed",
        wizard_type: params.wizardType,
        draft_key: params.draftKey,
        error: String(e),
        elapsed_time_ms: params.getElapsedMs(),
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, setError, onValidSubmit };
}
