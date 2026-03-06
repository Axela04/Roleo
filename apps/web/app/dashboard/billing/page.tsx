import { Nav } from '@/components/nav';

const plans = [
  ['Launch', '$29', '10 applications/week'],
  ['Advance', '$59', '15 applications/week'],
  ['Accelerate', '$109', '25 applications/week'],
  ['Executive', '$249+', '50+ applications/week']
];

export default function BillingPage() {
  return (
    <main>
      <Nav />
      <section className="p-6">
        <h1 className="text-xl font-semibold mb-4">Subscriptions</h1>
        <div className="grid md:grid-cols-2 gap-4">
          {plans.map(([name, price, limit]) => (
            <div key={name} className="bg-white border rounded-xl p-4"><h2 className="font-medium">{name}</h2><p>{price}</p><p className="text-sm text-slate-600">{limit}</p></div>
          ))}
        </div>
      </section>
    </main>
  );
}
