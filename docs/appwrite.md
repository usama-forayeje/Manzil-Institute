# APPWRITE.md — Complete Appwrite Platform Reference for AI Coding Agents

> This file is NOT about deployment or self-hosting. This is the **complete reference for how to use Appwrite inside this project's codebase** — every service, every query method, and the exact patterns to follow. Any AI agent (or developer) working on this project should read this before writing any Appwrite-related code. This version goes deep on three areas the team specifically needs: **SMS OTP Authentication using a BD local gateway (not Twilio)**, **Realtime**, and **Functions** — since these three power the entire live, multi-operator experience of the app.

---

## 0. Foundational Rule — Client SDK vs Server SDK

Appwrite gives you two SDKs, and mixing them up is the #1 security mistake teams make.

|               | **Client SDK** (`appwrite` npm package)                                                                   | **Server SDK** (`node-appwrite` npm package)                                                                  |
| ------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Runs where    | Browser / mobile app                                                                                      | Server only — Next.js Route Handlers, Appwrite Functions                                                      |
| Identity      | Scoped to the logged-in user's session/JWT                                                                | Privileged — authenticated via API Key, can bypass all permissions                                            |
| What it's for | Reads the user is allowed to see, Realtime subscriptions, writes the user is explicitly permitted to make | Admin-level operations: managing users, financial writes, anything that must bypass normal permission checks  |
| Golden rule   | —                                                                                                         | **The API Key must never be exposed to the browser bundle.** If it leaks, your entire project is compromised. |

**Rule for this project:** Any write that touches money, stock, or locked records must never happen directly from client code. It always goes through a Server SDK call inside a Route Handler or an Appwrite Function.

---

## 1. TablesDB — The Database Service (Tables / Rows / Columns)

> Appwrite renamed its Database service. The old vocabulary (Collection, Document, Attribute) still works and is backward compatible, but it's deprecated — it will keep receiving security patches but no new features. **Every new feature Appwrite ships from now on lands only in TablesDB.** Always use TablesDB terminology in new code: **Table, Row, Column.**

### 1.1 Initializing the Client

```ts
// Client-side (browser)
import { Client, TablesDB } from "appwrite";
const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
const tablesDB = new TablesDB(client);

// Server-side (Route Handler / Function)
import { Client, TablesDB } from "node-appwrite";
const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const tablesDB = new TablesDB(client);
```

### 1.2 Full CRUD

```ts
// CREATE TABLE
await tablesDB.createTable({ databaseId, tableId, name, permissions: [...] });

// CREATE COLUMNS
await tablesDB.createStringColumn({ databaseId, tableId, key: 'name', size: 255, required: true });
await tablesDB.createIntegerColumn({ databaseId, tableId, key: 'totalMeals', required: true });
await tablesDB.createFloatColumn({ databaseId, tableId, key: 'ratePerMeal', required: true });
await tablesDB.createBooleanColumn({ databaseId, tableId, key: 'isLocked', default: false });
await tablesDB.createEnumColumn({ databaseId, tableId, key: 'mealType', elements: ['2-bela', '3-bela'], required: true });
await tablesDB.createDatetimeColumn({ databaseId, tableId, key: 'approvedAt', required: false });

// CREATE ROW (formerly "Document")
const row = await tablesDB.createRow({
  databaseId, tableId,
  rowId: ID.unique(),
  data: { receiptNo: 'RCP-0001', totalAmount: 2900 },
  permissions: [Permission.read(Role.label('accountant'))],
});

// READ ONE
const row = await tablesDB.getRow({ databaseId, tableId, rowId });

// READ LIST (with Query — full details in §1.3)
const result = await tablesDB.listRows({ databaseId, tableId, queries: [...] });
// result.total gives you the count; there is no separate "countRows" method

// UPDATE
await tablesDB.updateRow({ databaseId, tableId, rowId, data: { isLocked: true } });

// DELETE
await tablesDB.deleteRow({ databaseId, tableId, rowId });
```

### 1.3 The Query API — Every Filter, Sort, and Pagination Method

```ts
import { Query } from "node-appwrite"; // or 'appwrite' on the client

// Equality / inequality
Query.equal("status", ["active"]);
Query.notEqual("status", ["banned"]);

// Comparisons
Query.greaterThan("age", 18);
Query.greaterThanEqual("age", 18);
Query.lessThan("price", 100);
Query.lessThanEqual("price", 100);
Query.between("age", 18, 65);

// Text / array
Query.search("title", "tutorial"); // requires a fulltext index on the column
Query.contains("tags", "javascript"); // does the array contain this value?
Query.startsWith("email", "admin@");
Query.isNull("deletedAt");
Query.isNotNull("publishedAt");

// Combine conditions with OR (AND is implicit when you just list multiple queries)
Query.or([Query.equal("role", ["admin"]), Query.equal("role", ["accountant"])]);

// Sorting (chain multiple — first one is primary sort key)
Query.orderDesc("createdAt");
Query.orderAsc("title");

// Return only specific columns (keeps payload small)
Query.select(["title", "views", "createdAt"]);

// Offset pagination (good for jump-to-page UIs on small-to-medium lists)
Query.limit(25);
Query.offset(50);

// Cursor pagination (the scalable choice — use this for anything that can grow large)
Query.limit(25);
Query.cursorAfter(lastRowId);
Query.cursorBefore(firstRowId);
```

**Performance rules that matter in production:**

- Any column used in `Query.equal`, `Query.orderAsc`, or `Query.orderDesc` needs an index — without one, Appwrite does a full table scan on every request.
- `Query.search` requires a fulltext index on that column, or it throws an error.
- Prefer **cursor pagination** for anything that could grow past a few hundred rows. Combining a high `Query.offset` with a wide `Query.limit` is the fastest way to make your database slow.
- If you omit `Query.limit`, Appwrite returns 25 rows by default.
- Every row automatically has built-in fields: `$id`, `$createdAt`, `$updatedAt`, `$permissions`, and `$sequence` (a numeric, insertion-ordered ID — useful for stable insertion-order sorting).

### 1.4 Multi-Column Sort Example

```ts
await tablesDB.listRows({
  databaseId,
  tableId: "receipts",
  queries: [
    Query.equal("startDate", ["2026-07-09"]),
    Query.equal("isLocked", [false]),
    Query.orderDesc("createdAt"),
    Query.limit(50),
  ],
});
```

---

## 2. Permissions System (Permission + Role)

This is the backbone of Appwrite security. **By default, no table or row has any permission granted to anyone.**

```ts
import { Permission, Role } from "node-appwrite";

Permission.read(Role.any()); // public read
Permission.read(Role.user(userId)); // one specific user
Permission.read(Role.label("accountant")); // anyone with this label/role
Permission.read(Role.team(teamId)); // anyone in this Team
Permission.write(Role.label("admin")); // create + update + delete combined
Permission.create(Role.label("operator"));
Permission.update(Role.label("operator"));
Permission.delete(Role.label("admin"));
```

**Rule for financial tables** (`receipts`, `fund_ledger`, `payroll`, `stock_movements`, `cash_handovers`):

- Never grant `Role.any()` write access.
- Client users should never have direct write permission on these tables at all — only the Server Function's own API-key identity should be able to write. The client always goes through `Functions.createExecution()`.
- Read access is granted by role-label (`Role.label('admin')`, `Role.label('accountant')`), never open to everyone.

---

## 3. Realtime — Deep Dive (Live, Event-Driven Queries)

> ⚠️ Appwrite's Realtime SDK recently moved to a **new message-based architecture**. The old pattern (`client.subscribe(channelString, callback)` returning a raw unsubscribe function) still works for backward compatibility, but **all new code in this project must use the new `Realtime` + `Channel` classes** described below.

### 3.1 Why Realtime Exists in This App

This is a multi-operator system — receipt collectors, the accountant, and warehouse staff all touch the same data at the same time from different devices. Without realtime, someone would see stale stock counts, stale fund balances, or a "locked" receipt that isn't actually locked yet on their screen. Realtime closes that gap: instead of the client asking "has anything changed?" on a timer, the server pushes the change the instant it happens, over a persistent WebSocket connection, with latency measured in milliseconds.

### 3.2 The Modern Subscribe Pattern

```ts
import { Client, Realtime, Channel } from "appwrite";

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
const realtime = new Realtime(client);

// Subscribe to one specific row
const subscription = await realtime.subscribe(
  Channel.tablesdb(DB_ID).table(TABLE_ID).row(ROW_ID),
  (response) => {
    console.log(response.events); // e.g. ["databases.*.tables.*.rows.*.update"]
    console.log(response.payload); // the full updated row
  },
);

// Subscribe to multiple channels at once — they all share ONE underlying WebSocket
const subscription2 = await realtime.subscribe(
  [Channel.tablesdb(DB_ID).table(TABLE_ID).row(ROW_ID), Channel.files()],
  (response) => {
    /* handle either kind of event */
  },
);
```

### 3.3 Changing What You're Watching Without Reconnecting

This is one of the best improvements in the new SDK. If a user switches which receipt they're viewing, or which date's list they're looking at, you don't need to tear down and rebuild the WebSocket:

```ts
await subscription.update({
  channels: [Channel.tablesdb(DB_ID).table(TABLE_ID).row(NEW_ROW_ID)],
  queries: [Query.equal("status", ["active"])], // server-side filtering of events
});
```

### 3.4 Cleaning Up

```ts
// Stop just this one subscription — everything else keeps running
await subscription.unsubscribe();

// Tear down the whole WebSocket entirely (app teardown, logout)
realtime.disconnect();
```

### 3.5 Every Available Channel

```ts
Channel.tablesdb(databaseId).table(tableId).row(rowId); // one specific row
Channel.tablesdb(databaseId).table(tableId); // every row in a table
Channel.account(); // events on the logged-in user's own account (name/email changes, etc.)
Channel.files(); // Storage — file upload/delete/update events
Channel.teams(); // team membership changes
```

Channels are hierarchical: you can subscribe broadly (a whole table) or narrowly (a single row). Broad channels mean more events arrive, so you do more filtering on the client — narrow channels are cheaper but you need one subscription per resource you care about.

### 3.6 Permission-Aware Delivery (Security Built In)

Realtime events are filtered server-side by permissions automatically. **A user only ever receives an event for a row they actually have read access to.** If a row updates and the connected user lacks read permission on it, the event simply isn't sent to them — you don't need to write any client-side security filtering on top of this.

### 3.7 Wiring Realtime Into TanStack Query (The Standard Pattern for This App)

```ts
// src/lib/appwrite/use-realtime-table.ts
"use client";
import { useEffect } from "react";
import { useQueryClient, QueryKey } from "@tanstack/react-query";
import { Realtime, Channel } from "appwrite";
import { realtimeClient } from "@/lib/appwrite/realtime-client"; // one shared Client instance app-wide

interface Options {
  databaseId: string;
  tableId: string;
  queryKey: QueryKey;
}

export function useRealtimeTable({ databaseId, tableId, queryKey }: Options) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const realtime = new Realtime(realtimeClient);
    let sub: Awaited<ReturnType<typeof realtime.subscribe>>;

    (async () => {
      sub = await realtime.subscribe(Channel.tablesdb(databaseId).table(tableId), () => {
        // Any create/update/delete on this table → invalidate the cache.
        // React Query re-fetches in the background; the UI updates with zero layout shift.
        queryClient.invalidateQueries({ queryKey, exact: false });
      });
    })();

    return () => {
      sub?.unsubscribe();
    };
  }, [databaseId, tableId, queryClient, queryKey]);
}
```

Use this same hook shape for **every** live list, dashboard, or counter in the app: receipts, fund ledger balances, stock levels (drives instant low-stock badges), cash handover status, attendance grids, payroll status, cooking-report approval queues, meal card status. If a screen shows live operational data, it pairs a `useSuspenseQuery` with this hook. No exceptions, and **no `setInterval` polling anywhere in this codebase.**

### 3.8 Connection Resilience

The client SDK keeps one persistent WebSocket per browser tab, shared across all your subscriptions. On disconnect, it auto-reconnects, but you should treat the moment of reconnection as a signal to do one broad `invalidateQueries({ queryKey: [], exact: false })` — this guarantees you never silently miss an event that happened during the gap. Realtime is a cache-invalidation signal, never your only data source: every screen's initial paint still comes from a normal `useSuspenseQuery` fetch, so a missed event self-heals on the next navigation anyway.

### 3.9 When to Use Realtime, and When Not To

- ✅ Use it: live dashboards, several operators editing the same data, stock/fund balances that must update instantly, live chat, approval queues.
- ❌ Realtime does **not work from the Server SDK / API Key** — it's a client-only feature. If you need server-side reactions to data changes, use a Function's **event trigger** instead (§4.7).
- ❌ Skip it for anything that updates rarely (e.g. once a month) — a normal refetch is simpler and cheaper.
- ❌ If a channel could emit hundreds of events per second, the client can't keep up. Batch or aggregate on the server first.
- ❌ Not a substitute for offline-first sync — if the app needs to work reliably with no connection and sync later, that needs its own dedicated strategy, not Realtime.

---

## 4. Functions — Deep Dive (Server-Side Compute, Sagas, and Triggers)

### 4.1 Why Functions Are Central to This App

Appwrite's REST API has no native multi-document ACID transaction. Anything that touches more than one table in a single logical operation — creating a receipt (which affects the receipt table AND the fund ledger AND a serial counter), an external stock sale (stock deduction + movement log + fund credit), approving a cash handover (locking receipts + writing an approval record) — **must** run inside an Appwrite Function, never as several separate client-side calls. A Function gives you one server-side execution context where you control the entire sequence, can catch a failure partway through, and can compensate (undo) the steps that already succeeded.

### 4.2 Calling a Function (From Client or Server)

```ts
import { Functions } from "node-appwrite"; // or 'appwrite' on the client
const functions = new Functions(client);

const execution = await functions.createExecution({
  functionId: "external-sale",
  body: JSON.stringify({ itemId, quantity, rate, clientRequestId }),
  async: false, // false = wait and get the result immediately; true = fire-and-forget
});

const result = JSON.parse(execution.responseBody);
```

`clientRequestId` is a UUID generated once per user action (button press) — this is your idempotency key, explained in §4.6.

### 4.3 Creating and Deploying a Function

```bash
appwrite init functions
# ? What would you like to name your function? external-sale
# ? What runtime would you like to use? Node.js (node-22.0)
```

This scaffolds:

```
external-sale/
├── src/main.ts
├── package.json
└── README.md
```

Test locally before deploying (Docker required):

```bash
appwrite run functions
```

Note: permissions, events, CRON schedules, and timeouts don't apply during local runs — this is purely for testing your code logic.

Deploy for real:

```bash
cd external-sale
npm install
appwrite push functions
```

### 4.4 Anatomy of a Function

```ts
// src/main.ts
import { Client, TablesDB } from "node-appwrite";

export default async ({ req, res, log, error }: any) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT!)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID!)
    .setKey(req.headers["x-appwrite-key"] ?? "");

  const tablesDB = new TablesDB(client);

  try {
    const payload = JSON.parse(req.body || "{}");
    // ... business logic goes here
    return res.json({ success: true });
  } catch (err) {
    error(`Function failed: ${err}`);
    return res.json({ success: false, error: String(err) }, 500);
  }
};
```

### 4.5 The Saga Pattern — Multi-Step Writes Done Safely

Every multi-table Function in this app follows the same shape: an ordered list of compensable steps, wrapped in a try/catch that reverses whatever already succeeded if a later step fails.

```ts
export default async ({ req, res, log, error }: any) => {
  const { itemId, quantity, rate, operatorId, clientRequestId } = JSON.parse(req.body);
  const compensations: Array<() => Promise<void>> = [];

  try {
    // Idempotency check first — see if we've already handled this exact request
    const existing = await checkIdempotencyKey(clientRequestId);
    if (existing) return res.json(existing.result);

    // Step 1: deduct stock (record how to undo it)
    const item = await tablesDB.getRow({
      databaseId: DB_ID,
      tableId: "stock_items",
      rowId: itemId,
    });
    if (item.currentStock < quantity) throw new Error("insufficient_stock");
    await tablesDB.updateRow({
      databaseId: DB_ID,
      tableId: "stock_items",
      rowId: itemId,
      data: { currentStock: item.currentStock - quantity },
    });
    compensations.push(async () =>
      tablesDB.updateRow({
        databaseId: DB_ID,
        tableId: "stock_items",
        rowId: itemId,
        data: { currentStock: item.currentStock },
      }),
    );

    // Step 2: log the movement
    const movement = await tablesDB.createRow({
      databaseId: DB_ID,
      tableId: "stock_movements",
      rowId: ID.unique(),
      data: { itemId, type: "SALE", quantity, rate, totalPrice: quantity * rate, operatorId },
    });
    compensations.push(async () =>
      tablesDB.deleteRow({ databaseId: DB_ID, tableId: "stock_movements", rowId: movement.$id }),
    );

    // Step 3: credit the fund ledger
    const ledger = await tablesDB.createRow({
      databaseId: DB_ID,
      tableId: "fund_ledger",
      rowId: ID.unique(),
      data: {
        fundType: "main_meal",
        type: "credit",
        amount: quantity * rate,
        source: "external_sale",
        operatorId,
      },
    });

    await writeAuditLog({
      userId: operatorId,
      action: "create",
      collection: "fund_ledger",
      docId: ledger.$id,
    });
    await saveIdempotencyResult(clientRequestId, {
      movementId: movement.$id,
      ledgerId: ledger.$id,
    });

    return res.json({ success: true, movementId: movement.$id, ledgerId: ledger.$id });
  } catch (err) {
    error(`external-sale failed, rolling back: ${err}`);
    for (const undo of compensations.reverse()) {
      try {
        await undo();
      } catch (compErr) {
        error(`compensation failed: ${compErr}`); /* escalate/alert */
      }
    }
    throw err;
  }
};
```

### 4.6 Idempotency — Preventing Double-Tap and Retry Disasters

Slow networks mean operators double-tap submit buttons, and retried requests can hit your Function twice. Idempotency guarantees the second attempt does nothing new:

1. Every mutating client call generates a `clientRequestId` (UUID v4) **once per user action** (on button press, not per network retry).
2. An `idempotency_keys` table stores `{ key, result, createdAt }` with a **unique index on `key`**.
3. The Function checks this table first — if the key already exists, it returns the cached result instead of re-running the whole saga.
4. Keys expire after 24 hours via a scheduled cleanup Function.

### 4.7 Event-Triggered Functions (Server-Side Reactions — the Realtime Equivalent for Servers)

Since Realtime is client-only, if you need the _server_ to react automatically whenever a row changes (e.g. writing an audit log entry, sending a notification, cascading an update to another table), configure the Function to trigger on an Appwrite event instead of an HTTP call:

```json
"events": ["databases.boarding-db.tables.receipts.rows.*.create"]
```

This Function now runs automatically every single time a new receipt row is created — no client call needed at all. This is the correct pattern for "whenever X happens, also do Y" logic that must be guaranteed to run regardless of which client created X.

### 4.8 CRON Scheduled Functions

For time-based jobs like nightly reconciliation:

```json
"schedule": "59 23 * * *"
```

Always set the `TZ` environment variable on the Function (`Asia/Dhaka` for this project) so the schedule and any date math inside the Function match the real local time, not the container's default timezone.

### 4.9 Inspecting Function Executions (Debugging & Monitoring)

```ts
const executions = await functions.listExecutions({
  functionId: "external-sale",
  queries: [
    Query.equal("status", ["failed"]),
    Query.equal("trigger", ["http"]),
    Query.greaterThanEqual("duration", 5), // executions that took 5+ seconds
  ],
});
```

---

## 5. Authentication — Deep Dive (Phone SMS OTP with a BD Local Gateway + Google OAuth)

### 5.1 The Reality for This Project

Appwrite has a built-in phone-OTP flow (`account.createPhoneToken()`), but it only works with the SMS providers Appwrite natively supports: **Twilio, MSG91, Telesign, Textmagic, or Vonage.** This project is **not** using Twilio or any of those — it's using a **BD local SMS gateway** (e.g. SSL Wireless, Alpha SMS, BulkSMSBD, or whichever gateway is contracted). That means the native `createPhoneToken()` flow is skipped entirely, and we build our own OTP layer end-to-end, described fully in §5.3–§5.6 below. This is the primary, correct auth architecture for this project — not a fallback.

### 5.2 What Appwrite Still Handles For Us

Even though the OTP itself is fully custom, we don't reinvent everything — Appwrite still manages:

- The `users` collection (identity, labels/roles, phone number as an identifier)
- Session creation and the `appwrite-session` cookie once OTP is verified
- All permission checks everywhere else in the app, exactly like any other Appwrite Auth user

So the custom layer only replaces the "send code / verify code" part — everything downstream (sessions, permissions, RBAC) is 100% standard Appwrite.

### 5.3 The Full Custom OTP Architecture (BD Local Gateway)

**High-level flow:**

```
User enters phone number
   ↓
Route Handler: check phone is pre-registered (Admin SDK, Users.list)
   ↓
Route Handler: check rate limit (max 3 requests / 10 min per phone)
   ↓
Generate 6-digit OTP, hash it, store in `otp_codes` table with expiry (e.g. 5 minutes)
   ↓
Call BD gateway's HTTP API directly (fetch) to send the SMS
   ↓
User enters the code they received
   ↓
Route Handler: fetch the otp_codes row, compare hash + check expiry + check attempts
   ↓
On success: Server SDK creates a real Appwrite session for that user
   ↓
Session cookie set — user is now logged in exactly like any other Appwrite Auth flow
```

**Step 1 — `otp_codes` table schema**

```ts
interface OtpCode {
  $id: string;
  phone: string; // indexed
  codeHash: string; // never store the plaintext OTP
  expiresAt: string; // ISO date, e.g. now + 5 minutes
  attempts: number; // increment on each failed check, lock after 5
  consumed: boolean; // true once successfully used — prevents replay
}
```

**Step 2 — Request OTP (Route Handler)**

```ts
// src/app/api/auth/phone/request/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite/server";
import { Query } from "node-appwrite";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { phone } = await req.json();
  const { users, tablesDB } = createAdminClient();

  // Pre-registered-only guard
  const existing = await users.list([Query.equal("phone", phone)]);
  if (existing.total === 0) {
    return NextResponse.json(
      {
        error: "not_allowed",
        message:
          "This phone number is not registered in the system. Please contact the Chief Jimma.",
      },
      { status: 403 },
    );
  }

  // Rate limit: max 3 requests per phone per 10 minutes
  if (await isRateLimited(phone)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  // Generate + hash the OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
  const codeHash = crypto.createHash("sha256").update(code).digest("hex");
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  await tablesDB.createRow({
    databaseId: DB_ID,
    tableId: "otp_codes",
    rowId: ID.unique(),
    data: { phone, codeHash, expiresAt, attempts: 0, consumed: false },
  });

  // Send via the BD local gateway's own HTTP API (example shape — check your gateway's actual docs)
  await fetch("https://smsgw.example-bd-provider.com/api/v3/send-sms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: process.env.SMS_GATEWAY_API_KEY,
      sid: process.env.SMS_GATEWAY_SENDER_ID,
      msisdn: phone,
      sms: `আপনার ভেরিফিকেশন কোড: ${code}`,
    }),
  });

  await recordOtpAttempt(phone); // for rate limiting bookkeeping
  return NextResponse.json({ success: true, phone });
}
```

**Step 3 — Verify OTP + Create Real Appwrite Session (Route Handler)**

```ts
// src/app/api/auth/phone/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite/server";
import { Query } from "node-appwrite";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { phone, code } = await req.json();
  const { users, tablesDB } = createAdminClient();

  const rows = await tablesDB.listRows({
    databaseId: DB_ID,
    tableId: "otp_codes",
    queries: [
      Query.equal("phone", [phone]),
      Query.equal("consumed", [false]),
      Query.orderDesc("$createdAt"),
      Query.limit(1),
    ],
  });
  const otpRow = rows.rows[0];

  if (!otpRow || new Date(otpRow.expiresAt) < new Date()) {
    return NextResponse.json({ error: "expired_or_invalid" }, { status: 400 });
  }
  if (otpRow.attempts >= 5) {
    return NextResponse.json({ error: "too_many_attempts" }, { status: 429 });
  }

  const codeHash = crypto.createHash("sha256").update(code).digest("hex");
  if (codeHash !== otpRow.codeHash) {
    await tablesDB.updateRow({
      databaseId: DB_ID,
      tableId: "otp_codes",
      rowId: otpRow.$id,
      data: { attempts: otpRow.attempts + 1 },
    });
    return NextResponse.json({ error: "invalid_code" }, { status: 400 });
  }

  // Mark consumed — prevents this code being replayed
  await tablesDB.updateRow({
    databaseId: DB_ID,
    tableId: "otp_codes",
    rowId: otpRow.$id,
    data: { consumed: true },
  });

  // Find the pre-registered user for this phone, then create a real Appwrite session
  const matchedUsers = await users.list([Query.equal("phone", [phone])]);
  const user = matchedUsers.users[0];
  const session = await users.createSession(user.$id); // Server SDK, admin-level — issues a real session/secret

  const response = NextResponse.json({ success: true, userId: user.$id });
  response.cookies.set("appwrite-session", session.secret, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
  return response;
}
```

From this point on, the user has a completely normal Appwrite session — every other part of the app (permissions, `createSessionClient()`, Realtime subscriptions) works exactly as if they'd logged in through Appwrite's own OTP flow. The custom layer is invisible to the rest of the codebase.

### 5.4 Why This Is Actually Better for a Local Gateway

- Full control over the SMS message template (Bengali text, custom formatting) — not limited to whatever format Appwrite's native providers assume.
- You can switch BD gateways (SSL Wireless → Alpha SMS → BulkSMSBD, etc.) later by changing only the `fetch()` call in Step 2 — nothing else in the app needs to change, since the rest of the system only ever talks to your own `otp_codes` table and Appwrite sessions.
- You keep 100% of the cost-control and anti-spam guards (pre-registered-only, rate limiting, hashed codes, attempt limits, single-use `consumed` flag) exactly as strict as if Appwrite were doing it natively — arguably stricter, since you control every part of it.

### 5.5 Pre-Registered-Number Guard — Non-Negotiable Rule

This is critical for a 6000+ student system — without it, anyone could trigger unlimited SMS sends against your budget. Both Step 2 (request) and the general rule: **never send an OTP to a phone number that isn't already in the `users` collection.** Rate limit is max 3 OTP requests per phone number per 10 minutes, tracked via a small counter (Redis, or a `rate_limits` table) checked in the request handler — this stops abuse even from already-registered numbers.

### 5.6 Google OAuth (For Admins/Accountants)

```ts
account.createOAuth2Session("google", successUrl, failureUrl);
```

Configure the Client ID/Secret under Console → Auth → Settings → OAuth2 Providers → Google (from Google Cloud Console).

### 5.7 Server-Side Session Verification (JWT)

```ts
// Client-side: get a JWT tied to the current session
const jwt = await account.createJWT();

// Server-side: use it to call Appwrite AS that user (not as admin)
const sessionClient = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setJWT(jwt);
```

Every Route Handler and Function that performs a financial write must independently verify the session/JWT server-side and resolve the real `userId` and role from it — **never trust a `userId` or `role` field the client sends in the request body.**

### 5.8 Admin User Management (Server SDK)

```ts
import { Users } from "node-appwrite";
const users = new Users(client);

await users.updateLabels(userId, ["accountant"]); // assign a role/label
const user = await users.get(userId);
```

---

## 6. Storage (Buckets & Files)

```ts
import { Storage, ID, Permission, Role } from "node-appwrite";
const storage = new Storage(client);

await storage.createBucket({
  bucketId: "meal-cards",
  name: "Meal Card Photos",
  permissions: [Permission.read(Role.label("admin"))],
  maximumFileSize: 5 * 1024 * 1024,
  allowedFileExtensions: ["jpg", "png"],
});

const file = await storage.createFile({ bucketId, fileId: ID.unique(), file: inputFile });

const files = await storage.listFiles({
  bucketId,
  queries: [Query.equal("mimeType", ["image/jpeg", "image/png"]), Query.orderAsc("sizeActual")],
});

const url = storage.getFilePreview({ bucketId, fileId, width: 400 });
```

---

## 7. Teams (Group-Based Access Control)

```ts
import { Teams, Query } from "node-appwrite";
const teams = new Teams(client);

await teams.create({ teamId: ID.unique(), name: "Warehouse Staff" });
await teams.createMembership({ teamId, email, roles: ["manager"] });

const teamList = await teams.list([Query.greaterThan("total", 100), Query.orderDesc("total")]);
```

Use Teams when access needs to be granted to an entire group at once (e.g. everyone on one warehouse's staff), when a simple label isn't granular enough.

---

## 8. Messaging (Email / SMS / Push, Beyond Just OTP)

```ts
import { Messaging, ID } from "node-appwrite";
const messaging = new Messaging(client);

await messaging.createSms({
  messageId: ID.unique(),
  content: "Low stock alert: rice below threshold",
  users: [adminUserId],
});
await messaging.createEmail({
  messageId: ID.unique(),
  subject: "Monthly payroll ready",
  content: "...",
  users: [userId],
});
```

Use this for anything that isn't the OTP flow itself — low-stock alerts, payroll-ready notifications, daily reconciliation summaries.

---

## 9. Putting It All Together — The Standard Feature Structure

Every feature directory (`src/features/<name>/`) follows this shape:

```
types.ts        → TypeScript interfaces
service.ts      → read-only TablesDB calls using Query (client SDK where permitted)
functions.ts    → Functions.createExecution() wrappers for every financial/multi-step write
queries.ts      → TanStack Query key factories + queryOptions for prefetching
hooks/
  use-<name>-realtime.ts   → the §3.7 pattern, one per live list/dashboard
```

**The four golden rules for any AI agent writing code in this project:**

1. Reads go through `TablesDB.listRows()` + `Query`, called directly from the client wherever permissions allow it.
2. Financial or multi-step writes go through `Functions.createExecution()` — never a direct `createRow`/`updateRow` call from client code on a financial table.
3. Every live list, dashboard, or counter pairs a `useSuspenseQuery` with a matching realtime subscription (§3.7) — never a `setInterval`.
4. Permissions are always explicit — never `Role.any()` on a sensitive table, and every mutating call carries a `clientRequestId` for idempotency (§4.6).
