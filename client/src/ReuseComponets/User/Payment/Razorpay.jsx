import { Button } from "@/components/ui/button";
import React from "react";
import { useRazorpay } from "react-razorpay";

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
        handlePlaceOrder();
      },
      prefill: {
        name: name,
        email: email,
        contact: "7736417357",
      },
      theme: {
        color: "#F37254",
      },
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
