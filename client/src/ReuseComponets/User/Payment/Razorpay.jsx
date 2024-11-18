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

  const handlePayment = async () => {
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
            await handlePlaceOrder('Paid');
          }
        } catch (err) {
          setError("Failed to process payment response");
          await handleFailedPayment('Failed');
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
          setError("Payment cancelled by user");
          await handleFailedPayment({ message: "Payment cancelled by user" });
        },
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.on("payment.failed", async (response) => {
      const errorMessage = response.error?.description || "Payment failed";
      setError(errorMessage);
      await handleFailedPayment(response.error);
    });

    razorpayInstance.on("payment.error", async (error) => {
      setError("Network error occurred during payment");
      await handleFailedPayment(error);
    });
    razorpayInstance.open();
  };

  const handleFailedPayment = async (error) => {
    try {
      await handlePlaceOrder('Failed');
      onPaymentError?.(error);
    } catch (err) {
      console.error("Error handling failed payment:", err);
      toast.error("An error occurred while processing your order. Please try again.");
    }
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