import { useState } from "react";
import { Plus, Trash2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AdminCouponModal from "@/ReuseComponets/Admin/AdminCouponModal";

export default function Coupon() {
  const [isOpen, setIsOpen] = useState(false);
  const [coupons] = useState([
    {
      code: "SUMMER10",
      discount: "10%",
      validPeriod: "12/31/2024",
      usageLimit: 10,
      eligibleCategories: ["Casual Shirts", "Formal Shirts", "Premium Shirts"],
      status: "Active",
    },
    {
      code: "PREMIUM500",
      discount: "₹500",
      validPeriod: "12/31/2024",
      usageLimit: 3,
      eligibleCategories: ["Premium Shirts"],
      status: "Active",
    },
    {
      code: "FORMAL20",
      discount: "20%",
      validPeriod: "12/31/2024",
      usageLimit: 5,
      eligibleCategories: ["Formal Shirts"],
      status: "Active",
    },
  ]);

  const categories = ["Casual Shirts", "Formal Shirts", "Premium Shirts"];

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
              <TableHead className="max-w-[300px]">
                ELIGIBLE CATEGORIES
              </TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.code}>
                <TableCell className="font-medium">{coupon.code}</TableCell>
                <TableCell>{coupon.discount}</TableCell>
                <TableCell>{coupon.validPeriod}</TableCell>
                <TableCell>{coupon.usageLimit}</TableCell>
                <TableCell className="max-w-[300px]">
                  <div className="flex flex-wrap gap-1">
                    {coupon.eligibleCategories.map((category) => (
                      <span
                        key={category}
                        className="text-sm text-muted-foreground"
                      >
                        • {category}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      coupon.status === "Active" ? "success" : "secondary"
                    }
                  >
                    {coupon.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Link2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AdminCouponModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        categories={categories}
      />
    </div>
  );
}
