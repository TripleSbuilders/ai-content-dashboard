export type SelectionOption = {
  value: string;
  labelAr: string;
  /** Stored drafts may persist previous Arabic labels; keep these for decode compatibility. */
  legacyLabelAr?: readonly string[];
  icon?: string;
};

export const MAIN_GOAL_OPTIONS: readonly SelectionOption[] = [
  {
    value: "increase_sales",
    labelAr: "زيادة المبيعات (Sales)",
    legacyLabelAr: ["زيادة مبيعات", "Increase qualified leads and purchases"],
    icon: "💰",
  },
  {
    value: "brand_awareness",
    labelAr: "الوعي بالبراند (Brand Awareness)",
    legacyLabelAr: [
      "وعي بالعلامة التجارية",
      "Build authority with high-depth content",
      "بناء ثقة ومصداقية (Authority) بمحتوى عميق",
    ],
    icon: "📈",
  },
  {
    value: "increase_engagement",
    labelAr: "زيادة التفاعل (Engagement)",
    legacyLabelAr: [
      "زيادة التفاعل",
      "Grow social reach and engagement",
      "زيادة الوصول والتفاعل (Reach & Engagement)",
    ],
    icon: "💬",
  },
] as const;

export const BRAND_TONE_OPTIONS: readonly SelectionOption[] = [
  { value: "formal_professional", labelAr: "رسمي واحترافي (Formal)", legacyLabelAr: ["رسمي واحترافي"] },
  { value: "funny_trendy", labelAr: "فرفوش وماشي مع التريند", legacyLabelAr: ["فكاهي وتريند"] },
  { value: "friendly_persuasive", labelAr: "فريندلي ومقنع", legacyLabelAr: ["ودي ومقنع"] },
  { value: "modern_contemporary", labelAr: "مودرن وعصري", legacyLabelAr: ["حديث وعصري"] },
] as const;

export const TARGET_AUDIENCE_OPTIONS: readonly SelectionOption[] = [
  { value: "youth", labelAr: "الشباب" },
  { value: "entrepreneurs", labelAr: "رواد الأعمال" },
  { value: "mothers", labelAr: "الأمهات" },
  { value: "students", labelAr: "الطلبة", legacyLabelAr: ["الطلاب"] },
] as const;

export const PLATFORM_OPTIONS: readonly SelectionOption[] = [
  { value: "facebook", labelAr: "فيسبوك", legacyLabelAr: ["Facebook"] },
  { value: "instagram", labelAr: "إنستجرام", legacyLabelAr: ["Instagram"] },
  { value: "x", labelAr: "إكس (تويتر)", legacyLabelAr: ["X"] },
  { value: "linkedin", labelAr: "لينكد إن", legacyLabelAr: ["LinkedIn"] },
  { value: "tiktok", labelAr: "تيك توك", legacyLabelAr: ["TikTok"] },
  { value: "youtube", labelAr: "يوتيوب", legacyLabelAr: ["YouTube"] },
] as const;

export const BEST_CONTENT_TYPE_OPTIONS: readonly SelectionOption[] = [
  { value: "educational", labelAr: "محتوى تعليمي", legacyLabelAr: ["educational carousel"], icon: "🎓" },
  {
    value: "behind_the_scenes",
    labelAr: "كواليس الشغل (BTS)",
    legacyLabelAr: ["خلف الكواليس"],
    icon: "🎬",
  },
  { value: "before_after", labelAr: "قبل وبعد", legacyLabelAr: ["قبل / بعد"], icon: "✨" },
  {
    value: "testimonials",
    labelAr: "ريفيوهات وآراء العملاء (Testimonials)",
    legacyLabelAr: ["آراء العملاء", "case study"],
    icon: "🗣️",
  },
  {
    value: "offers_promotions",
    labelAr: "عروض وخصومات (Promos)",
    legacyLabelAr: ["عروض وتخفيضات"],
    icon: "🏷️",
  },
  { value: "faq", labelAr: "أسئلة شائعة (FAQ)", legacyLabelAr: ["أسئلة شائعة"], icon: "❓" },
  {
    value: "product_demo",
    labelAr: "عرض المنتج (Product Demo)",
    legacyLabelAr: ["عرض المنتج", "deep explainer video"],
    icon: "🧪",
  },
  { value: "problem_solving", labelAr: "حل المشاكل", legacyLabelAr: ["حل المشكلات"], icon: "🛠️" },
] as const;

export const OTHER_OPTION: SelectionOption = {
  value: "__other__",
  labelAr: "حاجة تانية (اكتبها بنفسك)",
  legacyLabelAr: ["أخرى (اكتب بنفسك)"],
  icon: "➕",
};
