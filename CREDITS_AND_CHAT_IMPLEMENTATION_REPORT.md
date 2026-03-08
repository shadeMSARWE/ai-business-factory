# Credits System + AI Chat — Implementation Report

## Summary

A **production-ready** credits system and **AI Chat** have been added to the platform. Existing factories and agents are unchanged: they still run via `runFactoryEngine()` and agent orchestration; credit checks and deductions run in the API layer before execution.

---

## 1. Credits System Architecture

- **Storage:** New table `user_credits` (see schema below). Each user has one row: `user_id`, `credits`, `created_at`, `updated_at`.
- **New users:** On first use, `ensure_user_credits(user_id)` creates a row with **100 credits** (INSERT … ON CONFLICT DO NOTHING).
- **Flow:** Before any AI action (factory, agent, chat), the API:
  1. Ensures the user has a `user_credits` row (and gets balance).
  2. Checks balance ≥ cost for that action.
  3. Optionally checks hourly rate limit (100 requests/hour).
  4. Deducts credits via `deduct_user_credits(user_id, amount)`.
  5. Runs the factory/agent/chat; no changes to `runFactoryEngine()` or agent engine logic.

---

## 2. Database Schema

### `user_credits`
| Column      | Type        | Description                    |
|------------|-------------|--------------------------------|
| user_id    | UUID (PK)   | References auth.users          |
| credits    | INT         | Current balance (default 100)   |
| created_at | TIMESTAMPTZ |                                |
| updated_at | TIMESTAMPTZ |                                |

**RPCs:**
- `ensure_user_credits(p_user_id UUID)` → INT (creates row with 100 if missing, returns balance).
- `deduct_user_credits(p_user_id UUID, p_amount INT)` → INT (new balance or -1 if insufficient).
- `add_user_credits(p_user_id UUID, p_amount INT)` → INT (adds credits, e.g. after purchase).

### `chat_sessions`
| Column    | Type        |
|-----------|-------------|
| id        | UUID (PK)   |
| user_id   | UUID (FK)   |
| title     | TEXT        |
| created_at| TIMESTAMPTZ |

### `chat_messages`
| Column    | Type        |
|-----------|-------------|
| id        | UUID (PK)   |
| user_id   | UUID (FK)   |
| chat_id   | UUID (FK)   |
| role      | TEXT (user/assistant/system) |
| content   | TEXT        |
| created_at| TIMESTAMPTZ |

### `ai_request_rate`
| Column        | Type        | Purpose                    |
|---------------|-------------|----------------------------|
| user_id       | UUID        | User                       |
| hour_bucket   | TIMESTAMPTZ | Truncated to hour          |
| request_count | INT         | Count in that hour (max 100)|

**RPC:** `check_and_increment_ai_rate(p_user_id UUID)` → BOOLEAN (true if under limit and incremented).

**Migration file:** `supabase/migrations/012_user_credits_and_chat.sql`

---

## 3. Credit Consumption Rules

| Tool type           | Cost (credits) |
|---------------------|----------------|
| Simple factories    | 1             |
| Medium factories    | 2             |
| Heavy factories     | 3             |
| Business Generator  | 5             |
| AI Agents           | 4             |
| AI Chat (per message) | 1           |

**Factory tiers** (see `lib/credit-costs.ts`):
- **Simple (1):** seo, logo, viralVideoIdeas, socialContent, contentCalendar, productGenerator, startupValidator.
- **Medium (2):** ads, websiteTemplates, landingPageAI, storeBuilder, appBuilder, brandKit, marketingStrategy, copywritingFactory, funnelBuilder, videoFactory, imageGenerator, businessFinder, autoOutreach, landingPage, mobileApps, store.
- **Heavy (3):** website, universalBuilder, saasBuilder, automationFactory, courseCreator, businessPlan, brandingStudio.

---

## 4. Credit Check & UX

- **Before run:** API checks balance; if `credits <= 0` (or &lt; cost), returns **402** with `{ error: "No credits remaining", code: "NO_CREDITS" }`. Generation is not run.
- **UI:** 
  - Dashboard header shows **Credits: &lt;balance&gt;** and a **Buy Credits** button (→ `/dashboard/billing`).
  - `ErrorFallback` shows a **Buy Credits** button when the error message indicates a credits issue (e.g. “No credits remaining”).
  - Credits-exhausted modal and warning banner link to billing.

---

## 5. PayPal Billing Integration

- **Route:** `/dashboard/billing` (existing page extended).
- **Credit packs (one-time):**
  - **Starter:** $9 → 100 credits  
  - **Pro:** $29 → 500 credits  
  - **Business:** $79 → 2000 credits  

- **Flow:**
  1. User clicks “Buy with PayPal” for a pack → `POST /api/paypal/create-order` with `{ packId: "starter"|"pro"|"business" }`.
  2. API creates PayPal order (custom_id = user_id), returns `{ orderId, url }`.
  3. Frontend stores `orderId` in `sessionStorage`, redirects to PayPal.
  4. After payment, user returns to `/dashboard/billing?success=1`.
  5. Page reads `orderId` from `sessionStorage`, calls `POST /api/paypal/capture-order` with `{ orderId }`.
  6. API captures the order, maps amount to credits (`creditsForAmount`), calls `add_user_credits(userId, credits)`.
  7. Success message and credit refresh (e.g. “Payment successful. X credits have been added.”).

**Endpoints:**
- `POST /api/paypal/create-order` — body: `{ packId }` → `{ orderId, url }`.
- `POST /api/paypal/capture-order` — body: `{ orderId }` → `{ success, credits }`.

---

## 6. AI Chat System Architecture

- **Route:** `/dashboard/chat`.
- **Layout:** Left: chat history (sessions). Center: messages. Bottom: prompt input (ChatGPT-like).
- **Features:** Copy message, delete chat, rename chat, scrollable history. Regenerate UI placeholder present.
- **Engine:** OpenAI (e.g. gpt-4o-mini). All requests go through server routes; API key stays server-side.
- **Cost:** 1 credit per user message (deducted before calling OpenAI).
- **Storage:** Messages and sessions stored in `chat_sessions` and `chat_messages`.

---

## 7. API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/credits/balance | Return current user credits (user_credits) |
| GET | /api/billing | Return billing/credits for dashboard (uses user_credits balance) |
| POST | /api/paypal/create-order | Create PayPal order for a credit pack |
| POST | /api/paypal/capture-order | Capture order and add credits to user_credits |
| GET | /api/chat/sessions | List current user’s chat sessions |
| POST | /api/chat/sessions | Create session |
| GET | /api/chat/sessions/[id] | Get session |
| PATCH | /api/chat/sessions/[id] | Rename session |
| DELETE | /api/chat/sessions/[id] | Delete session |
| GET | /api/chat/sessions/[id]/messages | List messages |
| POST | /api/chat/sessions/[id]/messages | Send user message, call OpenAI, store reply, deduct 1 credit |

Existing:
- `POST /api/factory/run` — now checks credits, rate limit, deducts, then runs `runFactoryEngine()`.
- `POST /api/agents/run` — now checks credits (4), rate limit, deducts, then runs agent.
- `POST /api/business-generator/run` — now checks credits (5), rate limit, deducts, then runs.

---

## 8. API Protection (Rate Limit)

- **Limit:** 100 AI requests per hour per user.
- **Implementation:** Table `ai_request_rate` + RPC `check_and_increment_ai_rate(p_user_id)`. Only increments if current count &lt; 100; returns false when at limit.
- **Usage:** Called in factory run, agents run, business-generator run, and chat send-message APIs before deducting credits and running the AI.

---

## 9. Error Handling

- **No credits:** 402, `{ error: "No credits remaining", code: "NO_CREDITS" }`; UI shows ErrorFallback / modal with “Buy Credits”.
- **Rate limit:** 429, message “Too many requests. Maximum 100 AI requests per hour.”
- **API timeout / failure:** Chat and factories return 502 or 422 with a short message; chat stores an error message in the thread.

---

## 10. Security

- **API keys:** OpenAI and PayPal secrets are used only in server routes (env on server). Not exposed to the frontend.
- **Auth:** All credits and chat APIs require Supabase auth; user_credits and chat RPCs/policies enforce same user or service.

---

## 11. UI Style

- Dark theme, glass-style panels, violet/fuchsia gradients, Framer Motion where used (e.g. chat messages, billing success).
- Chat: Same design system; premium feel with clear copy/delete/rename and credit hint (“1 credit per message”).

---

## 12. Verification

- **TypeScript:** `npx tsc --noEmit` passes.
- **Existing routes:** No routes removed or renamed. Factories and agents still run via `runFactoryEngine()` and the agent engine; only pre-checks and deduction were added in the API.
- **No factories removed.** Credit costs are defined in `lib/credit-costs.ts` and applied in the API layer.

---

## Files Touched / Added

**New**
- `supabase/migrations/012_user_credits_and_chat.sql`
- `lib/credit-costs.ts`
- `lib/user-credits-service.ts`
- `app/api/credits/balance/route.ts`
- `app/api/paypal/create-order/route.ts`
- `app/api/paypal/capture-order/route.ts`
- `app/api/chat/sessions/route.ts`
- `app/api/chat/sessions/[id]/route.ts`
- `app/api/chat/sessions/[id]/messages/route.ts`
- `app/dashboard/chat/page.tsx`
- `CREDITS_AND_CHAT_IMPLEMENTATION_REPORT.md`

**Modified**
- `app/api/billing/route.ts` — uses `user_credits` balance.
- `app/api/factory/run/route.ts` — credit check, rate limit, deduct, then run.
- `app/api/agents/run/route.ts` — same.
- `app/api/business-generator/run/route.ts` — same.
- `app/dashboard/billing/page.tsx` — credit packs (Starter/Pro/Business), PayPal create-order + capture-on-return.
- `components/dashboard/dashboard-shell.tsx` — credits display and Buy Credits in header.
- `components/dashboard/dashboard-sidebar.tsx` — “AI Chat” nav item (MessageCircle, `/dashboard/chat`).
- `components/factories/ErrorFallback.tsx` — “Buy Credits” when error is credits-related.
- `components/credits-exhausted-modal.tsx` — copy updated to “Buy Credits”.
- `lib/credits.ts` — `CREDIT_PACKS`, `creditsForAmount`, `getCreditPack`.
