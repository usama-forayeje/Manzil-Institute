import { redirect } from 'next/navigation';

export default function AttendanceMainPage() {
  // Redirect to students attendance by default or a general dashboard
  redirect('/dashboard/admin/attendance/students');
}
