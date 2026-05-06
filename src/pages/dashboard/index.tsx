// src/pages/dashboard/index.tsx

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm">
        <h3 className="text-sm text-neutral-500">Revenue</h3>
        <p className="text-3xl font-bold mt-2">$12,450</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm">
        <h3 className="text-sm text-neutral-500">Orders</h3>
        <p className="text-3xl font-bold mt-2">1,245</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm">
        <h3 className="text-sm text-neutral-500">Customers</h3>
        <p className="text-3xl font-bold mt-2">845</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm">
        <h3 className="text-sm text-neutral-500">Conversion</h3>
        <p className="text-3xl font-bold mt-2">4.8%</p>
      </div>
    </div>
  );
}