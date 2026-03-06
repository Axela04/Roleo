import { Nav } from '@/components/nav';

export default function AdminPage() {
  return (
    <main>
      <Nav />
      <section className="p-6">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <ul className="list-disc ml-6 text-sm text-slate-600 mt-3">
          <li>User plan + usage overview</li>
          <li>Ingestion health and alerts sent</li>
          <li>Prompt version registry</li>
          <li>Audit log viewer (also exposed to Replit console)</li>
        </ul>
      </section>
    </main>
  );
}
