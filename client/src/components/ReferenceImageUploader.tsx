import { useRef, useState } from "react";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const ACCEPTED_MIME_PREFIX = "image/";

type ReferenceImageUploaderProps = {
  value?: string;
  onChange: (nextValue: string) => void;
  disabled?: boolean;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

export default function ReferenceImageUploader(props: ReferenceImageUploaderProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string>("");

  const hasImage = Boolean(props.value);

  const handleOpenPicker = () => {
    if (props.disabled) return;
    fileRef.current?.click();
  };

  const handleRemove = () => {
    setError("");
    props.onChange("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith(ACCEPTED_MIME_PREFIX)) {
      setError("لو سمحت ارفع ملف صورة بس.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`حجم الصورة كبير أوي. أقصى مساحة مسموح بيها هي ${formatFileSize(MAX_FILE_SIZE_BYTES)}.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      if (!result.startsWith("data:image/")) {
        setError("معرفناش نعالج الصورة دي. جرب ترفع ملف تاني.");
        return;
      }
      setError("");
      props.onChange(result);
    };
    reader.onerror = () => {
      setError("معرفناش نقرأ الملف ده. جرب تاني.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      dir="rtl"
      lang="ar"
      className="space-y-3 rounded-xl border border-outline/30 bg-surface-container-lowest p-3 dark:border-muted/40 dark:bg-earth-darkBg/60"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold text-on-surface">صورة مرجعية (Reference) - اختياري</p>
        <button
          type="button"
          className="rounded-lg border border-outline/40 bg-surface-container-high px-3 py-1.5 text-xs font-semibold text-on-surface transition hover:bg-surface-container-highest disabled:cursor-not-allowed disabled:opacity-50 dark:border-muted/40 dark:bg-surface-container-high"
          onClick={handleOpenPicker}
          disabled={props.disabled}
        >
          {hasImage ? "غير الصورة" : "ارفع صورة"}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
        disabled={props.disabled}
      />

      {hasImage && (
        <div className="space-y-2">
          <img src={props.value} alt="معاينة الصورة" className="max-h-52 w-full rounded-lg object-cover" />
          <button
            type="button"
            className="rounded-lg border border-outline/40 bg-surface-container-high px-3 py-1.5 text-xs font-semibold text-on-surface transition hover:bg-surface-container-highest disabled:cursor-not-allowed disabled:opacity-50 dark:border-muted/40 dark:bg-surface-container-high"
            onClick={handleRemove}
            disabled={props.disabled}
          >
            امسح الصورة
          </button>
        </div>
      )}

      <p className="text-[11px] text-on-surface-variant">
        ارفع صورة هنا لو عايز الذكاء الاصطناعي يمشي على ستايل أو ألوان معينة. أقصى مساحة:{" "}
        {formatFileSize(MAX_FILE_SIZE_BYTES)}.
      </p>

      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
