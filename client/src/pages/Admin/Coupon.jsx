import { useEffect, useState } from "react"
import { Plus, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import AdminCouponModal from "@/ReuseComponets/Admin/AdminCouponModal"
import axiosInstance from "@/config/axiosConfig"

export default function Coupon() {
  const [isOpen, setIsOpen] = useState(false)
  const [coupons, setCoupons] = useState([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [couponToDelete, setCouponToDelete] = useState(null)

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const response = await axiosInstance.get("/admin/getCoupon")
      console.log("dataaa--->", response.data)
      setCoupons(response.data.coupons)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = (couponId) => {
    setCouponToDelete(couponId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/admin/deleteCoupon/${couponToDelete}`)
      fetchCoupons()
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

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

      <AdminCouponModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCouponAdded={fetchCoupons}
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
              This action cannot be undone. This coupon will be permanently deleted from the system.
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
  )
}