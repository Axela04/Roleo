import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-12">
      <h1 className="text-4xl font-semibold">Roleo</h1>
      <p className="mt-3 max-w-2xl text-slate-600">AI-powered job application and career management platform.</p>
      <Link href="/dashboard" className="inline-block mt-6 rounded bg-slate-900 text-white px-4 py-2">Open MVP Dashboard</Link>
    </main>
  );
}
