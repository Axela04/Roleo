import { Nav } from '@/components/nav';

export default function Dashboard() {
  return (
    <main>
      <Nav />
      <section className="p-6 grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4"><h2 className="font-medium">Profile Hub</h2><p className="text-sm text-slate-600">Canonical profile + resume versions.</p></div>
        <div className="bg-white rounded-xl border p-4"><h2 className="font-medium">Job Discovery</h2><p className="text-sm text-slate-600">Recent postings + filters + vector ranking.</p></div>
        <div className="bg-white rounded-xl border p-4"><h2 className="font-medium">Apply Kit + CRM</h2><p className="text-sm text-slate-600">Tailored docs, status pipeline, reminders.</p></div>
      </section>
    </main>
  );
}
