import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/config/axiosConfig";
import { saveAs } from "file-saver";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Home,
  Download,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
// import { Home, ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function SalesReport() {
  const [activeTab, setActiveTab] = useState("daily");
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const itemsPerPage = 5;

  const [salesData, setSalesData] = useState({
    salesReport: [],
    totalSalesCount: 0,
    totalOrderAmount: 0,
    totalDiscount: 0,
    totalPage: 1,
    page: 1,
  });

  useEffect(() => {
    fetchReports(currentPage);
  }, [currentPage, activeTab, startDate, endDate]);

  const fetchReports = async (page) => {
    try {

      const response = await axiosInstance.get(
        `/admin/report?period=${activeTab}&page=${page}&limit=5&startDate=${startDate}&endDate=${endDate}`
      );
      setSalesData(response.data);
    } catch (error) {
      console.error("Error fetching sales report:", error);
    }
  };

  const tabContent = ["daily", "weekly", "monthly", "yearly", "custom"];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;


  const totalPages = Math.ceil(
    (salesData[activeTab]?.length || 0) / itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleApplyDateFilter = () => {
    setCurrentPage(1);
    fetchReports(1);
  };

  const handlePdfDownload = async () => {
    try {
      const response = await axiosInstance.get(
        `/admin/download/report/pdf?period=${activeTab}&startDate=${startDate}&endDate=${endDate}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(blob, "SALES REPORT.pdf");

    } catch (error) {
      console.error(error);
    }
  };

  const handleXldownload = async () => {
    try {
      const response = await axiosInstance.get(
        `/admin/download/report/xl?period=${activeTab}&startDate=${startDate}&endDate=${endDate}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "SalesReport.xlsx");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 h-screen">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/admin/dashboard"
              className="flex items-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Sales Report</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Sales Report</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Report Settings</h2>
          <div className="flex gap-2 mb-4">
            {tabContent.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                  if (tab !== "custom") {
                    setStartDate("");
                    setEndDate("");
                  }
                }}
              >
                {tab}
              </Button>
            ))}
          </div>
          {activeTab === "custom" && (
            <div className="flex items-center gap-2 mb-4">
              <input
                type="date"
                className="border rounded p-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span>to</span>
              <input
                type="date"
                className="border rounded p-2"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <Button onClick={handleApplyDateFilter}>Apply</Button>
            </div>
          )}
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-lg border mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData &&
                salesData?.salesReport.map((sale) => (
                  <TableRow key={sale._id}>
                    <TableCell>{sale.userId.name}</TableCell>
                    <TableCell>
                      {new Date(sale.placed_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{sale.payment_method}</TableCell>
                    <TableCell>{sale.order_items.length}</TableCell>
                    <TableCell className="text-right">
                      ₹{sale.total_price_with_discount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              <TableRow className="bg-gray-100 font-medium">
                <TableCell colSpan={4}>Total Order Amount</TableCell>
                <TableCell className="text-right">
                  ₹{salesData.totalOrderAmount.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow className="bg-gray-100 font-medium">
                <TableCell colSpan={4}>Total Discount</TableCell>
                <TableCell className="text-right">
                  ₹{salesData.totalDiscount.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, salesData[activeTab]?.length || 0)} of{" "}
            {salesData[activeTab]?.length || 0} entries
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            onClick={handlePdfDownload}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            <Download className="mr-2 h-4 w-4" />
            Download as PDF
          </Button>
          <Button
            onClick={handleXldownload}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Download as Excel
          </Button>
        </div>
      </div>
    </div>
  );
}
