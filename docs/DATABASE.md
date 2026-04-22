# Database schema (Drizzle / PostgreSQL)

**Canonical source:** [server/src/db/schema.ts](../server/src/db/schema.ts).  
**Migrations / boot DDL:** [server/src/db/migrations.ts](../server/src/db/migrations.ts).

**Schema namespace:** `social_geni` (all tables below live in this PostgreSQL schema).

> **Maintenance:** After changing `schema.ts`, update this document so agents proposing telemetry or new tables do not conflict with existing structures.

---

## Tables overview

| Table | Primary key | Purpose |
|-------|-------------|---------|
| `kits` | `id` (text) | Core artifact: brief, result JSON, delivery status, tokens, row version |
| `kit_interactions` | `id` (text) | Viewer interaction telemetry linked to kits |
| `idempotency_keys` | `key_hash` | Idempotent generate mapping |
| `users` | `id` | App user linked to Supabase |
| `user_devices` | `id` | Device ↔ user linkage; `device_id` unique |
| `plan_subscriptions` | `id` | Plan periods per user |
| `monthly_usage_counters` | `id` | Usage per period (video/image/kits/regenerate/retry) |
| `kit_failure_logs` | `id` | Failure diagnostics |
| `notifications` | `id` | In-app notifications |
| `kit_delete_audit` | `id` | Admin delete audit trail (actor + reason + timestamp) |
| `user_profile` | `id` | Profile fields; `user_id` unique |
| `app_preferences` | `id` | UI prefs; `user_id` unique |
| `brand_voice` | `id` | Pillars / avoid words / sample; `user_id` unique |
| `extras_waitlist` | `id` | Waitlist signups |
| `industries` | `id` | Prompt catalog industries |
| `industry_prompts` | `id` | Versioned prompt templates |

**Foreign keys:** Not declared as FK constraints in Drizzle excerpt; relations are by convention (`user_id`, `kit_id`, `industry_id` text references). Verify in migrations if enforcing FKs.

---

## `kits` (columns)

| Column | Type | Notes |
|--------|------|--------|
| `id` | text | PK |
| `device_id` | text | Default `''` |
| `user_id` | text | Nullable |
| `brief_json` | text | Stringified wizard payload |
| `brief_hash` | text | Normalized brief fingerprint (idempotency) |
| `target_audience_v2` | jsonb | `string[]` |
| `platforms_v2` | jsonb | `string[]` |
| `best_content_types_v2` | jsonb | `string[]` |
| `ui_preferences` | jsonb | Viewer UI state (`lang`, open section maps) |
| `result_json` | text | Nullable; stringified kit JSON |
| `delivery_status` | text | |
| `model_used` | text | |
| `last_error` | text | Default `''` |
| `correlation_id` | text | |
| `prompt_version_id` | text | Nullable |
| `is_fallback` | boolean | Default false |
| `prompt_tokens` | integer | Default 0 |
| `completion_tokens` | integer | Default 0 |
| `total_tokens` | integer | Default 0 |
| `usage_charged_at` | timestamptz nullable | Charge-once guard marker for usage deduction |
| `row_version` | integer | Optimistic concurrency |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### Admin-side delete behavior (Phase 4 + Phase 2 hardening)

- Admin delete endpoint: `DELETE /api/kits/:id` (admin-only).
- Cleanup order in repository/service (inside one transaction):
  1) insert `kit_delete_audit` record (`actor_type`, `actor_id`, `reason`, `deleted_at`)
  1) delete `kit_interactions` by `kit_id`
  2) delete `idempotency_keys` by `kit_id`
  3) delete `kits` row
- This is hard delete for MVP operations.

---

## `idempotency_keys`

| Column | Type |
|--------|------|
| `key_hash` | text PK |
| `brief_hash` | text |
| `kit_id` | text |
| `expires_at` | bigint |

---

## `kit_interactions`

| Column | Type | Notes |
|--------|------|-------|
| `id` | text PK | |
| `kit_id` | text | Owning kit ID |
| `user_id` | text nullable | Owner user when authenticated |
| `device_id` | text | Owner device |
| `interaction_type` | text | Action type (`copy_action`, toggles, etc.) |
| `meta_json` | jsonb | Optional metadata payload |
| `created_at`, `updated_at` | timestamptz | |

---

## `users`

| Column | Type |
|--------|------|
| `id` | text PK |
| `supabase_user_id` | text unique |
| `email` | text |
| `display_name` | text |
| `is_admin` | boolean |
| `created_at`, `updated_at` | timestamptz |

---

## `user_devices`

| Column | Type |
|--------|------|
| `id` | text PK |
| `user_id` | text |
| `device_id` | text unique |
| `created_at`, `updated_at` | timestamptz |

---

## `plan_subscriptions`

| Column | Type |
|--------|------|
| `id` | text PK |
| `user_id` | text |
| `plan_code` | text |
| `status` | text |
| `period_start` | timestamptz |
| `period_end` | timestamptz nullable |
| `created_at`, `updated_at` | timestamptz |

---

## `monthly_usage_counters`

| Column | Type |
|--------|------|
| `id` | text PK |
| `user_id` | text nullable |
| `device_id` | text nullable |
| `period_key` | text |
| `video_prompts_used` | integer |
| `image_prompts_used` | integer |
| `kits_used` | integer |
| `regenerate_used` | integer |
| `retry_used` | integer |
| `created_at`, `updated_at` | timestamptz |

---

## `kit_failure_logs`

| Column | Type |
|--------|------|
| `id` | text PK |
| `kit_id` | text nullable |
| `phase` | text |
| `error_code` | text |
| `error_message` | text |
| `correlation_id` | text |
| `model_used` | text |
| `meta_json` | text default `{}` |
| `created_at` | timestamptz |

---

## `notifications`

| Column | Type |
|--------|------|
| `id` | text PK |
| `user_id` | text nullable (owner scope key) |
| `title`, `body`, `kind` | text |
| `kit_id` | text nullable |
| `read_at` | timestamptz nullable |
| `created_at` | timestamptz |

Notifications API contract is now strictly user-scoped in routes (`GET`, `read-all`, `read-one`) and no longer global.

---

## `kit_delete_audit`

| Column | Type |
|--------|------|
| `id` | text PK |
| `kit_id` | text |
| `actor_type` | text (`admin_session` / `admin_user`) |
| `actor_id` | text |
| `reason` | text |
| `metadata` | jsonb |
| `deleted_at` | timestamptz |

---

## `user_profile`

| Column | Type |
|--------|------|
| `id` | text PK |
| `user_id` | text unique |
| `display_name`, `email` | text |
| `updated_at` | timestamptz |

---

## `app_preferences`

| Column | Type |
|--------|------|
| `id` | text PK |
| `user_id` | text unique |
| `compact_table` | boolean |
| `updated_at` | timestamptz |

---

## `brand_voice`

| Column | Type |
|--------|------|
| `id` | text PK |
| `user_id` | text unique |
| `pillars_json` | text |
| `avoid_words_json` | text |
| `sample_snippet` | text |
| `updated_at` | timestamptz |

---

## `extras_waitlist`

| Column | Type |
|--------|------|
| `id` | text PK |
| `tool_id` | text |
| `email` | text |
| `created_at` | timestamptz |

---

## `industries`

| Column | Type |
|--------|------|
| `id` | text PK |
| `slug` | text unique |
| `name` | text |
| `is_active` | boolean |
| `created_at`, `updated_at` | timestamptz |

---

## `industry_prompts`

| Column | Type |
|--------|------|
| `id` | text PK |
| `industry_id` | text nullable |
| `version` | integer |
| `status` | text |
| `prompt_template` | text |
| `notes` | text |
| `created_at`, `updated_at` | timestamptz |

---

## Indexes

Define explicit indexes in **`migrations.ts`** if present; Drizzle `schema.ts` does not list all indexes. Query migrations for `CREATE INDEX` before assuming an index exists.

---

## Row Level Security (Phase 4)

RLS is enabled in `server/src/db/migrations.ts` for:

- `social_geni.kits`
- `social_geni.kit_interactions`
- `social_geni.notifications`
- `social_geni.monthly_usage_counters`
- `social_geni.kit_delete_audit`

### Active policies

- `kits_owner_rw` on `kits`:
  - `USING (user_id = auth.uid()::text)`
  - `WITH CHECK (user_id = auth.uid()::text)`
- `kit_interactions_owner_rw` on `kit_interactions`:
  - `USING (user_id = auth.uid()::text)`
  - `WITH CHECK (user_id = auth.uid()::text)`
- `notifications_owner_rw` on `notifications`:
  - `USING (user_id = auth.uid()::text)`
  - `WITH CHECK (user_id = auth.uid()::text)`
- `monthly_usage_owner_rw` on `monthly_usage_counters`:
  - `USING (user_id = auth.uid()::text)`
  - `WITH CHECK (user_id = auth.uid()::text)`
- `kit_delete_audit_admin_read` on `kit_delete_audit`:
  - `FOR SELECT`
  - `USING (COALESCE((auth.jwt() ->> 'is_admin')::boolean, false))`

### Scope and caveats

- هذه السياسات فعّالة بشكل أساسي لقنوات Supabase/PostgREST المرتبطة بـ JWT.
- إذا كان الاتصال بقاعدة البيانات يتم عبر service role (أو role لديه `bypassrls`) فسياسات RLS لا تكون حاجزًا كاملاً على هذا المسار.
- جدول `kit_jobs` غير موجود حاليًا في schema الحالي، لذا لم تُطبّق عليه سياسات.

### Rollback notes

للرجوع السريع:

1. حذف السياسات:
   - `DROP POLICY IF EXISTS kits_owner_rw ON social_geni.kits;`
   - `DROP POLICY IF EXISTS kit_interactions_owner_rw ON social_geni.kit_interactions;`
   - `DROP POLICY IF EXISTS notifications_owner_rw ON social_geni.notifications;`
   - `DROP POLICY IF EXISTS monthly_usage_owner_rw ON social_geni.monthly_usage_counters;`
   - `DROP POLICY IF EXISTS kit_delete_audit_admin_read ON social_geni.kit_delete_audit;`
2. تعطيل RLS عند الحاجة:
   - `ALTER TABLE social_geni.<table> DISABLE ROW LEVEL SECURITY;`
