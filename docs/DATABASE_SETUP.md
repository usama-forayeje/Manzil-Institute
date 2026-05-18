# 🏫 Student Admission System — Complete Design Guide
## Manzil International Institute Management System

> **Version:** 1.0 | **Date:** April 2026  
> **Scope:** Multi-Section Student Management, Fee System, NFC Attendance  
> **Tech:** Next.js 15 · Appwrite · TypeScript · React Hook Form · Zod

---

## 📋 Table of Contents

1. [Institution Structure Overview](#1-institution-structure-overview)
2. [Database Collections (12 total)](#2-database-collections)
3. [Fee System Design](#3-fee-system-design)
4. [Admission Form Design](#4-admission-form-design)
5. [NFC Attendance System](#5-nfc-attendance-system)
6. [Environment Variables](#6-environment-variables)
7. [File Structure](#7-file-structure)
8. [Step-by-Step Implementation Plan](#8-implementation-plan)

---

## 1. Institution Structure Overview

### তিনটি বিভাগ (Sections/Departments)

```
Manzil International Institute
├── 🕌 MADRASA SECTION
│   ├── Classes: Ibtedaee 1–5, Mutawassit 1–4, Sanawee 1–3, Alim, Fazil, Kamil
│   ├── Medium: Arabic + Bengali
│   └── Boarding Type: Day / Residential / Full Boarding
│
├── 📚 GENERAL / SCHOOL SECTION
│   ├── Classes: Play, Nursery, KG, Class 1–10, SSC, HSC
│   ├── Medium: Bengali + English
│   └── Boarding Type: Day / Residential
│
└── 💻 TECHNICAL SECTION
    ├── Courses: Computer, Tailoring, Electrician, etc.
    ├── Duration: 3 months / 6 months / 1 year
    └── Boarding Type: Day only (usually)
```

### Multi-Enrollment Rule

একজন ছাত্র একই সাথে **তিনটি বিভাগেই** ভর্তি হতে পারে:

```
Example Student: Mohammad Rahim
├── Madrasa:  Mutawassit 3rd Year  → একটি student_enrollments record
├── School:   Class 8              → আরেকটি student_enrollments record
└── Technical: Computer Diploma   → আরেকটি student_enrollments record
```

**Design Decision:** একটি `students` collection (personal info) + আলাদা `student_enrollments` collection (class/section assignment)। এই separation এ একজন student এর personal data একবার save হবে, enrollment বারবার হতে পারবে।

---

## 2. Database Collections

### সম্পূর্ণ তালিকা

| # | Collection | Purpose |
|---|-----------|---------|
| 01 | `students` | Personal & family info |
| 02 | `student_enrollments` | Class/Section assignment per department |
| 03 | `departments` | Madrasa / School / Technical config |
| 04 | `classes` | Class definitions per department |
| 05 | `fee_types` | Fee category master (global) |
| 06 | `fee_structures` | Fee amounts per class/boarding/department |
| 07 | `fee_invoices` | Per-student monthly/annual invoice |
| 08 | `fee_payments` | Actual payment records + receipts |
| 09 | `exam_schedules` | Exam definitions (monthly/final/board) |
| 10 | `exam_fees` | Exam-specific fee linkage |
| 11 | `nfc_cards` | Card → student/staff mapping |
| 12 | `attendance_students` | Daily attendance records |

---

### 📁 Collection 01: `students`

**ENV:** `NEXT_PUBLIC_COL_STUDENTS`  
**Purpose:** একবার personal info save হবে। Multiple enrollment এ reuse হবে।

```
ATTRIBUTES:
─────────────────────────────────────────────────────────────
studentId          String(20)   REQUIRED  UNIQUE   MDS-2026-0001
userId             String(50)   optional           Link to auth user
admissionNo        String(20)   REQUIRED  UNIQUE   ADM-2026-0001

── Personal ──────────────────────────────────────────────────
nameEn             String(150)  REQUIRED
nameBn             String(150)  REQUIRED
fatherNameBn       String(150)  REQUIRED
fatherNameEn       String(150)  optional
motherNameBn       String(150)  REQUIRED
motherNameEn       String(150)  optional
dateOfBirth        Datetime     REQUIRED
gender             String(10)   REQUIRED           male/female
bloodGroup         String(5)    optional           A+/A-/B+/B-/AB+/AB-/O+/O-/unknown
nationality        String(50)   optional  'বাংলাদেশী'
religion           String(20)   optional           islam/hinduism/other
birthCertNo        String(50)   optional
nidNumber          String(20)   optional           (for adult students)
photo              String(500)  optional           R2 Storage URL
isHafiz            Boolean      optional  false

── Contact ──────────────────────────────────────────────────
phonePrimary       String(20)   optional           student's phone
guardianPhone      String(20)   REQUIRED           father/guardian
whatsappNo         String(20)   optional
email              String(200)  optional

── Address ──────────────────────────────────────────────────
presentVillage      String(200)  REQUIRED
presentThana        String(100)  REQUIRED
presentDistrict     String(100)  REQUIRED
presentDivision     String(50)   REQUIRED
presentUnion        String(100)  optional
presentPostOffice   String(100)   optional
presentPostCode     String(10)   optional

permanentVillage    String(200)  optional
permanentThana      String(100)  optional
permanentDistrict   String(100)  optional
permanentDivision   String(50)   optional
permanentUnion      String(100)  optional
permanentPostOffice String(100)   optional
permanentPostCode   String(10)   optional

── Status ──────────────────────────────────────────────────
status             Enum         REQUIRED  'active'   active/inactive/graduated/transferred
admissionDate      Datetime     REQUIRED
previousSchoolName String(200)  optional
previousClassName  String(50)   optional
previousResult     String(50)   optional           GPA or marks
transferCertificateUrl String(500)  optional       R2 Storage URL

── Meta ────────────────────────────────────────────────────
notes              String(1000) optional
createdAt          Datetime     REQUIRED
updatedAt          Datetime     optional
createdBy          String(50)   optional           admin userId
─────────────────────────────────────────────────────────────

INDEXES:
  studentId      → UNIQUE
  admissionNo    → UNIQUE
  guardianPhone  → KEY
  nfcCardId      → KEY
  status         → KEY
  admissionDate  → KEY
```

---

### 📁 Collection 02: `student_enrollments`

**ENV:** `NEXT_PUBLIC_COL_STUDENT_ENROLLMENTS`  
**Purpose:** একজন student এর একটি department এ একটি enrollment। Multiple departments = multiple rows।

```
ATTRIBUTES:
─────────────────────────────────────────────────────────────
enrollmentId       String(20)   REQUIRED  UNIQUE   ENR-2026-0001
studentId          String(20)   REQUIRED           → students.studentId
departmentId       String(20)   REQUIRED           → departments.$id
classId            String(20)   REQUIRED           → classes.$id
section            String(10)   optional           A / B / প্রথম / দ্বিতীয়
rollNo             String(20)   optional           Auto-assign or manual
session            String(10)   REQUIRED           2026-2027
shift              String(10)   optional           morning/day/evening
boardingType       String(15)   REQUIRED           day/residential/boarding
status             String(15)   REQUIRED  'active'  active/inactive/promoted/transferred
enrollmentDate     Datetime     REQUIRED
promotedFrom       String(20)   optional           Previous enrollmentId
notes              String(500)  optional
createdAt          Datetime     REQUIRED
─────────────────────────────────────────────────────────────

INDEXES:
  enrollmentId              → UNIQUE
  studentId                 → KEY
  classId + section         → KEY (composite)
  studentId + departmentId  → KEY (composite) ← একজন student এর same dept এ duplicate check
  status                    → KEY
  session                   → KEY
```

---

### 📁 Collection 03: `departments`

**ENV:** `NEXT_PUBLIC_COL_DEPARTMENTS`  
**Purpose:** 3টি বিভাগের config।

```
ATTRIBUTES:
─────────────────────────────────────────────────────────────
name               String(100)  REQUIRED           Madrasa Section
nameBn             String(100)  REQUIRED           মাদ্রাসা বিভাগ
nameAr             String(100)  optional           قسم المدرسة
code               String(10)   REQUIRED  UNIQUE   MDR / SCH / TEC
type               String(20)   REQUIRED           madrasa/school/technical
medium             String(50)   optional           arabic+bengali / bengali+english
hasBoardingFee     Boolean      REQUIRED  true
hasExamFee         Boolean      REQUIRED  true
hasMonthlyFee      Boolean      REQUIRED  true
isActive           Boolean      REQUIRED  true
sortOrder          Integer      optional  0
createdAt          Datetime     REQUIRED
─────────────────────────────────────────────────────────────

DEFAULT DATA:
  { code: "MDR", name: "Madrasa Section",   nameBn: "মাদ্রাসা বিভাগ",  type: "madrasa",   sortOrder: 1 }
  { code: "SCH", name: "School Section",    nameBn: "স্কুল বিভাগ",      type: "school",    sortOrder: 2 }
  { code: "TEC", name: "Technical Section", nameBn: "টেকনিক্যাল বিভাগ", type: "technical", sortOrder: 3 }
```

---

### 📁 Collection 04: `classes`

**ENV:** `NEXT_PUBLIC_COL_CLASSES`  
**Purpose:** প্রতিটি department এর class list।

```
ATTRIBUTES:
─────────────────────────────────────────────────────────────
name               String(100)  REQUIRED           Class 5 / Mutawassit 3
nameBn             String(100)  optional           শ্রেণী ৫
nameAr             String(100)  optional           الصف الخامس
departmentId       String(20)   REQUIRED           → departments.$id
departmentCode     String(10)   REQUIRED           MDR/SCH/TEC
level              Integer      REQUIRED           Sort order (1,2,3...)
sections           String(500)  optional  '["A","B"]'  JSON array
classTeacherId     String(50)   optional           → staff.staffId
capacity           Integer      optional  40
duration           String(50)   optional           For Technical: "6 months"
isActive           Boolean      REQUIRED  true
createdAt          Datetime     REQUIRED
─────────────────────────────────────────────────────────────

INDEXES:
  departmentId + level → KEY (composite)
  departmentCode       → KEY

DEFAULT DATA (MADRASA):
  Ibtedaee 1–5, Mutawassit 1–4, Sanawee 1–3, Alim, Fazil, Kamil

DEFAULT DATA (SCHOOL):
  Play, Nursery, KG, Class 1–10, SSC, HSC

DEFAULT DATA (TECHNICAL):
  Computer Basic, Computer Diploma, Tailoring, Electrician, Graphics Design
```

---

### 📁 Collection 05: `fee_types`

**ENV:** `NEXT_PUBLIC_COL_FEE_TYPES`  
**Purpose:** সব ধরনের fee এর master catalog। এখানে "কী ধরনের fee" define হয়।

```
ATTRIBUTES:
─────────────────────────────────────────────────────────────
name               String(100)  REQUIRED           Tuition Fee
nameBn             String(100)  REQUIRED           টিউশন ফি
code               String(30)   REQUIRED  UNIQUE   TUITION / BOARDING / FORM_FEE
category           String(20)   REQUIRED           admission/monthly/exam/other
billingCycle       String(20)   REQUIRED           once/monthly/quarterly/annually/per_exam
applicableTo       String(30)   REQUIRED           all/day_only/residential_only/boarding_only
departmentIds      String(500)  optional  '[]'     JSON: which depts (empty = all)
isRequired         Boolean      REQUIRED  true      false = optional
isActive           Boolean      REQUIRED  true
sortOrder          Integer      optional  0
description        String(500)  optional
createdAt          Datetime     REQUIRED
─────────────────────────────────────────────────────────────

DEFAULT FEE TYPES:

ADMISSION (one-time):
  { code: "FORM_FEE",      nameBn: "ফর্ম ফি",           category: "admission", billingCycle: "once",        applicableTo: "all"              }
  { code: "ADMISSION_FEE", nameBn: "ভর্তি ফি",           category: "admission", billingCycle: "once",        applicableTo: "all"              }
  { code: "ID_CARD_FEE",   nameBn: "আইডি কার্ড ফি",     category: "admission", billingCycle: "once",        applicableTo: "all"              }
  { code: "DRESS_FEE",     nameBn: "ড্রেস ফি",           category: "admission", billingCycle: "once",        applicableTo: "all",  isRequired: false }

MONTHLY (recurring):
  { code: "TUITION",       nameBn: "টিউশন ফি",           category: "monthly",   billingCycle: "monthly",     applicableTo: "all"              }
  { code: "RESIDENTIAL",   nameBn: "আবাসিক ফি",          category: "monthly",   billingCycle: "monthly",     applicableTo: "residential_only" }
  { code: "BOARDING",      nameBn: "বোর্ডিং ফি",         category: "monthly",   billingCycle: "monthly",     applicableTo: "boarding_only"    }
  { code: "MEAL",          nameBn: "খাবার ফি",            category: "monthly",   billingCycle: "monthly",     applicableTo: "boarding_only",   isRequired: false }
  { code: "TRANSPORT",     nameBn: "পরিবহন ফি",           category: "monthly",   billingCycle: "monthly",     applicableTo: "day_only",        isRequired: false }

EXAM:
  { code: "MONTHLY_EXAM",  nameBn: "মাসিক পরীক্ষা ফি",   category: "exam",      billingCycle: "per_exam",    applicableTo: "all",  isRequired: false }
  { code: "HALF_YEARLY",   nameBn: "অর্ধ-বার্ষিক পরীক্ষা", category: "exam",    billingCycle: "per_exam",    applicableTo: "all"              }
  { code: "ANNUAL_EXAM",   nameBn: "বার্ষিক পরীক্ষা ফি",  category: "exam",      billingCycle: "per_exam",    applicableTo: "all"              }
  { code: "BOARD_EXAM",    nameBn: "বোর্ড পরীক্ষা ফি",    category: "exam",      billingCycle: "per_exam",    applicableTo: "all",  isRequired: false }

OTHER:
  { code: "LATE_FEE",      nameBn: "বিলম্ব ফি",           category: "other",     billingCycle: "once",        applicableTo: "all",  isRequired: false }
  { code: "LIBRARY",       nameBn: "লাইব্রেরি ফি",         category: "other",     billingCycle: "annually",    applicableTo: "all",  isRequired: false }
  { code: "LAB",           nameBn: "ল্যাব ফি",             category: "other",     billingCycle: "annually",    applicableTo: "all",  isRequired: false }
```

---

### 📁 Collection 06: `fee_structures`

**ENV:** `NEXT_PUBLIC_COL_FEE_STRUCTURES`  
**Purpose:** প্রতিটি class + boarding type + department combination এ fee amount define করা।

```
ATTRIBUTES:
─────────────────────────────────────────────────────────────
feeTypeId          String(50)   REQUIRED           → fee_types.$id
feeTypeCode        String(30)   REQUIRED           TUITION / BOARDING / etc.
departmentId       String(20)   optional           null = all departments
classId            String(20)   optional           null = all classes
className          String(100)  optional           For display
boardingType       String(15)   optional           null = all | day/residential/boarding
session            String(10)   REQUIRED           2026-2027
amount             Integer      REQUIRED           Amount in BDT (পয়সা ছাড়া)
effectiveFrom      Datetime     REQUIRED
effectiveTo        Datetime     optional           null = no end date
isActive           Boolean      REQUIRED  true
notes              String(300)  optional
createdAt          Datetime     REQUIRED
createdBy          String(50)   optional
─────────────────────────────────────────────────────────────

INDEXES:
  feeTypeCode + classId + boardingType + session → KEY (composite)
  session      → KEY
  isActive     → KEY

EXAMPLE DATA:

Admission fees (same for all):
  { feeTypeCode: "FORM_FEE",      classId: null, boardingType: null, amount: 200  }
  { feeTypeCode: "ADMISSION_FEE", classId: null, boardingType: null, amount: 1500 }
  { feeTypeCode: "ID_CARD_FEE",   classId: null, boardingType: null, amount: 150  }
  { feeTypeCode: "DRESS_FEE",     classId: null, boardingType: null, amount: 1200 }

Monthly tuition (varies by class):
  { feeTypeCode: "TUITION", classId: "ibtedaee_1", boardingType: null, amount: 600  }
  { feeTypeCode: "TUITION", classId: "mutawassit_1", boardingType: null, amount: 800  }
  { feeTypeCode: "TUITION", classId: "class_5_school", boardingType: null, amount: 900  }

Boarding fees (same amount regardless of class):
  { feeTypeCode: "BOARDING",     classId: null, boardingType: "boarding",    amount: 3000 }
  { feeTypeCode: "RESIDENTIAL",  classId: null, boardingType: "residential", amount: 1500 }

Exam fees:
  { feeTypeCode: "MONTHLY_EXAM", classId: null, boardingType: null, amount: 200 }
  { feeTypeCode: "HALF_YEARLY",  classId: null, boardingType: null, amount: 500 }
  { feeTypeCode: "ANNUAL_EXAM",  classId: null, boardingType: null, amount: 800 }
```

---

### 📁 Collection 07: `fee_invoices`

**ENV:** `NEXT_PUBLIC_COL_FEE_INVOICES`  
**Purpose:** প্রতি student এর প্রতি মাস / exam এর জন্য invoice তৈরি হবে। Invoice = কত টাকা নেওয়া হবে তার record।

```
ATTRIBUTES:
─────────────────────────────────────────────────────────────
invoiceId          String(20)   REQUIRED  UNIQUE   INV-2026-0001
studentId          String(20)   REQUIRED           → students.studentId
enrollmentId       String(20)   REQUIRED           → student_enrollments.enrollmentId
departmentCode     String(10)   REQUIRED           MDR / SCH / TEC

invoiceType        String(20)   REQUIRED           admission/monthly/exam
month              String(7)    optional           2026-01 (for monthly invoices)
examScheduleId     String(50)   optional           → exam_schedules.$id (for exam invoices)
session            String(10)   REQUIRED           2026-2027

── Fee Breakdown (JSON) ─────────────────────────────────────
items              String(5000) REQUIRED
  [
    {
      "feeTypeCode": "TUITION",
      "feeTypeName": "টিউশন ফি",
      "amount": 800,
      "isRequired": true,
      "isIncluded": true
    },
    {
      "feeTypeCode": "BOARDING",
      "feeTypeName": "বোর্ডিং ফি",
      "amount": 3000,
      "isRequired": true,
      "isIncluded": true
    }
  ]

totalAmount        Integer      REQUIRED           Sum of included items
discount           Integer      optional  0        Scholarship / waiver
discountNote       String(200)  optional
netAmount          Integer      REQUIRED           totalAmount - discount
paidAmount         Integer      REQUIRED  0
dueAmount          Integer      REQUIRED           netAmount - paidAmount
status             String(15)   REQUIRED  'unpaid' unpaid/partial/paid/waived/cancelled

dueDate            Datetime     optional           Payment deadline
overdueNotified    Boolean      optional  false    SMS/notification sent

createdAt          Datetime     REQUIRED
updatedAt          Datetime     optional
createdBy          String(50)   optional
─────────────────────────────────────────────────────────────

INDEXES:
  invoiceId                        → UNIQUE
  studentId                        → KEY
  studentId + month + enrollmentId → KEY (composite, prevent duplicate monthly invoice)
  status                           → KEY
  month                            → KEY
  dueDate                          → KEY
```

---

### 📁 Collection 08: `fee_payments`

**ENV:** `NEXT_PUBLIC_COL_FEE_PAYMENTS`  
**Purpose:** Actual payment। একটি invoice এ multiple partial payments হতে পারে।

```
ATTRIBUTES:
─────────────────────────────────────────────────────────────
paymentId          String(20)   REQUIRED  UNIQUE   PAY-2026-0001
receiptNo          String(20)   REQUIRED  UNIQUE   RCP-2026-0001
invoiceId          String(20)   REQUIRED           → fee_invoices.invoiceId
studentId          String(20)   REQUIRED           → students.studentId
enrollmentId       String(20)   REQUIRED
departmentCode     String(10)   REQUIRED

amountPaid         Integer      REQUIRED
paymentMethod      String(15)   REQUIRED           cash/bank/bkash/nagad/rocket
transactionRef     String(100)  optional           Mobile/bank reference number
paymentDate        Datetime     REQUIRED
collectedBy        String(50)   REQUIRED           staff userId
notes              String(500)  optional

createdAt          Datetime     REQUIRED
─────────────────────────────────────────────────────────────

INDEXES:
  receiptNo  → UNIQUE
  paymentId  → UNIQUE
  invoiceId  → KEY
  studentId  → KEY
  paymentDate → KEY
```

---

### 📁 Collection 09: `exam_schedules`

**ENV:** `NEXT_PUBLIC_COL_EXAM_SCHEDULES`  
**Purpose:** সব ধরনের exam এর schedule। Fee generate করার trigger।

```
ATTRIBUTES:
─────────────────────────────────────────────────────────────
examName           String(200)  REQUIRED           প্রথম সাময়িক পরীক্ষা ২০২৬
examNameBn         String(200)  optional
examType           String(20)   REQUIRED           monthly/half_yearly/annual/board/special
departmentId       String(20)   optional           null = all departments
classId            String(20)   optional           null = all classes
section            String(10)   optional           null = all sections
session            String(10)   REQUIRED           2026-2027
startDate          Datetime     REQUIRED
endDate            Datetime     REQUIRED
resultPublished    Boolean      REQUIRED  false
feeAmount          Integer      optional           Override fee_structures amount
feeRequired        Boolean      REQUIRED  true
status             String(15)   REQUIRED  'upcoming' upcoming/ongoing/completed/cancelled
createdBy          String(50)   optional
createdAt          Datetime     REQUIRED
─────────────────────────────────────────────────────────────

INDEXES:
  departmentId + classId + examType + session → KEY (composite)
  status     → KEY
  startDate  → KEY
```

---

### 📁 Collection 10: `exam_fees`

**ENV:** `NEXT_PUBLIC_COL_EXAM_FEES`  
**Purpose:** কোন exam এর জন্য কোন student কে invoice generate করা হয়েছে তার link।

```
ATTRIBUTES:
─────────────────────────────────────────────────────────────
examScheduleId     String(50)   REQUIRED
studentId          String(20)   REQUIRED
enrollmentId       String(20)   REQUIRED
invoiceId          String(20)   optional           Generated invoice ID
status             String(15)   REQUIRED  'pending' pending/invoiced/paid/exempted
createdAt          Datetime     REQUIRED
─────────────────────────────────────────────────────────────

INDEXES:
  examScheduleId + studentId → KEY+UNIQUE (composite, prevent duplicate)
```

---

### 📁 Collection 11: `nfc_cards`

**ENV:** `NEXT_PUBLIC_COL_NFC_CARDS`  
**Purpose:** NFC card → student/staff mapping।

```
ATTRIBUTES:
─────────────────────────────────────────────────────────────
cardUid            String(50)   REQUIRED  UNIQUE   Physical card UID
assignedType       String(10)   REQUIRED           student / staff
assignedId         String(20)   REQUIRED           studentId or staffId
assignedName       String(200)  optional           Quick display name
isActive           Boolean      REQUIRED  true
lastScanned        Datetime     optional
lastScanLocation   String(50)   optional           gate/classroom
assignedAt         Datetime     REQUIRED
deactivatedAt      Datetime     optional
deactivatedBy      String(50)   optional
notes              String(300)  optional
createdAt          Datetime     REQUIRED
─────────────────────────────────────────────────────────────

INDEXES:
  cardUid     → UNIQUE
  assignedId  → KEY
  isActive    → KEY
```

---

### 📁 Collection 12: `attendance_students`

**ENV:** `NEXT_PUBLIC_COL_ATTENDANCE_STUDENTS`  
**Purpose:** NFC বা manual attendance।

```
ATTRIBUTES:
─────────────────────────────────────────────────────────────
studentId          String(20)   REQUIRED
enrollmentId       String(20)   REQUIRED
date               String(10)   REQUIRED           2026-01-15 (YYYY-MM-DD)
departmentCode     String(10)   REQUIRED           MDR / SCH / TEC
classId            String(20)   REQUIRED
section            String(10)   optional
status             String(10)   REQUIRED           present/absent/late/leave/holiday
checkInTime        String(8)    optional           08:30:00
method             String(10)   REQUIRED  'manual'  nfc/manual/self
nfcCardUid         String(50)   optional           Which card was scanned
markedBy           String(50)   optional           staff userId (null for NFC auto)
leaveReasonId      String(50)   optional           If on leave
note               String(300)  optional
createdAt          Datetime     REQUIRED
─────────────────────────────────────────────────────────────

INDEXES:
  studentId + date + enrollmentId → KEY+UNIQUE (composite, prevent duplicate per enrollment)
  date + departmentCode           → KEY (composite, daily report query)
  studentId + date                → KEY
  method                          → KEY
  status                          → KEY

IMPORTANT NOTE:
  একজন student তিনটি department এ enrolled থাকলে ঐদিনে তিনটি attendance record হতে পারে।
  enrollmentId দিয়ে আলাদা করা যাবে।
  Gate NFC scan → studentId দিয়ে সব active enrollment এ present mark হবে।
```

---

## 3. Fee System Design

### 3.1 Fee Calculation Logic

```
Student: Mohammad Rahim
Enrollment: Madrasa (Mutawassit 3) + Boarding
Session: 2026-2027

─── ADMISSION (one-time) ────────────────────────────────────
Form Fee:       ৳  200  (all students)
Admission Fee:  ৳ 1500  (all students)
ID Card Fee:    ৳  150  (all students)
Dress Fee:      ৳ 1200  (optional)
──────────────────────────
Total:          ৳ 3050

─── MONTHLY ────────────────────────────────────────────────
Tuition:        ৳  800  (Mutawassit 3, from fee_structures)
Boarding Fee:   ৳ 3000  (boarding student, from fee_structures)
Meal Fee:       ৳  500  (boarding optional)
──────────────────────────
Monthly Total:  ৳ 4300

─── EXAM (when applicable) ──────────────────────────────────
Monthly Exam:   ৳  200  (per exam, optional)
Half-Yearly:    ৳  500  (required)
Annual:         ৳  800  (required)
──────────────────────────
```

### 3.2 Fee Generate Algorithm

```typescript
// প্রতি মাসের শুরুতে (cron job বা manual trigger):
async function generateMonthlyInvoices(month: string, session: string) {
  
  // 1. সব active enrollments আনো
  const enrollments = await getActiveEnrollments(session);
  
  for (const enrollment of enrollments) {
    
    // 2. ইতিমধ্যে invoice আছে কিনা check (duplicate prevention)
    const existing = await checkExistingInvoice(enrollment.id, month);
    if (existing) continue;
    
    // 3. এই enrollment এর জন্য applicable fee types আনো
    const applicableFees = await getApplicableFees({
      departmentId: enrollment.departmentId,
      classId:      enrollment.classId,
      boardingType: enrollment.boardingType,  // ← boarding/residential/day
      session,
    });
    
    // 4. fee_structures থেকে amounts আনো
    const items = await resolveFeeAmounts(applicableFees, enrollment);
    
    // 5. Invoice create করো
    await createInvoice({
      studentId:     enrollment.studentId,
      enrollmentId:  enrollment.id,
      invoiceType:   "monthly",
      month,
      session,
      items,
      totalAmount:   items.reduce((s, i) => s + i.amount, 0),
      netAmount:     totalAmount - discount,
      dueDate:       new Date(year, monthIndex, 10), // 10 তারিখের মধ্যে
    });
  }
}
```

### 3.3 Multi-Department Fee Example

```
Student enrolled in BOTH Madrasa AND School:

Invoice 1 (MDR-2026-01):
  Department: Madrasa
  Tuition: ৳800 (Mutawassit rate)
  Boarding: ৳3000 (boarding student)
  Total: ৳3800

Invoice 2 (SCH-2026-01):
  Department: School
  Tuition: ৳900 (Class 8 rate)
  (No boarding — same student already paying in Madrasa invoice)
  Total: ৳900

Design Decision:
  Boarding fee শুধু PRIMARY department এ charge হবে।
  enrollment.isPrimary = true/false দিয়ে control করো।
```

---

## 4. Admission Form Design

### 4.1 Multi-Step Form Steps

```
STEP 1: ব্যক্তিগত তথ্য (Personal Info)
  ─ Photo upload (required)
  ─ Full Name (Bn + En)
  ─ Father/Mother Name (Bn + En)
  ─ Date of Birth
  ─ Gender, Religion, Blood Group
  ─ Nationality, Birth Certificate No

STEP 2: যোগাযোগ ও ঠিকানা (Contact & Address)
  ─ Guardian Phone (required)
  ─ Student Phone (optional)
  ─ WhatsApp, Email
  ─ Current Address (Division→District→Thana→Village)
  ─ Permanent Address (or same as current)

STEP 3: ভর্তির তথ্য (Enrollment Info)
  ─ Department selection (Madrasa / School / Technical)
    [Can select multiple → adds multiple enrollments]
  ─ For each selected department:
    → Class selection (filtered by department)
    → Section selection
    → Session
    → Boarding Type (Day / Residential / Full Boarding)
    → Roll Number (auto or manual)
  ─ Previous School info

STEP 4: ফি সংগ্রহ (Fee Collection)
  ─ Auto-loads fee_structures based on class + boarding type
  ─ Admission fees (Form Fee, Admission Fee, ID Card Fee)
  ─ Optional fees (Dress Fee, etc.) with checkboxes
  ─ First month fee (optional checkbox)
  ─ If multi-enrollment: shows fees per department separately
  ─ Total calculation
  ─ Payment method selection
  ─ Discount input (optional)
  ─ [Collect & Print Receipt] button

STEP 5: সফলতা (Success)
  ─ Student ID (MDS-2026-0001)
  ─ Enrollment IDs per department
  ─ Receipt preview
  ─ Print button
```

### 4.2 Student ID Format

```
MDS-2026-0001  →  Madrasa Section
SCH-2026-0001  →  School Section
TEC-2026-0001  →  Technical Section

OR একটি unified ID:
MII-2026-0001  →  Manzil International Institute (all sections)
```

### 4.3 Receipt Format

```
─── RECEIPT PER DEPARTMENT ─────────────────────────────────
প্রতিটি department এর জন্য আলাদা receipt

Receipt: RCP-MDR-2026-0001
Student: Mohammad Rahim
Dept:    Madrasa Section
Class:   Mutawassit 3rd Year

Fee Items:
  Form Fee           ৳   200
  Admission Fee      ৳  1500
  ID Card Fee        ৳   150
  Dress Fee          ৳  1200
  First Month Tuition ৳  800
  First Month Boarding ৳ 3000
  ─────────────────────────
  TOTAL              ৳  6850
  Discount           ৳     0
  NET PAID           ৳  6850

Method: Cash
Date: 15 Jan 2026
Collector: Admin Rahman
─────────────────────────────────────────────────────────────
```

---

## 5. NFC Attendance System

### 5.1 How NFC Works

```
SCENARIO: Student taps NFC card at gate

1. Card scan → Web NFC API reads cardUid
2. Query nfc_cards collection: find by cardUid
3. Get studentId from nfc_cards record
4. Get all ACTIVE enrollments for this student (today's date)
5. For each enrollment:
   → Check if attendance already marked today
   → If not: create attendance_students record (status: present)
   → If yes: skip (idempotent, no duplicate)
6. Show success screen:
   → Student photo + name
   → Class info (e.g., "Mutawassit 3 | School Class 8")
   → Time: 08:45 AM
   → GREEN screen ✓

EDGE CASES:
  - Card not registered: RED screen, "কার্ড নিবন্ধিত নয়"
  - Student already scanned: BLUE screen, "ইতিমধ্যে উপস্থিত - 08:30 AM"
  - Card inactive: RED screen, "কার্ড নিষ্ক্রিয়"
```

### 5.2 NFC Gate Mode Query

```typescript
async function processNfcScan(cardUid: string): Promise<NfcScanResult> {
  
  // 1. Find card
  const card = await findCardByUid(cardUid);
  if (!card || !card.isActive) return { type: "error", message: "কার্ড নিবন্ধিত নয়" };
  
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  
  if (card.assignedType === "student") {
    
    // 2. Get student info
    const student = await getStudent(card.assignedId);
    
    // 3. Get ALL active enrollments
    const enrollments = await getActiveEnrollments(card.assignedId);
    
    const results = [];
    for (const enr of enrollments) {
      
      // 4. Check duplicate
      const alreadyMarked = await checkAttendance(student.studentId, today, enr.id);
      if (alreadyMarked) {
        results.push({ dept: enr.departmentCode, status: "already_marked", time: alreadyMarked.checkInTime });
        continue;
      }
      
      // 5. Mark present
      await createAttendance({
        studentId:     student.studentId,
        enrollmentId:  enr.id,
        date:          today,
        departmentCode: enr.departmentCode,
        classId:       enr.classId,
        section:       enr.section,
        status:        "present",
        checkInTime:   new Date().toTimeString().split(" ")[0],
        method:        "nfc",
        nfcCardUid:    cardUid,
      });
      results.push({ dept: enr.departmentCode, status: "marked" });
    }
    
    return {
      type:    "student",
      student,
      results,
    };
  }
}
```

### 5.3 Attendance Database Indexes (Critical for Performance)

```
attendance_students INDEXES:
  1. studentId + date + enrollmentId  → UNIQUE  (prevent duplicate)
  2. date + departmentCode + classId  → KEY     (daily class report)
  3. studentId + date                 → KEY     (student's daily check)
  4. date                             → KEY     (full day report)
  5. status                           → KEY     (filter absent/late)
```

---

## 6. Environment Variables

```env
# ── Database Collections ──────────────────────────────────────
NEXT_PUBLIC_COL_STUDENTS=
NEXT_PUBLIC_COL_STUDENT_ENROLLMENTS=
NEXT_PUBLIC_COL_DEPARTMENTS=
NEXT_PUBLIC_COL_CLASSES=
NEXT_PUBLIC_COL_FEE_TYPES=
NEXT_PUBLIC_COL_FEE_STRUCTURES=
NEXT_PUBLIC_COL_FEE_INVOICES=
NEXT_PUBLIC_COL_FEE_PAYMENTS=
NEXT_PUBLIC_COL_EXAM_SCHEDULES=
NEXT_PUBLIC_COL_EXAM_FEES=
NEXT_PUBLIC_COL_NFC_CARDS=
NEXT_PUBLIC_COL_ATTENDANCE_STUDENTS=

# ── Storage Buckets ──────────────────────────────────────────
NEXT_PUBLIC_BUCKET_STUDENT_PHOTOS=
NEXT_PUBLIC_BUCKET_DOCUMENTS=      # (already exists from staff module)
NEXT_PUBLIC_BUCKET_RECEIPTS=
```

---

## 7. File Structure

```
src/
│
├── app/(dashboard)/admin/
│   ├── students/
│   │   ├── page.tsx                     ← Student list
│   │   ├── admission/
│   │   │   └── page.tsx                 ← Admission form page
│   │   ├── [studentId]/
│   │   │   ├── page.tsx                 ← Student profile
│   │   │   ├── enrollments/page.tsx     ← All enrollments
│   │   │   └── fees/page.tsx            ← Fee history
│   │   └── promote/page.tsx             ← Bulk promotion
│   │
│   ├── fees/
│   │   ├── page.tsx                     ← Fee dashboard
│   │   ├── collect/page.tsx             ← Collect fee
│   │   ├── invoices/page.tsx            ← All invoices
│   │   ├── due/page.tsx                 ← Due fees list
│   │   ├── structure/page.tsx           ← Fee structure management
│   │   └── receipts/[id]/page.tsx       ← Print receipt
│   │
│   ├── attendance/
│   │   ├── students/page.tsx            ← Manual attendance
│   │   └── gate/page.tsx                ← NFC gate mode
│   │
│   └── nfc/
│       ├── page.tsx                     ← NFC card management
│       └── gate/page.tsx                ← Full-screen gate mode
│
├── components/
│   ├── admission/
│   │   ├── AdmissionForm.tsx            ← Main multi-step controller
│   │   └── steps/
│   │       ├── Step1PersonalInfo.tsx
│   │       ├── Step2ContactAddress.tsx
│   │       ├── Step3EnrollmentInfo.tsx  ← Multi-department selection
│   │       ├── Step4FeeCollection.tsx   ← Dynamic fee calculation
│   │       └── Step5Success.tsx
│   │
│   ├── fees/
│   │   ├── FeeStructureManager.tsx
│   │   ├── InvoiceList.tsx
│   │   ├── PaymentForm.tsx
│   │   └── Receipt.tsx                  ← Printable receipt
│   │
│   └── nfc/
│       ├── NFCScanner.tsx               ← Web NFC API wrapper
│       └── GateMode.tsx                 ← Full-screen gate display
│
├── lib/
│   ├── actions/
│   │   ├── admission.ts                 ← createStudent, createEnrollment
│   │   ├── fees.ts                      ← generateInvoices, recordPayment
│   │   └── attendance.ts                ← processNfcScan, markAttendance
│   │
│   ├── validations/
│   │   ├── admission.ts                 ← Zod schemas (step 1–4)
│   │   └── fee.ts                       ← Fee calculation schemas
│   │
│   └── stores/
│       └── admissionFormStore.ts        ← Zustand (step persistence)
│
└── config/
    └── appwrite.ts                      ← Add new collection IDs here
```

---

## 8. Implementation Plan

### Phase A — Database Setup (Appwrite Console)

**Step 1:** Create 12 collections (তালিকা অনুযায়ী উপরে দেওয়া attributes দিয়ে)

**Step 2:** Create indexes (specially composite indexes)

**Step 3:** Insert default data:
```
a) departments    → 3 records (MDR, SCH, TEC)
b) classes        → Madrasa 13 + School 14 + Technical 5 = ~32 records
c) fee_types      → ~15 records (উপরে দেওয়া list)
d) fee_structures → ~30-50 records (class × boarding type combinations)
```

**Step 4:** Create storage buckets:
```
student_photos  → 5MB, image/jpeg,png,webp only
receipts        → 2MB, application/pdf only
```

**Step 5:** Update `.env.local` with all collection IDs

---

### Phase B — Config & Validations

**Step 6:** `config/appwrite.ts` এ নতুন collection IDs add করো

**Step 7:** `lib/validations/admission.ts` এ Zod schemas লিখো:
```typescript
// Step 1 schema
// Step 2 schema  
// Step 3 schema (with dynamic department-based fields)
// Step 4 schema (with computed fee totals)
// Full merged schema
```

**Step 8:** `lib/stores/admissionFormStore.ts` — Zustand store (staffFormStore এর pattern follow করো, sessionStorage use করো)

---

### Phase C — Server Actions

**Step 9:** `lib/actions/admission.ts`:
```
createAdmission(formData):
  1. Upload photo → Appwrite Storage
  2. Generate studentId (MDS-2026-XXXX)
  3. Generate admissionNo (ADM-2026-XXXX)
  4. Insert students collection
  5. For each selected department:
     → Generate enrollmentId (ENR-2026-XXXX)
     → Insert student_enrollments collection
  6. Generate invoice(s) for admission fees
  7. Record payment (if paid now)
  8. Generate receiptNo (RCP-2026-XXXX)
  9. Insert fee_invoices + fee_payments
  10. Return { studentId, enrollmentIds, receiptNo }
```

**Step 10:** `lib/actions/fees.ts`:
```
generateMonthlyInvoices(month, session)
collectPayment(invoiceId, amount, method)
getStudentFeeHistory(studentId)
getDueFees(filters)
```

**Step 11:** `lib/actions/attendance.ts`:
```
processNfcScan(cardUid)          ← NFC gate scan
markManualAttendance(data[])     ← Teacher marks class
getDailyReport(date, dept, class)
getMonthlyReport(studentId, month)
```

---

### Phase D — UI Components

**Step 12:** `AdmissionForm.tsx` — multi-step form (StaffForm.tsx pattern follow করো)

**Step 13:** Step components (Step1–Step5)

**Step 14:** `Receipt.tsx` — printable, A5 size, 2 copies per A4

**Step 15:** `FeeStructureManager.tsx` — admin fee configuration UI

**Step 16:** `GateMode.tsx` — full-screen NFC gate:
```
Black bg → "SCAN CARD" ripple animation
→ Success: green bg + student photo + name + class
→ Already scanned: blue bg + time info
→ Error: red bg + error message
→ Auto-reset after 3 seconds
```

---

### Phase E — Pages

**Step 17:** `/dashboard/admin/students/admission/page.tsx`

**Step 18:** `/dashboard/admin/fees/page.tsx` (dashboard + invoice list)

**Step 19:** `/dashboard/admin/attendance/students/page.tsx`

**Step 20:** `/dashboard/admin/nfc/gate/page.tsx` (full-screen gate mode)

---

## ⚠️ Important Design Decisions

### 1. students vs student_enrollments separation
Personal data একবার, class/dept data আলাদা। ভবিষ্যতে class promote করলে শুধু enrollment update হবে, personal data same থাকবে।

### 2. fee_invoices vs fee_payments separation
Invoice = কত পাবো, Payment = কত পেলাম। Partial payment support এর জন্য এই separation দরকার।

### 3. Boarding fee in PRIMARY enrollment only
একজন student দুটো department এ enrolled হলেও boarding fee একবারই নেওয়া হবে। `isPrimary` field দিয়ে control করো।

### 4. NFC + Multi-enrollment
Gate scan করলে সব active enrollment এ present হবে। Class teacher manually mark করলে শুধু তার class এর enrollment এ mark হবে।

### 5. Exam fees per department
একটি exam schedule একটি department এর জন্য। Student দুই dept এ থাকলে দুটো exam invoice আলাদা।

---

*End of Document — Manzil Institute Management System*  
*Ready for agent-based implementation*