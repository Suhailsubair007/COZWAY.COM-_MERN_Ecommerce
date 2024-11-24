import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ChevronRight,
  Home,
  Package,
  CreditCard,
  Truck,
  RefreshCcw,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axiosInstance from "@/config/axiosConfig";

export default function Component() {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/admin/order/${id}`);
      setOrderData(response.data.order);
      setError(null);
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Failed to fetch order details");
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, itemId, newStatus) => {
    setUpdatingStatus((prev) => ({ ...prev, [itemId]: true }));
    try {
      await axiosInstance.patch(`/admin/orders/${orderId}/status`, {
        newStatus,
        itemId,
      });
      await fetchOrderDetail();
      toast("The order status has been successfully updated.");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update the order status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  if (!orderData)
    return (
      <div className="flex items-center justify-center h-screen">
        No order found
      </div>
    );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const orderStatuses = ["pending", "shipped", "delivered", "cancelled",];

  const isStatusDisabled = (currentStatus, status) => {
    const currentIndex = orderStatuses.indexOf(currentStatus);
    const statusIndex = orderStatuses.indexOf(status);
    return statusIndex < currentIndex;
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <a
          href="/admin/dashboard"
          className="flex items-center hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4 mr-1" />
          <span>Dashboard</span>
        </a>
        <ChevronRight className="h-4 w-4" />
        <a
          href="/admin/orders"
          className="hover:text-foreground transition-colors"
        >
          Orders
        </a>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Order Details</span>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Order Details</h1>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {orderData.order_status}
        </Badge>
      </div>

      {/* Order Info */}
      <div className="bg-muted/100 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Ordered on {formatDate(orderData.placed_at)}
            </p>
            <p className="text-lg font-semibold flex items-center">
              <Package className="h-5 w-5 text-primary mr-1" />
              Order {orderData.order_id}
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Shipping Address */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Truck className="h-5 w-5 text-primary" />
              <h2>Shipping Address</h2>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{orderData.shipping_address.address}</p>
              <p>
                {orderData.shipping_address.district},{" "}
                {orderData.shipping_address.state}
              </p>
              <p>Pin Code - {orderData.shipping_address.pincode}</p>
              <p>Contact Number - {orderData.shipping_address.phone}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2>Payment Method</h2>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{orderData.payment_method}</p>
              <p>Status: {orderData.payment_status}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Package className="h-5 w-5 text-primary" />
              <h2>Order Summary</h2>
            </div>
            <div className="text-sm space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Items Total</span>
                <span>₹{orderData.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Total Discount</span>
                <span>₹{orderData.total_discount.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping Charge</span>
                <span>₹{orderData.shipping_fee.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Grand Total</span>
                <span>₹{orderData.total_price_with_discount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Order Items</h2>
      <ScrollArea className="h-[400px] bg-transparent rounded-md border p-4">
        <div className="space-y-6">
          {orderData.order_items.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 pb-4 border-b last:border-b-0"
            >
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                width={80}
                height={80}
                className="rounded-lg border object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Quantity: {item.quantity} x ₹{item.price.toFixed(2)}
                </p>
                <Badge variant="secondary" className="mt-2">
                  {item.product.category.name}
                </Badge>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-sm text-muted-foreground">Status:</p>
                  <Select
                    value={item.order_status}
                    onValueChange={(newStatus) =>
                      updateOrderStatus(orderData._id, item._id, newStatus)
                    }
                    disabled={updatingStatus[item._id]}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select stFatus" />
                    </SelectTrigger> 
                    <SelectContent>

                      {orderStatuses.map((status) => (
                        <SelectItem
                          key={status}
                          value={status}
                          disabled={orderData?.payment_status === 'Failed' || isStatusDisabled(item.order_status, status)}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}

                    </SelectContent>
                  </Select>
                  {updatingStatus[item._id] && (
                    <RefreshCcw className="h-4 w-4 animate-spin" />
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ₹{(item.quantity * item.price).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}