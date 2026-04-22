# خطة Audit محدثة (Round 2) - بناء على التعديلات الجديدة

## حالة المستند
- النوع: Execution Plan فقط
- لا يوجد تنفيذ فعلي في هذه الخطوة
- تاريخ التحديث: 2026-04-20
- مبني على: مراجعة كاملة جديدة للكود + تشغيل فحوصات فعلية

## الهدف
تحويل حالة المشروع الحالية بعد تعديلات V2 Agency الى خطة تنفيذ عملية ومحدثة، مرتبة حسب المخاطر الفعلية، مع ربط واضح بين كل مشكلة والمرحلة المناسبة للتنفيذ.

## ما الذي تم مراجعته فعليا في Round 2
1. مراجعة Backend كاملة لمسارات auth/authz و kits و features و analytics و admin.
2. مراجعة Frontend كاملة لمسارات V1/V2 routing وسلوك admin login وواجهات dashboard.
3. مراجعة Database schema/migrations في المسارات الحساسة (notifications, kits, access control posture).
4. مراجعة docs الأساسية وحالة الـ pivot:
   - docs/PROJECT_STATE.md
   - docs/PIVOT_AGENCY_EXECUTION.md
   - docs/V1_V2_DECISION_COMPARISON.md
   - README.md
5. تشغيل checks فعلية على الحالة الحالية:
   - TypeScript client/server: PASS
   - Unit tests client/server: PASS
   - E2E: FAIL (smoke test واحد)
   - npm audit (high+): PASS

## نتيجة تنفيذ الفحوصات (ملخص)
| Check | الحالة | ملاحظة |
|---|---|---|
| `npx tsc --noEmit -p client/tsconfig.json` | PASS | بدون أخطاء |
| `npx tsc --noEmit -p server/tsconfig.json` | PASS | بدون أخطاء |
| `npm run test -w server` | PASS | 64/64 |
| `npm run test -w client` | PASS | 12/12 |
| `npm run test:e2e -w client` | FAIL | smoke selector قديم لا يطابق UI الجديد |
| `npm audit --audit-level=high` | PASS | 0 vulnerabilities |

## Findings المعتمدة بعد التحديث

## P0 (Critical)
1. **Bypass في المصادقة بسبب الثقة في Origin/Referer**
   - الدليل:
     - `server/src/middleware/auth.ts` (Path B trusted origin)
     - `server/src/middleware/auth.ts:52`
   - الأثر: أي عميل غير متصفح يقدر يزوّر `Origin` ويعدي guard بدون bearer token حقيقي.

## P1 (High)
1. **Notifications غير معزولة لكل مستخدم (تسريب multi-tenant)**
   - الدليل:
     - `server/src/routes/features.ts:114`
     - `server/src/routes/features.ts:118`
     - `server/src/routes/features.ts:132`
     - `server/src/routes/features.ts:134`
     - `server/src/routes/features.ts:138`
     - `server/src/routes/features.ts:141`
     - `server/src/db/schema.ts:115`
   - الأثر: عرض/تحديث إشعارات بدون ownership filter.

2. **Admin bypass بالـ API_SECRET**
   - الدليل:
     - `server/src/routes/adminPlans.ts:41`
   - الأثر: لو السر اتسرب، الوصول الإداري يصبح مباشر.

3. **SSE error leakage**
   - الدليل:
     - `server/src/routes/kits.ts:322`
     - `server/src/routes/kits.ts:324`
   - الأثر: تسريب رسائل أخطاء داخلية للعميل.

4. **حذف الكيتات بدون audit trail**
   - الدليل:
     - `server/src/routes/kits.ts:463`
     - `server/src/routes/kits.ts:467`
     - `server/src/services/kitGenerationService.ts:889`
     - `server/src/services/kitRepository.ts:280`
   - الأثر: صعوبة التحقيق/الامتثال عند الحذف الخاطئ أو المتعمد.

## P2 (Medium)
1. **Analytics summary endpoint غير محمي**
   - الدليل:
     - `server/src/routes/analytics.ts:48`
     - `server/src/index.ts:96`
   - الأثر: تسريب telemetry aggregates لأي طرف بدون auth.

2. **غياب RLS على مستوى Postgres**
   - الدليل: لا توجد `CREATE POLICY`/`ENABLE ROW LEVEL SECURITY` في `server/src/**`.
   - الأثر: غياب defense-in-depth على مستوى قاعدة البيانات.

3. **No rate limit على Agency Admin login**
   - الدليل:
     - `server/src/routes/auth.ts:127`
     - بينما rate limit مطبق فقط على `/api/auth/sync` في `server/src/routes/auth.ts:95`
   - الأثر: زيادة سطح brute-force على admin login.

4. **CORS wildcard في production مجرد warning**
   - الدليل:
     - `server/src/index.ts:36`
     - `server/src/index.ts:42`
   - الأثر: misconfiguration يبقى شغال بدل fail-fast.

5. **Regression في E2E smoke بسبب تغير UI copy**
   - الدليل:
     - `client/e2e/smoke.spec.ts:5`
     - `client/e2e/smoke.spec.ts:6`
     - `client/e2e/smoke.spec.ts:7`
     - `client/src/Dashboard.tsx:76`
     - `client/src/Dashboard.tsx:136`
   - الأثر: CI instability واختبار smoke غير معبر عن الحالة الحالية.

6. **Documentation drift في عقد الـ API**
   - الدليل:
     - `README.md:239`
     - `README.md:242`
   - الأثر: الوثائق تقول إن كل `/api/*` يتطلب `API_SECRET` بينما التطبيق الحالي يعتمد على أكثر من مسار auth.

## P3 (Low)
1. **JWKS cache بدون TTL واضح**
2. **قرار V1/V2 النهائي مازال مفتوح (حسب PROJECT_STATE/Decision doc)**

## Delta مقابل الخطة السابقة

## ما زال مفتوح كما هو
1. auth boundary hardening
2. notifications ownership isolation
3. admin bypass و SSE sanitization
4. RLS و hardening الطبقة القاعدية

## جديد في Round 2
1. اكتشاف Regression فعلي في `smoke.spec.ts` بعد تغييرات UX.
2. اتساع أهمية قرار V1/V2 كـ dependency تنفيذية (مش بس قرار منتج).
3. توثيق drift أكبر بين README والعقد الفعلي للمصادقة.

## تم التحقق منه ولم يعد Priority عالي
1. dependency vulnerabilities (high+) ليست مشكلة حاليا.
2. unit/typecheck baseline مستقر حاليا.

## الخطة المحدثة على Phases

## Phase 0 - Decision Gate + Baseline Freeze
### الهدف
تثبيت الاتجاه قبل التنفيذ حتى لا يحدث rework.

### عناصر التنفيذ
1. اعتماد اتجاه V1/V2 بشكل رسمي (A أو B أو Targeted Refactor) بالرجوع إلى:
   - `docs/V1_V2_DECISION_COMPARISON.md`
   - `docs/PROJECT_STATE.md`
2. تثبيت Auth Strategy واحدة واضحة لكل Edition.
3. اعتماد هذا المستند كـ baseline تنفيذ.

### Definition of Done
1. قرار V1/V2 موثق وموقع.
2. قائمة phases مقفولة وترتيبها معتمد.

### تقدير
- 0.5 يوم

---

## Phase 1 - إغلاق P0 (Auth Boundary Hardening)
### الهدف
منع أي وصول مبني على headers قابلة للتزوير.

### عناصر التنفيذ
1. إزالة الاعتماد الأمني على `Origin/Referer` في auth decision.
2. جعل `CORS_ORIGIN=*` في production fail-fast بدل warning.
3. توحيد مسارات السماح (JWT موثوق أو admin session موثوق أو service channel داخلي محدد).

### ملفات مستهدفة
- `server/src/middleware/auth.ts`
- `server/src/index.ts`
- `README.md`
- `docs/TESTING.md`

### اختبارات القبول
1. طلب بدون bearer صالح يترفض حتى لو Origin مزوّر.
2. JWT صالح يمر.
3. production + wildcard CORS يمنع startup.

### تقدير
- 1 يوم

---

## Phase 2 - Data Isolation + Privilege Tightening (P1)
### الهدف
إغلاق تسريب بيانات المستخدمين وتشديد صلاحيات الإدارة.

### عناصر التنفيذ
1. إضافة ownership حقيقي لجدول notifications (عمود user_id + queries scoped).
2. تعديل `/notifications`, `/notifications/read-all`, `/notifications/:id/read` لتعمل per-user فقط.
3. إزالة أو تقييد bypass `API_SECRET` لمسارات admin.
4. إضافة audit trail لعمليات delete (actor + target + timestamp + reason).

### ملفات مستهدفة
- `server/src/db/schema.ts`
- `server/src/db/migrations.ts`
- `server/src/routes/features.ts`
- `server/src/routes/adminPlans.ts`
- `server/src/routes/kits.ts`
- `server/src/services/kitGenerationService.ts`
- `server/src/services/kitRepository.ts`
- `docs/DATABASE.md`

### اختبارات القبول
1. مستخدم A لا يرى ولا يعدّل إشعارات B.
2. admin bypass بالـ API_SECRET غير ممكن خارج القناة المحددة.
3. كل delete عملية لها audit record.

### تقدير
- 1.5 إلى 2 يوم

---

## Phase 3 - Error Leakage + Attack Surface Reduction (P1/P2)
### الهدف
تقليل التسريب وتقوية المسارات المكشوفة.

### عناصر التنفيذ
1. Sanitization لرسائل SSE errors (generic message للعميل + تفاصيل في logs فقط).
2. حماية `GET /api/analytics/wizard-summary` (auth أو admin-only).
3. إضافة rate limit لمسار `POST /api/auth/agency-admin/login`.

### ملفات مستهدفة
- `server/src/routes/kits.ts`
- `server/src/routes/analytics.ts`
- `server/src/routes/auth.ts`
- `docs/TESTING.md`

### اختبارات القبول
1. رسائل الخطأ الحساسة لا تظهر للعميل.
2. analytics summary غير متاح لغير المصرح لهم.
3. admin login له limits واضحة ضد brute-force.

### تقدير
- 1 يوم

---

## Phase 4 - Database Defense in Depth (RLS)
### الهدف
نقل جزء من الحماية لطبقة قاعدة البيانات.

### عناصر التنفيذ
1. تفعيل RLS للجداول المعرضة للـ API.
2. إضافة سياسات owner/admin واضحة.
3. اختبار السياسات من DB level مباشرة.

### ملفات مستهدفة
- `server/src/db/migrations.ts`
- `docs/DATABASE.md`

### اختبارات القبول
1. queries غير المصرح لها تتمنع على DB level.
2. app flows الحالية تظل تعمل بعد تطبيق السياسات.

### تقدير
- 1 إلى 1.5 يوم

---

## Phase 5 - Quality Stabilization + Contract Sync
### الهدف
استقرار CI وتطابق التوثيق مع السلوك الفعلي.

### عناصر التنفيذ
1. تحديث `smoke.spec.ts` ليتماشى مع UI الجديد (Dashboard copy/actions).
2. توسيع route tests لمسارات `auth`, `adminPlans`, `features`.
3. تحديث README API contract ليعكس auth الحقيقي (JWT + admin session + service path).

### ملفات مستهدفة
- `client/e2e/smoke.spec.ts`
- `server/src/routes/*.test.ts`
- `README.md`
- `docs/TESTING.md`

### اختبارات القبول
1. E2E smoke يرجع PASS.
2. tests تغطي authorization boundaries الجديدة.
3. docs متوافقة 1:1 مع التنفيذ.

### تقدير
- 1 إلى 1.5 يوم

---

## Phase 6 - Hardening اختياري (بعد الإغلاق)
### عناصر التنفيذ
1. إضافة TTL لـ JWKS cache.
2. تقييم نقل analytics من memory إلى persistence.
3. دراسة soft-delete حسب مؤشرات Phase 2 delete audit.

### تقدير
- 1 إلى 2 يوم (اختياري)

## ترتيب التنفيذ النهائي المقترح
1. Phase 0
2. Phase 1
3. Phase 2
4. Phase 3
5. Phase 4
6. Phase 5
7. Phase 6 (اختياري)

## التقدير الإجمالي
- التنفيذ الأساسي (Phase 0-5): من 5 إلى 7 أيام عمل
- مع hardening الاختياري (Phase 6): حتى 9 أيام

## قواعد التنفيذ
1. كل Phase في PR مستقل.
2. ممنوع دمج Phase جديدة قبل إغلاق معايير القبول للمرحلة السابقة.
3. أي تغيير contract لازم يتوثق في نفس PR.

## ملاحظة ختامية
هذه النسخة محدثة بالكامل بناء على حالة المشروع الحالية بعد التعديلات الجديدة، وتشمل delta واضح عن الخطة السابقة مع إعادة ترتيب الأولويات حسب المخاطر الفعلية.