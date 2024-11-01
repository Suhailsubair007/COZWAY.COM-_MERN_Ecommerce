
import { ChevronRight, Home } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axiosInstance from "@/config/axiosConfig"

export default function OrderDetail() {
  const { id } = useParams()
  const [orderData, setOrderData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrderDetail()
  }, [id])

  const fetchOrderDetail = async () => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get(`/users/order/${id}`)
      setOrderData(response.data.order)
      setError(null)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError("Failed to fetch order details")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>
  if (!orderData) return <div className="p-6">No order found</div>

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-[1200px] mx-auto p-5">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center  gap-2 text-sm text-gray-600 mb-4">
        <a href="/" className="flex items-center hover:text-gray-900">
          <Home className="h-4 w-4" />
          <span className="ml-1">Home</span>
        </a>
        <ChevronRight className="h-4 w-4" />
        <a href="/profile" className="hover:text-gray-900">
          Account
        </a>
        <ChevronRight className="h-4 w-4" />
        <a href="/profile/orders" className="hover:text-gray-900">
          My Orders
        </a>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">Order Details</span>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
      </div>

      {/* Main Content */}
      <div className="bg-gray-100 rounded-lg shadow-sm p-6 mb-6">
        {/* Order Info */}
        <div className="mb-6 text-gray-600">
          Ordered on {formatDate(orderData.placed_at)} | Order# {orderData.order_id}
          <a href="#" className="text-blue-600 hover:text-blue-700 float-right">
            Invoice
          </a>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Shipping Address */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Shipping Address</h2>
            <div className="text-gray-600 space-y-1">
              <p>{orderData.shipping_address.address}</p>
              <p>{orderData.shipping_address.district}, {orderData.shipping_address.state}</p>
              <p>Pin Code - {orderData.shipping_address.pincode}</p>
              <p>Contact Number - {orderData.shipping_address.phone}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Payment Method</h2>
            <p className="text-gray-600">{orderData.payment_method}</p>
            <p className="text-gray-600">Status: {orderData.payment_status}</p>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Items Total</span>
                <span>₹{orderData.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Charge</span>
                <span>₹{orderData.shipping_fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-900 font-semibold">
                <span>Grand Total</span>
                <span>₹{orderData.total_price_with_discount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-6">
          {orderData.order_items.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                width={80}
                height={80}
                className="rounded-lg border object-cover"
              />
              <div className="flex-1">
                <h3 className="text-gray-900 font-medium">
                  {item.product.name}
                </h3>
                <p className="text-gray-600 mt-1">
                  Quantity: {item.quantity} x ₹{item.price.toFixed(2)}
                </p>
                <p className="text-gray-600">
                  Category: {item.product.category.name}
                </p>
              </div>
              <div className="text-green-600">Status: {item.order_status}</div>
            </div>
          ))}
        </div>

        {/* Cancel Button */}
        <div className="flex justify-end mt-6">
          <button className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  )
}