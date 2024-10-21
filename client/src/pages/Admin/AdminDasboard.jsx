
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Bell, Menu, Search, User } from 'lucide-react';

export default function Component() {
  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 278 },
    { name: 'May', value: 189 },
    { name: 'Jun', value: 239 },
    { name: 'Jul', value: 349 },
    { name: 'Aug', value: 200 },
    { name: 'Sep', value: 278 },
    { name: 'Oct', value: 189 },
    { name: 'Nov', value: 239 },
    { name: 'Dec', value: 349 },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 overflow-y-auto p-4">
        {/* Header */}
        <header className="mb-4 flex items-center justify-between">
          <button className="rounded-full p-2 lg:hidden">
            <Menu className="h-6 w-6" />
          </button>
          <h2 className="text-2xl font-bold">Welcome Admin</h2>
          <div className="flex items-center">
            <div className="relative mr-2">
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-full border px-4 py-2 pr-10 focus:border-blue-500 focus:outline-none"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button className="mr-2 rounded-full p-2">
              <Bell className="h-6 w-6" />
            </button>
            <button className="rounded-full p-2">
              <User className="h-6 w-6" />
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Earning', value: '$198k', change: '+37.8%', color: 'bg-green-500' },
            { title: 'Orders', value: '2.4k', change: '-2%', color: 'bg-purple-500' },
            { title: 'Balance', value: '$2.4k', change: '-2%', color: 'bg-blue-500' },
            { title: 'Total Sales', value: '$89k', change: '+11%', color: 'bg-red-500' },
          ].map((stat) => (
            <div key={stat.title} className="rounded-lg bg-white p-4 shadow-md">
              <div className={`mb-2 h-10 w-10 rounded-full ${stat.color}`} />
              <h3 className="text-lg font-semibold">{stat.title}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change} this month
              </p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="mb-8 rounded-lg bg-white p-4 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Overview</h3>
            <select className="rounded border px-2 py-1">
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="value" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product Sell */}
        <div className="rounded-lg bg-white p-4 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Product Sell</h3>
            <div className="flex items-center">
              <div className="relative mr-2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full rounded-full border px-4 py-2 pr-10 focus:border-blue-500 focus:outline-none"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <select className="rounded border px-2 py-1">
                <option>Last 30 days</option>
                <option>Last 60 days</option>
              </select>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2">Product Name</th>
                <th className="pb-2">Stock</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Abstract 3D', stock: 32, price: '$45.99', sales: 20 },
                { name: 'Sarphens Illustration', stock: 15, price: '$45.99', sales: 18 },
              ].map((product) => (
                <tr key={product.name} className="border-b">
                  <td className="py-2">
                    <div className="flex items-center">
                      <div className="mr-2 h-10 w-10 rounded bg-gray-200" />
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2">{product.stock} in stock</td>
                  <td className="py-2">{product.price}</td>
                  <td className="py-2">{product.sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}