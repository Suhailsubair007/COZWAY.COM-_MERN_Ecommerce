import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useRazorpay } from "react-razorpay";
import { toast } from "sonner";

const RazorpayX = ({
  handlePlaceOrder,
  name,
  email,
  amount,
  buttonName,
  selectedAddress,
  selectedPaymentMethod,
}) => {
  const { Razorpay } = useRazorpay();

  const handlePayment = async () => {
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
  };

  return (
    <div>
      <Button
        className="w-full mb-4"
        size="lg"
        onClick={handlePayment}
        disabled={!selectedAddress || !selectedPaymentMethod}
      >
        {buttonName}
      </Button>
    </div>
  );
};

export default RazorpayX;