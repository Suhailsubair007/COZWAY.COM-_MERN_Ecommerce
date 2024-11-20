import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosConfig";
import {
  HomeIcon as House,
  ChevronRight,
  Undo2,
  CreditCard,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import RetryPayment from "./Payment/RetryPayment";

const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case "DELIVERED":
      return "text-green-600";
    case "PROCESSING":
      return "text-green-500";
    case "PENDING":
      return "text-yellow-600";
    case "FAILED":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

export default function Component() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const user = useSelector((state) => state.user.userInfo.id);
  const userInfo = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const fetchOrders = async (page) => {
    try {
      const response = await axiosInstance.get(
        `/users/orders/${user}?page=${page}&limit=2`
      );
      console.log("dataaaa=================>", response.data);
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePayNow = (orderId) => {
    console.log(`Initiating payment for order: ${orderId}`);
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 bg-gray-50">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2">
          <li className="flex items-center">
            <a
              href="/"
              className="text-gray-500 hover:text-gray-900 flex items-center transition-colors duration-200"
            >
              <House className="w-5 h-5" />
              <span className="sr-only">Home</span>
            </a>
          </li>
          <li className="flex items-center">
            <ChevronRight className="w-5 h-5" />
          </li>
          <li>
            <a
              href="/profile"
              className="text-gray-500 hover:text-gray-900 transition-colors duration-200"
            >
              Account
            </a>
          </li>
          <li className="flex items-center">
            <ChevronRight className="w-5 h-5" />
          </li>
          <li>
            <span className="text-gray-900 font-medium" aria-current="page">
              My Orders
            </span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <div className="text-gray-600">Welcome! Suhail</div>
      </div>

      {/* Orders List */}
      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Order ID: {order.order_id}
              </h2>
              <p className="text-sm text-gray-600 mt-1 sm:mt-0">
                Placed on: {new Date(order.placed_at).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="rounded-lg border object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.product.name}
                    </h3>
                    <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        Price: ₹{item.price.toFixed(0)}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        Total: ₹{item.totalProductPrice.toFixed(0)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                    <p
                      className={`text-sm font-medium ${getStatusColor(
                        order?.order_status
                      )}`}
                    >
                      {order?.order_status}
                    </p>
                    {order?.order_status === "delivered" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReturnOrder(order?._id)}
                        className="flex items-center space-x-2"
                      >
                        <Undo2 className="w-4 h-4" />
                        <span>Return Order</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Total Amount: ₹{order.total_price_with_discount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  Payment Method: {order?.payment_method}
                </p>
                <p className="text-sm text-gray-600">
                  Payment Status: {order?.payment_status}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
                <Button
                  variant="default"
                  onClick={() => navigate(`/orders/${order._id}`)}
                >
                  View Details
                </Button>
                {order?.payment_status === "Failed" && (
                  <RetryPayment
                    currentPage={currentPage}
                    fetchOrders={fetchOrders}
                    amount={order?.total_price_with_discount.toFixed(0)}
                    buttonName="Pay Now"
                    userInfo={userInfo}
                    orderId={order._id}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
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
    </div>
  );
}
