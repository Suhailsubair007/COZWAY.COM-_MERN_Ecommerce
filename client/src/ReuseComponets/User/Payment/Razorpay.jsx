import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useRazorpay } from "react-razorpay";
import { toast } from "sonner";
import axiosInstance from "@/config/axiosConfig";
const RazorpayX = ({
  handlePlaceOrder,
  name,
  email,
  amount,
  buttonName,
  selectedAddress,
  selectedPaymentMethod,
  items // Add items prop
}) => {
  const { Razorpay } = useRazorpay();
  const [isLoading, setIsLoading] = useState(false);

  const checkStockAvailability = async () => {
    try {
      const response = await axiosInstance.post('/users/check-stock', {
        order_items: items.map(item => ({
          productId: item.productId,
          size: item.size,
          quantity: item.quantity
        }))
      });
      return response.data.success;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to check stock availability");
      return false;
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      const isStockAvailable = await checkStockAvailability();
      
      if (!isStockAvailable) {
        setIsLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY,
        amount: amount * 100,
        currency: "INR",
        name: "",
        description: "",
        order_id: "",
        handler: async (response) => {
          try {
            if (response.razorpay_payment_id) {
              await handlePlaceOrder('Paid');
            }
          } catch (err) {
            console.error("Payment successful but order placement failed:", err);
            toast.error("Payment successful, but order placement failed.");
          }
        },
        prefill: {
          name: name,
          email: email,
          contact: "7736417357",
        },
        theme: {
          color: "#F37254",
        },
        modal: {
          ondismiss: async () => {
            await handlePlaceOrder('Failed');
          }
        }
      };

      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      toast.error("Failed to initialize payment");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        className="w-full mb-4"
        size="lg"
        onClick={handlePayment}
        disabled={!selectedAddress || !selectedPaymentMethod || isLoading}
      >
        {isLoading ? "Checking availability..." : buttonName}
      </Button>
    </div>
  );
};

export default RazorpayX;