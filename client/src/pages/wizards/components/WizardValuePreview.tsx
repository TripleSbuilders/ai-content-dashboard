const WIZARD_KIT_LABEL: Record<string, string> = {
  social: "حملة السوشيال ميديا",
  offer: "حملة العروض والمنتجات",
  deep: "حملة المحتوى العميق",
  unknown: "المحتوى",
};

export default function WizardValuePreview(props: {
  wizardType: string;
  brandName: string;
  industry: string;
  direction: string;
}) {
  const kitLabel = WIZARD_KIT_LABEL[props.wizardType] ?? props.wizardType;
  return (
    <div className="mb-5 rounded-xl border border-secondary/30 bg-secondary/10 p-4">
      <p className="text-[11px] font-bold uppercase tracking-wide text-secondary">نظرة سريعة</p>
      <h3 className="mt-1 text-sm font-semibold text-on-surface">
        بنجهز باقة {kitLabel} لـ {props.brandName}
      </h3>
      <p className="mt-1 text-xs text-on-surface-variant">
        المجال: {props.industry}. الاتجاه الأساسي: {props.direction.slice(0, 120)}.
      </p>
    </div>
  );
}
