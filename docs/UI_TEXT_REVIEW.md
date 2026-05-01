# UI text review (client portal + wizards)

This document is a **read-only snapshot** of user-visible copy in the client portal overview, shell navigation, My Brands, and wizard surfaces. It is **not** wired i18n: changing rows here does not change the app until strings are updated in source.

**How to use:** Fill the last column with **Egyptian colloquial** (or your preferred dialect) where you want different tone from MSA. Leave blank if the current Arabic is fine.

**Columns:** Location (file + area, sometimes line hints) · Current English / context · Current Arabic (MSA/UI Arabic where present) · New Egyptian (owner).

**Note:** The creative step in `WizardCore` renders `AdditionalNotes` from `client/src/components/AdditionalNotes.tsx` (label, hint, placeholder). Those strings are included under wizard creative because users see them in the same flow.

**WizardSteps:** `WizardSteps.tsx` is in scope for the plan but is **not** imported elsewhere in `client/src` at scan time; many labels duplicate `WizardCore`. Rows for `WizardSteps` mark **alternate module** where copy may drift from `WizardCore`.

---

## Overview — `client/src/pages/ClientOverview.tsx`

| Location | Improved English / Context | Current Arabic Text | New Egyptian Text |
|----------|----------------------------|----------------------|-------------------|
| Hero eyebrow L54–L56 | SocialGeni Client Portal | | بوابة عملاء SocialGeni |
| Hero H1 L57–L59 | Welcome to your agency workspace | | أهلاً بيك في مساحة شغلك معانا |
| Hero Arabic line L60–L62 | (English context: tagline under hero) | مرحبًا بك في بوابة الوكالة — محتوى احترافي مدعوم بالذكاء الاصطناعي | أهلاً بيك في البوابة بتاعتنا — محتوى احترافي متظبط بالذكاء الاصطناعي |
| Hero body L63–L66 | Submit a single structured brief. We blend human expertise with AI to deliver production-ready content kits—posts, visuals, and video prompts—complete with clear next steps for your team. | | ابعتلنا بريف واحد متظبط، وإحنا هندمج خبرة فريقنا مع الذكاء الاصطناعي عشان نسلمك محتوى جاهز على النشر — بوستات، أفكار للصور، وسكريبتات فيديوهات — ومعاهم خطوات واضحة لفريقك ينفذها. |
| Primary CTA L72–L74 | Start your request & get a first draft | | ابدأ طلبك واستلم أول مسودة |
| Secondary CTA L75–L79 | View plans & pricing | | شوف خطط الأسعار |
| How it works H2 L87–L89 | How it works | | إزاي بنشتغل؟ |
| How it works Arabic L90 | (subtitle) | كيف نعمل — ثلاث خطوات واضحة | خطواتنا إزاي؟ — تلات خطوات واضحة |
| Step card prefix L101 | Step 1 / Step 2 / Step 3 | | خطوة 1 / خطوة 2 / خطوة 3 |
| STEPS[0] title L6 | Submit your brief | أرسل تفاصيل مشروعك | ابعتلنا البريف بتاعك |
| STEPS[0] body L8–L9 | Fill out our smart project brief so we capture your brand, goals, and channels in one seamless flow. | | املأ نموذج البريف الذكي بتاعنا عشان نفهم البراند بتاعك، أهدافك، والقنوات اللي هتشتغل عليها في خطوات بسيطة. |
| STEPS[1] title L12 | Expert & AI generation | خبراء + ذكاء اصطناعي | خبرة فريقنا + الذكاء الاصطناعي |
| STEPS[1] body L14–L15 | Our team and platform craft tailored posts, image prompts, video prompts, and a strategy perfectly aligned to your brief. | | فريقنا والمنصة بتاعتنا هيجهزوا بوستات، أفكار صور وفيديوهات، واستراتيجية متفصلة مخصوص على مقاس البريف بتاعك. |
| STEPS[2] title L18 | Receive premium assets | استلم أصول جاهزة | استلم محتواك الجاهز |
| STEPS[2] body L19–L20 | Get ready-to-publish content, plus easy exports like PDFs and formatted Excel sheets (if included in your package). | | استلم محتوى جاهز على النشر، ومعاه ملفات التصدير زي الـ PDF وشيتات الإكسل المنسقة (لو باقتك بتشملهم). |
| Portfolio H2 L112–L114 | Recent Projects | | سابقة أعمالنا |
| Portfolio intro L115–L117 | Sample projects — a quick look at the type of packages we deliver. | | أمثلة لشغلنا — نظرة سريعة على الباقات اللي بنقدمها. |
| Featured badge L122–L125 | Featured Project | | تسليمة مميزة |
| Featured H3 L126 | Multi-Channel Launch Package | | باقة إطلاق على منصات مختلفة |
| Featured body L127–L130 | One brief, one cohesive system: tailored posts, image concepts, short-form video prompts, and a weekly publishing schedule your team can execute immediately. | | بريف واحد بيطلعلك سيستم متكامل: بوستات متفصلة لكل منصة، أفكار صور، سكريبتات ريلز وتيك توك، وخطة نشر أسبوعية فريقك يقدر ينفذها فوراً. |
| Tag pills L133–L135 | Bilingual copy; Export-ready; Review workflow | | محتوى عربي وإنجليزي؛ جاهز للتصدير؛ سيستم مراجعة |
| PORTFOLIO[0] L26–L28 | Real Estate Campaign | | حملة تسويق عقاري |
| PORTFOLIO[0] subtitle | Multi-channel launch + bilingual captions | | إطلاق على منصات كتير + كابشنز عربي وإنجليزي |
| PORTFOLIO[1] L31–L33 | E-commerce Launch | | إطلاق متجر إلكتروني (E-commerce) |
| PORTFOLIO[1] subtitle | Product hooks, reels scripts, and ad angles | | أفكار جذابة للمنتجات، سكريبتات ريلز، وزوايا إعلانية (Ad angles) |
| PORTFOLIO[2] L36–L38 | B2B SaaS Thought Leadership | | ريادة فكرية لشركات الـ B2B SaaS |
| PORTFOLIO[2] subtitle | LinkedIn-first content mix and weekly plan | | محتوى مركز على لينكد إن + خطة أسبوعية |
| PORTFOLIO[3] L41–L43 | Hospitality & F&B | | مطاعم وكافيهات (ضيافة) |
| PORTFOLIO[3] subtitle | Seasonal promos and UGC-style video prompts | | عروض المواسم وأفكار فيديوهات بطريقة الـ UGC |
| Closing H2 L159 | Ready to brief your next campaign? | | جاهز تعمل بريف حملتك الجاية؟ |
| Closing body L160–L162 | Launch our smart wizard to detail your brand, audience, and needs. Save your progress and come back anytime. | | افتح النظام الذكي بتاعنا عشان تدخل تفاصيل البراند، جمهورك، والمطلوب. وتقدر تحفظ خطواتك وترجع تكملها في أي وقت. |
| Closing CTA L167–L169 | Start your request & preview deliverables | | ابدأ طلبك وشوف شكل التسليمات |

---

## Navigation & shell — `client/src/layout/UserLayout.tsx`

| Location | Improved English / Context | Current Arabic Text | New Egyptian Text |
|----------|----------------------------|----------------------|-------------------|
| Skip link L86–L91 | Skip to main content | | تخطى للمحتوى الأساسي |
| Brand title L98–L100 | SocialGeni Client Portal | | بوابة عملاء SocialGeni |
| Brand subtitle L100 | Agency Experience | | تجربة وكالات الإعلانات |
| Nav item L10 | Overview | نظرة عامة | الرئيسية / نظرة عامة |
| Nav item L11 | My Brands | علاماتي التجارية | البراندات بتاعتي |
| Nav item L12 | Request Content | طلب محتوى جديد | اطلب محتوى جديد |
| Nav item L13 | Plans & Pricing | باقات الأسعار | الأسعار والباقات |
| Nav `aria-label` L27 | Client portal navigation | | قايمة بوابة العملاء |
| Current plan label L107 | Current Plan | | الباقة الحالية |
| Plan code fallback L108 | (displays `starter` or entitlement code) | | (هتتعرض هنا) |
| Theme control L121–L123 | Theme | | الثيم / المظهر |
| Theme value L123 | Dark / Light | | غامق / فاتح |
| User email fallback L128 | Studio user | | مستخدم الاستوديو |
| Link L130–L132 | Profile | | البروفايل |
| Link L133–L135 | Help | | مساعدة |
| Button L137–L143 | Sign out | | تسجيل خروج |
| Button L146–L152 | Sign in with Google | | سجل دخول بجوجل |
| Mobile menu button `aria-label` L159–L164 | Open navigation menu | | افتح المنيو |
| Mobile header L167 | Client Portal | | بوابة العملاء |
| Mobile sign-in L173–L175 | Sign in | | تسجيل الدخول |
| Mobile overlay close `aria-label` L181–L186 | Close navigation menu | | اقفل المنيو |
| Mobile drawer title L189 | Navigation | | القايمة |

---

## My Brands — `client/src/pages/MyBrandsPage.tsx`

| Location | Improved English / Context | Current Arabic Text | New Egyptian Text |
|----------|----------------------------|----------------------|-------------------|
| Page H1 L170 | My Brands | علاماتي التجارية | البراندات بتاعتي |
| Subtitle L171–L173 | Reuse your saved brand profiles to start new requests in one click. | | استخدم إعدادات البراند اللي حفظتها قبل كده وابدأ طلب جديد بضغطة واحدة. |
| Loading L177–L179 | Loading your brands... | | بنحمل البراندات بتاعتك... |
| Error L141, L183–L184 | We couldn't load your saved brands at the moment. | | معرفناش نحمل البراندات بتاعتك دلوقتي. جرب تاني. |
| Empty state L190–L192 | No saved brands yet. Submit your first request and your brand profile will appear here. | | لسه مفيش براندات متسجلة. اعمل أول طلب ليك وبروفايل البراند هيظهر هنا. |
| Card label L203 | Brand | | البراند |
| Card field L208 | Tone of Voice: | | نبرة الصوت (Tone): |
| Card field L210–L212 | Target Audience: | | الجمهور المستهدف: |
| Fallback tone L110 | Not specified | | مش متحدد |
| Audience empty L212 | Not specified | | مش متحدد |
| CTA button L232–L238 | Order for this Brand | طلب محتوى جديد لهذا البراند | اطلب للبراند ده تاني |

---

## Wizard entry (titles & steps) — wrapper pages

### `client/src/pages/wizards/SocialCampaignWizard.tsx`

| Location | Improved English / Context | Current Arabic Text | New Egyptian Text |
|----------|----------------------------|----------------------|-------------------|
| `title` L25 | Social Campaign Wizard | | إعداد حملة السوشيال ميديا |
| `subtitle` L26 | Designed for a social-first approach: pinpoint audience intent, an optimal channel mix, and high-impact posts. | | متصممة مخصوص للسوشيال ميديا: جمهور واضح، ميكس قنوات مظبوط، ومحتوى قوي جاهز للنشر. |
| `defaults.main_goal` L45 | Grow social reach and engagement | | زيادة الوصول والتفاعل (Reach & Engagement) |
| `stepTitles.diagnosis` L30 | Quick diagnosis | | تشخيص سريع |
| `stepTitles.brand` L31 | Brand & industry | | البراند والمجال |
| `stepTitles.audience` L32 | Audience & goals | | الجمهور والأهداف |
| `stepTitles.channels` L33 | Channels & tone | | القنوات ونبرة الصوت |
| `stepTitles.creative` L34 | Creative direction | | الاتجاه الإبداعي (Creative Direction) |
| `stepTitles.volume` L35 | Output volumes | | كمية المحتوى |
| `stepTitles.offer` L36 | Offer & competitors | | العرض والمنافسين |

### `client/src/pages/wizards/OfferProductWizard.tsx`

| Location | Improved English / Context | Current Arabic Text | New Egyptian Text |
|----------|----------------------------|----------------------|-------------------|
| `title` L25 | Offer Campaign Wizard | | إعداد حملة العروض والمنتجات |
| `subtitle` L26 | Built for commercial success: focused offer framing, clear buyer intent, and higher conversion rates. | | متصممة عشان تبيع: عرض متبروز صح، نية شراء واضحة، ونتائج كونفرجن (Conversions) أعلى. |
| `defaults.main_goal` L45 | Increase qualified leads and purchases | | زيادة المبيعات والـ Leads المؤهلين |
| `defaults.offer` L46 | Highlight value proposition, guarantees, and strong CTAs | | إبراز قيمة العرض، الضمان، والـ CTA |
| `stepTitles` L29–L36 | Same English labels as Social where keys overlap | | (نفس المسميات اللي فوق للخطوات المشتركة) |

### `client/src/pages/wizards/DeepContentWizard.tsx`

| Location | Improved English / Context | Current Arabic Text | New Egyptian Text |
|----------|----------------------------|----------------------|-------------------|
| `title` L25 | In-Depth Campaign Wizard | | إعداد حملة المحتوى العميق |
| `subtitle` L26 | Built for depth-first execution: robust narrative structure, richer creative briefs, and production-ready details. | | متصممة للمحتوى العميق: قصة أقوى، بريف إبداعي مليان تفاصيل، وجاهزة للتنفيذ على طول. |
| `defaults.main_goal` L44 | Build industry authority with in-depth content | | بناء ثقة ومصداقية (Authority) بمحتوى عميق |
| `defaults.best_content_types` L45 | Case studies; Educational carousels; Deep explainer videos | | دراسة حالة (Case Study)؛ كاروسيل تعليمي؛ فيديو شرح تفصيلي |
| `stepTitles` L29–L36 | Quick diagnosis; Brand & industry; Audience & goals; Creative direction; Output volumes; Offer & positioning; Channels & tone | | تشخيص سريع؛ البراند والمجال؛ الجمهور والأهداف؛ الاتجاه الإبداعي؛ كمية المحتوى؛ العرض والتموضع (Positioning)؛ القنوات ونبرة الصوت |

---

## Selection options — `client/src/pages/wizards/selectionOptions.ts`

| Location | Improved English / Context | Current Arabic Text | New Egyptian Text |
|----------|----------------------------|----------------------|-------------------|
| MAIN_GOAL increase_sales | Increase sales | زيادة مبيعات | زيادة المبيعات (Sales) |
| MAIN_GOAL brand_awareness | Brand awareness | وعي بالعلامة التجارية | الوعي بالبراند (Brand Awareness) |
| MAIN_GOAL increase_engagement | Increase engagement | زيادة التفاعل | زيادة التفاعل (Engagement) |
| BRAND_TONE formal_professional | Formal & Professional | رسمي واحترافي | رسمي واحترافي (Formal) |
| BRAND_TONE funny_trendy | Funny & Trendy | فكاهي وتريند | فرفوش وماشي مع التريند |
| BRAND_TONE friendly_persuasive | Friendly & Persuasive | ودي ومقنع | فريندلي ومقنع |
| BRAND_TONE modern_contemporary | Modern & Contemporary | حديث وعصري | مودرن وعصري |
| TARGET_AUDIENCE youth | Youth & Gen Z | الشباب | الشباب |
| TARGET_AUDIENCE entrepreneurs | Entrepreneurs & Founders | رواد الأعمال | رواد الأعمال |
| TARGET_AUDIENCE mothers | Mothers & Parents | الأمهات | الأمهات |
| TARGET_AUDIENCE students | Students | الطلاب | الطلبة |
| PLATFORM facebook | Facebook | Facebook | فيسبوك |
| PLATFORM instagram | Instagram | Instagram | إنستجرام |
| PLATFORM x | X (Twitter) | X | إكس (تويتر) |
| PLATFORM linkedin | LinkedIn | LinkedIn | لينكد إن |
| PLATFORM tiktok | TikTok | TikTok | تيك توك |
| PLATFORM youtube | YouTube | YouTube | يوتيوب |
| BEST_CONTENT educational | Educational | محتوى تعليمي | محتوى تعليمي |
| BEST_CONTENT behind_the_scenes | Behind the scenes (BTS) | خلف الكواليس | كواليس الشغل (BTS) |
| BEST_CONTENT before_after | Before & After | قبل / بعد | قبل وبعد |
| BEST_CONTENT testimonials | Customer Testimonials | آراء العملاء | ريفيوهات وآراء العملاء (Testimonials) |
| BEST_CONTENT offers_promotions | Offers & Promos | عروض وتخفيضات | عروض وخصومات (Promos) |
| BEST_CONTENT faq | FAQs | أسئلة شائعة | أسئلة شائعة (FAQ) |
| BEST_CONTENT product_demo | Product Demos | عرض المنتج | عرض المنتج (Product Demo) |
| BEST_CONTENT problem_solving | Problem Solving | حل المشكلات | حل المشاكل |
| OTHER_OPTION | Custom (specify) | أخرى (اكتب بنفسك) | حاجة تانية (اكتبها بنفسك) |

---

## Wizard core — `client/src/pages/wizards/WizardCore.tsx`

| Location | Improved English / Context | Current Arabic Text | New Egyptian Text |
|----------|----------------------------|----------------------|-------------------|
| WAITING_STAGES[0] L70–L71 | Analyzing your brand profile | | بنحلل البراند بتاعك |
| WAITING_STAGES[0] hint | Reviewing your inputs and campaign goals to set the right strategic direction. | | بنراجع الداتا وأهداف حملتك عشان نحدد الاتجاه الاستراتيجي الصح. |
| WAITING_STAGES[1] title | Crafting high-converting hooks | | بنجهز زوايا و (Hooks) بتجيب من الآخر |
| WAITING_STAGES[1] hint | Developing social angles and messaging tailored to your selected funnel. | | بنكتب الزوايا الإعلانية ورسايل السوشيال ميديا اللي تناسب مسارك. |
| WAITING_STAGES[2] title | Preparing your visual prompts | | بنحضر أفكار وتوجيهات الديزاين |
| WAITING_STAGES[2] hint | Structuring the creative assets and finalizing your content package. | | بنرتب المحتوى الإبداعي وبنقفل باقة المحتوى بتاعتك عشان تستلمها. |
| STREAM_STATUS_STEPS L84–L87 | Starting; Generating; Formatting; Finalizing | | بنبدأ; بننشئ المحتوى; بننسق الدنيا; بنقفل الشغل |
| STREAM_SECTION_LABELS L91–L98 | Narrative Summary; Diagnosis Plan; Social Posts; Image Concepts; Video Prompts; Marketing Strategy; Sales System; Offer Optimization | | ملخص القصة; خطة التشخيص; بوستات; أفكار صور; سكريبتات فيديوهات; استراتيجية تسويق; سيستم مبيعات; تظبيط العرض |
| Agency subtitle override L446–L448 | Share your project details, and our team will build a complete, ready-to-execute content plan. | | ادينا تفاصيل مشروعك، وفريقنا هيجهزلك خطة محتوى متكاملة وجاهزة للتنفيذ على طول. |
| Draft banner L453–L457 | Restored a saved draft for this workflow. | | رجعنالك المسودة اللي كنت حافظها للطلب ده. |
| Draft button | Clear draft | | امسح المسودة |
| Service Flow L467 | How it works | | خطوات الشغل |
| Service Flow bullets L469–L471 | 1) Submit your project details; 2) Our team reviews your strategy; 3) Receive a polished content package | | ١) ابعت تفاصيل مشروعك؛ ٢) فريقنا بيراجع استراتيجيتك؛ ٣) بنسلمك باقة محتوى متظبطة وجاهزة |
| Sales note L473–L475 | Our team will reach out after you submit to coordinate the delivery timeline. | | فريق المبيعات بتاعنا هيكلمك بعد ما تبعت الطلب عشان ننسق ميعاد التسليم. |
| Step chrome L480–L482 | Step {n} of {total} | | خطوة {n} من {total} |
| WizardValuePreview L9–L14 | Quick Preview | | نظرة سريعة |
| Preview H3 pattern | Building a {wizardType} kit for {brandName} | | بنجهز باقة {wizardType} لـ {brandName} |
| Preview line | Industry: … Primary direction: … | | المجال: … الاتجاه الأساسي: … |
| Step chips L29 | "{n}. {stepTitle}" | | (نفس النمط زي ما هو في الكود) |
| Step block error L508 | Upgrade your plan to unlock advanced settings. | يجب الدفع أولاً للحصول على الإعدادات المتقدمة | لازم ترقي باقتك عشان تفتح الإعدادات المتقدمة دي |
| Diagnosis: Who are you? L519 | What is your role? | | إنت مين في دول؟ |
| Select placeholder L522 | Select your role… | | اختار دورك... |
| Role options L523–L526 | Founder / Entrepreneur; Coach / Consultant; Expert / Professional; Freelancer / Creative | | رائد أعمال / مؤسس; كوتش أو مستشار; دكتور / خبير / محترف; فريلانسر أو مبدع |
| Account Stage L533 | Business Stage | | مرحلة البيزنس |
| Select stage L536 | Select business stage… | | اختار المرحلة... |
| Stage options L537–L540 | Just starting (< 6 months); 6 months to 1 year; 1–3 years (inconsistent results); 3+ years (ready to scale) | | لسه ببدأ (أقل من ٦ شهور); من ٦ شهور لسنة; من سنة لـ ٣ سنين (النتايج مش ثابتة); أكتر من ٣ سنين (عايز أكسيل وأكبر) |
| Follower Range L546 | Current Audience Size | | عدد المتابعين |
| Select range L549 | Select audience size… | | اختار العدد... |
| Follower bands L550–L553 | Under 1,000; 1,000 – 5,000; 5,000 – 20,000; 20,000+ | | أقل من ١,٠٠٠; من ١,٠٠٠ لـ ٥,٠٠٠; من ٥,٠٠٠ لـ ٢٠,٠٠٠; أكتر من ٢٠,٠٠٠ |
| Primary Blocker L561 | Biggest Challenge | | أكبر مشكلة بتواجهك |
| Select blocker L564 | Select your main challenge… | | اختار المشكلة الأساسية... |
| Blocker options L565–L568 | Low reach (nobody sees my posts); Content block (don't know what to post); Low conversion (followers but no sales); Time constraints (inconsistent posting) | | الريتش واقع (محدش بيشوف بوستاتي); مش عارف أنزل إيه باستمرار; عندي فولورز بس مفيش مبيعات; معنديش وقت ومش منتظم خالص |
| Revenue goal L574 | Target Monthly Revenue | | التارجت الشهري للمبيعات |
| Select target L577 | Select revenue goal… | | اختار التارجت... |
| Revenue tiers L578–L581 | $500 – $1,000/mo; $1,000 – $3,000/mo; $3,000 – $10,000/mo; $10,000+/mo | | $500 – $1,000 في الشهر; $1,000 – $3,000 في الشهر; $3,000 – $10,000 في الشهر; أكتر من $10,000 في الشهر |
| Client contact header L594 | Contact Details | | بيانات التواصل |
| Full name L597 | Full Name | | الاسم بالكامل |
| Placeholder L599 | e.g., John Doe | | الاسم بالكامل |
| Phone L604 | Phone Number | | رقم الموبايل (واتساب) |
| Placeholder L606 | +20 ... | | +20 ... |
| Email L612 | Email Address | | الإيميل |
| Placeholder L614 | you@example.com | | client@email.com |
| Brand name L622 | Brand Name | | اسم البراند |
| Industry L627 | Industry | | المجال |
| Industry select L648 | Select an industry… | | اختار المجال... |
| Industry other option L654 | Other (Please specify) | | مجال تاني (اكتبه بنفسك) |
| Industry other placeholder L670 | Enter your industry... | | اكتب مجالك هنا... |
| Industry display L649–L652 | E-commerce, Real Estate, F&B / Restaurants, Healthcare / Clinics, Education, General | | متاجر إلكترونية (E-commerce)، عقارات، مطاعم وكافيهات، عيادات وطب، تعليم، عام |
| Business links L680 | Website & Social Links (Optional) | | لينكات الويب سايت أو السوشيال ميديا (اختياري) |
| Placeholder L685 | https://your-site.com, https://instagram.com/yourbrand | | https://your-site.com, https://instagram.com/yourbrand |
| Audience: Target audience L697 | Target Audience | | الجمهور المستهدف |
| Audience other placeholder L733 | Describe your ideal customer... | اكتب جمهورك المستهدف... | وصف عميلك المثالي إيه؟... |
| Main campaign goal L742 | Primary Campaign Goal | | الهدف الأساسي للحملة |
| Goal other placeholder L778 | Enter custom goal... | اكتب هدف الحملة... | اكتب هدفك هنا... |
| Channels: Active platforms L792 | Active Platforms | | المنصات اللي شغال عليها |
| Platform other placeholder L828 | Enter another platform... | اكتب منصة إضافية... | اكتب منصة تانية... |
| Brand tone L839 | Tone of Voice | | نبرة البراند (Tone of Voice) |
| Tone other placeholder L875 | Describe your brand's tone... | اكتب نبرة البراند... | وصف نبرة البراند بتاعتك... |
| Brand colors L884 | Brand Colors | | ألوان البراند |
| Offer L897 | Core Offer & Message | | العرض / الرسالة الأساسية |
| Competitors L904 | Main Competitors | | أهم المنافسين |
| Reference image lock L924–L931 | 🔒 Reference images are available on the Early Adopter plan. | | 🔒 إضافة صور كمرجع (References) متاحة بس في باقة الـ Early Adopter. |
| Upgrade link L931 | Upgrade Plan | | رقي باقتك |
| Campaign duration L942 | Campaign Duration | | مدة الحملة |
| Budget level L949 | Ad Budget Level (1–7) | | مستوى ميزانية الإعلانات (١-٧) |
| Best content types L957 | Top-Performing Content Types | | أكتر أنواع محتوى بتجيب نتيجة معاك |
| Best content other placeholder L997 | Enter another content type... | اكتب نوع محتوى إضافي... | اكتب نوع محتوى تاني... |
| Volume: Premium header L1010 | Advanced Strategy Builder | | بناء استراتيجية متقدمة (Premium) |
| Volume Arabic line L1011 | Design your strategy quickly without filling out long forms. | صمّم الاستراتيجية في خطوات سريعة بدل تعبئة نموذج طويل. | ظبط استراتيجيتك في خطوات سريعة من غير ما تملا فورم طويلة ومملة. |
| Content pillars L1014 | Content Pillar Mix | | ميكس أعمدة المحتوى (Content Pillars) |
| Pillar keys L1017–L1019 | Direct Sales; Educational; Engagement | بيعي مباشر; تعليمي; تفاعلي | مبيعات مباشر (Sales); تعليمي; تفاعلي (Engagement) |
| Platform optimization L1044 | Platform-Specific Optimization | | تظبيط المحتوى حسب المنصة |
| Platform toggles L1046 | LinkedIn; TikTok/Reels; Instagram | | لينكد إن; تيك توك / ريلز; إنستجرام |
| Micro tone L1069 | Nuanced Tone of Voice | | تفاصيل نبرة الصوت |
| Tone presets L1072–L1075 | Luxury; Street/Slang; Sarcastic; Egyptian Colloquial | | فخم (Luxury); لغة الشارع / روش; ساخر (Sarcastic); مصري عامي |
| Audience deep dive L1100 | Audience Deep Dive | | تحليل أعمق للجمهور |
| Placeholder L1105 | What is your customer's biggest pain point? | إيه أكتر حاجة بتضايق زبونك؟ | إيه أكتر وجع (Pain point) عند زبونك؟ |
| Posting cadence L1112 | Posting Frequency | | معدل النشر |
| Cadence options L1114 | 3x a week; 5x a week; Full 30-day plan | | ٣ أيام في الأسبوع; ٥ أيام في الأسبوع; خطة كاملة لـ ٣٠ يوم |
| Plan usage L1133–L1137 | Plan Usage \ Plan: … Video Prompts: … Image Prompts: … | | استهلاك باقتك \ الباقة: ... سكريبتات الفيديوهات: ... أفكار الصور: ... |
| Final panel title L1150–L1151 | Ready to reveal your diagnosis & plan **or** Ready to generate your content kit | | جاهز تشوف التشخيص وخطة العمل **أو** جاهز نطلعلك باقة المحتوى |
| Final panel body L1153–L1156 | This usually takes 10–30 seconds. Feel free to grab a coffee! | | الموضوع بياخد من ١٠ لـ ٣٠ ثانية تقريباً... |
| Summary Role L1165–L1166 | Role; Not set | | الدور; مش متحدد |
| Summary Primary Blocker L1169–L1170 | Main Challenge; Not set | | المشكلة الأساسية; مش متحددة |
| Summary Revenue L1173–L1174 | Target Revenue; Not set | | تارجت المبيعات; مش متحدد |
| Proof section L1181 | Why this works | | ليه ده بيجيب نتيجة؟ |
| Proof bullets L1183–L1185 | Built for scalable execution…; Easily regenerate options…; Progress auto-saved… | | مبني عشان يتنفذ بسهولة ولـ Scale كبير...; تقدر تعيد توليد المحتوى تاني...; كل حاجة بتتحفظ كمسودة أوتوماتيك... |
| Nav Back L191–L193 | Back | | رجوع |
| Nav Next L195–L197 | Next Step | | الخطوة الجاية |
| Submit loading variantB L1207 | Building your diagnosis… | | بنجهزلك التشخيص... |
| Submit loading default L1208 | Generating your content... | | بننشئ المحتوى... |
| Submit free L1210 | Submit Request (Free Trial) | | ابعت الطلب (وجرب ببلاش) |
| Submit premium variantB L1212 | Reveal my diagnosis & plan | | وريني التشخيص والخطة |
| Submit premium default L1213 | Generate my content kit | | طلعلي باقة المحتوى دلوقتي |
| Loading hints L1267–L1273 | Saving your content kit…; Formatting generated sections…; Wrapping up…; Generating content progressively... | | بنحفظ باقة المحتوى...; بننسق الأقسام اللي طلعت...; بنقفل الشغل...; بنطلع المحتوى واحدة واحدة... |
| Progress L1275–L1276 | Progress: {pct}% | | خلصنا: {pct}% |
| Current section L1287–L1289 | Working on: … | | شغالين حالياً على: ... |
| Live reasoning L1335 | AI Processing Log | | خطوات الذكاء الاصطناعي (لايف) |
| Trace fallback label L1345 | asset | | أصل / محتوى |
| Live summary L1367 | Live status: | | ملخص لايف: |

### Creative step — `AdditionalNotes` (used from WizardCore)

| Location | Improved English / Context | Current Arabic Text | New Egyptian Text |
|----------|----------------------------|----------------------|-------------------|
| `client/src/components/AdditionalNotes.tsx` L22–L24 | Additional Notes | | ملاحظات إضافية |
| Hint L25–L27 | Drop any specific instructions for tone, design, or formatting here. | | لو عندك أي تعليمات زيادة بخصوص نبرة الصوت، الديزاين، أو شكل التسليم، اكتبها هنا. |
| Placeholder L34 | Type your extra notes here… | | اكتب أي ملاحظات أو تعليمات زيادة هنا... |

---

## Wizard steps (alternate module) — `client/src/pages/wizards/WizardSteps.tsx`

| Location | Improved English / Context | Current Arabic Text | New Egyptian Text |
|----------|----------------------------|----------------------|-------------------|
| CreativeStep L459 | Creative & Visual Direction | | ملاحظات الديزاين والاتجاه الإبداعي |
| CreativeStep best_content_types L496 | Top-Performing Content Formats | | أكتر أنواع محتوى بتجيب نتيجة معاك |
| VolumeStep L530 | Number of Social Posts ({min}–{max}) | | عدد البوستات ({min}–{max}) |
| VolumeStep L545 | Number of Image Concepts ({min}–{max}) | | عدد أفكار الصور والديزاينات ({min}–{max}) |
| VolumeStep L562 | Number of Video Scripts ({min}–{max}) | | عدد سكريبتات الفيديوهات ({min}–{max}) |
