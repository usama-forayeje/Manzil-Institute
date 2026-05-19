// ============================================================
// NAV CONFIG — Manzil Institute Management System
// Roles: super_admin | admin | manager | teacher | accountant | parent
// ============================================================

export type NavItem = {
  title:    string;       // English label
  titleBn:  string;       // Bengali label
  href:     string;       // route
  icon:     NavIcon;      // icon key (map করো Lucide icons এ)
  badge?:   string;       // optional badge text e.g. "New", "3"
  badgeVariant?: "default" | "destructive" | "warning" | "success";
  items?:   NavItem[];    // sub-menu items (1 level deep only)
  adminOnly?: boolean;    // super_admin only items
  dividerBefore?: boolean;// section separator এর আগে
};

export type NavIcon =
  | "dashboard"  | "students"   | "staff"      | "teacher"
  | "classes"    | "attendance" | "fees"        | "expenses"
  | "boarding"   | "notices"    | "reports"     | "settings"
  | "nfc"        | "library"    | "salary"      | "leave"
  | "exam"       | "timetable"  | "messages"    | "profile"
  | "child"      | "tools"      | "audit"       | "policies"
  | "health"     | "receipt"    | "accounts"    | "terms"
  | "designations";

// ─── SUPER ADMIN ───────────────────────────────────────────
// সম্পূর্ণ system এর access — কোনো restriction নেই
const superAdminNav: NavItem[] = [
  {
    title: "Dashboard",
    titleBn: "ড্যাশবোর্ড",
    href: "/dashboard/admin",
    icon: "dashboard",
  },

  // ── শিক্ষার্থী ──────────────────────────────────────────
  {
    title: "Students",
    titleBn: "শিক্ষার্থী",
    href: "/dashboard/admin/students",
    icon: "students",
    items: [
      {
        title: "All Students",
        titleBn: "সকল শিক্ষার্থী",
        href: "/dashboard/admin/students",
        icon: "students",
      },
      {
        title: "New Admission",
        titleBn: "নতুন ভর্তি",
        href: "/dashboard/admin/students/admission",
        icon: "students",
      },
      {
        title: "ID Cards",
        titleBn: "আইডি কার্ড",
        href: "/dashboard/admin/id-cards",
        icon: "students",
      },
      {
        title: "Documents",
        titleBn: "কাগজপত্র",
        href: "/dashboard/admin/students/documents",
        icon: "reports",
      },
      {
        title: "Promote Students",
        titleBn: "ক্লাস প্রমোশন",
        href: "/dashboard/admin/students/promote",
        icon: "classes",
      },
    ],
  },

  // ── কর্মচারী ───────────────────────────────────────────
  {
    title: "Staff",
    titleBn: "কর্মচারী",
    href: "/dashboard/admin/staff",
    icon: "staff",
    items: [
      {
        title: "All Staff",
        titleBn: "সকল কর্মচারী",
        href: "/dashboard/admin/staff",
        icon: "staff",
      },
      {
        title: "Add Staff",
        titleBn: "স্টাফ যোগ করুন",
        href: "/dashboard/admin/staff/add",
        icon: "staff",
      },
      {
        title: "Salary",
        titleBn: "বেতন",
        href: "/dashboard/admin/staff/salary",
        icon: "salary",
      },
      {
        title: "Leave",
        titleBn: "ছুটি ব্যবস্থাপনা",
        href: "/dashboard/admin/leave",
        icon: "leave",
      },
      {
        title: "Policies",
        titleBn: "নীতিমালা",
        href: "/dashboard/admin/staff/policies",
        icon: "policies",
      },
      {
        title: "Designations",
        titleBn: "পদবী / পদমর্যাদা",
        href: "/dashboard/admin/settings/designations",
        icon: "designations",
      },
      {
        title: "Terms & Conditions",
        titleBn: "নিয়ম ও শর্তাবলী",
        href: "/dashboard/admin/settings/terms",
        icon: "terms",
      },
    ],
  },

  // ── একাডেমিক ───────────────────────────────────────────
  {
    title: "Academics",
    titleBn: "একাডেমিক",
    href: "/dashboard/admin/academics",
    icon: "classes",
    dividerBefore: true,
    items: [
      {
        title: "Sessions",
        titleBn: "সেশন",
        href: "/dashboard/admin/academics/sessions",
        icon: "timetable",
      },
      {
        title: "Departments",
        titleBn: "বিভাগ",
        href: "/dashboard/admin/academics/departments",
        icon: "classes",
      },
      {
        title: "Classes",
        titleBn: "শ্রেণী",
        href: "/dashboard/admin/academics/classes",
        icon: "classes",
      },
      {
        title: "Sections",
        titleBn: "সেকশন",
        href: "/dashboard/admin/academics/sections",
        icon: "classes",
      },
      // {
      //   title: "Subjects",
      //   titleBn: "বিষয়সমূহ",
      //   href: "/dashboard/admin/academics/subjects",
      //   icon: "classes",
      // },
    ],
  },

  // ── উপস্থিতি ───────────────────────────────────────────
  {
    title: "Attendance",
    titleBn: "উপস্থিতি",
    href: "/dashboard/admin/attendance",
    icon: "attendance",
    items: [
      {
        title: "Staff Attendance",
        titleBn: "স্টাফ উপস্থিতি",
        href: "/dashboard/admin/attendance/staff",
        icon: "attendance",
      },
      {
        title: "Student Attendance",
        titleBn: "শিক্ষার্থী উপস্থিতি",
        href: "/dashboard/admin/attendance/students",
        icon: "attendance",
      },
      {
        title: "NFC Gate Mode",
        titleBn: "গেট মোড (NFC)",
        href: "/dashboard/admin/nfc/gate",
        icon: "nfc",
        badge: "NFC",
        badgeVariant: "success",
      },
    ],
  },

  // ── অর্থ ব্যবস্থাপনা ──────────────────────────────────
  {
    title: "Fees",
    titleBn: "ফি ব্যবস্থাপনা",
    href: "/dashboard/admin/fees",
    icon: "fees",
    dividerBefore: true,
    items: [
      {
        title: "Fee Dashboard",
        titleBn: "ফি ড্যাশবোর্ড",
        href: "/dashboard/admin/fees",
        icon: "fees",
      },
      {
        title: "Generate Invoices",
        titleBn: "ইনভয়েস জেনারেট",
        href: "/dashboard/admin/fees/generate",
        icon: "fees",
        dividerBefore: true,
      },
      {
        title: "Collect Fee",
        titleBn: "ফি সংগ্রহ",
        href: "/dashboard/admin/fees/collect",
        icon: "fees",
      },
      {
        title: "Due Fees",
        titleBn: "বকেয়া ফি",
        href: "/dashboard/admin/fees/due",
        icon: "fees",
        badge: "!",
        badgeVariant: "destructive",
      },
      {
        title: "Fee Structure",
        titleBn: "ফি কাঠামো",
        href: "/dashboard/admin/fees/structure",
        icon: "settings",
      },
      {
        title: "Fee History",
        titleBn: "ফি ইতিহাস",
        href: "/dashboard/admin/fees/history",
        icon: "reports",
      },
      {
        title: "Receipts",
        titleBn: "রশিদ",
        href: "/dashboard/admin/receipts",
        icon: "receipt",
      },
    ],
  },

  {
    title: "Expenses",
    titleBn: "খরচ (খাতওয়ারি)",
    href: "/dashboard/admin/expenses",
    icon: "expenses",
    items: [
      {
        title: "All Expenses",
        titleBn: "সকল খরচ",
        href: "/dashboard/admin/expenses",
        icon: "expenses",
      },
      {
        title: "Add Expense",
        titleBn: "খরচ যোগ করুন",
        href: "/dashboard/admin/expenses/add",
        icon: "expenses",
      },
      {
        title: "Khat (Categories)",
        titleBn: "খাত ব্যবস্থাপনা",
        href: "/dashboard/admin/expenses/categories",
        icon: "expenses",
      },
      {
        title: "Pending Approval",
        titleBn: "অনুমোদন বাকি",
        href: "/dashboard/admin/expenses?status=pending",
        icon: "expenses",
        badge: "পেন্ডিং",
        badgeVariant: "warning",
      },
    ],
  },

  // ── আবাসন ──────────────────────────────────────────────
  {
    title: "Boarding",
    titleBn: "আবাসন",
    href: "/dashboard/admin/boarding",
    icon: "boarding",
    dividerBefore: true,
    items: [
      {
        title: "Overview",
        titleBn: "সারসংক্ষেপ",
        href: "/dashboard/admin/boarding",
        icon: "boarding",
      },
      {
        title: "Rooms",
        titleBn: "কক্ষ ব্যবস্থাপনা",
        href: "/dashboard/admin/hall/rooms",
        icon: "boarding",
      },
      {
        title: "Boarding Students",
        titleBn: "আবাসিক শিক্ষার্থী",
        href: "/dashboard/admin/boarding/students",
        icon: "students",
      },
      {
        title: "Boarding Types",
        titleBn: "বোর্ডিং ধরন",
        href: "/dashboard/admin/boarding/types",
        icon: "settings",
      },
    ],
  },

  // ── যোগাযোগ (Temporarily disabled as pages are missing) ──
  // {
  //   title: "Notices",
  //   titleBn: "নোটিশ বোর্ড",
  //   href: "/dashboard/admin/notices",
  //   icon: "notices",
  // },
  // {
  //   title: "Messages",
  //   titleBn: "বার্তা",
  //   href: "/dashboard/admin/messages",
  //   icon: "messages",
  // },

  // ── NFC ────────────────────────────────────────────────
  {
    title: "NFC Cards",
    titleBn: "NFC কার্ড",
    href: "/dashboard/admin/nfc",
    icon: "nfc",
    items: [
      {
        title: "Card Management",
        titleBn: "কার্ড ব্যবস্থাপনা",
        href: "/dashboard/admin/nfc",
        icon: "nfc",
      },
      {
        title: "Gate Mode",
        titleBn: "গেট মোড",
        href: "/dashboard/admin/nfc/gate",
        icon: "nfc",
      },
      {
        title: "Scan Log",
        titleBn: "স্ক্যান লগ",
        href: "/dashboard/admin/nfc/log",
        icon: "audit",
      },
    ],
  },

  // ── লাইব্রেরি ─────────────────────────────────────────
  {
    title: "Library",
    titleBn: "লাইব্রেরি",
    href: "/dashboard/admin/library",
    icon: "library",
    items: [
      {
        title: "Book Catalog",
        titleBn: "বইয়ের তালিকা",
        href: "/dashboard/admin/library/books",
        icon: "library",
      },
      {
        title: "Issue / Return",
        titleBn: "ইস্যু / ফেরত",
        href: "/dashboard/admin/library/issues",
        icon: "library",
      },
      {
        title: "Overdue",
        titleBn: "মেয়াদোত্তীর্ণ",
        href: "/dashboard/admin/library/issues?status=overdue",
        icon: "library",
        badge: "!",
        badgeVariant: "destructive",
      },
    ],
  },

  // ── রিপোর্ট ────────────────────────────────────────────
  {
    title: "Reports",
    titleBn: "রিপোর্ট",
    href: "/dashboard/admin/reports",
    icon: "reports",
    dividerBefore: true,
    items: [
      {
        title: "Financial Report",
        titleBn: "আর্থিক রিপোর্ট",
        href: "/dashboard/admin/reports/financial",
        icon: "reports",
      },
      {
        title: "Attendance Report",
        titleBn: "উপস্থিতি রিপোর্ট",
        href: "/dashboard/admin/reports/attendance",
        icon: "attendance",
      },
      {
        title: "Fee Report",
        titleBn: "ফি রিপোর্ট",
        href: "/dashboard/admin/reports/fees",
        icon: "fees",
      },
      {
        title: "Exam Results",
        titleBn: "পরীক্ষার ফলাফল",
        href: "/dashboard/admin/reports/results",
        icon: "exam",
      },
    ],
  },

  // ── সরঞ্জাম ────────────────────────────────────────────
  {
    title: "Tools",
    titleBn: "সরঞ্জাম",
    href: "/dashboard/admin/tools",
    icon: "tools",
    items: [
      {
        title: "Bulk Import",
        titleBn: "বাল্ক আমদানি",
        href: "/dashboard/admin/tools/import",
        icon: "tools",
      },
      {
        title: "Export Data",
        titleBn: "ডেটা রপ্তানি",
        href: "/dashboard/admin/tools/export",
        icon: "tools",
      },
    ],
  },

  // ── সেটিংস ────────────────────────────────────────────
  {
    title: "Settings",
    titleBn: "সেটিংস",
    href: "/dashboard/admin/settings",
    icon: "settings",
    adminOnly: true,
    dividerBefore: true,
    items: [
      {
        title: "Madrasa Profile",
        titleBn: "মাদ্রাসা প্রোফাইল",
        href: "/dashboard/admin/settings",
        icon: "settings",
      },

      {
        title: "User Management",
        titleBn: "ব্যবহারকারী",
        href: "/dashboard/admin/settings/users",
        icon: "staff",
      },
      {
        title: "Audit Log",
        titleBn: "অডিট লগ",
        href: "/dashboard/admin/settings/audit",
        icon: "audit",
      },
      {
        title: "System Health",
        titleBn: "সিস্টেম স্বাস্থ্য",
        href: "/dashboard/admin/settings/health",
        icon: "health",
      },
      {
        title: "Year Transition",
        titleBn: "বার্ষিক ট্রানজিশন",
        href: "/dashboard/admin/settings/year-transition",
        icon: "settings",
        badge: "!",
        badgeVariant: "warning",
      },
      {
        title: "Backup & Export",
        titleBn: "ব্যাকআপ",
        href: "/dashboard/admin/settings/backup",
        icon: "tools",
      },
    ],
  },
];

// ─── ADMIN (Principal / School Head) ───────────────────────
// Super admin এর মতো — কিন্তু system settings এ limited access
const adminNav: NavItem[] = [
  {
    title: "Dashboard",
    titleBn: "ড্যাশবোর্ড",
    href: "/dashboard/admin",
    icon: "dashboard",
  },
  {
    title: "Students",
    titleBn: "শিক্ষার্থী",
    href: "/dashboard/admin/students",
    icon: "students",
    items: [
      { title: "All Students",    titleBn: "সকল শিক্ষার্থী", href: "/dashboard/admin/students",           icon: "students" },
      { title: "New Admission",   titleBn: "নতুন ভর্তি",     href: "/dashboard/admin/students/admission", icon: "students" },
      { title: "ID Cards",        titleBn: "আইডি কার্ড",     href: "/dashboard/admin/id-cards",           icon: "students" },
      { title: "Documents",       titleBn: "কাগজপত্র",        href: "/dashboard/admin/students/documents", icon: "reports"  },
    ],
  },
  {
    title: "Staff",
    titleBn: "কর্মচারী",
    href: "/dashboard/admin/staff",
    icon: "staff",
    items: [
      { title: "All Staff",  titleBn: "সকল কর্মচারী", href: "/dashboard/admin/staff",     icon: "staff"    },
      { title: "Leave",      titleBn: "ছুটি",          href: "/dashboard/admin/leave",     icon: "leave"    },
      { title: "Policies",   titleBn: "নীতিমালা",      href: "/dashboard/admin/staff/policies", icon: "policies" },
      { title: "Designations", titleBn: "পদবী / পদমর্যাদা", href: "/dashboard/admin/settings/designations", icon: "designations" },
      { title: "Terms & Conditions", titleBn: "নিয়ম ও শর্তাবলী", href: "/dashboard/admin/settings/terms", icon: "terms" },
    ],
  },
  {
    title: "Academics",
    titleBn: "একাডেমিক",
    href: "/dashboard/admin/academics",
    icon: "classes",
    items: [
      { title: "Classes",    titleBn: "শ্রেণী",    href: "/dashboard/admin/academics/classes",   icon: "classes"   },
      { title: "Timetable",  titleBn: "সময়সূচি",  href: "/dashboard/admin/academics/timetable", icon: "timetable" },
      { title: "Exams",      titleBn: "পরীক্ষা",   href: "/dashboard/admin/academics/exams",     icon: "exam"      },
      { title: "Results",    titleBn: "ফলাফল",     href: "/dashboard/admin/academics/results",   icon: "reports"   },
    ],
  },
  {
    title: "Attendance",
    titleBn: "উপস্থিতি",
    href: "/dashboard/admin/attendance",
    icon: "attendance",
    items: [
      { title: "Staff Attendance",   titleBn: "স্টাফ উপস্থিতি",      href: "/dashboard/admin/attendance/staff",    icon: "attendance" },
      { title: "Student Attendance", titleBn: "শিক্ষার্থী উপস্থিতি", href: "/dashboard/admin/attendance/students", icon: "attendance" },
    ],
  },
  // {
  //   title: "Notices",
  //   titleBn: "নোটিশ বোর্ড",
  //   href: "/dashboard/admin/notices",
  //   icon: "notices",
  // },
  // ── অর্থ ব্যবস্থাপনা ──────────────────────────────────
  {
    title: "Fees",
    titleBn: "ফি ব্যবস্থাপনা",
    href: "/dashboard/admin/fees",
    icon: "fees",
    dividerBefore: true,
    items: [
      { title: "Fee Dashboard", titleBn: "ফি ড্যাশবোর্ড", href: "/dashboard/admin/fees",          icon: "fees"    },
      { title: "Collect Fee",   titleBn: "ফি সংগ্রহ",     href: "/dashboard/admin/fees/collect",  icon: "fees"    },
      { title: "Due Fees",      titleBn: "বকেয়া ফি",      href: "/dashboard/admin/fees/due",      icon: "fees", badge: "!", badgeVariant: "destructive" },
      { title: "Fee History",   titleBn: "ফি ইতিহাস",     href: "/dashboard/admin/fees/history",  icon: "reports" },
      { title: "Receipts",      titleBn: "রশিদ প্রিন্ট",    href: "/dashboard/admin/receipts",      icon: "receipt" },
      { title: "Generate Invoices", titleBn: "ইনভয়েস জেনারেট", href: "/dashboard/admin/fees/generate", icon: "fees", dividerBefore: true },
    ],
  },
  {
    title: "Boarding",
    titleBn: "আবাসন",
    href: "/dashboard/admin/boarding",
    icon: "boarding",
    dividerBefore: true,
    items: [
      {
        title: "Overview",
        titleBn: "সারসংক্ষেপ",
        href: "/dashboard/admin/boarding",
        icon: "boarding",
      },
      {
        title: "Rooms",
        titleBn: "কক্ষ ব্যবস্থাপনা",
        href: "/dashboard/admin/hall/rooms",
        icon: "boarding",
      },
      {
        title: "Boarding Students",
        titleBn: "আবাসিক শিক্ষার্থী",
        href: "/dashboard/admin/boarding/students",
        icon: "students",
      },
      {
        title: "Boarding Types",
        titleBn: "বোর্ডিং ধরন",
        href: "/dashboard/admin/boarding/types",
        icon: "settings",
      },
    ],
  },
  // {
  //   title: "Messages",
  //   titleBn: "বার্তা",
  //   href: "/dashboard/admin/messages",
  //   icon: "messages",
  // },
  {
    title: "Reports",
    titleBn: "রিপোর্ট",
    href: "/dashboard/admin/reports",
    icon: "reports",
    dividerBefore: true,
    items: [
      { title: "Financial",   titleBn: "আর্থিক",    href: "/dashboard/admin/reports/financial",  icon: "reports"    },
      { title: "Attendance",  titleBn: "উপস্থিতি",  href: "/dashboard/admin/reports/attendance", icon: "attendance" },
      { title: "Exam Results",titleBn: "পরীক্ষার ফলাফল", href: "/dashboard/admin/reports/results", icon: "exam" },
    ],
  },
];

// ─── MANAGER (দৈনিক পরিচালনা) ─────────────────────────────
// Fee collection, expense entry, student info (read-only)
const managerNav: NavItem[] = [
  {
    title: "Dashboard",
    titleBn: "ড্যাশবোর্ড",
    href: "/dashboard/manager",
    icon: "dashboard",
  },
  {
    title: "Students",
    titleBn: "শিক্ষার্থী",
    href: "/dashboard/manager/students",
    icon: "students",
    items: [
      { title: "All Students",  titleBn: "সকল শিক্ষার্থী", href: "/dashboard/manager/students",           icon: "students" },
      { title: "New Admission", titleBn: "নতুন ভর্তি",     href: "/dashboard/manager/students/admission", icon: "students" },
    ],
  },
  {
    title: "Staff",
    titleBn: "কর্মচারী",
    href: "/dashboard/manager/staff",
    icon: "staff",
  },
  {
    title: "Attendance",
    titleBn: "উপস্থিতি",
    href: "/dashboard/manager/attendance",
    icon: "attendance",
    items: [
      { title: "Staff",   titleBn: "স্টাফ উপস্থিতি",      href: "/dashboard/manager/attendance/staff",    icon: "attendance" },
      { title: "Students",titleBn: "শিক্ষার্থী উপস্থিতি", href: "/dashboard/manager/attendance/students", icon: "attendance" },
    ],
  },
  {
    title: "Fee Collection",
    titleBn: "ফি সংগ্রহ",
    href: "/dashboard/manager/fees",
    icon: "fees",
    dividerBefore: true,
    items: [
      { title: "Collect Fee",  titleBn: "ফি সংগ্রহ",   href: "/dashboard/manager/fees/collect",  icon: "fees"    },
      { title: "Due Fees",     titleBn: "বকেয়া ফি",    href: "/dashboard/manager/fees/due",      icon: "fees", badge: "!", badgeVariant: "destructive" as const },
      { title: "Generate Invoices", titleBn: "ইনভয়েস জেনারেট", href: "/dashboard/admin/fees/generate", icon: "fees", dividerBefore: true },
      { title: "Fee History",  titleBn: "ফি ইতিহাস",   href: "/dashboard/manager/fees/history",  icon: "reports" },
      { title: "Receipts",     titleBn: "রশিদ",         href: "/dashboard/manager/receipts",      icon: "receipt" },
    ],
  },
  {
    title: "Expenses",
    titleBn: "খরচ",
    href: "/dashboard/manager/expenses",
    icon: "expenses",
    items: [
      { title: "All Expenses",      titleBn: "সকল খরচ",       href: "/dashboard/manager/expenses",              icon: "expenses" },
      { title: "Add Expense",       titleBn: "খরচ যোগ করুন",   href: "/dashboard/manager/expenses/add",          icon: "expenses" },
      { title: "Pending Approval",  titleBn: "অনুমোদন বাকি",  href: "/dashboard/manager/expenses?status=pending", icon: "expenses", badge: "পেন্ডিং", badgeVariant: "warning" as const },
    ],
  },
  // {
  //   title: "Notices",
  //   titleBn: "নোটিশ",
  //   href: "/dashboard/manager/notices",
  //   icon: "notices",
  //   dividerBefore: true,
  // },
  // {
  //   title: "Messages",
  //   titleBn: "বার্তা",
  //   href: "/dashboard/manager/messages",
  //   icon: "messages",
  // },
  {
    title: "Reports",
    titleBn: "রিপোর্ট",
    href: "/dashboard/manager/reports",
    icon: "reports",
    items: [
      { title: "Today's Collection", titleBn: "আজকের সংগ্রহ",  href: "/dashboard/manager/reports/daily",    icon: "fees"    },
      { title: "Defaulters",         titleBn: "বকেয়াদার",      href: "/dashboard/manager/reports/defaulters",icon: "fees"    },
      { title: "This Week",          titleBn: "এই সপ্তাহ",      href: "/dashboard/manager/reports/weekly",   icon: "reports" },
    ],
  },
];

// ─── TEACHER (শিক্ষক) ──────────────────────────────────────
// নিজের ক্লাস, attendance, results
const teacherNav: NavItem[] = [
  {
    title: "Dashboard",
    titleBn: "ড্যাশবোর্ড",
    href: "/dashboard/teacher",
    icon: "dashboard",
  },
  {
    title: "My Classes",
    titleBn: "আমার ক্লাস",
    href: "/dashboard/teacher/classes",
    icon: "classes",
  },
  {
    title: "My Students",
    titleBn: "আমার শিক্ষার্থী",
    href: "/dashboard/teacher/students",
    icon: "students",
  },
  {
    title: "Attendance",
    titleBn: "উপস্থিতি",
    href: "/dashboard/teacher/attendance",
    icon: "attendance",
    items: [
      { title: "Mark Attendance", titleBn: "উপস্থিতি নিন",     href: "/dashboard/teacher/attendance/mark",   icon: "attendance" },
      { title: "View Reports",    titleBn: "রিপোর্ট দেখুন",    href: "/dashboard/teacher/attendance/report", icon: "reports"    },
    ],
  },
  {
    title: "Exams & Results",
    titleBn: "পরীক্ষা ও ফলাফল",
    href: "/dashboard/teacher/results",
    icon: "exam",
    items: [
      { title: "Enter Marks",  titleBn: "নম্বর দিন",     href: "/dashboard/teacher/results/entry",  icon: "exam"    },
      { title: "View Results", titleBn: "ফলাফল দেখুন",   href: "/dashboard/teacher/results/view",   icon: "reports" },
    ],
  },
  {
    title: "Timetable",
    titleBn: "আমার সময়সূচি",
    href: "/dashboard/teacher/timetable",
    icon: "timetable",
    dividerBefore: true,
  },
  {
    title: "Leave Request",
    titleBn: "ছুটির আবেদন",
    href: "/dashboard/teacher/leave",
    icon: "leave",
  },
  {
    title: "Policies",
    titleBn: "নীতিমালা",
    href: "/dashboard/teacher/policies",
    icon: "policies",
  },
  // {
  //   title: "Notice Board",
  //   titleBn: "নোটিশ বোর্ড",
  //   href: "/dashboard/teacher/notices",
  //   icon: "notices",
  // },
  // {
  //   title: "Messages",
  //   titleBn: "বার্তা",
  //   href: "/dashboard/teacher/messages",
  //   icon: "messages",
  // },
  {
    title: "My Profile",
    titleBn: "আমার প্রোফাইল",
    href: "/dashboard/teacher/profile",
    icon: "profile",
    dividerBefore: true,
  },
];

// ─── ACCOUNTANT (হিসাবরক্ষক) ──────────────────────────────
// শুধু finance — fee, expense, salary, reports
const accountantNav: NavItem[] = [
  {
    title: "Dashboard",
    titleBn: "ড্যাশবোর্ড",
    href: "/dashboard/accountant",
    icon: "dashboard",
  },
  {
    title: "Fee Collection",
    titleBn: "ফি সংগ্রহ",
    href: "/dashboard/accountant/fees",
    icon: "fees",
    items: [
      { title: "Collect Fee",  titleBn: "ফি সংগ্রহ",  href: "/dashboard/accountant/fees/collect", icon: "fees"    },
      { title: "Due Fees",     titleBn: "বকেয়া ফি",   href: "/dashboard/accountant/fees/due",     icon: "fees", badge: "!", badgeVariant: "destructive" as const },
      { title: "Fee History",  titleBn: "ফি ইতিহাস",  href: "/dashboard/accountant/fees/history", icon: "reports" },
      { title: "Receipts",     titleBn: "রশিদ",        href: "/dashboard/accountant/receipts",     icon: "receipt" },
    ],
  },
  {
    title: "Expenses",
    titleBn: "খরচ (খাতওয়ারি)",
    href: "/dashboard/accountant/expenses",
    icon: "expenses",
    items: [
      { title: "All Expenses",  titleBn: "সকল খরচ",         href: "/dashboard/accountant/expenses",              icon: "expenses" },
      { title: "Add Expense",   titleBn: "খরচ যোগ করুন",    href: "/dashboard/accountant/expenses/add",          icon: "expenses" },
      { title: "Khat Summary",  titleBn: "খাত সারসংক্ষেপ",  href: "/dashboard/accountant/expenses/categories",   icon: "expenses" },
    ],
  },
  {
    title: "Salary",
    titleBn: "বেতন",
    href: "/dashboard/accountant/salary",
    icon: "salary",
    items: [
      { title: "Generate Salary", titleBn: "বেতন তৈরি করুন", href: "/dashboard/accountant/salary/generate", icon: "salary"  },
      { title: "Salary History",  titleBn: "বেতনের ইতিহাস",  href: "/dashboard/accountant/salary",          icon: "reports" },
      { title: "Salary Slips",    titleBn: "বেতন স্লিপ",     href: "/dashboard/accountant/salary/slips",    icon: "receipt" },
      { title: "Advances",        titleBn: "অগ্রিম বেতন",    href: "/dashboard/accountant/salary/advances", icon: "fees"    },
    ],
  },
  {
    title: "Reports",
    titleBn: "আর্থিক রিপোর্ট",
    href: "/dashboard/accountant/reports",
    icon: "reports",
    dividerBefore: true,
    items: [
      { title: "Monthly Summary",   titleBn: "মাসিক সারসংক্ষেপ",  href: "/dashboard/accountant/reports/monthly",    icon: "reports" },
      { title: "Fee Collection",    titleBn: "ফি সংগ্রহ রিপোর্ট", href: "/dashboard/accountant/reports/fees",       icon: "fees"    },
      { title: "Expense Report",    titleBn: "খরচ রিপোর্ট",       href: "/dashboard/accountant/reports/expenses",   icon: "expenses"},
      { title: "Student Ledger",    titleBn: "শিক্ষার্থী লেজার",  href: "/dashboard/accountant/reports/ledger",     icon: "accounts"},
      { title: "Annual Summary",    titleBn: "বার্ষিক সারসংক্ষেপ",href: "/dashboard/accountant/reports/annual",     icon: "reports" },
    ],
  },
  {
    title: "Export Data",
    titleBn: "ডেটা রপ্তানি",
    href: "/dashboard/accountant/export",
    icon: "tools",
  },
];

// ─── PARENT (অভিভাবক) ──────────────────────────────────────
// সন্তানের তথ্য, ফি, উপস্থিতি, নোটিশ
const parentNav: NavItem[] = [
  {
    title: "Dashboard",
    titleBn: "ড্যাশবোর্ড",
    href: "/dashboard/parent",
    icon: "dashboard",
  },
  {
    title: "My Child",
    titleBn: "আমার সন্তান",
    href: "/dashboard/parent/child",
    icon: "child",
  },
  {
    title: "Attendance",
    titleBn: "উপস্থিতি",
    href: "/dashboard/parent/attendance",
    icon: "attendance",
  },
  {
    title: "Fees",
    titleBn: "ফি",
    href: "/dashboard/parent/fees",
    icon: "fees",
    items: [
      { title: "Fee Status",   titleBn: "ফি অবস্থা",    href: "/dashboard/parent/fees",          icon: "fees"    },
      { title: "Fee History",  titleBn: "ফি ইতিহাস",    href: "/dashboard/parent/fees/history",  icon: "reports" },
      { title: "Receipts",     titleBn: "রশিদ",          href: "/dashboard/parent/fees/receipts", icon: "receipt" },
    ],
  },
  {
    title: "Results",
    titleBn: "পরীক্ষার ফলাফল",
    href: "/dashboard/parent/results",
    icon: "exam",
  },
  // {
  //   title: "Notice Board",
  //   titleBn: "নোটিশ বোর্ড",
  //   href: "/dashboard/parent/notices",
  //   icon: "notices",
  //   dividerBefore: true,
  // },
  // {
  //   title: "Contact",
  //   titleBn: "যোগাযোগ",
  //   href: "/dashboard/parent/contact",
  //   icon: "messages",
  // },
];

// ─── MASTER NAV MAP ────────────────────────────────────────
export type AppRole =
  | "super_admin"
  | "admin"
  | "manager"
  | "teacher"
  | "accountant"
  | "parent";

export const roleNavItems: Record<AppRole, NavItem[]> = {
  super_admin: superAdminNav,
  admin:       adminNav,
  manager:     managerNav,
  teacher:     teacherNav,
  accountant:  accountantNav,
  parent:      parentNav,
};

// ─── Icon → Lucide icon name map ──────────────────────────
// Sidebar component এ এই map use করবে
export const iconMap: Record<NavIcon, string> = {
  dashboard:  "LayoutDashboard",
  students:   "GraduationCap",
  staff:      "Users",
  teacher:    "BookOpen",
  classes:    "School",
  attendance: "CalendarCheck",
  fees:       "Banknote",
  expenses:   "Receipt",
  boarding:   "Building2",
  notices:    "Bell",
  reports:    "BarChart3",
  settings:   "Settings",
  nfc:        "CreditCard",
  library:    "Library",
  salary:     "Wallet",
  leave:      "CalendarOff",
  exam:       "ClipboardList",
  timetable:  "Clock",
  messages:   "MessageSquare",
  profile:    "UserCircle",
  child:      "Baby",
  tools:      "Wrench",
  audit:      "FileSearch",
  policies:   "FileText",
  health:     "Activity",
  receipt:    "FileCheck",
  accounts:   "BookMarked",
  terms:      "ScrollText",
  designations: "Briefcase",
};

// ─── Role metadata ─────────────────────────────────────────
export const roleMetadata: Record<
  AppRole,
  {
    label:   string;
    labelBn: string;
    color:   string;  // Tailwind bg class
    textColor: string;
    dashboardPath: string;
  }
> = {
  super_admin: {
    label:         "Super Admin",
    labelBn:       "সুপার অ্যাডমিন",
    color:         "bg-purple-100 dark:bg-purple-900/30",
    textColor:     "text-purple-700 dark:text-purple-300",
    dashboardPath: "/dashboard/admin",
  },
  admin: {
    label:         "Admin",
    labelBn:       "অ্যাডমিন",
    color:         "bg-indigo-100 dark:bg-indigo-900/30",
    textColor:     "text-indigo-700 dark:text-indigo-300",
    dashboardPath: "/dashboard/admin",
  },
  manager: {
    label:         "Manager",
    labelBn:       "ম্যানেজার",
    color:         "bg-blue-100 dark:bg-blue-900/30",
    textColor:     "text-blue-700 dark:text-blue-300",
    dashboardPath: "/dashboard/manager",
  },
  teacher: {
    label:         "Teacher",
    labelBn:       "শিক্ষক",
    color:         "bg-green-100 dark:bg-green-900/30",
    textColor:     "text-green-700 dark:text-green-300",
    dashboardPath: "/dashboard/teacher",
  },
  accountant: {
    label:         "Accountant",
    labelBn:       "হিসাবরক্ষক",
    color:         "bg-cyan-100 dark:bg-cyan-900/30",
    textColor:     "text-cyan-700 dark:text-cyan-300",
    dashboardPath: "/dashboard/accountant",
  },
  parent: {
    label:         "Parent",
    labelBn:       "অভিভাবক",
    color:         "bg-teal-100 dark:bg-teal-900/30",
    textColor:     "text-teal-700 dark:text-teal-300",
    dashboardPath: "/dashboard/parent",
  },
};

// ─── Helper functions ──────────────────────────────────────

/** Role অনুযায়ী nav items আনো */
export function getNavItems(role: AppRole): NavItem[] {
  return roleNavItems[role] ?? [];
}

/** Current path টা কোন nav item এ active সেটা বের করো */
export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.href === pathname) return true;
  if (item.items) {
    return item.items.some((sub) => pathname.startsWith(sub.href));
  }
  // Prefix match — parent route গুলোর জন্য
  if (item.href !== "/" + item.href.split("/")[1]) {
    return pathname.startsWith(item.href);
  }
  return false;
}

/** Role এর dashboard path বের করো */
export function getDashboardPath(role: AppRole): string {
  return roleMetadata[role]?.dashboardPath ?? "/dashboard";
}