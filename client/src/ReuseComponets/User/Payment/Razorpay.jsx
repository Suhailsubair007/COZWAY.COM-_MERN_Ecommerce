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
  onPaymentError,
}) => {
  const { Razorpay } = useRazorpay();
  const [error, setError] = useState(null);

  const handlePayment = () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_API_KEY,
      amount: amount * 100,
      currency: "INR",
      name: "",
      description: "",
      order_id: "",
      handler: async (response) => {
        console.log(response);
        try {
          if (response.razorpay_payment_id) {
            // Payment successful
            setError(null);
            handlePlaceOrder();
          }
        } catch (err) {
          setError("Failed to process payment response");
          onPaymentError(err);
          console.log("dataaaargbatbhrtbhn")
          toast.error("Failed to process payment response");
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
        ondismiss: () => {
          setError("Payment cancelled by user");
          onPaymentError?.({ message: "Payment cancelled by user" });
        },
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.on("payment.failed", (response) => {
      const errorMessage = response.error?.description || "Payment failed";
      setError(errorMessage);
      onPaymentError?.(response.error);
    });

    // Handle network errors
    razorpayInstance.on("payment.error", (error) => {
      setError("Network error occurred during payment");
      onPaymentError?.(error);
    });
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
