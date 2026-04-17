import { redirect } from 'next/navigation';

export default function CurriculumPage() {
  // Redirect to MNC curriculum by default
  redirect('/curriculum/mnc');
}
