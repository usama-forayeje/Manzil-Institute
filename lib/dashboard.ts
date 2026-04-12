const DASHBOARD_URLS: Record<string, string> = {
  super_admin: '/dashboard/admin',
  manager: '/dashboard/manager',
  teacher: '/dashboard/teacher',
  student: '/dashboard/student',
  parent: '/dashboard/parent',
};

export function getDashboardUrl(role: string): string {
  return DASHBOARD_URLS[role] || DASHBOARD_URLS.student;
}

export function isNonStudentRole(role: string): boolean {
  return role !== 'student' && role in DASHBOARD_URLS;
}

export function getRoleDisplayName(role: string): string {
  const displayNames: Record<string, string> = {
    super_admin: 'Super Admin',
    manager: 'Manager',
    teacher: 'Teacher',
    student: 'Student',
    parent: 'Parent',
  };
  return displayNames[role] || role;
}
