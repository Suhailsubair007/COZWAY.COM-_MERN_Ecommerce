import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReturnRequestModal } from "@/ReuseComponets/Admin/ReturnRequestModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Package,
  Eye,
  ChevronRight,
  Home,
  CheckCircle,
  XCircle,
} from "lucide-react";
import axiosInstance from "@/config/axiosConfig";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReturnRequest, setSelectedReturnRequest] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const fetchOrders = async (page) => {
    try {
      const response = await axiosInstance.get(
        `/admin/orders?page=${page}&limit=6`
      );
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch orders. Please try again.");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const hasReturnRequest = (order) => {
    return order.order_items.some(
      (item) =>
        item.return_request.is_requested &&
        !item.return_request.is_response_send
    );
  };

  const handleReturnRequestClick = (order) => {
    const returnRequestItem = order.order_items.find(
      (item) =>
        item.return_request.is_requested &&
        !item.return_request.is_response_send
    );
    if (returnRequestItem) {
      setSelectedReturnRequest(returnRequestItem.return_request);
      setSelectedOrderId(order._id);
      setSelectedItemId(returnRequestItem._id);
      setIsModalOpen(true);
    }
  };

  const handleApproveReturn = async () => {
    await handleReturnResponse(true);
  };

  const handleRejectReturn = async () => {
    await handleReturnResponse(false);
  };

  const handleReturnResponse = async (isApproved) => {
    try {
      const response = await axiosInstance.post(
        `/admin/orders/${selectedOrderId}/return-response`,
        {
          itemId: selectedItemId,
          isApproved,
        }
      );

      if (response.data.success) {
        toast.success(
          `Return request ${isApproved ? "approved" : "rejected"} successfully`
        );
        setIsModalOpen(false);
        fetchOrders(currentPage);
      } else {
        toast.error("Failed to process return request");
      }
    } catch (error) {
      console.error("Error processing return request:", error);
      toast.error("An error occurred while processing the return request");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 h-screen">
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <a
          href="/admin/dashboard"
          className="flex items-center hover:text-gray-900"
        >
          <Home className="h-4 w-4" />
          <span className="ml-1">Dashboard</span>
        </a>
        <ChevronRight className="h-4 w-4" />
        <a href="/profile" className="hover:text-gray-900">
          My orders
        </a>
      </nav>
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] sm:w-[200px]">ORDER ID</TableHead>
              <TableHead className="min-w-[200px]">CUSTOMER</TableHead>
              <TableHead className="hidden sm:table-cell">DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>RETURN REQUEST</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{order.order_id}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.userId.name}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {order.userId.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {new Date(order.placed_at)?.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {order.total_price_with_discount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleReturnRequestClick(order)}
                    className={
                      hasReturnRequest(order)
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {hasReturnRequest(order) ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => navigate(`/admin/new/${order._id}`)}
                      variant="outline"
                      size="icon"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View Details</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => handlePageChange(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <ReturnRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        returnRequest={selectedReturnRequest || { reason: "", comment: "" }}
        onApprove={handleApproveReturn}
        onReject={handleRejectReturn}
      />
    </div>
  );
}
