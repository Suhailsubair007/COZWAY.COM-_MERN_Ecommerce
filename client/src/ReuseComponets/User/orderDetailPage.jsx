import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { saveAs } from "file-saver";
import ReturnPopup from "./ReturnPopup";
import { LoadingSpinner } from "./LoadingSpinner";
import {
  ChevronRight,
  Home,
  Package,
  CreditCard,
  FileText,
  Truck,
  Undo2,
  X,
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
  const [cancelProductId, setCancelProductId] = useState(null);
  const [returningProductId, setReturningProductId] = useState(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
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

  const handleCancel = (productId) => {
    setCancelProductId(productId);
  };

  const confirmCancel = async () => {
    try {
      const response = await axiosInstance.patch(
        `users/order/${id}/cancel/${cancelProductId}`,
        { userId }
      );
      if (response.status === 200) {
        fetchOrderDetail();
        toast.success("Product cancelled successfully");
        setCancelProductId(null);
      } else {
        toast.error("Failed to cancel product");
      }
    } catch (error) {
      if(error.response.status === 400){
        toast.error(error.response.data.message ||"Error in cancelling producty");
      }
      console.error("Error cancelling product:", error);
      
    }
  };

  const handleReturn = (productId) => {
    setReturningProductId(productId);
    setIsReturnModalOpen(true);
  };

  const confirmReturn = async (reason, comments) => {
    try {
      const response = await axiosInstance.post(
        `/users/order/${id}/return/${returningProductId}`,
        {
          returnReason: reason,
          returnComments: comments,
        }
      );
      if (response.status === 200) {
        fetchOrderDetail();
        toast.success("Return request submitted successfully");
        setIsReturnModalOpen(false);
        setReturningProductId(null);
      } else {
        toast.error("Failed to submit return request");
      }
    } catch (error) {
      console.error("Error submitting return request:", error);
      toast.error("Error submitting return request");
    }
  };

  const handleInvoiceDownload = async () => {
    try {
      const response = await axiosInstance.post(
        "/users/invoice",
        {
          orderId: id,
          userId: userId,
        },
        {
          responseType: "blob",
          headers: {
            Accept: "application/pdf",
          },
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const fileName = `invoice-${orderData.order_id}.pdf`;
      saveAs(blob, fileName);

      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice");
    }
  };

  if (isLoading)
    return (
     <LoadingSpinner/>
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
          <Button
            onClick={handleInvoiceDownload}
            variant="outline"
            className="gap-2"
          >
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
                <span>₹{orderData.total_price_with_discount.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Total Discount</span>
                <span>₹{orderData.total_discount.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping Charge</span>
                <span>₹{orderData.shipping_fee.toFixed(0)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Grand Total</span>
                <span>₹{orderData.total_price_with_discount.toFixed(0)}</span>
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
                  Quantity: {item.quantity} x ₹ {item.price.toFixed(0)}
                </p>
                <Badge variant="secondary" className="mt-2">
                  {item.product.category.name}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  Status: {item.order_status}
                </p>
                {item.return_request && (
                  <Badge
                    variant={
                      item.return_request.is_requested
                        ? !item.return_request.is_response_send
                          ? "default"
                          : item.return_request.is_approved
                          ? "success"
                          : "destructive"
                        : null
                    }
                    className="mt-2"
                  >
                    {item.return_request.is_requested
                      ? !item.return_request.is_response_send
                        ? "Return Request Sent"
                        : item.return_request.is_approved
                        ? "Return Request Accepted"
                        : "Return Request Rejected"
                      : null}
                  </Badge>
                )}
              </div>
              <div className="text-right space-y-2">
                <p className="font-semibold">
                  ₹{(item.price * item.quantity).toFixed(0)}
                </p>
                {item.order_status === "delivered" &&
                  !item.return_request?.is_requested && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReturn(item._id)}
                      className="w-full"
                    >
                      <Undo2 className="w-4 h-4 mr-2" />
                      Return
                    </Button>
                  )}
                {item.order_status !== "cancelled" &&
                  item.order_status !== "shipped" &&
                  item.order_status !== "delivered" &&
                  !item.return_request?.is_requested && 
                  (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancel(item._id)}
                      className="w-full"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Cancel Dialog */}
      <AlertDialog
        open={!!cancelProductId}
        onOpenChange={() => setCancelProductId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to cancel this product?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cancelling this product will change its status to "Cancelled".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCancelProductId(null)}>
              No, keep the product
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>
              Yes, cancel the product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Return Modal */}
      <ReturnPopup
        open={isReturnModalOpen}
        onOpenChange={setIsReturnModalOpen}
        onSubmit={confirmReturn}
      />
    </div>
  );
}
