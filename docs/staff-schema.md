# ═══════════════════════════════════════════════════════════════
# MANZIL INTERNATIONAL INSTITUTE
# Staff Module — Appwrite Collections & Attributes
# ═══════════════════════════════════════════════════════════════
#
# Collections: 8 total
#   01. staff_applications   → public form submissions
#   02. staff                → approved employee registry
#   03. staff_salaries       → monthly salary records
#   04. salary_advances      → advance/loan tracking
#   05. leave_requests       → leave applications
#   06. attendance_staff     → daily attendance
#   07. policies             → institute policies
#   08. policy_acknowledgements → staff sign-off records
#
# ═══════════════════════════════════════════════════════════════



# ───────────────────────────────────────────────────────────────
# 01. COLLECTION: staff_applications
# ENV: NEXT_PUBLIC_COL_STAFF_APPLICATIONS
# PURPOSE: Public form submissions. Admin reviews → approve/reject.
# PERMISSIONS:
#   Create → role:public (anyone can apply)
#   Read   → role:admin, role:manager
#   Update → role:admin
#   Delete → role:admin
# ───────────────────────────────────────────────────────────────

┌──────────────────────────┬───────────┬───────┬──────────┬────────────────┬─────────┐
│ Attribute                │ Type      │ Size  │ Required │ Default        │ Index   │
├──────────────────────────┼───────────┼───────┼──────────┼────────────────┼─────────┤
│                          │           │       │          │                │         │
│ — ID & Status ────────── │           │       │          │                │         │
│                          │           │       │          │                │         │
│ applicationId            │ String    │ 20    │ YES      │ —              │ UNIQUE  │
│ status                   │ String    │ 15    │ YES      │ pending        │ KEY     │
│ reviewedBy               │ String    │ 50    │ NO       │ ""             │ —       │
│ reviewedAt               │ Datetime  │ —     │ NO       │ —              │ —       │
│ reviewNotes              │ String    │ 500   │ NO       │ ""             │ —       │
│ assignedStaffId          │ String    │ 50    │ NO       │ ""             │ —       │
│                          │           │       │          │                │         │
│ — Personal Info ──────── │           │       │          │                │         │
│                          │           │       │          │                │         │
│ nameBn                   │ String    │ 200   │ YES      │ —              │ —       │
│ nameEn                   │ String    │ 200   │ YES      │ —              │ —       │
│ fatherNameBn             │ String    │ 200   │ YES      │ —              │ —       │
│ fatherNameEn             │ String    │ 200   │ NO       │ ""             │ —       │
│ motherNameBn             │ String    │ 200   │ YES      │ —              │ —       │
│ motherNameEn             │ String    │ 200   │ NO       │ ""             │ —       │
│ dateOfBirth              │ Datetime  │ —     │ YES      │ —              │ —       │
│ gender                   │ String    │ 10    │ YES      │ —              │ —       │
│ maritalStatus            │ String    │ 20    │ YES      │ —              │ —       │
│ religion                 │ String    │ 20    │ YES      │ —              │ —       │
│ nationality              │ String    │ 50    │ NO       │ বাংলাদেশী      │ —       │
│ bloodGroup               │ String    │ 10    │ NO       │ unknown        │ —       │
│ isHafiz                  │ Boolean   │ —     │ NO       │ false          │ —       │
│                          │           │       │          │                │         │
│ — Contact ─────────────  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ nidNumber                │ String    │ 20    │ YES      │ —              │ KEY     │
│ phonePrimary             │ String    │ 20    │ YES      │ —              │ KEY     │
│ phoneSecondary           │ String    │ 20    │ NO       │ ""             │ —       │
│ email                    │ String    │ 200   │ NO       │ ""             │ —       │
│                          │           │       │          │                │         │
│ — Address ─────────────  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ currentAddress           │ String    │ 500   │ YES      │ —              │ —       │
│ permanentAddress         │ String    │ 500   │ NO       │ ""             │ —       │
│                          │           │       │          │                │         │
│ — Professional ────────  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ designation              │ String    │ 100   │ YES      │ —              │ KEY     │
│ department               │ String    │ 100   │ NO       │ ""             │ —       │
│ employmentType           │ String    │ 20    │ YES      │ —              │ —       │
│ education                │ String    │ 10000 │ YES      │ []             │ —       │
│ totalExperienceYears     │ Integer   │ —     │ NO       │ 0              │ —       │
│ previousWorkplace        │ String    │ 500   │ NO       │ ""             │ —       │
│ previousWorkDuration     │ String    │ 100   │ NO       │ ""             │ —       │
│ specialSkills            │ String    │ 1000  │ NO       │ ""             │ —       │
│ socialLinks              │ String    │ 2000  │ NO       │ {}             │ —       │
│                          │           │       │          │                │         │
│ — Expected Terms ──────  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ expectedSalary           │ Integer   │ —     │ YES      │ —              │ —       │
│ expectedJoiningDate      │ String    │ 20    │ YES      │ —              │ —       │
│ noticePeriod             │ String    │ 200   │ YES      │ —              │ —       │
│                          │           │       │          │                │         │
│ — Payment Info ────────  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ paymentMethod            │ String    │ 20    │ YES      │ —              │ —       │
│ bankName                 │ String    │ 200   │ NO       │ ""             │ —       │
│ bankBranch               │ String    │ 200   │ NO       │ ""             │ —       │
│ accountName              │ String    │ 200   │ NO       │ ""             │ —       │
│ accountNumber            │ String    │ 50    │ NO       │ ""             │ —       │
│ mobileBankingProvider    │ String    │ 20    │ NO       │ ""             │ —       │
│ mobileBankingNumber      │ String    │ 20    │ NO       │ ""             │ —       │
│                          │           │       │          │                │         │
│ — Reference ───────────  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ referenceName            │ String    │ 200   │ YES      │ —              │ —       │
│ referencePhone           │ String    │ 20    │ YES      │ —              │ —       │
│ referenceOccupation      │ String    │ 200   │ NO       │ ""             │ —       │
│                          │           │       │          │                │         │
│ — Emergency Contact ───  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ emergencyContactName     │ String    │ 200   │ YES      │ —              │ —       │
│ emergencyContactNo       │ String    │ 20    │ YES      │ —              │ —       │
│ emergencyRelationship    │ String    │ 50    │ YES      │ —              │ —       │
│                          │           │       │          │                │         │
│ — Documents ───────────  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ photoUrl                 │ String    │ 500   │ NO       │ ""             │ —       │
│ nidFrontCopyUrl          │ String    │ 500   │ NO       │ ""             │ —       │
│ nidBackCopyUrl           │ String    │ 500   │ NO       │ ""             │ —       │
│ certificateUrls          │ String    │ 5000  │ NO       │ []             │ —       │
│ experienceLetterUrl      │ String    │ 500   │ NO       │ ""             │ —       │
│ cvUrl                    │ String    │ 500   │ NO       │ ""             │ —       │
│                          │           │       │          │                │         │
│ — Meta ─────────────── │           │       │          │                │         │
│                          │           │       │          │                │         │
│ declaration              │ Boolean   │ —     │ YES      │ —              │ —       │
│ appliedAt                │ Datetime  │ —     │ YES      │ —              │ KEY     │
└──────────────────────────┴───────────┴───────┴──────────┴────────────────┴─────────┘

Total attributes: 62

INDEXES (6):
  idx_applicationId  → UNIQUE → applicationId
  idx_status         → KEY    → status
  idx_phonePrimary   → KEY    → phonePrimary
  idx_nidNumber      → KEY    → nidNumber
  idx_designation    → KEY    → designation
  idx_appliedAt      → KEY    → appliedAt

STATUS VALUES:
  pending → approved → rejected



# ───────────────────────────────────────────────────────────────
# 02. COLLECTION: staff
# ENV: NEXT_PUBLIC_COL_STAFF
# PURPOSE: Approved employee registry. Source of truth.
# PERMISSIONS:
#   Create → admin API key (approve action থেকে)
#   Read   → admin, manager, self (userId match)
#   Update → admin
#   Delete → NEVER (isActive = false করো)
# ───────────────────────────────────────────────────────────────

┌──────────────────────────┬───────────┬───────┬──────────┬────────────────┬─────────┐
│ Attribute                │ Type      │ Size  │ Required │ Default        │ Index   │
├──────────────────────────┼───────────┼───────┼──────────┼────────────────┼─────────┤
│                          │           │       │          │                │         │
│ — Identity ────────────  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ staffId                  │ String    │ 20    │ YES      │ —              │ UNIQUE  │
│ userId                   │ String    │ 50    │ NO       │ ""             │ KEY     │
│ applicationId            │ String    │ 20    │ NO       │ ""             │ —       │
│                          │           │       │          │                │         │
│ — Personal Info ──────── │           │       │          │                │         │
│                          │           │       │          │                │         │
│ nameBn                   │ String    │ 200   │ YES      │ —              │ —       │
│ nameEn                   │ String    │ 200   │ YES      │ —              │ —       │
│ fatherNameBn             │ String    │ 200   │ YES      │ —              │ —       │
│ fatherNameEn             │ String    │ 200   │ NO       │ ""             │ —       │
│ motherNameBn             │ String    │ 200   │ YES      │ —              │ —       │
│ motherNameEn             │ String    │ 200   │ NO       │ ""             │ —       │
│ dateOfBirth              │ Datetime  │ —     │ YES      │ —              │ —       │
│ gender                   │ String    │ 10    │ YES      │ —              │ —       │
│ maritalStatus            │ String    │ 20    │ YES      │ —              │ —       │
│ religion                 │ String    │ 20    │ YES      │ —              │ —       │
│ nationality              │ String    │ 50    │ NO       │ বাংলাদেশী      │ —       │
│ bloodGroup               │ String    │ 10    │ NO       │ unknown        │ —       │
│ isHafiz                  │ Boolean   │ —     │ NO       │ false          │ —       │
│                          │           │       │          │                │         │
│ — Contact ─────────────  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ nidNumber                │ String    │ 20    │ YES      │ —              │ KEY     │
│ phonePrimary             │ String    │ 20    │ YES      │ —              │ KEY     │
│ phoneSecondary           │ String    │ 20    │ NO       │ ""             │ —       │
│ email                    │ String    │ 200   │ NO       │ ""             │ —       │
│                          │           │       │          │                │         │
│ — Address ─────────────  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ currentAddress           │ String    │ 500   │ YES      │ —              │ —       │
│ permanentAddress         │ String    │ 500   │ NO       │ ""             │ —       │
│                          │           │       │          │                │         │
│ — Employment ──────────  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ designation              │ String    │ 100   │ YES      │ —              │ KEY     │
│ department               │ String    │ 100   │ NO       │ ""             │ —       │
│ employmentType           │ String    │ 20    │ YES      │ —              │ KEY     │
│ joiningDate              │ Datetime  │ —     │ YES      │ —              │ —       │
│ isActive                 │ Boolean   │ —     │ YES      │ true           │ KEY     │
│                          │           │       │          │                │         │
│ — Salary ──────────────  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ basicSalary              │ Integer   │ —     │ YES      │ —              │ —       │
│ houseAllowance           │ Integer   │ —     │ NO       │ 0              │ —       │
│ medicalAllowance         │ Integer   │ —     │ NO       │ 0              │ —       │
│ transportAllowance       │ Integer   │ —     │ NO       │ 0              │ —       │
│ grossSalary              │ Integer   │ —     │ NO       │ 0              │ —       │
│ bonus                    │ Integer   │ —     │ NO       │ 0              │ —       │
│                          │           │       │          │                │         │
│ — Professional ────────  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ education                │ String    │ 10000 │ NO       │ []             │ —       │
│ totalExperienceYears     │ Integer   │ —     │ NO       │ 0              │ —       │
│ previousWorkplace        │ String    │ 500   │ NO       │ ""             │ —       │
│ previousWorkDuration     │ String    │ 100   │ NO       │ ""             │ —       │
│ specialSkills            │ String    │ 1000  │ NO       │ ""             │ —       │
│ socialLinks              │ String    │ 2000  │ NO       │ {}             │ —       │
│ assignedClasses          │ String    │ 2000  │ NO       │ []             │ —       │
│ subjects                 │ String    │ 1000  │ NO       │ []             │ —       │
│                          │           │       │          │                │         │
│ — Payment ─────────────  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ paymentMethod            │ String    │ 20    │ NO       │ cash           │ —       │
│ bankName                 │ String    │ 200   │ NO       │ ""             │ —       │
│ bankBranch               │ String    │ 200   │ NO       │ ""             │ —       │
│ accountName              │ String    │ 200   │ NO       │ ""             │ —       │
│ accountNumber            │ String    │ 50    │ NO       │ ""             │ —       │
│ mobileBankingProvider    │ String    │ 20    │ NO       │ ""             │ —       │
│ mobileBankingNumber      │ String    │ 20    │ NO       │ ""             │ —       │
│                          │           │       │          │                │         │
│ — Reference ───────────  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ referenceName            │ String    │ 200   │ NO       │ ""             │ —       │
│ referencePhone           │ String    │ 20    │ NO       │ ""             │ —       │
│ referenceOccupation      │ String    │ 200   │ NO       │ ""             │ —       │
│                          │           │       │          │                │         │
│ — Emergency Contact ───  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ emergencyContactName     │ String    │ 200   │ NO       │ ""             │ —       │
│ emergencyContactNo       │ String    │ 20    │ NO       │ ""             │ —       │
│ emergencyRelationship    │ String    │ 50    │ NO       │ ""             │ —       │
│                          │           │       │          │                │         │
│ — Documents ───────────  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ photo                    │ String    │ 500   │ NO       │ ""             │ —       │
│ nidFrontCopyUrl          │ String    │ 500   │ NO       │ ""             │ —       │
│ nidBackCopyUrl           │ String    │ 500   │ NO       │ ""             │ —       │
│ certificateUrls          │ String    │ 5000  │ NO       │ []             │ —       │
│ experienceLetterUrl      │ String    │ 500   │ NO       │ ""             │ —       │
│ cvUrl                    │ String    │ 500   │ NO       │ ""             │ —       │
│                          │           │       │          │                │         │
│ — NFC & Meta ──────────  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ nfcCardId                │ String    │ 50    │ NO       │ ""             │ —       │
│ noticePeriod             │ String    │ 200   │ NO       │ ""             │ —       │
│ notes                    │ String    │ 1000  │ NO       │ ""             │ —       │
│ createdAt                │ Datetime  │ —     │ YES      │ —              │ KEY     │
└──────────────────────────┴───────────┴───────┴──────────┴────────────────┴─────────┘

Total attributes: 68

INDEXES (7):
  idx_staffId        → UNIQUE → staffId
  idx_userId         → KEY    → userId
  idx_phonePrimary   → KEY    → phonePrimary
  idx_nidNumber      → KEY    → nidNumber
  idx_designation    → KEY    → designation
  idx_employmentType → KEY    → employmentType
  idx_isActive       → KEY    → isActive



# ───────────────────────────────────────────────────────────────
# 03. COLLECTION: staff_salaries
# ENV: NEXT_PUBLIC_COL_STAFF_SALARIES
# PURPOSE: Monthly salary records only. Advances are separate.
# PERMISSIONS:
#   Create → admin, accountant
#   Read   → admin, accountant, self
#   Update → admin, accountant
#   Delete → NEVER
# ───────────────────────────────────────────────────────────────

┌──────────────────────────┬───────────┬───────┬──────────┬────────────────┬─────────┐
│ Attribute                │ Type      │ Size  │ Required │ Default        │ Index   │
├──────────────────────────┼───────────┼───────┼──────────┼────────────────┼─────────┤
│                          │           │       │          │                │         │
│ — Reference ───────────  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ staffId                  │ String    │ 20    │ YES      │ —              │ KEY     │
│ month                    │ String    │ 7     │ YES      │ —              │ KEY     │
│ year                     │ Integer   │ —     │ YES      │ —              │ KEY     │
│                          │           │       │          │                │         │
│ — Earnings ────────────  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ basicSalary              │ Integer   │ —     │ YES      │ —              │ —       │
│ houseAllowance           │ Integer   │ —     │ NO       │ 0              │ —       │
│ medicalAllowance         │ Integer   │ —     │ NO       │ 0              │ —       │
│ transportAllowance       │ Integer   │ —     │ NO       │ 0              │ —       │
│ bonus                    │ Integer   │ —     │ NO       │ 0              │ —       │
│ grossSalary              │ Integer   │ —     │ YES      │ —              │ —       │
│                          │           │       │          │                │         │
│ — Deductions ──────────  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ deductionAbsent          │ Integer   │ —     │ NO       │ 0              │ —       │
│ deductionAdvance         │ Integer   │ —     │ NO       │ 0              │ —       │
│ deductionOther           │ Integer   │ —     │ NO       │ 0              │ —       │
│ totalDeductions          │ Integer   │ —     │ NO       │ 0              │ —       │
│                          │           │       │          │                │         │
│ — Net & Payment ───────  │           │       │          │                │         │
│                          │           │       │          │                │         │
│ netSalary                │ Integer   │ —     │ YES      │ —              │ —       │
│ paymentStatus            │ String    │ 15    │ YES      │ pending        │ KEY     │
│ paidAmount               │ Integer   │ —     │ NO       │ 0              │ —       │
│ paidAt                   │ Datetime  │ —     │ NO       │ —              │ —       │
│ paymentMethod            │ String    │ 20    │ NO       │ cash           │ —       │
│ transactionRef           │ String    │ 100   │ NO       │ ""             │ —       │
│                          │           │       │          │                │         │
│ — Meta ─────────────── │           │       │          │                │         │
│                          │           │       │          │                │         │
│ generatedBy              │ String    │ 50    │ YES      │ —              │ —       │
│ notes                    │ String    │ 500   │ NO       │ ""             │ —       │
│ createdAt                │ Datetime  │ —     │ YES      │ —              │ KEY     │
└──────────────────────────┴───────────┴───────┴──────────┴────────────────┴─────────┘

Total attributes: 24

INDEXES (5):
  idx_staffId       → KEY         → staffId
  idx_month         → KEY         → month
  idx_year          → KEY         → year
  idx_staffMonth    → KEY+UNIQUE  → staffId + month + year (composite)
  idx_status        → KEY         → paymentStatus

PAYMENT STATUS: pending → paid → partial



# ───────────────────────────────────────────────────────────────
# 04. COLLECTION: salary_advances
# ENV: NEXT_PUBLIC_COL_SALARY_ADVANCES
# PURPOSE: Advance/loan tracking. Separate from salary.
# PERMISSIONS:
#   Create → admin, accountant
#   Read   → admin, accountant, self
#   Update → admin, accountant
# ───────────────────────────────────────────────────────────────

┌──────────────────────────┬───────────┬───────┬──────────┬────────────────┬─────────┐
│ Attribute                │ Type      │ Size  │ Required │ Default        │ Index   │
├──────────────────────────┼───────────┼───────┼──────────┼────────────────┼─────────┤
│ staffId                  │ String    │ 20    │ YES      │ —              │ KEY     │
│ amount                   │ Integer   │ —     │ YES      │ —              │ —       │
│ reason                   │ String    │ 500   │ YES      │ —              │ —       │
│ requestDate              │ Datetime  │ —     │ YES      │ —              │ —       │
│ status                   │ String    │ 15    │ YES      │ pending        │ KEY     │
│ approvedBy               │ String    │ 50    │ NO       │ ""             │ —       │
│ approvedAt               │ Datetime  │ —     │ NO       │ —              │ —       │
│ repaymentMonths          │ Integer   │ —     │ NO       │ 0              │ —       │
│ monthlyDeduction         │ Integer   │ —     │ NO       │ 0              │ —       │
│ remainingBalance         │ Integer   │ —     │ NO       │ 0              │ —       │
│ fullyRepaidAt            │ Datetime  │ —     │ NO       │ —              │ —       │
│ notes                    │ String    │ 500   │ NO       │ ""             │ —       │
│ createdAt                │ Datetime  │ —     │ YES      │ —              │ KEY     │
└──────────────────────────┴───────────┴───────┴──────────┴────────────────┴─────────┘

Total attributes: 13

INDEXES (3):
  idx_staffId  → KEY → staffId
  idx_status   → KEY → status
  idx_created  → KEY → createdAt

STATUS: pending → approved → rejected → repaid



# ───────────────────────────────────────────────────────────────
# 05. COLLECTION: leave_requests
# ENV: NEXT_PUBLIC_COL_LEAVE_REQUESTS
# PURPOSE: Leave applications with approval workflow.
# PERMISSIONS:
#   Create → authenticated users (staff)
#   Read   → admin, manager, self
#   Update → admin, manager
# ───────────────────────────────────────────────────────────────

┌──────────────────────────┬───────────┬───────┬──────────┬────────────────┬─────────┐
│ Attribute                │ Type      │ Size  │ Required │ Default        │ Index   │
├──────────────────────────┼───────────┼───────┼──────────┼────────────────┼─────────┤
│ staffId                  │ String    │ 20    │ YES      │ —              │ KEY     │
│ leaveType                │ String    │ 20    │ YES      │ —              │ KEY     │
│ startDate                │ String    │ 10    │ YES      │ —              │ —       │
│ endDate                  │ String    │ 10    │ YES      │ —              │ —       │
│ totalDays                │ Integer   │ —     │ YES      │ —              │ —       │
│ reason                   │ String    │ 1000  │ YES      │ —              │ —       │
│ attachmentUrl            │ String    │ 500   │ NO       │ ""             │ —       │
│ status                   │ String    │ 15    │ YES      │ pending        │ KEY     │
│ approvedBy               │ String    │ 50    │ NO       │ ""             │ —       │
│ approvedAt               │ Datetime  │ —     │ NO       │ —              │ —       │
│ approvalNote             │ String    │ 500   │ NO       │ ""             │ —       │
│ appliedAt                │ Datetime  │ —     │ YES      │ —              │ KEY     │
│ createdAt                │ Datetime  │ —     │ YES      │ —              │ —       │
└──────────────────────────┴───────────┴───────┴──────────┴────────────────┴─────────┘

Total attributes: 13

INDEXES (4):
  idx_staffId   → KEY → staffId
  idx_leaveType → KEY → leaveType
  idx_status    → KEY → status
  idx_appliedAt → KEY → appliedAt

LEAVE TYPES: casual / sick / annual / earned / without_pay / hajj
STATUS:      pending → approved → rejected → cancelled



# ───────────────────────────────────────────────────────────────
# 06. COLLECTION: attendance_staff
# ENV: NEXT_PUBLIC_COL_ATTENDANCE_STAFF
# PURPOSE: Daily attendance — NFC, manual, or self entry.
# PERMISSIONS:
#   Create → admin, manager, teacher (mark others), self
#   Read   → admin, manager, self
#   Update → admin, manager
# ───────────────────────────────────────────────────────────────

┌──────────────────────────┬───────────┬───────┬──────────┬────────────────┬─────────┐
│ Attribute                │ Type      │ Size  │ Required │ Default        │ Index   │
├──────────────────────────┼───────────┼───────┼──────────┼────────────────┼─────────┤
│ staffId                  │ String    │ 20    │ YES      │ —              │ KEY     │
│ date                     │ String    │ 10    │ YES      │ —              │ KEY     │
│ status                   │ String    │ 15    │ YES      │ —              │ KEY     │
│ checkIn                  │ String    │ 10    │ NO       │ ""             │ —       │
│ checkOut                 │ String    │ 10    │ NO       │ ""             │ —       │
│ method                   │ String    │ 10    │ YES      │ manual         │ —       │
│ nfcScanned               │ Boolean   │ —     │ NO       │ false          │ —       │
│ markedBy                 │ String    │ 50    │ YES      │ —              │ —       │
│ note                     │ String    │ 500   │ NO       │ ""             │ —       │
│ createdAt                │ Datetime  │ —     │ YES      │ —              │ —       │
└──────────────────────────┴───────────┴───────┴──────────┴────────────────┴─────────┘

Total attributes: 10

INDEXES (4):
  idx_staffId     → KEY         → staffId
  idx_date        → KEY         → date
  idx_staffDate   → KEY+UNIQUE  → staffId + date (composite — একদিনে একটাই record)
  idx_status      → KEY         → status

STATUS:  present / absent / late / half_day / on_leave
METHOD:  nfc / manual / self



# ───────────────────────────────────────────────────────────────
# 07. COLLECTION: policies
# ENV: NEXT_PUBLIC_COL_POLICIES
# PURPOSE: Institute policies — staff must read and sign.
# PERMISSIONS:
#   Create → admin
#   Read   → all authenticated
#   Update → admin
# ───────────────────────────────────────────────────────────────

┌──────────────────────────┬───────────┬───────┬──────────┬────────────────┬─────────┐
│ Attribute                │ Type      │ Size  │ Required │ Default        │ Index   │
├──────────────────────────┼───────────┼───────┼──────────┼────────────────┼─────────┤
│ titleEn                  │ String    │ 200   │ YES      │ —              │ —       │
│ titleBn                  │ String    │ 200   │ YES      │ —              │ —       │
│ type                     │ String    │ 30    │ YES      │ —              │ KEY     │
│ content                  │ String    │ 50000 │ YES      │ —              │ —       │
│ target                   │ String    │ 20    │ YES      │ all            │ KEY     │
│ effectiveDate            │ String    │ 10    │ YES      │ —              │ —       │
│ resignEvery              │ String    │ 15    │ YES      │ never          │ —       │
│ isActive                 │ Boolean   │ —     │ YES      │ true           │ KEY     │
│ publishedBy              │ String    │ 50    │ YES      │ —              │ —       │
│ createdAt                │ Datetime  │ —     │ YES      │ —              │ KEY     │
└──────────────────────────┴───────────┴───────┴──────────┴────────────────┴─────────┘

Total attributes: 10

INDEXES (3):
  idx_type     → KEY → type
  idx_target   → KEY → target
  idx_isActive → KEY → isActive

TYPE:     general / attendance / code_of_conduct / salary / academic
TARGET:   all / teachers_only / admin_only
RESIGN:   never / 1_year / 6_months



# ───────────────────────────────────────────────────────────────
# 08. COLLECTION: policy_acknowledgements
# ENV: NEXT_PUBLIC_COL_POLICY_ACKNOWLEDGEMENTS
# PURPOSE: Track who has signed which policy.
# PERMISSIONS:
#   Create → authenticated (staff signs own)
#   Read   → admin, self
# ───────────────────────────────────────────────────────────────

┌──────────────────────────┬───────────┬───────┬──────────┬────────────────┬─────────┐
│ Attribute                │ Type      │ Size  │ Required │ Default        │ Index   │
├──────────────────────────┼───────────┼───────┼──────────┼────────────────┼─────────┤
│ policyId                 │ String    │ 50    │ YES      │ —              │ KEY     │
│ staffId                  │ String    │ 20    │ YES      │ —              │ KEY     │
│ signedAt                 │ Datetime  │ —     │ YES      │ —              │ KEY     │
│ ipAddress                │ String    │ 50    │ NO       │ ""             │ —       │
│ userAgent                │ String    │ 500   │ NO       │ ""             │ —       │
└──────────────────────────┴───────────┴───────┴──────────┴────────────────┴─────────┘

Total attributes: 5

INDEXES (3):
  idx_policyId       → KEY        → policyId
  idx_staffId        → KEY        → staffId
  idx_policyStaff    → KEY+UNIQUE → policyId + staffId (composite)



# ═══════════════════════════════════════════════════════════════
# STORAGE BUCKETS (Staff Module)
# ═══════════════════════════════════════════════════════════════

┌──────────────────────────┬────────────────────────────────────┬──────────┬──────────────────────────────────┐
│ Bucket Name              │ ENV Variable                       │ Max Size │ Allowed Types                    │
├──────────────────────────┼────────────────────────────────────┼──────────┼──────────────────────────────────┤
│ staff_photos             │ NEXT_PUBLIC_BUCKET_STAFF_PHOTOS    │ 5 MB     │ image/jpeg, image/png, image/webp│
│ documents                │ NEXT_PUBLIC_BUCKET_DOCUMENTS       │ 10 MB    │ image/*, application/pdf         │
└──────────────────────────┴────────────────────────────────────┴──────────┴──────────────────────────────────┘



# ═══════════════════════════════════════════════════════════════
# ENV VARIABLES (.env.local)
# ═══════════════════════════════════════════════════════════════

NEXT_PUBLIC_COL_STAFF_APPLICATIONS=
NEXT_PUBLIC_COL_STAFF=
NEXT_PUBLIC_COL_STAFF_SALARIES=
NEXT_PUBLIC_COL_SALARY_ADVANCES=
NEXT_PUBLIC_COL_LEAVE_REQUESTS=
NEXT_PUBLIC_COL_ATTENDANCE_STAFF=
NEXT_PUBLIC_COL_POLICIES=
NEXT_PUBLIC_COL_POLICY_ACKNOWLEDGEMENTS=

NEXT_PUBLIC_BUCKET_STAFF_PHOTOS=
NEXT_PUBLIC_BUCKET_DOCUMENTS=



# ═══════════════════════════════════════════════════════════════
# ATTRIBUTE COUNT SUMMARY
# ═══════════════════════════════════════════════════════════════

  01. staff_applications       → 62 attributes
  02. staff                    → 68 attributes
  03. staff_salaries           → 24 attributes
  04. salary_advances          → 13 attributes
  05. leave_requests           → 13 attributes
  06. attendance_staff         → 10 attributes
  07. policies                 → 10 attributes
  08. policy_acknowledgements  →  5 attributes
  ──────────────────────────────────────────────
  TOTAL                        → 205 attributes



# ═══════════════════════════════════════════════════════════════
# APPLICATION FLOW
# ═══════════════════════════════════════════════════════════════
#
#  Public Form Submission
#         ↓
#  staff_applications (status: pending)
#         ↓
#    Admin Reviews
#         ↓
#   ┌─────┴─────┐
# APPROVE     REJECT
#   ↓            ↓
# Create      status: rejected
# staff       reviewNotes: reason
# record
#   ↓
# staff_applications.status → approved
# staff_applications.assignedStaffId → STF-XXXX
#
# ═══════════════════════════════════════════════════════════════