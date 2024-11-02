import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosConfig";
import { useSelector } from "react-redux";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const getStatusColor = (status) => {
  switch (status.toUpperCase()) {
    case "DELIVERED":
      return "text-green-600";
    case "PROCESSING":
      return "text-green-500";
    case "PENDING":
      return "text-yellow-600";
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

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const fetchOrders = async (page) => {
    try {
      const response = await axiosInstance.get(
        `/users/orders/${user}?page=${page}&limit=2`
      );
      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 bg-gray-50">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2">
          <li className="flex items-center">
            <a
              href="/"
              className="text-gray-500 hover:text-gray-900 flex items-center transition-colors duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="sr-only">Home</span>
            </a>
          </li>
          <li className="flex items-center">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
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
            <svg
              className="w-5 h-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Order ID: {order.order_id}
              </h2>
              <p className="text-sm text-gray-600">
                Placed on: {new Date(order.placed_at).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-6 border-b pb-4 last:border-b-0 last:pb-0"
                >
                  {/* Product Image */}
                  <div className="shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="rounded-lg border object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.product.name}
                    </h3>
                    <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        Price: ₹{item.price.toFixed(2)}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        Total: ₹{item.totalProductPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="shrink-0 text-right">
                    <p
                      className={`text-sm font-medium ${getStatusColor(
                        order.order_status
                      )}`}
                    >
                      {order.order_status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between items-center">
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Total Amount: ₹{order.total_price_with_discount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  Payment Method: {order.payment_method}
                </p>
                <p className="text-sm text-gray-600">
                  Payment Status: {order.payment_status}
                </p>
              </div>
              <div className="space-x-3">
                <button
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="inline-block px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                >
                  View Details
                </button>
                {order.order_items.some(
                  (item) => item.order_status === "Pending"
                ) && (
                  <button
                    onClick={() => {
                      // cali
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Cancel Order
                  </button>
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
