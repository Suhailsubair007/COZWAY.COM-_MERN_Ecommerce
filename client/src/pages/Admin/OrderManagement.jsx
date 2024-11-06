import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Package, Eye, ChevronRight, Home } from "lucide-react";
import axiosInstance from "@/config/axiosConfig";
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
import { toast } from "sonner";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("/admin/orders");
      console.log("data===============>",response.data);
      setOrders(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch orders. Please try again.");
    }
  };

  const handleStatusChange = async (orderId, newStatus, currentStatus) => {
    // Prevent changing status to a previous state
    const statusOrder = ['pending', 'shipped', 'delivered', 'cancelled'];
    const currentIndex = statusOrder.indexOf(currentStatus.toLowerCase());
    const newIndex = statusOrder.indexOf(newStatus);

    if (newIndex < currentIndex) {
      toast.error("Cannot change to a previous status.");
      return;
    }

    try {
      await axiosInstance.patch(`/admin/orders/${orderId}/status`, {
        newStatus,
      });
      fetchOrders();
      toast.success("Order status updated successfully.");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status. Please try again.");
    }
  };

  const handleCancel = (order) => {
    setOrderToCancel(order);
    setIsCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    if (!orderToCancel) return;

    try {
      await handleStatusChange(orderToCancel._id, "cancelled", orderToCancel.order_status);
      toast.success("Order cancelled successfully.");
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order. Please try again.");
    }
    setOrderToCancel(null);
    setIsCancelDialogOpen(false);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvailableStatuses = (currentStatus) => {
    const statusOrder = ['pending', 'shipped', 'delivered', 'cancelled'];
    const currentIndex = statusOrder.indexOf(currentStatus.toLowerCase());
    return statusOrder.slice(currentIndex);
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

      <div className="mb-6">
        <Input
          placeholder="Search orders by ID, customer name, or email..."
          className="max-w-xl w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] sm:w-[200px]">ORDER ID</TableHead>
              <TableHead className="min-w-[200px]">CUSTOMER</TableHead>
              <TableHead className="hidden sm:table-cell">DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
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
                  {new Date(order.placed_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{order.total_amount}</TableCell>
                <TableCell>
                  <Select
                    value={order.order_status.toLowerCase()}
                    onValueChange={(value) =>
                      handleStatusChange(order._id, value, order.order_status)
                    }
                    disabled={order.order_status.toLowerCase() === "cancelled"}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableStatuses(order.order_status).map((status) => (
                        <SelectItem key={status} value={status}>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            status === 'delivered' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancel(order)}
                      disabled={
                        order.order_status.toLowerCase() === "cancelled" ||
                        order.order_status.toLowerCase() === "delivered"
                      }
                    >
                      Cancel
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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