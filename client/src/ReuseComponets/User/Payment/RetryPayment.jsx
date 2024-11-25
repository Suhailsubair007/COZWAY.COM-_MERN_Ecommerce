import { Button } from "@/components/ui/button";
import axiosInstance from "@/config/axiosConfig";
import axios from "axios";
import React, { useState } from "react";
import { useRazorpay } from "react-razorpay";
import { toast } from "sonner";

const RetryPayment = ({
  userInfo,
  amount,
  buttonName,
  orderId,
  fetchOrders,
  currentPage,
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
        try {
          if (response.razorpay_payment_id) {
            setError(null);
            const responce = await axiosInstance.post("/users//order/retry", {
              orderId,
              status: "Paid",
            });
            toast.success("Paymet completed Sucessfully..");
            fetchOrders(currentPage);

          }
        } catch (err) {
          setError("Failed to process payment response");
          toast.error("Failed");
        }
      },
      prefill: {
        name: userInfo?.name,
        email: userInfo?.name,
        contact: "7736417357",
      },
      theme: {
        color: "#F37254",
      },
      modal: {
        ondismiss: async () => {
          setError("Payment cancelled by user");
        },
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };

  return (
    <div>
      <Button
        variant="default"
        className="bg-green-600 hover:bg-green-700 text-white"
        onClick={handlePayment}
      >
        {buttonName}
      </Button>
    </div>
  );
};

export default RetryPayment;
