import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
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

export default function AdminDashboard() {
  const [data, setData] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalPendingOrders: 0,
    totalOrderRevenue: 0,
    monthlySalesData: [],
    yearlySalesData: [],
  });

  const [bestSelling, setBestSelling] = useState({
    topProducts: [],
    topCategories: [],
  });

  useEffect(() => {
    fetchData();
    fetchBestSelling();
  }, []);

  const [selectedView, setSelectedView] = useState("monthly");
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  const fetchData = async () => {
    try {
      const response = await axiosInstance("/admin/data");
      const result = await response.data;
      setData(result);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const fetchBestSelling = async () => {
    try {
      const response = await axiosInstance("/admin/topselling");
      const result = await response.data;
      setBestSelling(result);
    } catch (error) {
      console.error("Failed to fetch best selling data:", error);
    }
  };

  const filteredData = () => {
    const sourceData = selectedView === "monthly" ? data.monthlySalesData : data.yearlySalesData;
    if (selectedPeriod === "all") return sourceData;
    return sourceData.filter(item => item[selectedView === "monthly" ? "month" : "year"] === selectedPeriod);
  };


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

      <Card className="w-full mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sales vs Customers</CardTitle>
          <div className="flex gap-2">
            <Select value={selectedView} onValueChange={setSelectedView}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {(selectedView === "monthly"
                  ? data.monthlySalesData
                  : data.yearlySalesData
                ).map((item) => (
                  <SelectItem
                    key={selectedView === "monthly" ? item.month : item.year}
                    value={selectedView === "monthly" ? item.month : item.year}
                  >
                    {selectedView === "monthly"
                      ? new Date(item.month).toLocaleString("default", {
                          month: "long",
                          year: "numeric",
                        })
                      : item.year}
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
                data={filteredData()}
                margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey={selectedView === "monthly" ? "month" : "year"}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#666" }}
                  tickFormatter={(value) =>
                    selectedView === "monthly"
                      ? new Date(value).toLocaleString("default", {
                          month: "short",
                        })
                      : value
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Best Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                totalQuantity: {
                  label: "Quantity Sold",
                  color: "#3B82F6",
                },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bestSelling.topProducts}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="totalQuantity" fill="#3B82F6" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best Selling Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                totalQuantity: {
                  label: "Quantity Sold",
                  color: "#10B981",
                },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bestSelling.topCategories}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="categoryName" type="category" width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="totalQuantity" fill="#10B981" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
