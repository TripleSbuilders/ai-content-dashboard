## 1) ReferenceImageUploader

**File:** `client/src/components/ReferenceImageUploader.tsx`

| Location | Improved English / Context | Current Arabic Text | New Egyptian Text |
|----------|----------------------------|----------------------|-------------------|
| Header label L69–71 | Reference Image (Optional) | | صورة مرجعية (Reference) - اختياري |
| Primary button L78 (empty) | Upload Image | | ارفع صورة |
| Primary button L78 (has image) | Replace Image | | غير الصورة |
| Preview `alt` L93 | Reference preview | | معاينة الصورة |
| Remove button L100 | Remove Image | | امسح الصورة |
| Helper copy L105–107 | Add this if you want the AI to follow a specific visual style or color palette. Max size: `{formatFileSize(MAX)}`. | | ارفع صورة هنا لو عايز الذكاء الاصطناعي يمشي على ستايل أو ألوان معينة. أقصى مساحة: `{formatFileSize(MAX)}`. |
| Error L41 | Please upload a valid image file. | | لو سمحت ارفع ملف صورة بس. |
| Error L46 | This image is too large. The maximum size is `{formatFileSize(MAX_FILE_SIZE_BYTES)}`. | | حجم الصورة كبير أوي. أقصى مساحة مسموح بيها هي `{formatFileSize(MAX_FILE_SIZE_BYTES)}`. |
| Error L54 | We couldn't process this image. Please try another file. | | معرفناش نعالج الصورة دي. جرب ترفع ملف تاني. |
| Error L61 | We couldn't read this file. Please try again. | | معرفناش نقرأ الملف ده. جرب تاني. |

---

## 2) Zod validation messages

**Primary file:** `client/src/briefSchema.ts`

### 2a) Base `briefSchema`

| Location | Improved English / Context | Current Arabic Text | New Egyptian Text |
|----------|----------------------------|----------------------|-------------------|
| `client_email` refine L24–26 | Please enter a valid email address | | اكتب إيميل مظبوط |
| `brand_name` L28 | Brand name is required | | اسم البراند مطلوب |
| `num_posts` / `num_image_designs` / `num_video_prompts` / `content_package_idea_count` L44–69 | Please enter a valid number | | اكتب رقم صحيح |
| `num_posts` min/max L47–48 | Must be between 0 and 25 | | لازم يكون بين 0 و 25 |
| `num_image_designs` min/max L52–53 | Must be between 0 and 10 | | لازم يكون بين 0 و 10 |
| `num_video_prompts` min/max L57–58 | Must be between 0 and 10 | | لازم يكون بين 0 و 10 |
| `content_package_idea_count` min/max L63–69 | Must be between 0 and 25 | | لازم يكون بين 0 و 25 |

### 2b) Agency contact (`requiredClientContactShape`)

| Location | Improved English / Context | Current Arabic Text | New Egyptian Text |
|----------|----------------------------|----------------------|-------------------|
| `client_name` L83 | Client name is required | | اسم العميل مطلوب |
| `client_phone` L84 | Client phone number is required | | رقم تليفون العميل مطلوب |
| `client_email` L88 | Client email is required | | إيميل العميل مطلوب |
| `client_email` refine L89–91 | Please enter a valid email address | | اكتب إيميل مظبوط |

### 2c) `socialBriefSchema` (L95–101)

| Location | Improved English / Context | Current Arabic Text | New Egyptian Text |
|----------|----------------------------|----------------------|-------------------|
| `industry` L96 | Please select an industry | | اختار المجال بتاعك |
| `target_audience` L97 | Please select at least one target audience | | اختار شريحة واحدة على الأقل من الجمهور |
| `main_goal` L98 | Please select a main campaign goal | | اختار الهدف الأساسي للحملة |
| `platforms` L99 | Please select at least one active platform | | اختار منصة واحدة على الأقل |
| `brand_tone` L100 | Please select a brand tone | | اختار نبرة البراند (Tone of Voice) |

### 2d) `offerBriefSchema` (L104–108)

| Location | Improved English / Context | Current Arabic Text | New Egyptian Text |
|----------|----------------------------|----------------------|-------------------|
| `industry` L105 | Please select an industry | | اختار المجال بتاعك |
| `offer` L106 | Please describe your core offer | | اشرح العرض بتاعك |
| `target_audience` L107 | Please select at least one target audience | | اختار شريحة واحدة على الأقل من الجمهور |
| `main_goal` L108 | Please select a main goal | | اختار الهدف الأساسي |

### 2e) `deepBriefSchema` (L112–118)

| Location | Improved English / Context | Current Arabic Text | New Egyptian Text |
|----------|----------------------------|----------------------|-------------------|
| `industry` L113 | Please select an industry | | اختار المجال بتاعك |
| `target_audience` L114 | Please select at least one target audience | | اختار شريحة واحدة على الأقل من الجمهور |
| `main_goal` L115 | Please select a main goal | | اختار الهدف الأساسي |
| `visual_notes` L116 | Please add a creative direction | | اكتب ملاحظات الديزاين (Creative Direction) |
| `campaign_duration` L117 | Please specify the campaign duration | | حدد مدة الحملة |
| `best_content_types` L118 | Please select at least one content format | | اختار نوع محتوى واحد على الأقل |

### 2f) Diagnosis extensions (`socialBriefSchemaWithDiagnosis`, `offerBriefSchemaWithDiagnosis`, `deepBriefSchemaWithDiagnosis` — L121–142)

| Location | Improved English / Context | Current Arabic Text | New Egyptian Text |
|----------|----------------------------|----------------------|-------------------|
| `diagnostic_role` | Please select your role | | اختار دورك |
| `diagnostic_account_stage` | Please select your business stage | | اختار مرحلة البيزنس |
| `diagnostic_followers_band` | Please select your follower range | | اختار عدد المتابعين |
| `diagnostic_primary_blocker` | Please select your primary challenge | | اختار أكبر مشكلة بتواجهك |
| `diagnostic_revenue_goal` | Please select a target revenue range | | اختار تارجت المبيعات |

### 2g) Implicit / library-default message

| Location | Improved English / Context | Current Arabic Text | New Egyptian Text |
|----------|----------------------------|----------------------|-------------------|
| `reference_image` L40 `z.string().max(3_000_000).optional()` | (Default Zod 'too_big' validation message handling) | | حجم الصورة كبير جداً (يجب أن لا يتخطى الحد الأقصى) |
