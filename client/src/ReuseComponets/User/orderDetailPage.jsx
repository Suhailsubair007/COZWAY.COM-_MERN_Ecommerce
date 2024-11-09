import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ChevronRight,
  Home,
  Package,
  CreditCard,
  FileText,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/config/axiosConfig";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function OrderDetail() {
  const { id } = useParams();
  const userId = useSelector((state) => state.user.userInfo.id);
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/users/order/${id}`);
      setOrderData(response.data.order);
      setError(null);
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Failed to fetch order details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    try {
      const response = await axiosInstance.patch(`/users/order/${id}`, {
        status: "Cancelled",
        userId,
      });
      if (response.status === 200) {
        fetchOrderDetail();
        toast.success("Order cacelled..");
        setIsCancelDialogOpen(false);
      } else {
        console.log("Order cancellation failed");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
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

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <a
          href="/"
          className="flex items-center hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4 mr-1" />
          <span>Home</span>
        </a>
        <ChevronRight className="h-4 w-4" />
        <a href="/profile" className="hover:text-foreground transition-colors">
          Account
        </a>
        <ChevronRight className="h-4 w-4" />
        <a
          href="/profile/orders"
          className="hover:text-foreground transition-colors"
        >
          My Orders
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
      <div className="bg-muted/50 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Ordered on {formatDate(orderData.placed_at)}
            </p>
            <p className="text-lg font-semibold">Order #{orderData.order_id}</p>
          </div>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Invoice
          </Button>
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

      {/* Products List */}
      <h2 className="text-2xl font-semibold mb-4">Order Items</h2>
      <ScrollArea className="h-[400px] rounded-md border p-4">
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

      {/* Cancel Order Button */}
      <div className="flex justify-end mt-8">
        <Button
          variant="destructive"
          onClick={handleCancel}
          disabled={
            orderData.order_status === "cancelled" ||
            orderData.order_status === "delivered"
          }
        >
          {orderData.order_status === "cancelled"
            ? "Order Cancelled"
            : orderData.order_status === "delivered"
            ? "Order Delivered"
            : "Cancel Order"}
        </Button>
      </div>

      {/* Cancel Dialog */}
      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to cancel this order?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cancelling this order will change its status to "Cancelled". This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsCancelDialogOpen(false)}>
              No, keep the order
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>
              Yes, cancel the order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
