import { Nav } from '@/components/nav';

export default function JobsPage() {
  return (
    <main>
      <Nav />
      <section className="p-6">
        <h1 className="text-xl font-semibold">Job Feed</h1>
        <p className="text-sm text-slate-600">Supports SerpAPI ingestion and bring-your-own job link/manual description import.</p>
      </section>
    </main>
  );
}
