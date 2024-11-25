import { useEffect, useState } from "react";
import { Plus, Trash2, Home, ChevronRight, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AdminCouponModal from "@/ReuseComponets/Admin/AdminCouponModal";
import AdminEditCouponModal from "@/ReuseComponets/Admin/AdminEditCoupenModal";
import axiosInstance from "@/config/axiosConfig";

export default function Coupon() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [couponToEdit, setCouponToEdit] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axiosInstance.get("/admin/getCoupon");
      setCoupons(response.data.coupons);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (couponId) => {
    setCouponToDelete(couponId);
    setIsDeleteDialogOpen(true);
  };

  const handleEdit = (couponId) => {
    setCouponToEdit(couponId);
    setIsEditOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/admin/deleteCoupon/${couponToDelete}`);
      fetchCoupons();
      setIsDeleteDialogOpen(false);
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
            <BreadcrumbPage>Coupon Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coupon Management</h1>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Coupon
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CODE</TableHead>
              <TableHead>DISCOUNT</TableHead>
              <TableHead>VALID PERIOD</TableHead>
              <TableHead>USAGE LIMIT</TableHead>
              <TableHead>MIN PURCHASE AMOUNT</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon._id}>
                <TableCell className="font-medium">{coupon.code}</TableCell>
                <TableCell>
                  {coupon.discount_value}{" "}
                  {coupon.discount_type === "percentage" ? "%" : "₹"}
                </TableCell>
                <TableCell>
                  {new Date(coupon.expiration_date).toLocaleDateString()}{" "}
                </TableCell>
                <TableCell>{coupon.usage_limit}</TableCell>
                <TableCell>{coupon.min_purchase_amount} ₹</TableCell>{" "}
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(coupon._id)}
                  >
                    <Edit className="w-4 h-4 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(coupon._id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AdminCouponModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCouponAdded={fetchCoupons}
      />

      <AdminEditCouponModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onCouponEdited={fetchCoupons}
        couponId={couponToEdit}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this coupon?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This coupon will be permanently
              deleted from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete Coupon
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
