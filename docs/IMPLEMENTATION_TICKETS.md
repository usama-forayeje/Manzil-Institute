# Implementation Tickets for Student Admission System
## Manzil International Institute Management System

Based on DATABASE_SETUP.md. Tickets are ordered by priority (database setup first, then config, actions, UI, pages).

---

## TICKET-001: Create students Collection
**Priority:** High  
**Status:** To Do  
**Assignee:** Dev  
**Description:** Create the students collection in Appwrite with all attributes, indexes, and default data.  
**Acceptance Criteria:** 
- Collection created with exact attributes from doc.
- Indexes added (studentId UNIQUE, etc.).
- Default data inserted (none, as it's dynamic).
**Dependencies:** None  
**Estimate:** 30 min

---

## TICKET-002: Create student_enrollments Collection
**Priority:** High  
**Status:** To Do  
**Assignee:** Dev  
**Description:** Create the student_enrollments collection with attributes, indexes.  
**Acceptance Criteria:** 
- Attributes and composite indexes added.
- No default data (dynamic).  
**Dependencies:** TICKET-001  
**Estimate:** 20 min

---

## TICKET-003: Create departments Collection
**Priority:** High  
**Status:** To Do  
**Assignee:** Dev  
**Description:** Create departments collection with default data (MDR, SCH, TEC).  
**Acceptance Criteria:** 
- Default records inserted.  
**Dependencies:** None  
**Estimate:** 15 min

---

## TICKET-004: Create classes Collection
**Priority:** High  
**Status:** To Do  
**Assignee:** Dev  
**Description:** Create classes collection with default data for all departments.  
**Acceptance Criteria:** 
- ~32 records for Madrasa/School/Technical.  
**Dependencies:** TICKET-003  
**Estimate:** 30 min

---

## TICKET-005: Create fee_types Collection
**Priority:** High  
**Status:** To Do  
**Assignee:** Dev  
**Description:** Create ee_types with attributes, indexes, and ~15 default fee types.  
**Acceptance Criteria:** 
- All admission, monthly, exam, other fees added.  
**Dependencies:** None  
**Estimate:** 45 min

---

## TICKET-006: Create fee_structures Collection
**Priority:** High  
**Status:** To Do  
**Assignee:** Dev  
**Description:** Create ee_structures with attributes, indexes, and ~50 default records.  
**Acceptance Criteria:** 
- Fee amounts per class/boarding/session.  
**Dependencies:** TICKET-005, TICKET-004  
**Estimate:** 1 hour

---

## TICKET-007: Create Remaining Collections (fee_invoices, fee_payments, exam_schedules, exam_fees, nfc_cards, attendance_students, zakat_fund)
**Priority:** High  
**Status:** To Do  
**Assignee:** Dev  
**Description:** Create all remaining 7 collections with attributes and indexes.  
**Acceptance Criteria:** 
- All schemas matched exactly.  
**Dependencies:** Previous collections  
**Estimate:** 2 hours

---

## TICKET-008: Create Cloudflare R2 Buckets
**Priority:** High  
**Status:** To Do  
**Assignee:** Dev/Ops  
**Description:** Create R2 buckets for student_photos, documents, receipts with limits.  
**Acceptance Criteria:** 
- Buckets created, API access configured.  
**Dependencies:** None  
**Estimate:** 30 min

---

## TICKET-009: Update .env.local with Collection IDs and R2
**Priority:** High  
**Status:** To Do  
**Assignee:** Dev  
**Description:** Add all NEXT_PUBLIC_COL_* and NEXT_PUBLIC_BUCKET_* to .env.local.  
**Acceptance Criteria:** 
- File updated, IDs copied from Appwrite console.  
**Dependencies:** All collection creation  
**Estimate:** 15 min

---

## TICKET-010: Update config/appwrite.ts with New Collection IDs
**Priority:** Medium  
**Status:** To Do  
**Assignee:** Dev  
**Description:** Add new collection IDs to the config file.  
**Acceptance Criteria:** 
- File updated for all 13 collections.  
**Dependencies:** TICKET-009  
**Estimate:** 20 min

---

## TICKET-011: Create Zod Validations for Admission Form
**Priority:** Medium  
**Status:** To Do  
**Assignee:** Dev  
**Description:** Create lib/validations/admission.ts with schemas for all 5 steps.  
**Acceptance Criteria:** 
- Step 1-5 schemas with proper validation.  
**Dependencies:** None  
**Estimate:** 1 hour

---

## TICKET-012: Create Zustand Store for Admission Form
**Priority:** Medium  
**Status:** To Do  
**Assignee:** Dev  
**Description:** Create lib/stores/admissionFormStore.ts for form persistence.  
**Acceptance Criteria:** 
- Store with sessionStorage, follows staffFormStore pattern.  
**Dependencies:** None  
**Estimate:** 45 min

---

## TICKET-013: Implement createAdmission Server Action
**Priority:** Medium  
**Status:** To Do  
**Assignee:** Dev  
**Description:** Build lib/actions/admission.ts with photo upload, ID generation, inserts.  
**Acceptance Criteria:** 
- Full function working, creates student + enrollments + invoice + payment.  
**Dependencies:** TICKET-011, TICKET-012, Config  
**Estimate:** 2 hours

---

## TICKET-014: Implement Fee Actions (generateInvoices, collectPayment)
**Priority:** Medium  
**Status:** To Do  
**Assignee:** Dev  
**Description:** Build lib/actions/fees.ts for monthly invoices and payments.  
**Acceptance Criteria:** 
- generateMonthlyInvoices with fund check for poor students.  
**Dependencies:** Fee collections  
**Estimate:** 1.5 hours

---

## TICKET-015: Implement Attendance Actions (processNfcScan, markManual)
**Priority:** Medium  
**Status:** To Do  
**Assignee:** Dev  
**Description:** Build lib/actions/attendance.ts for NFC and manual attendance.  
**Acceptance Criteria:** 
- NFC scan processes multi-enrollments.  
**Dependencies:** Attendance collections  
**Estimate:** 1 hour

---

## TICKET-016: Create AdmissionForm.tsx (Multi-Step Controller)
**Priority:** Low  
**Status:** To Do  
**Assignee:** Dev  
**Description:** Build components/admission/AdmissionForm.tsx with 5 steps.  
**Acceptance Criteria:** 
- Controller with navigation, follows StaffForm pattern.  
**Dependencies:** Store, validations  
**Estimate:** 1 hour

---

## TICKET-017: Create Step Components (Step1 to Step5)
**Priority:** Low  
**Status:** To Do  
**Assignee:** Dev  
**Description:** Build all 5 step components with forms and file uploads.  
**Acceptance Criteria:** 
- Each step functional, integrates with store.  
**Dependencies:** TICKET-016  
**Estimate:** 2 hours

---

## TICKET-018: Create Fee Components (FeeStructureManager, InvoiceList, PaymentForm, Receipt)
**Priority:** Low  
**Status:** To Do  
**Assignee:** Dev  
**Description:** Build components/fees/ with all fee-related UI.  
**Acceptance Criteria:** 
- Receipt printable, fee calculation dynamic.  
**Dependencies:** Fee actions  
**Estimate:** 2 hours

---

## TICKET-019: Create NFC Components (NFCScanner, GateMode)
**Priority:** Low  
**Status:** To Do  
**Assignee:** Dev  
**Description:** Build components/nfc/ for NFC scanning and gate display.  
**Acceptance Criteria:** 
- Web NFC API integrated.  
**Dependencies:** Attendance actions  
**Estimate:** 1 hour

---

## TICKET-020: Create Admin Pages (Admission, Fees, Attendance, NFC)
**Priority:** Low  
**Status:** To Do  
**Assignee:** Dev  
**Description:** Build all /dashboard/admin/ pages.  
**Acceptance Criteria:** 
- Pages functional, integrate components.  
**Dependencies:** All components  
**Estimate:** 2 hours

---

## TICKET-021: Testing and Bug Fixes
**Priority:** Low  
**Status:** To Do  
**Assignee:** Dev  
**Description:** Test full flow, fix issues.  
**Acceptance Criteria:** 
- End-to-end testing with Playwright.  
**Dependencies:** All tickets  
**Estimate:** 2 hours

---

**Total Estimated Time:** ~20 hours  
**Order:** Complete High priority first (database), then Medium (config/actions), then Low (UI/pages).
