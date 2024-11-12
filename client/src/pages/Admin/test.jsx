import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "@/config/axiosConfig";

export default function SalesReport() {
  const [salesData, setSalesData] = useState({
    report: [],
    totalSalesCount: 0,
    totalOrderAmount: 0,
    totalDiscount: 0,
    totalPage: 1,
    page: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchReports(currentPage);
  }, [currentPage]);

  const fetchReports = async (page) => {
    try {
      const response = await axiosInstance.get(
        `/admin/report?page=${page}&limit=5`
      );
      console.log(response.data.report);
      setSalesData(response.data);
    } catch (error) {
      console.error("Error fetching sales report:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Sales Report</h1>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesData.report.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.order_id}</TableCell>
                <TableCell>{order.userId.name}</TableCell>
                <TableCell>
                  {new Date(order.placed_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{order.payment_method}</TableCell>
                <TableCell>{order.order_status}</TableCell>
                <TableCell className="text-right">
                  ₹{order.total_price_with_discount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 flex items-center justify-between">
          <div>
            Total Sales: {salesData.totalSalesCount} | Total Amount: ₹
            {salesData.totalOrderAmount.toFixed(2)} | Total Discount: ₹
            {salesData.totalDiscount.toFixed(2)}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="flex items-center">
              Page {currentPage} of {salesData.totalPage}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === salesData.totalPage}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
