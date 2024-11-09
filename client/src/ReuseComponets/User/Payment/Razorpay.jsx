import { Button } from "@/components/ui/button";
import React from "react";
import { useRazorpay } from "react-razorpay";
import axiosInstance from "@/config/axiosConfig";
import { toast } from "sonner";

const RazorpayX = ({
  name,
  email,
  amount,
  buttonName,
  selectedAddress,
  addresses,
  selectedPaymentMethod,
  userId,
  items,
  onSuccess,
}) => {
  const { Razorpay } = useRazorpay();

  const handlePayment = () => {
    const options = {
      key: "rzp_test_koaeP7VUui0qt4",
      amount: amount * 100,
      currency: "INR",
      name: "",
      description: "",
      order_id: "",
      handler: async (response) => {
        console.log(response);
        // alert("Payment Successful!");
        await handlePlaceOrder();
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
  const addressToSend =
    addresses && addresses.find((address) => address._id === selectedAddress);

  const handlePlaceOrder = async () => {
    try {
      const response = await axiosInstance.post(`/users/order/`, {
        userId: userId,
        order_items: items,
        address: addressToSend,
        payment_method: selectedPaymentMethod,
        subtotal: amount,
      });
      onSuccess(response.data.order);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place the order. Please try again.");
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
