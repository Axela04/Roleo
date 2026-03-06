import Link from 'next/link';

export function Nav() {
  return (
    <nav className="border-b bg-white px-6 py-4 flex gap-4 text-sm">
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/dashboard/jobs">Jobs</Link>
      <Link href="/dashboard/applications">Applications</Link>
      <Link href="/dashboard/billing">Billing</Link>
      <Link href="/dashboard/admin">Admin</Link>
    </nav>
  );
}
