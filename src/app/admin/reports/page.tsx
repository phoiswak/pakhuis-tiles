const reports = [
  {
    type: "sales",
    title: "Sales report",
    description: "All orders with totals, status, and customer details.",
  },
  {
    type: "inventory",
    title: "Inventory report",
    description: "Product stock levels, cost, and stock value.",
  },
  {
    type: "damage",
    title: "Damage report",
    description: "Damage and waste records by product and reason.",
  },
  {
    type: "suppliers",
    title: "Suppliers report",
    description: "Supplier directory with contact and VAT details.",
  },
  {
    type: "customers",
    title: "Customers report",
    description: "Customer list with pricing tiers.",
  },
];

export default function AdminReportsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Reports</h1>
      <p className="mt-1 text-sm text-ink-muted">Download CSV exports</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <div key={r.type} className="flex flex-col border border-stone-line bg-white p-5">
            <h2 className="font-display text-xl text-ink">{r.title}</h2>
            <p className="mt-2 flex-1 text-sm text-ink-muted">{r.description}</p>
            <a href={`/api/admin/reports/${r.type}`} className="btn-secondary mt-5 self-start">
              Download CSV
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
