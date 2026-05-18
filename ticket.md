Phase 1 — Foundation, Auth & Role Routing


// MMS-001

Setup Appwrite backend for a Madrasa Management System using Next.js 15 App Router with TypeScript strict mode.

INSTALL:
npm install appwrite node-appwrite react-hook-form @hookform/resolvers zod @tanstack/react-query zustand

APPWRITE PROJECT CONFIG:
- Platform: Web (add localhost + production domain)
- Enable Google OAuth provider in Auth settings

CREATE ALL DATABASE COLLECTIONS with exact attributes:

1. users
   userId(string,required), name(string), email(string), role(enum:super_admin,manager,teacher,student,parent), avatarUrl(string), phone(string), isActive(boolean,default:true), createdAt(datetime)

2. students
   studentId(string,required,unique), userId(FK), name(string), fatherName(string), motherName(string), dateOfBirth(datetime), gender(enum:male,female), class(string), section(string), rollNo(string), address(string), phone(string), guardianPhone(string), photo(string), nfcCardId(string), admissionDate(datetime), status(enum:active,inactive,graduated), boardingType(enum:day,residential,boarding), createdAt(datetime)

3. staff
   staffId(string,required,unique), userId(FK), name(string), designation(string), department(string), joiningDate(datetime), salary(number), phone(string), address(string), nfcCardId(string), photo(string), isActive(boolean), createdAt(datetime)

4. fee_structures
   name(string), type(enum:admission,monthly,boarding,exam,other), amount(number), description(string), isActive(boolean), createdAt(datetime)

5. fee_transactions
   studentId(FK), transactionType(enum:admission,monthly,boarding,exam), month(string,nullable), year(integer), items(json), totalAmount(number), paidAmount(number), dueAmount(number), paymentMethod(enum:cash,bank,bkash,nagad), receiptNo(string,unique), collectedBy(FK-userId), notes(string), createdAt(datetime)

6. expense_categories
   name(string), arabicName(string), description(string), isActive(boolean), createdAt(datetime)

7. expenses
   categoryId(FK), title(string), amount(number), description(string), date(datetime), receiptImage(string), createdBy(FK-userId), approvedBy(FK-userId,nullable), status(enum:pending,approved,rejected), createdAt(datetime)

8. attendance_staff
   staffId(FK), date(date), status(enum:present,absent,late,leave), checkInTime(string), checkOutTime(string), note(string), markedBy(FK-userId), nfcScanned(boolean), createdAt(datetime)

9. attendance_students
   studentId(FK), date(date), class(string), section(string), status(enum:present,absent,late,leave), markedBy(FK-userId), nfcScanned(boolean), createdAt(datetime)

10. boarding_rooms
    roomNo(string), floor(string), capacity(integer), currentOccupancy(integer), type(enum:single,double,dorm), isActive(boolean), createdAt(datetime)

11. boarding_allocations
    studentId(FK), roomId(FK), bedNo(string), startDate(datetime), endDate(datetime,nullable), monthlyFee(number), status(enum:active,inactive), createdAt(datetime)

12. classes
    name(string), arabicName(string), level(integer), sections(json), classTeacherId(FK-staffId), totalStudents(integer), isActive(boolean), createdAt(datetime)

13. notices
    title(string), body(string), targetRoles(json), isPinned(boolean), publishedBy(FK-userId), publishedAt(datetime), expiresAt(datetime,nullable), createdAt(datetime)

14. nfc_cards
    cardId(string,unique), assignedTo(FK-userId), assignedType(enum:student,staff), isActive(boolean), lastScanned(datetime), createdAt(datetime)

FILES TO CREATE:
- src/lib/appwrite/client.ts — browser-side Appwrite client
- src/lib/appwrite/server.ts — server-side client with session cookie
- src/lib/appwrite/admin.ts — admin client with API key
- src/types/database.ts — TypeScript interfaces for all collections
- src/config/appwrite.ts — collection IDs, bucket IDs as constants
- .env.local with all APPWRITE_* variables
- .env.example with all variables documented

// MMS-002

Implement Google OAuth authentication with Appwrite and role-based routing for the Madrasa Management System.

FILES TO CREATE:

src/lib/auth/actions.ts — Server Actions:
  signInWithGoogle() → creates OAuth2 session, redirect to Google
  signOut() → delete session, clear cookies, redirect to /
  getSession() → returns current user + role from Appwrite
  getCurrentUser() → fetch user document from users collection

src/middleware.ts — Route protection:
  Protected routes: /dashboard/* → redirect to /login if no session
  Public routes: / (landing), /login, /auth/callback
  Role-based redirect: after login check role → redirect to correct dashboard

src/app/auth/callback/page.tsx:
  - Appwrite calls this after Google OAuth
  - Check if user document exists in users collection
  - If new user: create user document with role = 'student' (default)
  - Read role from users collection
  - Redirect based on role:
    super_admin → /dashboard/admin
    manager → /dashboard/manager
    teacher → /dashboard/teacher
    student → /dashboard/student
    parent → /dashboard/parent

src/app/login/page.tsx:
  - Clean centered login card (ShadCN Card)
  - Madrasa logo + name at top
  - "Login with Google" button (Google icon + indigo color)
  - Arabic/Bengali text: "আপনার Google অ্যাকাউন্ট দিয়ে লগিন করুন"
  - Loading state during OAuth redirect
  - Error toast if login fails

src/hooks/useAuth.ts:
  - useAuth() hook returning { user, role, isLoading, signOut }
  - Uses TanStack Query for session caching

Landing page login button:
  - Update existing landing page login/signup buttons
  - Point to /login page
  - If already logged in: redirect to correct dashboard

Role promotion (Super Admin can change any user's role):
  Server action: updateUserRole(userId, newRole)
  Updates users collection + Appwrite user labels

  // MMS-003

  Build complete role-based dashboard layouts for all 5 user roles.

FILES TO CREATE:
src/app/(dashboard)/layout.tsx — checks role → renders correct layout
src/components/layouts/{AdminLayout,ManagerLayout,TeacherLayout,StudentLayout,ParentLayout}.tsx

SHARED COMPONENTS:
src/components/dashboard/Sidebar.tsx — accepts navItems[] prop
src/components/dashboard/Header.tsx — shows user name, avatar, role badge, logout button
src/components/dashboard/RoleBadge.tsx — colored badge per role

SIDEBAR NAV ITEMS PER ROLE:

SUPER ADMIN sidebar:
  Dashboard (overview) | Students (admission, list, fees) | Staff (list, attendance, salary) 
  Teachers | Classes | Attendance (staff + student + NFC) | Fee Management | 
  Expenses | Boarding | Notices | NFC Cards | Reports | Settings

MANAGER sidebar:
  Dashboard | Students | Staff | Attendance | Fee Collection | 
  Expenses | Reports | Notices

TEACHER sidebar:
  Dashboard | My Classes | Student Attendance | My Students | 
  Notice Board | My Profile

STUDENT sidebar:
  Dashboard | My Fees | My Attendance | Notice Board | My Profile

PARENT sidebar:
  Dashboard | My Child's Fees | My Child's Attendance | Notice Board | Contact

DESIGN:
- ShadCN sidebar (use shadcn sidebar component if available, else custom)
- Dark sidebar: zinc-900 bg in dark mode
- Active item: indigo-500 left border + bg-indigo-50/10
- Sidebar collapses to icon-only on mobile (Sheet component)
- Header: white/zinc-900, shows madrasa logo left, user avatar + name + role badge right
- Logout button in header dropdown
- Role badge colors: Super Admin=purple, Manager=blue, Teacher=green, Student=amber, Parent=teal
- Bengali text: "সুপার অ্যাডমিন", "ম্যানেজার", "শিক্ষক", "শিক্ষার্থী", "অভিভাবক"




Phase 2 — Role Dashboards (Overview Pages)


// MMS-004

Build the Super Admin dashboard overview at /dashboard/admin.

File: src/app/(dashboard)/admin/page.tsx

TOP ROW — KPI Cards (4 cards):
1. Total Students (count from students collection, active only) — with "X new this month"
2. Total Staff (count from staff collection, active only)
3. Income This Month (sum of fee_transactions this month) — in ৳ BDT
4. Expenses This Month (sum of expenses this month, approved only)

Each KPI card: ShadCN Card, icon (Lucide), big number, subtitle, trend arrow

CHARTS ROW:
Left (60%): Monthly Income vs Expense — BarChart (Recharts)
  - Last 6 months, two bars per month (green=income, red=expense)
Right (40%): Student breakdown by class — PieChart/Donut

RECENT ADMISSIONS TABLE:
- Last 5 admissions: Photo | Name | Class | Admission Date | Fee Status badge
- "View All" link to /dashboard/admin/students

TODAY'S ATTENDANCE:
- Staff present/absent/late counts
- Student present/absent counts
- "Mark Attendance" quick button

PENDING FEES WIDGET:
- List of 5 students with overdue fees
- Student name | Class | Due amount | "Collect" button

QUICK ACTIONS (floating bar):
- [+ New Admission] [Collect Fee] [Mark Attendance] [Add Expense] [Post Notice]

NOTICE BOARD:
- Last 3 notices with title + date + target audience
- "Post New Notice" button

All data fetched via server actions using Appwrite SDK (server-side)
Use TanStack Query for client-side caching with 5min staleTime
Show skeleton loaders while loading

// MMS-005

Build Teacher, Student, and Parent dashboard overview pages.

FILES:
- src/app/(dashboard)/teacher/page.tsx
- src/app/(dashboard)/student/page.tsx
- src/app/(dashboard)/parent/page.tsx

TEACHER DASHBOARD:
- "Good morning, [Teacher Name]" greeting with Arabic salutation
- My Classes today: list of classes assigned, time, section
- Attendance status: "Have you marked attendance today?" → Yes/No → if No: [Mark Now] button
- My Students count + [View List] link
- Recent notices (last 3)
- Quick links: Mark Attendance | View Students | My Profile

STUDENT DASHBOARD:
- Student profile card: photo + name + class + roll + section + student ID
- Fee Status: how much paid this month, how much due, with colored progress bar
  Green = fully paid, Yellow = partially paid, Red = due
- Attendance this month: % present (circular progress indicator)
- Notice board: last 3 notices
- [Pay Fee] button → opens payment page (parent/admin handles actual payment)

PARENT DASHBOARD:
- Child info card: photo + name + class + roll + attendance % this month
- If multiple children: tab to switch between them
- This month's fee status: paid/due breakdown
- Last 3 notices
- [Contact Teacher/Admin] button → shows contact info
- Attendance calendar: mini calendar highlighting present(green)/absent(red) days

All pages: server-side data fetch with Appwrite admin client
Role guard: redirect to /login if wrong role tries to access
Each page fully responsive, Bengali + English labels



Phase 3 — Student Admission System

// MMS-006

Build the complete Student Admission Form at /dashboard/admin/students/admission.

FILES:
- src/app/(dashboard)/admin/students/admission/page.tsx
- src/components/admission/AdmissionForm.tsx
- src/components/admission/steps/{PersonalInfo,FamilyInfo,AcademicInfo,FeeCollection}.tsx
- src/lib/actions/admission.ts — server actions

MULTI-STEP FORM (ShadCN Steps/Progress):
Show step indicator at top: 1 → 2 → 3 → 4

STEP 1 — Personal Information:
Fields: Full Name (Bengali + English), Father's Name, Date of Birth, Gender (Male/Female),
Photo Upload (Appwrite Storage, preview immediately), Blood Group, 
Nationality (default: Bangladeshi), Birth Certificate No, NID (if adult)

STEP 2 — Family & Contact:
Fields: Father's Name, Father's Occupation, Father's Phone, Father's NID,
Mother's Name, Mother's Phone, Guardian Name (if different), Guardian Phone,
Guardian Relationship, Village/Area, Upazila, District, Division, Post Code

STEP 3 — Academic Information:
Fields: Admission Class (dropdown from classes collection), 
Section (auto-populated from class), Roll No (auto-assign or manual),
Previous School/Madrasa Name, Previous Class, Previous Result/GPA,
Boarding Type (Day Student / Residential / Boarding),
If Boarding: select room preference

STEP 4 — Fee Collection:
Show fee items based on selected class + boarding type:
  ✓ Form Fee: ৳X (checkbox, pre-checked)
  ✓ Admission Fee: ৳X (checkbox, pre-checked)
  ✓ ID Card Fee: ৳X (checkbox)
  □ First Month Fee: ৳X (optional)
  □ Boarding Fee (if boarding): ৳X
Total = sum of checked items
Payment Method: Cash / Bank / bKash / Nagad
Reference No (for non-cash)
Notes field

ON SUBMIT:
1. Upload photo to Appwrite Storage → get URL
2. Generate studentId: MDS-YEAR-XXXX (e.g., MDS-2025-0001)
3. Generate receiptNo: RCP-YEAR-XXXX
4. Insert into students collection
5. Insert into fee_transactions collection (each fee item as JSON array)
6. Show success page with: Student ID, Name, Receipt preview, Print button

Zod schema for each step, RHF for form state
Persist form data in Zustand store between steps (don't lose on back button)

// MMS-007

Build the printable fee receipt system for the Madrasa Management System.

FILES:
- src/components/receipt/FeeReceipt.tsx — the receipt component
- src/components/receipt/PrintButton.tsx — print trigger
- src/app/(dashboard)/admin/receipts/[id]/page.tsx — view any receipt

RECEIPT LAYOUT (A5 size, print-optimized):

┌─────────────────────────────────────────┐
│  [Madrasa Logo]  MADRASA NAME           │
│  Arabic name | Address | Phone          │
│  ─────────────────────────────────────  │
│  FEE RECEIPT          No: RCP-2025-0001 │
│  Date: 15 Jan 2025                      │
│  ─────────────────────────────────────  │
│  Student: Mohammad Rahman               │
│  ID: MDS-2025-0001 | Class: Class 5     │
│  Section: A | Roll: 12                  │
│  Father: Abdul Karim                    │
│  ─────────────────────────────────────  │
│  FEE DETAILS:                           │
│  Form Fee              ৳  200           │
│  Admission Fee         ৳ 1500           │
│  ID Card Fee           ৳  150           │
│  Monthly Fee (Jan)     ৳  800           │
│  ─────────────────────────────────────  │
│  TOTAL PAID:           ৳ 2650           │
│  Method: Cash                           │
│  ─────────────────────────────────────  │
│  Collector Signature    Principal Sign  │
│  __________________    ______________   │
└─────────────────────────────────────────┘

TWO COPIES ON ONE A4:
Print 2 receipts side by side or stacked — one for student, one for office.
Add "Student Copy" / "Office Copy" label on each.

PRINT CSS:
@media print {
  hide sidebar, header, buttons
  show only the receipt component
  A4 paper size, 2 receipts per page
}

"Print Receipt" button → window.print()
"Download PDF" → use html2canvas + jsPDF or use browser print to PDF

RECEIPT VIEWING:
- After any fee collection: auto-show receipt with Print button
- Admin can view any past receipt at /dashboard/admin/receipts/[id]
- Receipts list with search by student name / receipt number / date range

// MMS-008

Build the Monthly Fee Collection System at /dashboard/admin/fees.

FILES:
- src/app/(dashboard)/admin/fees/page.tsx — main fee dashboard
- src/app/(dashboard)/admin/fees/collect/page.tsx — collect fee form
- src/app/(dashboard)/admin/fees/history/page.tsx — fee history
- src/app/(dashboard)/admin/fees/due/page.tsx — due fees list
- src/components/fees/{FeeCollectionForm,FeeHistory,DueFeesList,MonthlyFeeBreakdown}.tsx
- src/lib/actions/fees.ts — server actions

FEE COLLECTION FORM (/fees/collect):
1. Student Search: type name or ID → autocomplete dropdown from Appwrite
2. Show selected student card: photo, name, class, ID, boarding type
3. Fee Period: Month picker (Jan 2025 format) — cannot be future month
4. Monthly Fee Breakdown (checkboxes, pre-filled amounts from fee_structures):
   □ Tuition Fee         ৳ ___
   □ Boarding Fee        ৳ ___ (only if boarding student)
   □ Residential Fee     ৳ ___ (only if residential)
   □ Exam Fee            ৳ ___ (if exam month)
   □ Late Fee            ৳ ___ (if paying after 10th)
   □ Other               ৳ ___ (manual entry)
5. Total Amount: auto-calculated
6. Amount Paying Now: input (for partial payment)
7. Due Amount: auto-calculated (total - paying)
8. Payment Method: Cash / Bank Transfer / bKash / Nagad
9. Transaction Reference (for digital payment)
10. Notes
11. [Collect & Print Receipt] button

PARTIAL PAYMENT:
- Allow paying less than total
- Track dueAmount in fee_transactions
- Show running due in student fee history

FEE DASHBOARD (/fees):
- This Month's Stats: collected ৳X / expected ৳X / pending ৳X
- Daily collection chart (last 7 days, Recharts BarChart)
- Quick collect button
- Recent collections table (last 10): student | amount | method | time | receipt

DUE FEES LIST (/fees/due):
- All students with due amount > 0
- Filter by class, section, month
- Sortable by due amount
- "Collect Now" button per row → opens collection form pre-filled
- Export to PDF / CSV

FEE HISTORY (/fees/history):
- Search by student name / ID / receipt number
- Date range filter, class filter
- Table: Date | Student | Month | Items | Total | Paid | Due | Method | Receipt
- Click row → view receipt

// MMS-009

Build the Fee Structure Management system for Super Admin.

FILE: src/app/(dashboard)/admin/fees/structure/page.tsx
COMPONENT: src/components/fees/FeeStructureManager.tsx

This page allows Super Admin to define fee amounts that auto-populate in collection forms.

FEE STRUCTURE TABLE (ShadCN DataTable):
Columns: Fee Type | Category | Class | Amount | Boarding Type | Active | Actions

CREATE/EDIT FEE STRUCTURE (ShadCN Dialog):
Fields:
- Fee Name (e.g., "Tuition Fee", "Boarding Fee", "Form Fee")
- Fee Type: enum(tuition, boarding, residential, exam, admission, id_card, form, late, other)
- Applicable Class: All Classes / Specific Class (multi-select dropdown)
- Applicable Boarding Type: All / Day / Residential / Boarding
- Amount (৳ BDT)
- Description (notes for what this fee covers)
- Is Active toggle

EXAMPLES TO CREATE BY DEFAULT:
Admission Fees:
  Form Fee: ৳200 (all classes)
  Admission Fee: ৳1500 (all classes)
  ID Card Fee: ৳150 (all classes)

Monthly Fees (by class - can vary):
  Tuition Fee: ৳600-1200 (varies by class)
  Boarding Fee: ৳2000 (boarding students only)
  Residential Fee: ৳1500 (residential only)
  
Exam Fees (per exam):
  Exam Fee: ৳300 (all classes)

The collection form reads from this collection to auto-populate fee items.
Super Admin can update amounts — changes apply to new collections only (old receipts unchanged).


Phase 4 — Expense Management

// MMS-010

Build the Expense Category (Khat) management system.

FILE: src/app/(dashboard)/admin/expenses/categories/page.tsx
COMPONENT: src/components/expenses/KhatManager.tsx
SERVER ACTION: src/lib/actions/expenses.ts

KHAT (EXPENSE CATEGORY) LIST PAGE:
- Grid of Khat cards: name (Bengali + Arabic) | total spent this month | total spent all time | item count | active toggle
- "Add New Khat" button → opens Create dialog
- Each card: click to see all expenses in this Khat

CREATE/EDIT KHAT DIALOG:
Fields:
- Category Name in Bengali (required): e.g., "বেতন"
- Category Name in Arabic (optional): e.g., "مرتب"
- Category Code: auto-generated short code
- Description: what expenses go in this category
- Budget Limit (optional, monthly): set limit, warn when exceeded
- Is Active: toggle
- Color/Icon: pick color for visual identification

DEFAULT KHATS TO CREATE ON FIRST SETUP:
  বেতন (Salary) — Staff salary payments
  বিদ্যুৎ (Electricity) — Electricity bills
  পানি (Water) — Water bills
  রান্নাঘর (Kitchen/Food) — Food and kitchen expenses
  মেরামত (Maintenance) — Building maintenance
  স্টেশনারি (Stationery) — Office and class stationery
  পরিবহন (Transport) — Travel and transport
  চিকিৎসা (Medical) — Medical expenses
  পরীক্ষা (Exam) — Exam related expenses
  আইটি (IT/Tech) — Technology expenses
  অন্যান্য (Other) — Miscellaneous

KHAT SUMMARY CARDS:
Each Khat shows this month's total vs budget limit (progress bar if limit set)
Color: green (under 80% of limit), yellow (80-100%), red (over limit)

SERVER ACTIONS:
createKhat(data) → insert into expense_categories
updateKhat(id, data) → update
deleteKhat(id) → soft delete (only if no expenses linked)
getKhats(workspaceId) → list all active khats with monthly totals

// MMS-011

Build the Expense Entry and Management system.

FILES:
- src/app/(dashboard)/admin/expenses/page.tsx — expense list
- src/app/(dashboard)/admin/expenses/add/page.tsx — add expense
- src/app/(dashboard)/manager/expenses/page.tsx — manager view
- src/components/expenses/{ExpenseForm,ExpenseList,ExpenseApproval}.tsx

ADD EXPENSE FORM:
Fields (React Hook Form + Zod):
- Expense Title: short description
- Khat (Category): dropdown from expense_categories
- Amount: number input (৳ BDT)
- Date: date picker (default today)
- Description: textarea (detailed notes)
- Receipt Image: upload to Appwrite Storage (optional but recommended)
- Payment Method: Cash / Bank / bKash / Other

APPROVAL WORKFLOW:
- Manager/Staff adds expense → status: 'pending'
- Super Admin sees pending expenses with notification badge
- Super Admin: Approve ✓ | Reject ✗ | Request More Info
- On approve: status = 'approved', approvedBy = adminId
- On reject: status = 'rejected', rejectionReason saved
- Manager notified of decision

EXPENSE LIST PAGE:
Filters: Khat | Date range | Status (all/pending/approved/rejected) | Added by
Table: Date | Title | Khat | Amount | Added by | Status | Receipt | Actions
Status badges: pending=yellow, approved=green, rejected=red
Click receipt thumbnail → opens image preview modal
Export filtered list as PDF or CSV

MONTHLY EXPENSE DASHBOARD (cards + chart):
- Total approved expenses this month: ৳X
- Pending approval: ৳X (X items)
- Khat breakdown: horizontal bar chart per Khat
- Biggest expenses this month: top 5 list
- Month-over-month comparison chart

Phase 5 — Attendance System

// MMS-012
Build the Staff Attendance System at /dashboard/admin/attendance/staff.

FILES:
- src/app/(dashboard)/admin/attendance/staff/page.tsx — daily marking
- src/app/(dashboard)/admin/attendance/staff/report/page.tsx — reports
- src/app/(dashboard)/teacher/attendance/page.tsx — teacher self-view
- src/components/attendance/{StaffAttendanceMarker,AttendanceCalendar,MonthlyReport}.tsx
- src/lib/actions/attendance.ts — server actions

DAILY STAFF ATTENDANCE PAGE:
- Date picker at top (default: today, cannot mark future)
- "Already marked today" guard — show edit mode if already marked
- Staff list with quick-mark buttons:
  Each staff row: Photo | Name | Designation | [Present] [Absent] [Late] [Leave]
  Selected status highlighted in color: green/red/yellow/blue
- "Mark All Present" button at top → one click → all marked present
- Time field: check-in time (auto: now, editable)
- Notes field per staff (optional: reason for absence/leave)
- [Save Attendance] button → batch insert to Appwrite

NFC SCAN MODE (toggle button at top):
- Switch to "NFC Mode" → shows NFC scanner area
- Staff scans NFC card → system finds staff by nfc_card_id → marks present with timestamp
- Show success toast: "Rahman Sir - Present marked at 8:45 AM"
- If card not registered: show error "Card not assigned"
- Web NFC API: navigator.nfc (Chrome on Android/NFC reader)

MONTHLY REPORT (/attendance/staff/report):
- Month + Year selector
- Table: Staff Name | Working Days | Present | Absent | Late | Leave | % Attendance
- Color: green if >90%, yellow if 75-90%, red if <75%
- Click staff row → see full month calendar (green/red dots per day)
- Export PDF (one page per staff or summary)
- Individual staff report: attendance calendar + leave history



// MMS-013
Build the complete Student Attendance System.

FILES:
- src/app/(dashboard)/admin/attendance/students/page.tsx
- src/app/(dashboard)/teacher/attendance/mark/page.tsx — teacher marks attendance
- src/components/attendance/{StudentAttendanceMarker,ClassAttendanceView,AbsenteeList}.tsx

TEACHER ATTENDANCE MARKING (Teacher dashboard):
Step 1: Teacher selects their class + section (dropdown, auto-filled from profile)
Step 2: Date (default today)
Step 3: Student list appears with roll-number order:
  Each student: Roll | Photo | Name | [P] [A] [L] [Late]
  P = Present (green), A = Absent (red), L = Leave (blue), Late = yellow
  "Mark All Present" button → then teacher changes exceptions
Step 4: Submit → saves to attendance_students collection

SUPER ADMIN VIEW (/admin/attendance/students):
- Class + Section filter
- Date picker
- See attendance marked by each teacher
- Edit any attendance entry
- "Classes not marked today" alert list

ONE-TIME ATTENDANCE VIEW:
- Toggle: "Today's Attendance Summary"
- Shows: Total students | Present | Absent | Late | Leave | Not marked
- Class-wise breakdown table

CLASS-WISE DASHBOARD:
- Table: Class | Section | Total | Present today | Absent | % | Status (marked/not marked)
- Click class row → see full student list with status

MONTHLY STUDENT REPORT:
- Student search or class filter
- For each student: Name | Roll | Working Days | Present | Absent | Late | %
- Click student → monthly calendar view (green/red per day)
- Students below 75% attendance highlighted in red

NFC FOR STUDENTS:
- Student taps card at gate → auto-marks present with timestamp
- Gate mode: full-screen NFC scan view (for tablet at gate)
- Shows student photo + name + class on successful scan
- Multiple scans same day: only first counts (idempotent)

// MMS-014

Build the NFC Card Management system for Super Admin.

FILES:
- src/app/(dashboard)/admin/nfc/page.tsx — NFC card management
- src/app/(dashboard)/admin/nfc/gate/page.tsx — gate scan mode (full screen)
- src/components/nfc/{NFCCardList,NFCScanner,NFCWriter,GateMode}.tsx
- src/lib/nfc/webNFC.ts — Web NFC API wrapper

IMPORTANT: Web NFC API works in Chrome on Android with physical NFC reader.
For desktop: support USB NFC readers via Web Serial API or WebHID.
Wrap in try/catch with "NFC not supported on this device" fallback.

NFC CARD MANAGEMENT PAGE:

CARD LIST (ShadCN DataTable):
Columns: Card ID | Assigned To | Type (Student/Staff) | Last Scanned | Status | Actions
Filter: All / Students / Staff / Unassigned / Inactive

REGISTER NEW CARD (Dialog):
Step 1: Scan card → reads card UID via Web NFC API
  Show: "Hold NFC card near device..." with animated ripple
  On scan: cardId auto-fills
Step 2: Assign to:
  Type: Student / Staff (radio)
  Search student/staff by name/ID → autocomplete
Step 3: Confirm → save to nfc_cards + update student/staff.nfcCardId

WRITE TO CARD (Dialog):
- Select student or staff
- Click "Write to Card" → hold card near device
- Writes: { id: "MDS-2025-0001", type: "student", name: "Mohammad" }
- Success/error feedback

DEACTIVATE CARD:
- Mark as inactive in nfc_cards
- Student/staff can still be found manually
- Log deactivation

GATE MODE (Full screen, /admin/nfc/gate):
- Black background, large display
- Shows: "READY - Scan Card" with ripple animation
- On successful scan:
  → Show student/staff photo (large), name, class
  → Green screen + checkmark + "PRESENT MARKED"
  → Auto-mark attendance in attendance_students/staff
  → Returns to scanning mode after 3 seconds
- On unregistered card: red screen + "CARD NOT REGISTERED"
- On already scanned today: show info + don't double-mark
- Keep screen on (Screen Wake Lock API)

NFC SCAN LOG:
- Audit table: Date/Time | Card ID | Person | Type | Action | Status



Phase 6 — Staff & Teacher Management


// MMS-015

Build the Staff Management system at /dashboard/admin/staff.

FILES:
- src/app/(dashboard)/admin/staff/page.tsx — staff list
- src/app/(dashboard)/admin/staff/add/page.tsx — add staff form
- src/app/(dashboard)/admin/staff/[id]/page.tsx — staff profile
- src/components/staff/{StaffForm,StaffCard,StaffProfile}.tsx

STAFF REGISTRATION FORM (React Hook Form + Zod):
Personal Info:
  Full Name (Bengali + English) | Date of Birth | Gender | Blood Group
  NID Number | Photo Upload (Appwrite Storage)
  
Contact:
  Mobile (primary + secondary) | Email | Current Address | Permanent Address
  Emergency Contact Name + Phone + Relationship

Employment:
  Designation (e.g., প্রধান শিক্ষক, সহকারী শিক্ষক, আবাসিক শিক্ষক, কর্মচারী)
  Department | Joining Date | Salary (basic) | Employment Type (permanent/contract)
  
Documents (upload to Appwrite Storage):
  NID Copy | Certificates | Previous Employment Letter | References

Class Assignment (for teachers):
  Multi-select: which classes this teacher handles
  Subject(s) taught

STAFF LIST PAGE:
- Search by name, ID, designation
- Filter by: department, designation, status (active/inactive)
- Card grid view: photo + name + designation + phone + status badge
- List view toggle: table with sortable columns
- Click → staff profile page
- "Add Staff" button

STAFF PROFILE PAGE (/staff/[id]):
- Left: photo, name, ID badge, status, NFC card status
- Tabs: Personal Info | Employment | Documents | Attendance | Salary
- NFC card: [Assign Card] or [Replace Card] button
- Employment tab: salary history, joining date, leave balance
- Attendance tab: this month's attendance summary + calendar
- Documents tab: uploaded docs with download links

ACTIVE/INACTIVE:
- Toggle active status with confirmation dialog
- Inactive staff: removed from attendance lists but data preserved

// MMS-016

Build the Staff Policy (Nitimala) and Onboarding system.

FILES:
- src/app/(dashboard)/admin/staff/policies/page.tsx — policy management
- src/app/(dashboard)/teacher/policies/page.tsx — teacher policy view + sign
- src/components/staff/{PolicyEditor,PolicyCard,PolicyAcknowledgement}.tsx

POLICY MANAGEMENT (Super Admin):
Create Policy:
  - Title (Bengali + English)
  - Policy Type: General / Attendance / Code of Conduct / Salary / Academic
  - Content: Rich text editor (using @tiptap/react)
  - Effective Date
  - Requires Re-sign Every: Never / 1 Year / 6 Months
  - Target: All Staff / Teachers Only / Admin Only
  - Is Active toggle
  
Policy List: Title | Type | Created | Signed by X of Y staff | Status
Click → view policy + see who signed / who hasn't

TEACHER POLICY VIEW (/teacher/policies):
- List of policies they must sign
- Signed: green checkmark + date signed
- Unsigned: "Please read and acknowledge" with [Read & Sign] button
- Click [Read & Sign] → opens policy text in Dialog/Sheet
- Scroll to bottom → [I have read and agree to this policy] checkbox → [Sign] button
- Records: policyId, staffId, signedAt, ipAddress in policy_acknowledgements collection

ONBOARDING CHECKLIST (shown on first login for new staff):
□ Profile photo uploaded
□ Documents uploaded (NID, certificates)
□ NFC card assigned
□ General Policy signed
□ Code of Conduct signed
□ Emergency contact added

Progress bar: "Onboarding 3/6 complete"
Until complete: yellow banner at top of teacher dashboard



Phase 7 — Boarding Management

// MMS-017
Build the Boarding Management system at /dashboard/admin/boarding.

FILES:
- src/app/(dashboard)/admin/boarding/page.tsx — boarding overview
- src/app/(dashboard)/admin/boarding/rooms/page.tsx — room management
- src/app/(dashboard)/admin/boarding/students/page.tsx — boarding students
- src/components/boarding/{RoomGrid,RoomCard,AllocationForm,BoardingStudentList}.tsx

BOARDING OVERVIEW PAGE:
Stats cards: Total Rooms | Occupied Rooms | Total Capacity | Current Occupants | Available Beds
Visual room grid: each room = a card showing occupancy bar

ROOM MANAGEMENT (/boarding/rooms):
CREATE ROOM:
  Room Number, Floor (Ground/1st/2nd...), Room Type (Single/Double/Dormitory),
  Total Capacity (number of beds), Bathroom (attached/shared), 
  AC/Non-AC toggle, Notes

ROOM CARD shows:
  Room 101 | Floor 1 | Type: Dorm | 8/12 beds occupied
  Occupancy bar: green (<70%), yellow (70-90%), red (>90%)
  Click → see list of students in this room + bed numbers
  [Manage Room] → add/remove students

ALLOCATE STUDENT TO ROOM:
  Search student (boarding type must be 'boarding')
  Select room → select available bed number
  Start date (admission date or move-in date)
  Monthly boarding fee (auto-filled from fee structure, editable)
  [Allocate] → creates boarding_allocations record

ROOM DETAIL PAGE:
  Room info at top
  Beds list: Bed 1 — Mohammad Rahman (ID, class, since date) [Remove]
  [+ Add Student to this Room] button
  
BOARDING STUDENT LIST:
  All currently allocated boarding students
  Table: Photo | Name | ID | Class | Room | Bed | Since | Monthly Fee | Actions
  [Transfer Room] | [Vacate Room] buttons
  Filter by floor, room, class

BOARDING DASHBOARD WIDGET (in admin dashboard):
  "Boarding Highlights": total boarders, rooms with vacancies, recent allocations


Phase 8 — Academic Management

// MMS-018

Build the Class and Academic Structure management system.

FILES:
- src/app/(dashboard)/admin/academics/classes/page.tsx
- src/components/academics/{ClassCard,ClassForm,SectionManager,StudentPromotion}.tsx

CLASS MANAGEMENT:
CREATE CLASS form:
  Class Name (English): Class 1, Class 2... or Ibtedaee, Mutawassit, Sanawee etc.
  Class Name (Arabic/Bengali): الإبتدائي etc.
  Level (integer, for sorting order)
  Sections: dynamic add sections (A, B, C or প্রথম, দ্বিতীয়)
  Class Teacher: assign from staff list
  Max Capacity per section: number

CLASS LIST: Card grid showing:
  Class name | Total students | Sections | Class teacher | Actions
  Click → class detail: list of sections with student counts
  
SECTION MANAGEMENT:
  Within each class: sections list with: Section name | Student count | Class teacher override
  [Add Section] | [Remove Section] (only if no students enrolled)

STUDENT PROMOTION (end of year):
  Select: Promote students from Class X to Class Y
  Preview: list of students to be promoted
  Exceptions: mark any student to retain (fail/detention)
  [Execute Promotion] → bulk update class field in students collection
  Creates promotion record with date + admin who did it
  Previous class history preserved in student record

CLASS ROSTER:
  /admin/academics/classes/[classId] — full student list for a class
  Table: Roll | Photo | Name | Section | Status | Attendance % | Fees status
  Export class list as PDF (printable format)

// MMS-019

Build the Notice Board and Announcement system.

FILES:
- src/app/(dashboard)/admin/notices/page.tsx — manage notices
- src/components/notices/page.tsx — notice board (all roles)
- src/components/notices/{NoticeCard,NoticeForm,NoticeBoard}.tsx

POST NOTICE (Admin/Manager):
Form:
  Title (Bengali/English) | Body (rich text, TipTap)
  Target: All | Super Admin | Manager | Teachers | Students | Parents
  Priority: Normal | Important | Urgent (changes badge color)
  Is Pinned: toggle (pinned notices appear at top)
  Publish Date: now or schedule future
  Expiry Date: optional (after this date, notice auto-hides)
  Attachment: upload PDF/image to Appwrite Storage (optional)

NOTICE BOARD VIEW (all roles see this):
  Pinned notices section at top (red/orange border)
  Regular notices below in chronological order
  Each notice card: title | date | target badge | priority badge | body preview | attachment link
  Urgent notices: red border + alert icon
  Important: yellow border
  Normal: default card

Read tracking:
  Store readBy: string[] (userIds) in notice
  Unread notices have blue dot indicator
  "Mark as read" on open
  Admin can see "Read by X of Y recipients"

IN-APP NOTIFICATION:
  Bell icon in header shows unread notice count
  Click bell → dropdown of latest unread notices
  Click notice → opens full notice in modal



Phase 9 — Reports & Analytics

// MMS-020

Build the Comprehensive Financial Reports system.

FILE: src/app/(dashboard)/admin/reports/financial/page.tsx
COMPONENT: src/components/reports/FinancialReports.tsx

REPORT TYPES (Tab navigation):

1. MONTHLY SUMMARY:
   Month + Year selector
   Income section: Fee collections (by type) — table + total
   Expense section: by Khat — table + total
   Net: Income - Expense = surplus/deficit
   Chart: Income vs Expense bar chart
   Print/PDF button

2. FEE COLLECTION REPORT:
   Date range selector | Class filter
   Table: Expected Total | Collected | Pending | Collection %
   Breakdown: by class, by month, by fee type
   Defaulters list: students who haven't paid this month

3. EXPENSE REPORT (Khat-wise):
   Date range selector
   Table: Khat Name | Total Expenses | Number of Entries | % of Total
   Pie chart: expense distribution by Khat
   Drill-down: click Khat → see individual expenses

4. STUDENT FEE LEDGER:
   Search student by name/ID
   Full fee history: month by month paid/due table
   Running balance
   Total paid since admission | Total due ever
   Print individual ledger

5. ANNUAL SUMMARY:
   Year selector
   12-month summary table: Income | Expense | Net per month
   Year total: Total Income | Total Expense | Net
   Line chart: monthly trends

EXPORT OPTIONS:
Every report: "Download PDF" button → styled PDF with madrasa logo
Also "Export CSV" for data reports
Print option (print-optimized CSS)

// MMS-021

Build Attendance Reports and Analytics at /dashboard/admin/reports/attendance.

FILES:
- src/app/(dashboard)/admin/reports/attendance/page.tsx
- src/components/reports/{StaffAttendanceReport,StudentAttendanceReport,AttendanceDashboard}.tsx

TABS:

1. STAFF ATTENDANCE REPORT:
   Month + Year selector
   Table per staff:
     Name | Designation | Working Days | Present | Absent | Late | Leave | % | Status
   Color coding: Green >90% | Yellow 75-90% | Red <75%
   Click staff → see full month calendar view
   Export PDF (staff-wise summary)
   
2. STUDENT ATTENDANCE REPORT:
   Month selector + Class + Section filter
   Table: Roll | Name | Working Days | P | A | Late | L | % | Remarks
   Students below 75%: highlighted + "Needs Attention" badge
   Export class-wise attendance sheet (printable, landscape)

3. CLASS-WISE DASHBOARD:
   Today's attendance status: which classes have marked, which haven't
   Class comparison: table with each class's attendance % this month

4. ABSENTEE REPORT:
   Select date → list of all absent students that day
   Group by class
   "Send Notice" bulk action → creates notice targeting those students' parents

5. TREND CHARTS:
   Line chart: school attendance % over last 30 days
   Month-over-month comparison: this month vs last month


Phase 10 — Settings & System Config

// MMS-022

Build the System Settings panel at /dashboard/admin/settings.

FILE: src/app/(dashboard)/admin/settings/page.tsx
TABS: General | Academic | Users | Backup

1. GENERAL SETTINGS (Madrasa Profile):
   Madrasa Name (English + Bengali + Arabic)
   Logo Upload (Appwrite Storage — used in receipts, reports)
   Address (full postal address)
   Phone, Email, Website
   Principal Name
   EIIN Number / Registration Number
   Founding Year
   [Save Changes] → updates settings in a 'settings' Appwrite collection (single document)

2. ACADEMIC SETTINGS:
   Current Academic Year: e.g., 2025-2026
   Academic Year Start Month: January / July etc.
   Working Days: checkboxes for each day (uncheck Friday = off)
   Holidays: add date + holiday name (repeating list)
   Total working days auto-calculated
   Exam Schedule: add exam periods (name + start date + end date)

3. USER MANAGEMENT:
   List all registered users with: name | email | current role | last login | action
   [Change Role] → dropdown: super_admin / manager / teacher / student / parent
   [Deactivate] → sets isActive=false, blocks login
   Only Super Admin can access this tab

4. BACKUP / EXPORT:
   Export buttons:
   [Export All Students] → CSV
   [Export All Staff] → CSV
   [Export Fee Transactions] → CSV (date range)
   [Export Expenses] → CSV (date range)
   Note: "Store backups securely. This exports all data."

5. AUDIT LOG:
   Last 100 system actions: who did what, when
   e.g., "Admin Rahman changed Student Karim's fee status — 2 hours ago"
   Filter by user, action type, date

   // MMS-023
  
  Build the complete Parent Portal at /dashboard/parent.

FILES:
- src/app/(dashboard)/parent/page.tsx — parent home
- src/app/(dashboard)/parent/child/[id]/page.tsx — child detail
- src/app/(dashboard)/parent/fees/page.tsx — fee history
- src/app/(dashboard)/parent/attendance/page.tsx — attendance view
- src/components/parent/{ChildCard,FeeHistory,AttendanceCalendar,ContactForm}.tsx

PARENT HOME:
If parent has multiple children: show child selector cards at top
Select child → all info below updates for that child

CHILD SUMMARY CARD:
Photo | Full Name | Class | Section | Roll | Student ID | Status (Active)
Boarding Type badge | Admission Date

ATTENDANCE TAB:
Current month attendance calendar:
  Each day: ● green (present) | ● red (absent) | ● yellow (late) | ○ holiday/Sunday
Stats: Present X days | Absent Y days | This month %
Warning if below 75%: "Attendance below minimum. Please contact the madrasa."

FEES TAB:
Current month fee status card: Paid / Due with amounts
Fee history table (last 12 months): Month | Total | Paid | Due | Status
Receipt download: PDF button per transaction (same receipt template as admin)
Due fees highlighted in red with "Please pay by [date]"

NOTICES TAB:
Notices targeted at 'parent' or 'all'
Unread badge on tab
Click notice → full text in modal

CONTACT TAB:
Madrasa contact info (from settings)
Form: Subject | Message → sends to manager's inbox (stores in messages collection)
Class teacher contact info (name + phone, if permitted by admin)

// MMS-024

Build the Student Self-Portal at /dashboard/student.

FILES:
- src/app/(dashboard)/student/page.tsx — student home
- src/app/(dashboard)/student/profile/page.tsx
- src/app/(dashboard)/student/fees/page.tsx
- src/app/(dashboard)/student/attendance/page.tsx
- src/components/student/{StudentIDCard,AttendanceView,FeeStatus}.tsx

STUDENT HOME:
Greeting: "আস-সালামু আলাইকুম, [Name]!"
Profile summary card: photo + name + class + roll + student ID
Quick stats: Attendance this month % | Fee status this month | Notices (unread)

DIGITAL ID CARD (printable):
┌──────────────────────────────┐
│  [Madrasa Logo]              │
│  MADRASA NAME                │
│                              │
│  [Photo]  Mohammad Rahman    │
│           Class: 5-A Roll: 12│
│           ID: MDS-2025-0001  │
│           Session: 2025-26   │
│                              │
│  Father: Abdul Karim         │
│  Phone: 01XXXXXXXXX          │
└──────────────────────────────┘
[Print ID Card] → print-optimized CSS, card size

ATTENDANCE PAGE:
Same calendar view as parent portal
Monthly stats + percentage
Can see last 3 months

FEE PAGE:
Current month: paid ৳X | due ৳X
Fee history: last 6 months table
Download receipt PDF button

PROFILE PAGE:
View all personal info (read-only)
[Update Photo] — can update own photo
[Change Password] — via Appwrite auth

NOTICES:
All notices targeted at 'student' or 'all'

// MMS-025

Final polish pass: mobile responsiveness, PWA, and performance optimization.

FILES TO UPDATE/CREATE:
- public/manifest.json — PWA manifest
- src/app/layout.tsx — add PWA meta tags
- next.config.js — optimize images + headers

PWA SETUP:
manifest.json:
{
  "name": "Madrasa Management System",
  "short_name": "MadrasaMS",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#09090b",
  "theme_color": "#6366f1",
  "icons": [...various sizes]
}
Add service worker for offline support (next-pwa or custom)

MOBILE RESPONSIVENESS CHECKLIST:
□ All tables: horizontal scroll on mobile (overflow-x-auto)
□ All forms: single column on mobile, 2-col on desktop
□ Sidebar: Sheet drawer on mobile (already done in layout)
□ Receipt: scales properly on mobile preview
□ NFC gate mode: full-screen works on mobile/tablet
□ Charts (Recharts): responsive container wrapping
□ Date pickers: native date input fallback on mobile
□ Images: next/image with proper sizes prop

MOBILE QUICK ACTIONS (floating):
On mobile, add speed-dial FAB (Floating Action Button):
  Main button: + (indigo, bottom-right)
  Expands to: New Admission | Collect Fee | Mark Attendance | Add Expense

SKELETON LOADERS:
Every page that fetches data must show skeleton while loading:
  Use ShadCN Skeleton component
  Match skeleton shape to actual content (card skeletons, table row skeletons)

PERFORMANCE:
  Dynamic imports for heavy components (charts, rich text editor)
  next/image for all photos
  TanStack Query: staleTime: 5 * 60 * 1000 for relatively static data
  Appwrite query optimization: always use Appwrite's limit() + offset() for pagination
  Never fetch all documents without limit — use cursor-based pagination


  Phase 11 (continued) — Salary & Leave Management

  // MMS-026

  Build Staff Salary Management at /dashboard/admin/staff/salary.

FILES:
- src/app/(dashboard)/admin/staff/salary/page.tsx — salary dashboard
- src/app/(dashboard)/admin/staff/salary/generate/page.tsx — generate monthly salary
- src/components/salary/{SalaryForm,SalarySlip,SalaryHistory}.tsx
- src/lib/actions/salary.ts — server actions

APPWRITE COLLECTION: staff_salaries
Fields: staffId(FK), month(string e.g."2025-01"), basicSalary(number),
  houseAllowance(number), medicalAllowance(number), transportAllowance(number),
  otherAllowance(number), deductionAbsent(number), deductionLoan(number),
  deductionOther(number), grossSalary(number), netSalary(number),
  paymentStatus(enum:pending,paid,partial), paidAmount(number),
  paidDate(datetime,nullable), paymentMethod(enum:cash,bank,bkash),
  transactionRef(string), notes(string), generatedBy(FK-userId),
  createdAt(datetime)

APPWRITE COLLECTION: salary_advances
Fields: staffId(FK), amount(number), requestDate(datetime),
  reason(string), status(enum:pending,approved,rejected,repaid),
  approvedBy(FK-userId,nullable), repaidMonth(string,nullable), createdAt(datetime)

GENERATE MONTHLY SALARY PAGE:
  1. Select Month + Year
  2. Show all active staff with auto-calculated fields:
     - Basic salary (from staff.salary field)
     - Absent deduction: (basic/working_days) × absent_days (from attendance)
     - Manual fields: allowances, other deductions
  3. "Calculate All" button → auto-fills deductions from attendance data
  4. Review table: Staff | Basic | Allowances | Deductions | Net | Status
  5. Edit individual rows inline
  6. [Generate Salary Sheet] → bulk creates staff_salaries records

SALARY PAYMENT:
  Mark salary as paid: payment method + reference + date
  Partial payment support with due tracking

PRINTABLE SALARY SLIP:
┌────────────────────────────────┐
│  [Logo] MADRASA NAME           │
│  SALARY SLIP — January 2025    │
│  ─────────────────────────── │
│  Name: Mohammad Rahman         │
│  ID: STF-001  Desig: Teacher   │
│  ─────────────────────────── │
│  EARNINGS:           AMOUNT    │
│  Basic Salary        ৳ 8,000   │
│  House Allowance     ৳ 1,500   │
│  Medical Allowance   ৳   500   │
│  ─────────────────────────── │
│  DEDUCTIONS:                   │
│  Absent (2 days)    -৳   615   │
│  Advance Recovery   -৳   500   │
│  ─────────────────────────── │
│  NET SALARY:        ৳ 8,885    │
│  Payment: Cash | Date: 31 Jan  │
│  ─────────────────────────── │
│  Signature: __________         │
└────────────────────────────────┘
[Print Slip] button per staff row
ADVANCE SALARY:
  Staff requests → Manager/Admin approves → amount tracked → deducted from future salary
  Advance history per staff with repayment status



// MMS-027

Build the Leave Management System.

FILES:
- src/app/(dashboard)/admin/leave/page.tsx — leave management (admin)
- src/app/(dashboard)/teacher/leave/page.tsx — leave request (teacher/staff)
- src/components/leave/{LeaveRequestForm,LeaveApproval,LeaveCalendar,LeaveBalance}.tsx
- src/lib/actions/leave.ts

APPWRITE COLLECTION: leave_requests
Fields: staffId(FK), leaveType(enum:casual,sick,annual,earned,without_pay,hajj),
  startDate(date), endDate(date), totalDays(integer), reason(string),
  attachmentUrl(string,nullable), status(enum:pending,approved,rejected,cancelled),
  approvedBy(FK-userId,nullable), approvalNote(string,nullable),
  appliedAt(datetime), updatedAt(datetime)

APPWRITE COLLECTION: leave_balances
Fields: staffId(FK), year(integer), casualTotal(int,default:10), casualUsed(int,default:0),
  sickTotal(int,default:14), sickUsed(int,default:0),
  annualTotal(int,default:15), annualUsed(int,default:0),
  earnedTotal(int), earnedUsed(int,default:0)

STAFF LEAVE REQUEST FORM (/teacher/leave):
  Leave Type: Casual / Sick / Annual / Earned / Without Pay
  Start Date + End Date (auto-calculates total days, excludes Fridays/holidays)
  Reason textarea
  Attachment upload (medical certificate for sick leave)
  Leave Balance shown: "Casual: 7/10 remaining"
  [Submit Request] → status: pending, notification to admin

ADMIN LEAVE APPROVAL (/admin/leave):
  Pending requests list: Staff | Type | Dates | Days | Reason | Actions
  [Approve] with optional note | [Reject] with reason (required)
  On approve: update leave_balances.used field
  Approved: sent notification to staff

LEAVE CALENDAR:
  Monthly calendar view
  Each day: chips showing who is on approved leave
  Color per leave type: sick=red, casual=blue, annual=green
  "Today's Absent Due to Leave": list

LEAVE BALANCE REPORT:
  Table: Staff Name | Casual (used/total) | Sick (used/total) | Annual (used/total)
  Reset balances: [New Year Reset] button (resets all balances for new year)
  Staff with 0 remaining casual leave flagged in red


  Phase 12 (continued) — Exam & Results

// MMS-028
 
Build the Exam and Result Management system.

FILES:
- src/app/(dashboard)/admin/academics/exams/page.tsx
- src/app/(dashboard)/teacher/results/page.tsx — teacher enters marks
- src/app/(dashboard)/student/results/page.tsx — student views results
- src/components/exams/{ExamForm,MarkEntry,ResultSlip,MeritList}.tsx

APPWRITE COLLECTIONS:

exams:
  name(string), type(enum:monthly_test,midterm,annual,special),
  class(string), session(string e.g."2025-26"),
  startDate(date), endDate(date), resultPublished(bool,default:false),
  createdBy(FK-userId), createdAt(datetime)

subjects:
  name(string), arabicName(string), class(string),
  fullMarks(integer), passMarks(integer), isOptional(bool),
  teacherId(FK-staffId), sortOrder(integer)

exam_results:
  examId(FK), studentId(FK), subjectId(FK),
  theoryMarks(number), practicalMarks(number,nullable),
  totalMarks(number), grade(string), gradePoint(number),
  isAbsent(bool,default:false), createdAt(datetime)

EXAM CREATION (Admin):
  Name: e.g., "প্রথম সাময়িক পরীক্ষা ২০২৫"
  Type: Monthly Test / Midterm / Annual
  Class: select class
  Start + End date
  Subjects auto-loaded from subjects collection for that class

MARK ENTRY (Teacher — /teacher/results):
  Select: Exam → Subject → Class → Section
  Student list appears (roll order)
  Each student: Theory marks input + Practical marks (if applicable) + Absent checkbox
  [Save Marks] → batch upsert to exam_results
  "Already entered" guard — show edit mode if marks exist

GRADE SYSTEM:
  A+ = 80-100, GPA 5.0
  A  = 70-79,  GPA 4.0
  A- = 60-69,  GPA 3.5
  B  = 50-59,  GPA 3.0
  C  = 40-49,  GPA 2.0
  D  = 33-39,  GPA 1.0
  F  = 0-32,   GPA 0.0
  Auto-calculate on mark entry

RESULT SLIP (printable per student):
┌──────────────────────────────────┐
│ [Logo] MADRASA NAME              │
│ RESULT CARD — Midterm 2025       │
│ ──────────────────────────────── │
│ Name: Mohammad | Class: 5-A      │
│ Roll: 12 | ID: MDS-2025-0001     │
│ ──────────────────────────────── │
│ Subject      Full  Got  Grade    │
│ Arabic        100   85   A+      │
│ Bengali       100   72   A       │
│ English       100   65   A-      │
│ Mathematics   100   58   B       │
│ ──────────────────────────────── │
│ Total: 400/400 | GPA: 4.25       │
│ Position: 3rd in class           │
│ RESULT: PASSED                   │
│ ──────────────────────────────── │
│ Class Teacher Sig | Principal Sig│
└──────────────────────────────────┘

MERIT LIST:
Class-wise sorted by total marks → auto-assign positions 1st, 2nd, 3rd...
Ties: same position, next position skipped
Export merit list PDF: class + position + name + total + GPA


Phase 13 (continued) — Communication & Library

// MMS-029

Build the Internal Messaging and Notification system.

FILES:
- src/app/(dashboard)/admin/messages/page.tsx
- src/components/messages/{InboxView,ComposeMessage,MessageThread}.tsx
- src/lib/actions/messages.ts
- src/lib/notifications/sms.ts — SMS gateway client (optional)

APPWRITE COLLECTION: messages
Fields: senderId(FK-userId), recipientId(FK-userId,nullable),
  recipientRole(string,nullable), subject(string), body(string),
  isRead(bool,default:false), isBroadcast(bool,default:false),
  targetRoles(json,nullable), attachmentUrl(string,nullable),
  sentAt(datetime), parentMessageId(FK-messages,nullable)

APPWRITE COLLECTION: notification_logs
Fields: type(string), targetUserId(FK,nullable), targetRole(string,nullable),
  channel(enum:in_app,sms,email), message(string), status(enum:sent,failed,pending),
  triggeredBy(string), sentAt(datetime)

COMPOSE MESSAGE (Admin/Manager):
  To: Specific person (search) OR broadcast to role (All Teachers / All Parents / All Students)
  Subject
  Body (rich text light — bold, italic, lists)
  Attachment (optional)
  [Send] button

INBOX VIEW:
  Left: message list (sender, subject, time, unread dot)
  Right: message thread (conversation style)
  Tabs: Inbox | Sent | Broadcast
  Filter: All / Unread / From Teacher / From Admin

AUTO-TRIGGERED NOTIFICATIONS (BullMQ-equivalent: Appwrite Functions or cron):

1. FEE DUE REMINDER:
   - Every month on the 25th: check students with fee_transactions where status != 'paid' for current month
   - Create in_app notification for each student/parent
   - If SMS enabled: send SMS via gateway

2. ATTENDANCE ALERT TO PARENTS:
   - After teacher marks attendance: any absent student → create notification for their parent
   - In-app notification: "Your child was absent today (15 Jan 2025)"

3. NOTICE ALERT:
   - When new notice posted: create in_app notification for target roles

SMS GATEWAY (optional — can disable if not needed):
  Use bdbulksms.com API or sslcommerz SMS API
  src/lib/notifications/sms.ts:
    sendSMS(phone: string, message: string) → calls SMS API
  Toggle in settings: Enable/Disable SMS notifications
  SMS template for fee reminder:
    "প্রিয় অভিভাবক, [Student Name] এর [Month] মাসের বেতন বাকি আছে। অনুগ্রহ করে পরিশোধ করুন। - মাদ্রাসা"

IN-APP NOTIFICATION BELL:
  Already built in Header — reads from notifications collection
  Real-time via Appwrite Realtime subscription:
    const unsubscribe = client.subscribe('databases.db.collections.notifications.documents', ...)
    Auto-update bell badge on new notification

// MMS-030

Build a Basic Library Management system at /dashboard/admin/library.

FILES:
- src/app/(dashboard)/admin/library/page.tsx — library dashboard
- src/app/(dashboard)/admin/library/books/page.tsx — book catalog
- src/app/(dashboard)/admin/library/issues/page.tsx — issue/return
- src/components/library/{BookForm,BookList,IssueForm,ReturnForm}.tsx

APPWRITE COLLECTIONS:

library_books:
  title(string), titleArabic(string,nullable), author(string),
  category(string), isbn(string,nullable), totalCopies(integer),
  availableCopies(integer), publishYear(integer,nullable),
  language(enum:arabic,bengali,english,urdu,other),
  location(string, shelf/rack no), coverImageUrl(string,nullable),
  isActive(bool), createdAt(datetime)

library_issues:
  bookId(FK), issuedTo(FK-userId), issuedToType(enum:student,staff),
  issueDate(date), dueDate(date), returnDate(date,nullable),
  status(enum:issued,returned,overdue), fineAmount(number,default:0),
  finePaid(bool,default:false), issuedBy(FK-userId), createdAt(datetime)

LIBRARY DASHBOARD:
  Stats: Total Books | Total Copies | Issued Today | Overdue Books | Members
  Quick actions: [Issue Book] [Return Book] [Add Book]
  Overdue books alert list (sorted by days overdue)

BOOK CATALOG (/library/books):
  Search by title, author, category
  Filter by language, category, availability
  Book card: cover image | title | author | available/total copies | category
  [Issue] button if copies available
  [Add New Book] → form

ISSUE BOOK FORM (/library/issues):
  Step 1: Search and select book (shows available copies)
  Step 2: Search student or staff by name/ID
  Step 3: Issue Date (auto: today) | Due Date (default: 14 days, configurable)
  [Issue] → decrements availableCopies in books
  Print issue slip (simple)

RETURN BOOK:
  Search by student/staff name OR book title
  Shows currently issued books for that person
  Select book → [Return]
  Auto-calculate fine: ৳2/day after due date (configurable in settings)
  Collect fine → mark finePaid=true
  Increments availableCopies in books

OVERDUE REPORT:
  All issued books past due date
  Columns: Book | Issued To | Issue Date | Due Date | Days Overdue | Fine
  "Send Reminder" button → creates in-app notification to borrower


Phase 14 (continued) — Advanced Admin Features

// MMS-031

Build Student Document Management and ID Card system.

FILES:
- src/app/(dashboard)/admin/students/[id]/documents/page.tsx
- src/app/(dashboard)/admin/id-cards/page.tsx — bulk ID card printing
- src/components/documents/{DocumentManager,StudentIDCard,AdmitCard,TransferCertificate}.tsx

APPWRITE COLLECTION: student_documents
Fields: studentId(FK), docType(enum:birth_cert,nid,previous_marksheet,
  photo,medical,transfer_cert,other), docName(string),
  fileUrl(string), fileSize(integer), uploadedBy(FK-userId),
  verificationStatus(enum:pending,verified,rejected),
  verifiedBy(FK-userId,nullable), notes(string,nullable), createdAt(datetime)

DOCUMENT MANAGER (per student, tab in student profile):
  Upload document: select type → upload file (PDF/image) → Appwrite Storage
  Document list: type | filename | upload date | verification status | actions
  Verification: Admin can mark as Verified ✓ or Rejected ✗ with note
  Download any document
  Delete with confirmation

STUDENT ID CARD (printable, CR80 card size = 85.6mm × 54mm):
┌──────────────────────────────────┐
│[Logo] [MADRASA NAME]             │
│       Student Identity Card      │
│                                  │
│ [PHOTO]  Name: Mohammad Rahman   │
│ 3x4 cm   Class: Class 5, Sec A   │
│          Roll: 12                │
│          ID: MDS-2025-0001       │
│          Blood: B+               │
│                                  │
│ Father: Abdul Karim              │
│ Phone: 01XXXXXXXXX               │
│ Session: 2025-2026               │
└──────────────────────────────────┘
Back side: Madrasa address + rules + lost card instructions

BULK ID CARD PRINTING (/admin/id-cards):
  Select Class + Section (or "All")
  Preview: grid of ID cards (2x5 per A4 page)
  [Print All] → @media print shows only cards in 2-per-row grid on A4
  [Print Selected] → checkboxes on each card

EXAM ADMIT CARD:
  Select exam → generate admit cards for all students
  Shows: student photo, name, ID, class, roll, exam schedule table (date/subject/time/room)
  [Print Class-wise] → bulk print

TRANSFER CERTIFICATE:
  Select student → fill TC details (reason, last class, date, conduct: Good/Excellent)
  Print TC: official format with madrasa seal area + principal signature line


// MMS-032

Build the Manager Dashboard and daily operations view at /dashboard/manager.

FILES:
- src/app/(dashboard)/manager/page.tsx — manager home
- src/app/(dashboard)/manager/fees/page.tsx — fee collection access
- src/app/(dashboard)/manager/expenses/page.tsx — expense management
- src/components/manager/{DailyCashSummary,PendingApprovals,QuickActions}.tsx

Manager role has access to:
✓ Fee collection (can collect fees, same as admin fee pages)
✓ Expense entry + approval
✓ View student info (read-only)
✓ Notice management (post + manage)
✗ User role management (super admin only)
✗ System settings (super admin only)
✗ Salary management (super admin only)
✗ NFC card management (super admin only)

MANAGER DASHBOARD:

TODAY'S CASH SUMMARY (most important widget):
  ┌─────────────────────────────────┐
  │  Today's Cash Flow              │
  │  Fee Collected:  ৳ 12,500      │
  │  Expenses Paid:  ৳  3,200      │
  │  Net Cash Today: ৳  9,300  ✓  │
  └─────────────────────────────────┘
  Breakdown: Cash | bKash | Bank (separate totals)
  [View Details] → full today's transactions

PENDING APPROVALS widget:
  Expenses pending approval: X items, ৳ total
  [Review Now] → expense approval page

TODAY'S ATTENDANCE widget:
  Staff: X present / Y total | Students: X present / Y total
  Classes not marked yet: list with [Remind Teacher] button

FEE COLLECTION SHORTCUT:
  [Collect Fee] big button → same form as admin fee collection
  Recent collections today: student | amount | time (last 5)

NOTICE BOARD MANAGEMENT:
  Quick compose notice form (title + body + target + [Post])
  Recent notices posted by anyone

STAFF ON LEAVE TODAY:
  List of staff on approved leave today
  Affects: "Who should cover their class?" alert if teacher on leave

QUICK REPORTS (limited):
  [Today's Collection Report] → PDF of today's fee transactions
  [This Week Summary] → income + expense for current week
  [Defaulters This Month] → students with unpaid fees

// MMS-033

Build the Class Timetable/Schedule system.

FILES:
- src/app/(dashboard)/admin/academics/timetable/page.tsx
- src/app/(dashboard)/teacher/timetable/page.tsx — teacher's own schedule
- src/components/timetable/{TimetableGrid,PeriodEditor,TeacherSchedule}.tsx

APPWRITE COLLECTIONS:

period_config:
  periodNo(integer 1-8), startTime(string e.g."08:00"), endTime(string),
  name(string e.g."1st Period"), isBreak(bool), createdAt(datetime)

timetable_slots:
  classId(FK), section(string), dayOfWeek(enum:saturday,sunday,monday,tuesday,wednesday,thursday),
  periodNo(integer), subjectId(FK), teacherId(FK-staffId),
  room(string,nullable), session(string), createdAt(datetime)

substitutions:
  date(date), originalTeacherId(FK), substituteTeacherId(FK),
  classId(FK), section(string), periodNo(integer), reason(string),
  createdBy(FK-userId), createdAt(datetime)

TIMETABLE BUILDER (/admin/academics/timetable):
  Select: Class + Section + Session
  Grid view: Days (columns: Sat-Thu) × Periods (rows: 1st-8th)
  Each cell: [Subject - Teacher Name] or [Break] or [Empty]
  Click cell → opens period assignment dialog:
    Subject dropdown (from subjects for this class)
    Teacher dropdown (from staff, shows their availability for this slot)
    Room number (optional)
  [Save Timetable] → bulk upsert timetable_slots

TEACHER SCHEDULE VIEW (/teacher/timetable):
  Shows teacher's own weekly schedule:
  Mon: Period 1 Class 5A (Arabic) | Period 3 Class 6B (Arabic)
  Tue: Period 2 Class 5A (Arabic) | Free | Free...
  Highlighted: today's schedule

PRINT TIMETABLE:
  Class-wise: full week grid → printable A4 landscape
  Teacher-wise: each teacher's schedule → printable

SUBSTITUTION:
  When teacher is on leave → admin/manager sees alert
  [Assign Substitute] → select available teacher for each period
  Substitute teacher gets in-app notification
  Substitution log maintained

// MMS-034

Build Bulk Operations and Data Import/Export system.

FILES:
- src/app/(dashboard)/admin/tools/page.tsx — admin tools hub
- src/app/(dashboard)/admin/tools/import/page.tsx — import students
- src/app/(dashboard)/admin/tools/export/page.tsx — export data
- src/components/tools/{BulkImport,BulkExport,ImportValidator}.tsx
- src/lib/utils/excel.ts — xlsx helper functions

Install: xlsx (SheetJS)

BULK STUDENT IMPORT:
Step 1: [Download Template] → generates sample Excel file with columns:
  Name | FatherName | Class | Section | DOB | Gender | Phone | GuardianPhone | Address | BoardingType

Step 2: Upload filled Excel
Step 3: VALIDATION (show before importing):
  ✓ Valid rows count
  ✗ Error rows: row number | column | error (e.g., "Row 5: Class not found")
  Show preview table of valid rows

Step 4: [Import Valid Rows] → creates students in Appwrite
  Progress bar: "Importing 47 of 150..."
  Result: "145 imported successfully, 5 skipped (errors)"

BULK FEE GENERATION:
  Select: Month + Year + Class (or All Classes)
  Preview: X students will get fee records created
  Fee breakdown: tuition + boarding (by student type)
  [Generate Fees] → bulk creates fee_transactions with status 'due'
  Shows: generated X, skipped Y (already exists for this month)

EXPORT OPTIONS (all use SheetJS):
  [Export Students] — filters: class, status → Excel with all student fields
  [Export Attendance] — month/class/section → Excel (student vs days grid)
  [Export Fee Collection] — date range → Excel with all transaction details
  [Export Expenses] — date range + khat filter → Excel
  [Export Staff List] → Excel

PDF EXPORTS (use html2canvas or browser print):
  Class List → A4 portrait, formatted table
  Attendance Sheet → A4 landscape, blank grid for manual marking
  Fee Due List → formatted list

DUPLICATE DETECTION:
  [Find Duplicates] tool → finds students with same name + DOB or same phone
  Shows potential duplicates side by side
  [Merge] or [Ignore] option per pair

// MMS-035

Build Advanced System Settings, Audit Log, and Health Monitor.

FILES:
- src/app/(dashboard)/admin/settings/audit/page.tsx
- src/app/(dashboard)/admin/settings/health/page.tsx
- src/app/(dashboard)/admin/settings/year-transition/page.tsx
- src/components/settings/{AuditLog,SystemHealth,YearTransition}.tsx

APPWRITE COLLECTION: audit_logs
Fields: userId(FK), userEmail(string), userRole(string),
  action(string e.g."STUDENT_ADMITTED","FEE_COLLECTED","ROLE_CHANGED"),
  targetType(string e.g."student","fee","user"),
  targetId(string), targetName(string),
  oldValue(json,nullable), newValue(json,nullable),
  ipAddress(string), userAgent(string), createdAt(datetime)

Call createAuditLog() in every important server action:
  createAuditLog({ action: "FEE_COLLECTED", targetType: "fee_transaction", 
    targetId: transactionId, targetName: "Monthly fee - Mohammad", newValue: { amount, month } })

AUDIT LOG PAGE (/settings/audit):
  Filter: user, action type, date range, target type
  Table: Time | User | Action | Target | Details
  Action colored badges: CREATE=green, UPDATE=blue, DELETE=red, LOGIN=gray
  Click row → see full details modal with old/new values (JSON diff)
  Export filtered log as CSV

SYSTEM HEALTH PAGE (/settings/health):
  Appwrite project stats (via Appwrite API):
    Database: X documents total | Storage: X MB used / Y MB total
    Users: X total registered
    Recent API calls count
  App-level stats:
    Total students | Total staff | Total fee transactions | Total expenses
  Quick DB stats: each collection document count

ACADEMIC YEAR TRANSITION WIZARD:
  Step 1: Review — show current year stats (students, staff, finances)
  Step 2: Promote Students — run bulk promotion (with exceptions)
  Step 3: Reset Balances — reset leave balances, attendance records marked for archiving
  Step 4: New Year Config — set new academic year in settings
  Step 5: Confirm — execute transition
  
  This is IRREVERSIBLE — show strong warning with confirmation text input:
  "Type 'CONFIRM 2025-2026' to proceed"

GRADUATED STUDENT ARCHIVING:
  After year transition: option to archive highest class students as "Graduated"
  Archived students: data preserved, removed from active lists
  Can be viewed in "Alumni" section

SESSION MANAGEMENT:
  List of active sessions for current admin user
  Device + browser + login time + IP
  [Revoke] specific session
  [Revoke All Other Sessions] button


