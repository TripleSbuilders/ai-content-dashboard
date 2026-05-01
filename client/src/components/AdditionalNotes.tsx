import { forwardRef, type TextareaHTMLAttributes } from "react";

const labelCls =
  "mb-2 ms-1 block text-xs font-semibold uppercase tracking-widest text-on-surface-variant";
const fieldShell = "glow-focus rounded-xl bg-surface-container-lowest p-0.5";
const textareaCls =
  "w-full min-h-[128px] resize-y rounded-lg border-none bg-transparent px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 focus-visible:ring-2 focus-visible:ring-primary/45";
const errCls = "mt-1 text-sm text-error";

export type AdditionalNotesProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
  hintId?: string;
};

const AdditionalNotes = forwardRef<HTMLTextAreaElement, AdditionalNotesProps>(function AdditionalNotes(
  { error, className, id = "visual_notes", hintId = "visual_notes_hint", ...rest },
  ref,
) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className={labelCls}>
        ملاحظات إضافية
      </label>
      <p id={hintId} className="mb-2 text-sm text-on-surface-variant">
        لو عندك أي تعليمات زيادة بخصوص نبرة الصوت، الديزاين، أو شكل التسليم، اكتبها هنا.
      </p>
      <div className={fieldShell}>
        <textarea
          ref={ref}
          id={id}
          aria-describedby={hintId}
          className={textareaCls + (className ? ` ${className}` : "")}
          placeholder="اكتب أي ملاحظات أو تعليمات زيادة هنا..."
          {...rest}
        />
      </div>
      {error ? <p className={errCls}>{error}</p> : null}
    </div>
  );
});

export default AdditionalNotes;
