import { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosConfig";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validateCouponForm } from "../../utils/Validations";
import { toast } from "sonner";

export default function AdminEditCouponModal({
  isOpen,
  onClose,
  onCouponEdited,
  couponId,
}) {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    min_purchase_amount: "",
    max_discount_amount: "",
    expiration_date: "",
    usage_limit: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (couponId && isOpen) {
      fetchCouponDetails();
    }
  }, [couponId, isOpen]);

  const fetchCouponDetails = async () => {
    try {
      const response = await axiosInstance.get(`/admin/coupen/${couponId}`);
      setFormData(response.data.coupon);
    } catch (error) {
      console.error("Error fetching coupon details:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      discount_type: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateCouponForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axiosInstance.put(
          `/admin/coupen/${couponId}`,
          formData
        );
        onCouponEdited();
        onClose();
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Coupon</DialogTitle>
        </DialogHeader>
        <form className="grid gap-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                name="code"
                placeholder="Enter coupon code"
                value={formData.code}
                onChange={handleChange}
              />
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <Select
                value={formData.discount_type}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountValue">Discount Value</Label>
              <Input
                id="discountValue"
                name="discount_value"
                type="number"
                placeholder="Enter value"
                value={formData.discount_value}
                onChange={handleChange}
              />
              {errors.discount_value && (
                <p className="text-sm text-red-500">{errors.discount_value}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minPurchase">Minimum Purchase Amount</Label>
              <Input
                id="minPurchase"
                name="min_purchase_amount"
                type="number"
                placeholder="Enter amount"
                value={formData.min_purchase_amount}
                onChange={handleChange}
              />
              {errors.min_purchase_amount && (
                <p className="text-sm text-red-500">
                  {errors.min_purchase_amount}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxDiscount">Maximum Discount Amount</Label>
              <Input
                id="maxDiscount"
                name="max_discount_amount"
                type="number"
                placeholder="Enter amount"
                value={formData.max_discount_amount}
                onChange={handleChange}
              />
              {errors.max_discount_amount && (
                <p className="text-sm text-red-500">
                  {errors.max_discount_amount}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiration Date</Label>
              <Input
                id="expiryDate"
                name="expiration_date"
                type="date"
                value={
                  formData.expiration_date
                    ? formData.expiration_date.split("T")[0]
                    : ""
                }
                onChange={handleChange}
              />
              {errors.expiration_date && (
                <p className="text-sm text-red-500">{errors.expiration_date}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="usageLimit">Usage Limit</Label>
              <Input
                id="usageLimit"
                name="usage_limit"
                type="number"
                placeholder="Enter limit"
                value={formData.usage_limit}
                onChange={handleChange}
              />
              {errors.usage_limit && (
                <p className="text-sm text-red-500">{errors.usage_limit}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Coupon</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
