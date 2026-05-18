# Appwrite Database Schema - Current State

এই ডকুমেন্টে আপনার Appwrite ডাটাবেসের বর্তমান সব কালেকশন এবং সেগুলোর অ্যাট্রিবিউটগুলোর তালিকা দেওয়া হলো।

## ১. `students` (ছাত্রদের তথ্য)
| Attribute | Type | Required | Size/Format |
| :--- | :--- | :--- | :--- |
| `$id` | string | Yes | - |
| `userId` | string | No | 500 |
| `studentId` | string | Yes | 20 |
| `admissionNo` | string | No | 500 |
| `nameEn` | string | Yes | 255 |
| `nameBn` | string | Yes | 255 |
| `fatherNameBn` | string | Yes | 255 |
| `fatherNameEn` | string | Yes | 255 |
| `motherNameBn` | string | Yes | 255 |
| `motherNameEn` | string | Yes | 255 |
| `dateOfBirth` | datetime | Yes | - |
| `gender` | enum | Yes | - |
| `bloodGroup` | enum | Yes | - |
| `nationality` | string | Yes | 255 |
| `religion` | enum | Yes | - |
| `birthCertNo` | string | No | 49 |
| `nidNumber` | string | No | 20 |
| `photo` | url | No | - |
| `isHafiz` | boolean | No | - |
| `phonePrimary` | string | No | 20 |
| `guardianPhone` | string | Yes | 20 |
| `whatsappNo` | string | No | 20 |
| `email` | datetime | No | - |
| `presentVillage` | string | Yes | 255 |
| `presentThana` | string | Yes | 255 |
| `presentDistrict` | string | Yes | 254 |
| `presentDivision` | string | Yes | 255 |
| `presentUnion` | string | Yes | 255 |
| `presentPostOffice` | string | No | 255 |
| `presentPostCode` | integer | No | - |
| `permanentVillage` | string | No | 199 |
| `permanentThana` | string | No | 222 |
| `permanentDistrict` | string | No | 222 |
| `permanentDivision` | string | No | 222 |
| `permanentUnion` | string | No | 222 |
| `permanentPostOffice` | string | No | 222 |
| `permanentPostCode` | integer | No | - |
| `status` | enum | No | active/inactive |
| `admissionDate` | datetime | Yes | - |
| `previousSchoolName` | string | No | 500 |
| `previousClassName` | string | No | 255 |
| `previousResult` | string | No | 50 |
| `transferCertificateUrl` | string | No | 500 |
| `notes` | string | No | 500 |
| `createdBy` | string | No | 255 |

## ২. `student_enrollments` (ভর্তির একাডেমিক তথ্য)
- `enrollmentId` (string)
- `studentId` (string)
- `departmentId` (string)
- `classId` (string)
- `section` (string)
- `rollNo` (string)
- `session` (string)
- `shift` (enum)
- `boardingType` (enum)
- `status` (enum)
- `enrollmentDate` (datetime)
- `promotedFrom` (string)
- `notes` (string)

## ৩. `sessions` (সেশন)
- `sessionName` (string)
- `startDate` (datetime)
- `endDate` (datetime)
- `isActive` (boolean)
- `isCurrent` (boolean)

## ৪. `sections` (সেকশন)
- `sectionName` (string)
- `sectionNameBn` (string)
- `capacity` (integer)
- `isActive` (boolean)

## ৫. `fee_types` (ফিসের ধরণ)
- `name` (string)
- `nameBn` (string)
- `code` (string)
- `category` (string)
- `billingCycle` (string)
- `applicableTo` (string)
- `departmentIds[]` (string array)
- `isRequired` (boolean)
- `isActive` (boolean)
- `showInAdmissionForm` (boolean)
- `defaultAmount` (integer)
- `boardingTypes[]` (string array)

## ৬. `fee_structures` (ফিস স্ট্রাকচার)
- `feeTypeId` (string)
- `feeTypeCode` (string)
- `departmentId` (string)
- `classId` (string)
- `boardingType` (string)
- `amount` (integer)
- `isActive` (boolean)

## ৭. `fee_invoices` (রসিদ/বিল)
- `invoiceId` (string)
- `studentId` (string)
- `enrollmentId` (string)
- `departmentCode` (string)
- `invoiceType` (string)
- `month` (string)
- `totalAmount` (integer)
- `discount` (integer)
- `netAmount` (integer)
- `paidAmount` (integer)
- `dueAmount` (integer)
- `status` (enum)

## ৮. `fee_payments` (টাকা জমার রেকর্ড)
- `paymentId` (string)
- `receiptNo` (string)
- `invoiceId` (string)
- `studentId` (string)
- `amountPaid` (integer)
- `paymentMethod` (enum)
- `paymentDate` (datetime)

## ৯. `departments` (বিভাগ)
- `name` (string)
- `nameBn` (string)
- `code` (string)
- `type` (string)
- `isActive` (boolean)

## ১০. `classes` (শ্রেণী)
- `name` (string)
- `nameBn` (string)
- `departmentId` (string)
- `level` (integer)
- `isActive` (boolean)
- `monthlyFee` (integer)

## ১১. `boarding_types` (বোর্ডিং ধরণ)
- `name` (string)
- `nameBn` (string)
- `monthlyFee` (integer)
- `isActive` (boolean)

## ১২. `staff` (স্টাফ তালিকা)
- `staffId` (string)
- `name` (string)

## ১৩. `staff_applications` (স্টাফ নিয়োগ আবেদন)
- `applicationId` (string)
- `status` (enum)
- `nameBn` (string)
- `nameEn` (string)
- `nidNumber` (string)
- `phonePrimary` (string)
- `designation_id` (string)
- `education[]` (string array)
- `expectedSalary` (integer)
- `photoUrl` (string)
- `cvUrl` (string)
- `signatureUrl` (url)
- *(এবং আরও অনেক ব্যক্তিগত ও পেশাগত তথ্য)*

## ১৪. `terms_conditions` (শর্তাবলী)
- `designation_id` (string)
- `title` (string)
- `is_active` (boolean)
- `sections` (string/text)

## ১৫. `users` (ইউজার ও অ্যাডমিন)
- `name` (string)
- `email` (email)
- `role` (enum)
- `phone` (string)
- `isActive` (boolean)

## ১৬. `designations` (পদবী)
- `label_en` (string)
- `label_bn` (string)
- `category` (string)
- `has_terms` (boolean)
- `is_active` (boolean)
- `sort_order` (integer)
