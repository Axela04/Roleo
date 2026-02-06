import { Nav } from '@/components/nav';

export default function ApplicationsPage() {
  return (
    <main>
      <Nav />
      <section className="p-6">
        <h1 className="text-xl font-semibold">Application CRM</h1>
        <p className="text-sm text-slate-600">Pipeline: Saved → Applied → Contacted → Interview → Offer → Closed.</p>
      </section>
    </main>
  );
}
