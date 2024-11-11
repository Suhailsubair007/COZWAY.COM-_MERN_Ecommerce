import { useEffect, useState } from "react";
import { Plus, Trash2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AdminCouponModal from "@/ReuseComponets/Admin/AdminCouponModal";
import axiosInstance from "@/config/axiosConfig";

export default function Coupon() {
  const [isOpen, setIsOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const responce = await axiosInstance.get("/admin/getCoupon");
      console.log("dataaa--->", responce.data);
      setCoupons(responce.data.coupons);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log("id------->",id);
      console.log("================")
      await axiosInstance.delete(`/admin/deleteCoupon/${id}`);
      fetchCoupons();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 h-screen">
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

      <AdminCouponModal isOpen={isOpen} onClose={() => setIsOpen(false)} onCouponAdded={fetchCoupons} />
    </div>
  );
}
