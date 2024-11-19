import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Users, ShoppingBag, IndianRupee, Clock } from "lucide-react";
import axiosInstance from "@/config/axiosConfig";

export default function Component() {
  const [data, setData] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalPendingOrders: 0,
    totalOrderRevenue: 0,
    monthlySalesData: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance("/admin/data");
        console.log(response.data)
        const result = await response.data;
        setData(result);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6 text-start">ADMIN DASHBOARD</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{data.totalOrderRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Orders
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalPendingOrders}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sales vs Customers</CardTitle>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {data.monthlySalesData.map((item) => (
                  <SelectItem key={item.month} value={item.month}>
                    {new Date(item.month).toLocaleString("default", {
                      month: "long",
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              sales: {
                label: "Sales",
                color: "#000000",
              },
              customers: {
                label: "Customers",
                color: "#10B981",
              },
            }}
            className="h-[500px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.monthlySalesData}
                margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666" }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleString("default", {
                      month: "short",
                    })
                  }
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#000"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#10B981"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  yAxisId="left"
                  dataKey="sales"
                  fill="#000000"
                  barSize={40}
                />
                <Bar
                  yAxisId="right"
                  dataKey="customers"
                  fill="#10B981"
                  barSize={40}
                />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="grid grid-cols-3 gap-4 mt-6 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-xl font-bold">
                ₹{data.totalOrderRevenue.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-xl font-bold">{data.totalUsers}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-xl font-bold">{data.totalOrders}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
