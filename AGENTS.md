# AGENTS.md — Manzil Institute (Madrasa)

### (Production-Grade / Fully Realtime / Industry Standard Architecture — v2.0)

> **AI Agent Instructions:** Read this entire document before writing or modifying any code. This file is the single source of truth for all architectural, naming, database schema, transaction-safety, realtime, and coding decisions for this project. Nothing here is optional — every rule exists because of a real failure mode in multi-operator educational & financial systems.

---

## 0. Design Philosophy

This is not a simple CRUD app — it is a **mission-critical educational & financial system of record** for 6,000+ students and staff, managing admissions, academics, student fees, hall/seat allotments, and payroll. Operated concurrently by multiple administrators, accountants, teachers, and receipt collectors who may work simultaneously, double-click actions, or experience network drops, the architecture guarantees:

1. **No money is ever double-counted, lost, or silently wrong.**
2. **Every screen on every device reflects the true current state within ~1 second, with zero manual refresh.**
3. **Every write is traceable to a person, a time, and a reason.**
4. **Intuitive, lightning-fast UX with native Bengali localization, voice typing, and cascading madrasa hierarchy.**

---

## 1. Project Overview

The **Manzil International Institute Management System** (মানযিল ইনস্টিটিউট) is a modern, real-time, multi-role web platform designed to streamline all operational workflows:
- Student Enrollment & Admissions (ভর্তি ও শিক্ষার্থী প্রোফাইল)
- Madrasa Hierarchy & Academics (বিভাগ, জামাত/শ্রেণী, ফরিক/শাখা, শিক্ষাবর্ষ)
- Hall & Room Management (আবাসিক হল ও সিট বরাদ্দ)
- Fees, Receipts & Central Cash Tracking (ফি আদায়, বকেয়া, রসিদ, দৈনিক খতিয়ান ও হ্যান্ডওভার)
- Smart ID Cards & NFC Access (স্মার্ট আইডি কার্ড, বারকোড/কিউআর, এনএফসি গেটওয়ে)
- Attendance, HR & Payroll (শিক্ষার্থী ও স্টাফ হাজিরা, বেতন ও অ্যাডভান্স)

### Technology Stack

| Layer                     | Technology                                                                 | Key Details                                                                                                      |
| ------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Framework**             | **Next.js 16 (App Router)**                                                | React 19, TypeScript 5.7+ strict mode                                                                             |
| **Styling & UI**          | **Tailwind CSS v4 + shadcn/ui**                                            | Custom OKLCH palette, Kalpurush Bengali font support, responsive desktop & tablet/mobile                         |
| **Backend & DB**          | **Appwrite (Self-Hosted / Cloud)**                                         | Document Database, Storage Buckets, Admin & Session SDKs                                                         |
| **Authentication**        | **Appwrite Auth + Google OAuth / SMS OTP**                                 | Clerk is banned. Multi-role sessions stored in HTTP-only `appwrite-session` cookies (30-day persistence).         |
| **Real-time Engine**      | **Appwrite Realtime (WebSocket)**                                          | Live cache synchronization via TanStack Query — no polling `setInterval` anywhere                                 |
| **Server-Side Atomicity** | **Appwrite Functions / Server Actions with Sagas**                          | Multi-document financial mutations execute atomically with compensating rollbacks                              |
| **Server State**          | **TanStack React Query v5**                                                | Infinite scroll, optimistic updates, query invalidation driven by realtime events                                 |
| **Client State**          | **Zustand v5**                                                             | Ephemeral client UI state only — never a duplicate source of truth for server data                               |
| **Forms & Validation**    | **React Hook Form + Zod**                                                  | Type-safe forms, shared validation schemas, multi-step wizards                                                   |
| **Print & Export**        | **Native CSS Print Styles + jsPDF / HTML2Canvas**                          | 80mm POS thermal receipts, Landscape A4 fee sheets, printable student ID cards                                  |

---

## 2. Critical System Rules & Guardrails

### 2.1 Banned Dependencies & Direct Writes

- **Clerk is banned.** Authentication is strictly handled via Appwrite Auth (`lib/appwrite/server.ts`, `lib/auth/actions.ts`).
- **Direct Database Writes from UI for Financial Data are banned.** Client components must never directly call `databases.createDocument` or `databases.updateDocument` for receipts, fee collections, ledger entries, cash handovers, or stock movements. These must go through secure Server Actions or Appwrite Functions with compensating saga patterns (§4).

### 2.2 30-Day Persistent Session Management

- Sessions are stored in an HTTP-only cookie named `appwrite-session` with `maxAge: 30 days` and explicit `expires` date matching Appwrite's session expiry.
- Role cookies (`appwrite-user-role`, `appwrite-user-name`, `appwrite-user-email`) are persistent.
- Server components and layouts must never execute destructive signout redirects on transient errors (redirecting to `/api/auth/signout` on session miss is prohibited; redirect to `/login` instead).

### 2.3 Realtime-Everywhere Requirement (Non-Negotiable)

- **Every operational and financial table, dashboard counter, and status badge must be realtime-backed.**
  - Students list (`useStudentsRealtime`)
  - Fee transactions and due registers
  - Boarding / Khana Jari counters
  - Hall / Room occupancy badges
  - Cash ledger balances and handover requests
  - Attendance logs and audit trails
- **Pattern:** `Appwrite WebSocket Event` ➔ `useRealtimeCollection` ➔ `TanStack Query Cache update / invalidation` ➔ `Zero-flicker re-render`.
- `setInterval` polling is strictly prohibited.

### 2.4 Data Immutability & Reversal Workflow

- **Approved Receipts & Handovers are Immutable:** Once an accountant approves a cash handover or fees receipt, the document is marked `isLocked: true`. Locked documents can never be modified or deleted directly by any user.
- **Correction via Reversal (ভুল সংশোধন / রিভার্সাল):** Any financial correction to a locked entry must be processed as a **reversal transaction** (`type: 'REVERSAL'`) with a mandatory Bengali explanation, creating an opposite debit/credit entry in `fund_ledger` linked to `targetDocId` and logging full details in `audit_logs`.

### 2.5 Bengali Voice Typing & Clear Button (`<VoiceInput />`)

- All key Bengali text inputs (student name, father name, address, remarks, notes, search queries) must feature:
  1. A microphone button triggering Web Speech API (`bn-BD` locale) for voice typing.
  2. A clear (X) icon button to erase input in a single tap when a value exists.
  3. Integrated smoothly via the reusable `<VoiceInput />` component.

### 2.6 Universal Cascading Madrasa Hierarchy Selection (Non-Negotiable)

In every form, modal, filter, and report where academic positioning is selected:
$$\text{বিভাগ (Department)} \longrightarrow \text{জামাত / শ্রেণী (Class/Jamat)} \longrightarrow \text{ফরিক / গ্রুপ (Section/Group)}$$
1. **বিভাগ (Department):** Must be selected first. Until selected, Jamat dropdown remains disabled.
2. **জামাত (Jamat):** Filtered strictly by the selected department. Until selected, Section/Group remains disabled.
3. **ফরিক / গ্রুপ (Section/Group):** Filtered strictly by the selected Jamat.
4. Changing a parent level immediately resets and clears all child selections.

### 2.7 Universal Cascading Bangladesh Geo-Address Selection (Non-Negotiable)

In all student admissions (`student-form-sheet`), staff records, and guardian addresses:
$$\text{বিভাগ (Division)} \longrightarrow \text{জেলা (District)} \longrightarrow \text{উপজেলা / থানা (Upazila)} \longrightarrow \text{ইউনিয়ন (Union)} \longrightarrow \text{গ্রাম (Village)}$$
- Powered by `data/bangladesh-geo-data.json`.
- Strict cascading: changing a parent level instantly resets child dropdowns. Village input provides voice typing and one-tap clear.

### 2.8 UI Loading Skeletons & Cursor Pointers (Non-Negotiable)

- Raw text loading or generic spinners inside main content areas are prohibited. Always use `shadcn/ui` `<Skeleton />` matching the layout proportions of the target card, table, or form.
- Every clickable item (`<button>`, `<Button>`, interactive table row, tab trigger, badge) must explicitly have `cursor-pointer`.

### 2.9 Centralized Asset & Icon Management

- All app icons must be imported from `@/components/icons` or `lucide-react` with consistent stroke and size.
- Image assets must be centralized in `constants/images.ts` and never imported with deep relative paths in components.

### 2.10 Official Appwrite SDK, SSR & MCP Architecture Rules (Next.js 16 App Router)

- **Strict SDK Separation:**
  - **Server Components & Server Actions:** Exclusively import from `node-appwrite`. Never import browser SDK `appwrite` on the server.
  - **Client Components (`'use client'`):** Exclusively import from `appwrite` (browser SDK). Never import `node-appwrite` in client files.
- **Request-Scoped Client Isolation:**
  - `createSessionClient()` (`lib/appwrite/server.ts`): Use for operations performed on behalf of the logged-in user. Reads session from `(await cookies()).get('appwrite-session')` and attaches via `client.setSession()`.
  - `createAdminClient()` (`lib/appwrite/admin.ts`): Use for administrative tasks, system-level saga workflows, and background routines that require `APPWRITE_API_KEY`.
- **Server Action Document Serialization (Non-Negotiable):**
  - Appwrite documents have non-plain class prototypes. When returning documents from Server Actions to React Client Components, **always serialize to plain objects** via `JSON.parse(JSON.stringify(docs))` to prevent Next.js serialization runtime crashes.
- **Index-Safe Querying (`Query` from `node-appwrite`):**
  - Any attribute used in `Query.equal`, `Query.greaterThan`, `Query.orderDesc`, or `Query.search` must have a matching index in the Appwrite database collection.
- **Storage & InputFile:**
  - For server-side file uploads, construct file inputs using `InputFile.fromBuffer(buffer, filename)` or `InputFile.fromBlob(blob, filename)`.
- **Live MCP Tool Usage for AI Agents:**
  - The agent has active Appwrite MCP tools (`appwrite_get_context`, `appwrite_search_tools`, `appwrite_call_tool`). When inspecting or verifying collection schemas, attributes, or storage buckets, the agent MUST use live MCP calls rather than guessing database schema fields.

---

## 3. Scope of Modules & System Architecture

The Manzil International Institute system is structured into 8 cohesive core modules:

```
app/(dashboard)/dashboard/
├── admin/
│   ├── academics/        # বিভাগ, জামাত, শাখা, সেশন ও টার্ম
│   ├── students/         # ভর্তি ফরম, ছাত্র তালিকা, প্রমোশন, আইডি কার্ড
│   ├── boarding/         # বোর্ডিং ধরন, খানা জারি, দৈনিক মিল প্ল্যান
│   ├── hall/             # আবাসিক হল, ফ্লোর, রুম ও সিট বরাদ্দ
│   ├── fees/             # ফি স্ট্রাকচার, ফি আদায়, বকেয়া রেজিস্টার, রশিদ
│   ├── receipts/         # আদায়কৃত ভাউচার ও রসিদ হিস্ট্রি
│   ├── attendance/       # শিক্ষার্থী ও শিক্ষক/স্টাফ দৈনিক হাজিরা
│   ├── nfc/              # এনএফসি গেটওয়ে ও স্মার্ট কার্ড স্ক্যান
│   ├── hr/               # স্টাফ ডাটাবেজ, বেতন বই ও অ্যাডভান্স
│   └── settings/         # মাদ্রাসার পরিচিতি, ফি টাইপ, পদবী ও সিস্টেম কনফিগ
└── student/              # শিক্ষার্থীর নিজস্ব প্রোফাইল, ফি হিস্ট্রি ও উপস্থিতি
```

| # | মডিউল (Module) | বিস্তারিত বিবরণ (Scope) | রুট প্রিফিক্স (Route) | ফিচার ডিরেক্টরি (Feature Dir) |
|---|---|---|---|---|
| **1** | **শিক্ষার্থী ও ভর্তি (Students & Admission)** | নতুন ভর্তি ফরম (মাল্টি-স্টেপ উইজার্ড), ফটো ক্রপ ও আপলোড, শিক্ষার্থী তালিকা (ইনফিনিটি স্ক্রল), প্রমোশন ও ট্রান্সফার, প্রোফাইল কার্ড | `/dashboard/admin/students` | `features/students`, `features/admission` |
| **2** | **একাডেমিক কাঠামো (Academics)** | বিভাগ (হিফজ, কিতাব, নূরানী ইত্যাদি), জামাত/শ্রেণী, ফরিক/শাখা, শিক্ষাবর্ষ (সেশন) ও সেমিস্টার/টার্ম | `/dashboard/admin/academics` | `features/academic` |
| **3** | **ডিজিটাল খানা জারি ও বোর্ডিং (Boarding)** | বোর্ডিং টাইপ (আবাসিক, অনাবাসিক, ডে-কেয়ার), ৩-বেলা/২-বেলা মিল ক্যালকুলেশন, জেনারেল ফান্ড কর্তন, কিচেন মিল চার্ট | `/dashboard/admin/boarding` | `features/boarding`, `features/meals` |
| **4** | **আবাসিক হল ও সিট (Hall Management)** | হল/বিল্ডিং তৈরি, ফ্লোর, রুম ও বেড নম্বর, সিট বরাদ্দ ও বদলি, ফাঁকা সিট ট্র্যাকিং | `/dashboard/admin/hall` | `features/hall` |
| **5** | **ফি, রসিদ ও ক্যাশ খতিয়ান (Fees & Cash)** | ফি জেনারেট, মাসিক ফি আদায়, বকেয়া তালিকা, ৮mm থার্মাল রসিদ প্রিন্ট, সেন্ট্রাল ক্যাশ খতিয়ান ও হ্যান্ডওভার | `/dashboard/admin/fees`, `/receipts` | `features/fees`, `features/cash` |
| **6** | **আইডি কার্ড ও এনএফসি (ID Cards & NFC)** | পাসপোর্ট সাইজ প্রিভিউ ও ক্রপ, অফিশিয়াল আইডি কার্ড বাল্ক প্রিন্ট, বারকোড/কিউআর ও এনএফসি গেটওয়ে রিডার | `/dashboard/admin/id-cards`, `/nfc` | `features/id-cards`, `features/nfc` |
| **7** | **হাজিরা, স্টাফ ও পেরোল (Attendance & HR)** | ছাত্র ও শিক্ষক বায়োমেট্রিক/এনএফসি/ম্যানুয়াল হাজিরা, ছুটির হিসাব, বেতন শীট, অ্যাডভান্স ঋণ ও ওটি | `/dashboard/admin/attendance`, `/hr` | `features/attendance`, `features/hr` |
| **8** | **গুদাম ও বাজার (Godam & Market)** | বাজার ভাউচার এন্ট্রি, স্টক ইন/আউট, অপচয়/ঘাটতি এডজাস্টমেন্ট, কিচেন ব্যবহার ও দৈনিক বাজেট | `/dashboard/admin/godam` | `features/godam` |

---

## 4. Server-Side Atomic Transactions & Saga Pattern

Appwrite-এ ক্লায়েন্ট থেকে একাধিক ডকুমেন্টে আলাদা আলাদা রাইট কল করা ফিন্যান্সিয়াল সিস্টেমে ডেটা অসঙ্গতি তৈরি করে। সকল বহুপাক্ষিক ফিন্যান্সিয়াল মিউটেশনকে Server Actions বা Appwrite Functions-এ **Saga Pattern**-এ লিখতে হবে:

### 4.1 Compensating Saga Workflow

```ts
// Example: Student Fee Collection Saga
export async function collectStudentFeeSaga(payload: CollectFeePayload) {
  const steps: Array<() => Promise<void>> = [];
  let transactionId: string | null = null;
  let ledgerEntryId: string | null = null;

  try {
    // 1. Idempotency Check
    if (await isDuplicateRequest(payload.clientRequestId)) {
      return await getCachedResult(payload.clientRequestId);
    }

    // 2. Step 1: Create Fee Payment Document
    const payment = await databases.createDocument(DATABASE_ID, COLLECTIONS.FEE_PAYMENTS, ID.unique(), {
      studentId: payload.studentId,
      amount: payload.amount,
      feeTypeId: payload.feeTypeId,
      clientRequestId: payload.clientRequestId,
      isLocked: false,
    });
    transactionId = payment.$id;
    steps.push(async () => {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.FEE_PAYMENTS, payment.$id);
    });

    // 3. Step 2: Post to Central Fund Ledger
    const ledger = await databases.createDocument(DATABASE_ID, COLLECTIONS.FEE_TRANSACTIONS, ID.unique(), {
      type: 'credit',
      amount: payload.amount,
      source: 'student_fee',
      referenceId: payment.$id,
      collectorId: payload.operatorId,
      date: new Date().toISOString().split('T')[0],
    });
    ledgerEntryId = ledger.$id;
    steps.push(async () => {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.FEE_TRANSACTIONS, ledger.$id);
    });

    // 4. Step 3: Write Audit Log
    await writeAuditLog({
      userId: payload.operatorId,
      action: 'fee_collection',
      targetId: payment.$id,
      amount: payload.amount,
      clientRequestId: payload.clientRequestId,
    });

    const result = { success: true, paymentId: transactionId, ledgerId: ledgerEntryId };
    await cacheIdempotencyResult(payload.clientRequestId, result);
    return result;
  } catch (err) {
    // Failure -> Run compensations in reverse order
    for (const compensate of steps.reverse()) {
      try { await compensate(); } catch (e) { console.error('Compensation failed:', e); }
    }
    throw err;
  }
}
```

---

## 5. Domain Business Logic & Mathematical Formulas

### 5.1 Khana Jari & Boarding Rate Calculation (খানা জারি ও মিল রেট)


### 5.2 Fee Generation & Due Calculation (মাসিক ফি ও বকেয়া)

1. **মাসিক মোট পাওনা:**
   $$\text{Total Payable} = \text{Monthly Tuition} + \text{Boarding Fee} + \text{Hall Fee} + \text{Arrears (পূর্বের বকেয়া)} - \text{Discount/Waiver}$$
2. **অবশিষ্ট বকেয়া (Due Amount):**
   $$\text{Due} = \text{Total Payable} - \text{Total Paid}$$
   - $\text{Due} = 0 \longrightarrow$ `Status: PAID` (পরিশোধিত)
   - $\text{Due} > 0 \land \text{Paid} > 0 \longrightarrow$ `Status: PARTIAL` (আংশিক পরিশোধ)
   - $\text{Paid} = 0 \longrightarrow$ `Status: UNPAID` (অপরিশোধিত)

### 5.3 Daily Central Cash Reconciliation (দৈনিক ক্যাশ ও বাজার বাজেট)


---

## 6. Access Control & Security Matrix (RBAC)

| ফিচার / মডিউল | Super Admin | Manager | Accountant | Teacher | Student / Parent |
|---|:---:|:---:|:---:|:---:|:---:|
| নতুন শিক্ষার্থী ভর্তি ও প্রমোশন | ✔ | ✔ | ✘ | ✘ | ✘ |
| ক্লাস, জামাত ও বিভাগ কনফিগ | ✔ | ✔ | ✘ | ✘ | ✘ |
| ফি আদায় ও থার্মাল রসিদ প্রিন্ট | ✔ | ✔ | ✔ | ✘ | ✘ |
| ফি স্ট্রাকচার ও পলিসি তৈরি | ✔ | ✘ | ✔ | ✘ | ✘ |
| ক্যাশ খতিয়ান ও হ্যান্ডওভার অনুমোদন | ✔ | ✘ | ✔ | ✘ | ✘ |
| ভুল সংশোধন ও রিভার্সাল অনুমোদন | ✔ | ✘ | ✔ | ✘ | ✘ |
| বোর্ডিং বরাদ্দ ও খানা জারি | ✔ | ✔ | ✘ | ✘ | ✘ |
| হল ও রুম সিট বরাদ্দ | ✔ | ✔ | ✘ | ✘ | ✘ |
| হাজিরা ইনপুট (ছাত্র ও স্টাফ) | ✔ | ✔ | ✘ | ✔ | ✘ |
| বেতন শীট ও পেরোল অনুমোদন | ✔ | ✘ | ✔ | ✘ | ✘ |
| গুদাম স্টক ইন/আউট ও বাজার ভাউচার | ✔ | ✔ | ✘ | ✘ | ✘ |
| স্মার্ট আইডি কার্ড ও এনএফসি অ্যাক্সেস | ✔ | ✔ | ✘ | ✘ | ✘ |
| নিজস্ব প্রোফাইল, ফি ও রেজাল্ট দেখা | ✔ | ✔ | ✔ | ✔ | ✔ |
| অডিট লগ ও সিস্টেম সিকিউরিটি | ✔ | ✘ | ✘ | ✘ | ✘ |

---

## 7. Realtime Architecture Implementation

### 7.1 Single-Client Realtime Instance

- Root-level client instantiated once in `lib/appwrite/realtime-provider.tsx` and consumed via React Context.
- `useRealtimeCollection` hook subscribes to `databases.[DB].collections.[COL].documents`.
- Event filtering:
  - `create` / `update` ➔ `queryClient.setQueryData()` or `queryClient.invalidateQueries()`.
  - `delete` ➔ `queryClient.removeQueries()`.
- On WebSocket reconnect ➔ Automatic silent `invalidateQueries()` to ensure zero missed data.

---

## 8. Localization & Print Specifications

### 8.1 Terminologies (পরিভাষা)

| ইংরেজি পরিভাষা | বাংলা UI পরিভাষা | মাদ্রাসার বাস্তব অর্থ |
|---|---|---|
| Khana Jari | খানা জারি | বোর্ডিংয়ে শিক্ষার্থীর দৈনিক মিল চালু/নিবন্ধন |
| Jamat | জামাত / শ্রেণী | একাডেমিক ক্লাস স্তর (যেমন: শরহে বেকায়া, হিফজ) |
| Forik / Section | ফরিক / শাখা | একই জামাতের অভ্যন্তরীণ গ্রুপিং বা শাখা |
| Hall / Borat | দারুল ইকামা / হল | ছাত্রদের আবাসিক ভবন ও ডরমিটরি |
| Receipt Collector | রসিদ আদায়কারী | যিনি নগদ ফি আদায় ও রসিদ কাটেন |
| Khotiyan | দৈনিক খতিয়ান | প্রতিদিনের আয়-ব্যয় ও জমার চূড়ান্ত হিসাব |
| Reversal | সংশোধন / রিভার্সাল | ভুল এন্ট্রির বিপরীত ডেবিট/ক্রেডিট সংশোধন |
| Jimma | জিম্মাদার | দায়িত্বশীল পরিচালক বা সুপারভাইজার |

### 8.2 POS Thermal & ID Card Print Standards

- **80mm Thermal Receipt (`.print-pos`):** Compact, high-contrast, optimized for 80mm thermal receipt printers without margins, displaying Madrasa header, student ID, Jamat, paid amount in Bengali words, and QR verification.
- **Student ID Card:** Standard CR80 card dimensions ($85.60 \times 53.98\text{ mm}$), 300 DPI, crisp barcode/QR, student passport photo (3:4 aspect ratio with face centered), and guardian contact info.
- **Landscape A4 Sheets:** Monthly fee registers and payroll sheets formatted with sign-off rows for Jimma and Accountant.

---

## 9. AI Agent Development Checklist

Before completing any task or feature:
1. **Did you follow the Madrasa Hierarchy cascading rule?** (বিভাগ ➔ জামাত ➔ ফরিক)
2. **Did you implement Realtime cache synchronization?** (No static polling)
3. **Are financial writes handled via Server Sagas with idempotency?**
4. **Does every Bengali text input use `<VoiceInput />` with a clear button?**
5. **Are loading states rendered with shadcn `<Skeleton />`?**
6. **Are interactive buttons styled with `cursor-pointer`?**
7. **Are session cookies persistent for 30 days without destructive redirects?**
8. **Is all code strictly typed with zero TypeScript errors?**
9. **Are Appwrite documents serialized to plain objects before returning from Server Actions to Client Components?**
10. **Are Appwrite SDKs strictly separated (`node-appwrite` on server, `appwrite` on client)?**