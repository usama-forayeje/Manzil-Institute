# Appwrite Database Collections - Manzil International Institute

Ei file e appwrite database er jonno required collections ebong attributes gulo likha hoyeche. 

---

## 1. ADMISSION_DATA Collection

**Collection ID:** `NEXT_PUBLIC_COL_ADMISSION_DATA`

### Attributes

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `language` | string | ✅ Yes | Language: `en` or `bn` |
| `title` | string | ✅ Yes | Page title |
| `description` | string | ❌ No | Page description |
| `process` | string (JSON) | ❌ No | Admission process steps array |
| `requirements` | string (JSON) | ❌ No | Level-wise requirements |
| `feeStructure` | string (JSON) | ❌ No | Fee details |
| `importantDates` | string (JSON) | ❌ No | Important dates array |
| `contact` | string (JSON) | ❌ No | Contact info (phone, email, address) |
| `updated_by` | string | ❌ No | Admin user ID who updated |
| `updated_at` | datetime | ❌ No | Last update timestamp |

### Example JSON Structure for `process`

```json
[
  {
    "step": "1",
    "title": "Online Application",
    "description": "Submit your application through our online portal",
    "duration": "1-2 days",
    "color": "blue",
    "requirements": ["Valid email", "Parent contact", "Student details"]
  }
]
```

### Example JSON Structure for `requirements`

```json
{
  "level1": {
    "age": "Below 6 years",
    "academic": ["Basic alphabet", "Simple counting", "Islamic phrases"],
    "documents": ["Birth certificate", "2 photos", "Parent ID copy"]
  },
  "level2": {
    "age": "Below 9 years",
    "academic": ["Basic reading", "Simple math", "Islamic knowledge"],
    "documents": ["Birth certificate", "School certificates", "Photos", "Medical"]
  }
}
```

### Example JSON Structure for `feeStructure`

```json
{
  "oneTime": [
    {"name": "Admission Fee", "amount": "BDT 30,000"},
    {"name": "Session Fee", "amount": "BDT 25,000"}
  ],
  "monthly": {
    "tuition": [
      {"name": "Level 1-2", "amount": "BDT 2,000"},
      {"name": "Level 3", "amount": "BDT 2,500"}
    ],
    "residential": [
      {"name": "Standard Room", "amount": "BDT 3,500"}
    ],
    "food": [
      {"name": "Basic Package", "amount": "BDT 9,000"}
    ]
  }
}
```

---

## 2. CURRICULUM_DATA Collection

**Collection ID:** `NEXT_PUBLIC_COL_CURRICULUM_DATA`

### Attributes

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `curriculum_type` | string | ✅ Yes | `mic` (Manzil International) or `mnc` (Madrasa) |
| `language` | string | ✅ Yes | Language: `en` or `bn` |
| `title` | string | ✅ Yes | Curriculum title |
| `subtitle` | string | ❌ No | Curriculum subtitle |
| `overview` | string (JSON) | ❌ No | Overview stats (total levels, years, age range) |
| `levels` | string (JSON) | ❌ No | Level-wise curriculum details |
| `sectionTitles` | string (JSON) | ❌ No | Section titles for UI |
| `keyFeatures` | string (JSON) | ❌ No | Key features array (MIC only) |
| `updated_by` | string | ❌ No | Admin user ID |
| `updated_at` | datetime | ❌ No | Last update timestamp |

### Example JSON Structure for MIC `overview`

```json
{
  "totalLevels": 6,
  "levelsLabel": "Levels",
  "totalYears": 22,
  "yearsLabel": "Years",
  "ageRange": "4-25",
  "ageRangeLabel": "Years",
  "streamsLabel": "Streams"
}
```

### Example JSON Structure for MIC `levels`

```json
[
  {
    "level": "Level 1",
    "title": "Foundation Stage",
    "age": "04-08 Years",
    "duration": "5 Years",
    "color": "blue",
    "icon": "Star",
    "darseNizami": "Nurami, Nazara",
    "generalEducation": ["Ibtidaiyyah / Junior / PSC"],
    "internationalEducation": ["Grade 1 to Grade 5"],
    "technicalActivities": ["Handwriting", "Cooking", "Computer Basics"],
    "languageSports": ["Bengali", "Swimming"],
    "economyTarbiyah": ["Faith in Allah"],
    "foodSurvival": ["Organic Food", "Fire Safety"]
  }
]
```

### Example JSON Structure for MIC `keyFeatures`

```json
[
  {
    "title": "Integrated Education",
    "description": "Combines Darse Nizami, International Curriculum & Technical Education",
    "color": "blue",
    "icon": "Layers"
  },
  {
    "title": "Global Certification",
    "description": "Internationally recognized certifications",
    "color": "green",
    "icon": "Globe"
  }
]
```

### Example JSON Structure for MNC `levels`

```json
[
  {
    "level": "Khususi Jamat",
    "title": "Foundation (1-2 Years)",
    "age": "10-12 Years",
    "duration": "1 Year",
    "color": "blue",
    "icon": "Star",
    "madrasaLabel": "Madrasa",
    "generalLabel": "General",
    "technicalLabel": "Technical",
    "description": "Building strong foundations",
    "subjects": {
      "madrasa": ["Qaida & Nazira", "Dars-e-Nizami"],
      "general": ["English", "Math", "Bangla"],
      "technical": ["Computer Basics", "Art & Craft"]
    }
  }
]
```

---

## 3. DAILY_ROUTINE Collection

**Collection ID:** `NEXT_PUBLIC_COL_DAILY_ROUTINE`

Daily class/routine schedule for students.

### Attributes

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `day` | string | ✅ Yes | Day name: `saturday`, `sunday`, `monday`, etc. |
| `class_id` | string | ✅ Yes | Class ID from CLASSES collection |
| `periods` | string (JSON) | ❌ No | Array of period schedules |
| `is_active` | boolean | ❌ No | Active status |
| `effective_from` | datetime | ❌ No | Routine effective from date |

### Example JSON Structure for `periods`

```json
[
  {
    "period": 1,
    "time_start": "07:00",
    "time_end": "07:45",
    "subject": "Quran",
    "teacher_id": "teacher_doc_id",
    "room": "Room 1"
  },
  {
    "period": 2,
    "time_start": "07:45",
    "time_end": "08:30",
    "subject": "Bangla",
    "teacher_id": "teacher_doc_id",
    "room": "Room 2"
  }
]
```

---

## 4. MEAL_PLAN Collection

**Collection ID:** `NEXT_PUBLIC_COL_MEAL_PLAN`

Monthly meal planning for students (hostel).

### Attributes

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `month` | string | ✅ Yes | Month: `2025-01`, `2025-02`, etc. |
| `year` | integer | ✅ Yes | Year: 2025 |
| `meals` | string (JSON) | ❌ No | Daily meal schedule |
| `is_active` | boolean | ❌ No | Active status |

### Example JSON Structure for `meals`

```json
[
  {
    "day": 1,
    "breakfast": ["Pitha", "Cha"],
    "lunch": ["Rice", "Dal", "Vegetables", "Fish"],
    "dinner": ["Rice", "Chicken", "Salad"]
  },
  {
    "day": 2,
    "breakfast": ["Parota", "Tea"],
    "lunch": ["Rice", "Dal", "Bhorta"],
    "dinner": ["Kichuri", "Egg"]
  }
]
```

---

## 5. CLASS_ROUTINE Collection

**Collection ID:** `NEXT_PUBLIC_COL_CLASS_ROUTINE`

Weekly class-wise routine for each class.

### Attributes

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `class_id` | string | ✅ Yes | Class ID |
| `section` | string | ❌ No | Section (A, B, etc.) |
| `routine` | string (JSON) | ❌ No | Weekly routine |
| `effective_from` | datetime | ❌ No | Effective date |

### Example JSON Structure for `routine`

```json
{
  "saturday": [
    {"period": 1, "subject": "Math", "teacher": "Mr. X", "room": "R1"},
    {"period": 2, "subject": "English", "teacher": "Ms. Y", "room": "R2"}
  ],
  "sunday": [
    {"period": 1, "subject": "Science", "teacher": "Mr. Z", "room": "R3"}
  ]
}
```

---

## 6. EXAM_SCHEDULE Collection

**Collection ID:** `NEXT_PUBLIC_COL_EXAM_SCHEDULE`

Exam timing and schedule.

### Attributes

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `exam_id` | string | ✅ Yes | Exam ID from EXAMS collection |
| `class_id` | string | ✅ Yes | Class ID |
| `schedule` | string (JSON) | ❌ No | Exam date/time schedule |
| `is_published` | boolean | ❌ No | Published to students |

### Example JSON Structure for `schedule`

```json
[
  {
    "date": "2025-03-15",
    "subject": "Mathematics",
    "time_start": "09:00",
    "time_end": "11:00",
    "room": "Hall A"
  },
  {
    "date": "2025-03-17",
    "subject": "English",
    "time_start": "09:00",
    "time_end": "11:00",
    "room": "Hall B"
  }
]
```

---

## 7. ACADEMIC_CALENDAR Collection

**Collection ID:** `NEXT_PUBLIC_COL_ACADEMIC_CALENDAR`

Vacation calendar, holidays, and academic events throughout the year.

### Attributes

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `year` | integer | ✅ Yes | Year: 2025 |
| `events` | string (JSON) | ❌ No | Array of events |
| `is_active` | boolean | ❌ No | Active status |

### Example JSON Structure for `events`

```json
[
  {
    "id": "eid_001",
    "title": "Eid-ul-Fitr",
    "title_bn": "ঈদুল ফিতর",
    "type": "holiday",
    "start_date": "2025-03-30",
    "end_date": "2025-04-02",
    "is_optional": false,
    "description": "Eid festival holiday"
  },
  {
    "id": "eid_002",
    "title": "Pohela Boishakh",
    "title_bn": "পহেলা বৈশাখ",
    "type": "holiday",
    "start_date": "2025-04-14",
    "end_date": "2025-04-14",
    "is_optional": true,
    "description": "Bengali New Year"
  },
  {
    "id": "evt_001",
    "title": "Annual Exam",
    "title_bn": "বার্ষিক পরীক্ষা",
    "type": "exam",
    "start_date": "2025-11-01",
    "end_date": "2025-11-30",
    "is_optional": false,
    "description": "Annual examination period"
  },
  {
    "id": "evt_002",
    "title": "Sports Day",
    "title_bn": "ক্রীড়া দিবস",
    "type": "event",
    "start_date": "2025-02-15",
    "end_date": "2025-02-15",
    "is_optional": false,
    "description": "Annual sports competition"
  },
  {
    "id": "break_001",
    "title": "Winter Break",
    "title_bn": "শীতকালীন অবকাশ",
    "type": "vacation",
    "start_date": "2025-12-20",
    "end_date": "2025-12-31",
    "is_optional": false,
    "description": "Winter vacation for students"
  },
  {
    "id": "evt_003",
    "title": "Parent Teacher Meeting",
    "title_bn": "অভিভাবক-শিক্ষক সভা",
    "type": "meeting",
    "start_date": "2025-06-15",
    "end_date": "2025-06-15",
    "is_optional": false,
    "description": "PTM for all classes"
  }
]
```

### Event Types

| Type | Description | Color in UI |
|------|-------------|-------------|
| `holiday` | Govt/System holidays | Red |
| `vacation` | School vacations | Orange |
| `exam` | Exam periods | Purple |
| `event` | Special events | Blue |
| `meeting` | Meetings (PTM, etc.) | Green |
| `activity` | Extra activities | Yellow |

---

## 8. NOTICE Collection

**Collection ID:** `NEXT_PUBLIC_COL_NOTICES`

Notices for students, staff, parents.

### Attributes

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | ✅ Yes | Notice title |
| `content` | string | ✅ Yes | Notice body |
| `notice_type` | string | ✅ Yes | `general`, `exam`, `event`, `urgent` |
| `target_roles` | string (JSON) | ❌ No | Who should see: `["student", "parent"]` |
| `target_classes` | string (JSON) | ❌ No | Which classes: `["class_1", "class_2"]` |
| `is_published` | boolean | ❌ No | Published status |
| `publish_date` | datetime | ❌ No | When to publish |
| `expire_date` | datetime | ❌ No | Expiry date |
| `attachments` | string (JSON) | ❌ No | File IDs |
| `created_by` | string | ❌ No | Admin ID |
| `created_at` | datetime | ❌ No | Creation timestamp |

---

## 8. DESIGNATIONS Collection

**Collection ID:** `NEXT_PUBLIC_COL_DESIGNATIONS`

### Attributes

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `designation_id` | string | ✅ Yes | Unique ID (e.g., `principal`, `teacher`) |
| `label_bn` | string | ✅ Yes | Bengali label |
| `label_en` | string | ✅ Yes | English label |
| `category` | string | ❌ No | Category: `leadership`, `teachers`, `it`, `admin`, `support`, `other` |
| `has_terms` | boolean | ❌ No | Has terms & conditions |
| `is_active` | boolean | ❌ No | Active status |
| `sort_order` | integer | ❌ No | Display order |

---

## 9. TERMS_CONDITIONS Collection

**Collection ID:** `NEXT_PUBLIC_COL_TERMS_CONDITIONS`

### Attributes

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `designation_id` | string | ✅ Yes | Links to DESIGNATIONS collection |
| `title` | string | ✅ Yes | Terms document title |
| `sections` | string (JSON) | ❌ No | Array of sections with title and content |
| `is_active` | boolean | ❌ No | Active status |
| `updated_by` | string | ❌ No | Admin user ID |
| `updated_at` | datetime | ❌ No | Last update timestamp |

### Example JSON Structure for `sections`

```json
[
  {
    "title": "Job Responsibilities",
    "content": [
      "Teaching as per curriculum",
      "Preparing lesson plans",
      "Conducting assessments"
    ]
  },
  {
    "title": "Code of Conduct",
    "content": [
      "Maintain discipline",
      "Professional behavior",
      "Punctuality"
    ]
  }
]
```

---

## Environment Variables (.env.local)

```env
# Database Collections
NEXT_PUBLIC_COL_ADMISSION_DATA=your_admission_data_collection_id
NEXT_PUBLIC_COL_CURRICULUM_DATA=your_curriculum_data_collection_id
NEXT_PUBLIC_COL_DAILY_ROUTINE=your_daily_routine_collection_id
NEXT_PUBLIC_COL_MEAL_PLAN=your_meal_plan_collection_id
NEXT_PUBLIC_COL_CLASS_ROUTINE=your_class_routine_collection_id
NEXT_PUBLIC_COL_EXAM_SCHEDULE=your_exam_schedule_collection_id
NEXT_PUBLIC_COL_ACADEMIC_CALENDAR=your_academic_calendar_collection_id
NEXT_PUBLIC_COL_NOTICES=your_notices_collection_id
NEXT_PUBLIC_COL_DESIGNATIONS=your_designations_collection_id
NEXT_PUBLIC_COL_TERMS_CONDITIONS=your_terms_conditions_collection_id

# Existing Collections (from config)
NEXT_PUBLIC_COL_USERS=your_users_collection_id
NEXT_PUBLIC_COL_STUDENTS=your_students_collection_id
NEXT_PUBLIC_COL_STAFF=your_staff_collection_id
NEXT_PUBLIC_COL_CLASSES=your_classes_collection_id
NEXT_PUBLIC_COL_EXAMS=your_exams_collection_id
# ... etc
```

---

## How to Create Collections in Appwrite Console

1. **Login to Appwrite Console**
2. **Go to your project** → **Databases**
3. **Create Database** (if not exists): `Manzil Institute`
4. **Create Collections** one by one with above attributes
5. **Set Attributes**: Create each attribute with correct type
6. **Add Documents**: Insert sample data using the JSON examples above

---

## Notes

- JSON fields store data as string - app converts to object at runtime
- Collections fallback to empty/default if not configured
- All timestamps use ISO 8601 format
- Language always lowercase: `en` or `bn`
- Date formats: `YYYY-MM-DD`, Month format: `YYYY-MM`