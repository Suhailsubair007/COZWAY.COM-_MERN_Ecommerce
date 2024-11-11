import React, { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSelector } from "react-redux";
import axiosInstance from "@/config/axiosConfig";
import AddAddressModal from "./AddNewAddress";
import paypal from "../../assets/image/pay.png";
import { Banknote, Wallet } from "lucide-react";
import { toast } from "sonner";
import OrderConfirmationModal from "./OrderConfirmModal";
import RazorpayX from "./Payment/Razorpay";

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const user = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    fetchAddresses();
    fetchItems();
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get(`/users/addresses/${user.id}`);
      setAddresses(response.data.addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to fetch addresses");
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axiosInstance.get(`/users/items/${user.id}`);
      setItems(response.data.products);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to fetch cart items");
    }
  };

  const handleAddAddress = (newAddress) => {
    setAddresses([...addresses, newAddress]);
    setIsAddModalOpen(false);
  };

  const calculateTotalDiscountPercentage = () => {
    const totalOriginalPrice = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const totalDiscountedPrice = items.reduce(
      (acc, item) => acc + item.offerPrice * item.quantity,
      0
    );
    const discountPrice = totalOriginalPrice - totalDiscountedPrice;
    return discountPrice + (appliedCoupon ? couponDiscount : 0);
  };

  const calculateTotalSavings = () => {
    return items.reduce((acc, item) => {
      const originalTotal = item.price * item.quantity;
      const discountedTotal = item.offerPrice * item.quantity;
      return acc + (originalTotal - discountedTotal);
    }, 0);
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.offerPrice * item.quantity,
    0
  );
  const shipping = 0;
  const totalSavings = calculateTotalSavings();

  const applyCoupon = async () => {
    try {
      const response = await axiosInstance.post("/users/coupon/apply", {
        code: couponCode,
        userId: user.id,
        subtotal,
      });
      setAppliedCoupon(response.data.coupon);
      toast.success("Coupon applied successfully!");
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed successfully!");
  };

  const calculateDiscountedTotal = () => {
    if (!appliedCoupon) return subtotal;

    let discountAmount = 0;
    if (appliedCoupon.discount_type === "percentage") {
      discountAmount = subtotal * (appliedCoupon.discount_value / 100);
    } else {
      discountAmount = appliedCoupon.discount_value;
    }

    if (appliedCoupon.max_discount_amount) {
      discountAmount = Math.min(
        discountAmount,
        appliedCoupon.max_discount_amount
      );
    }

    return Math.max(subtotal - discountAmount, 0);
  };

  const total = calculateDiscountedTotal() + shipping;
  const couponDiscount = subtotal - calculateDiscountedTotal();

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedPaymentMethod) {
      toast.warning(
        "Please select both a delivery address and a payment method before placing your order."
      );
      return;
    }

    const addressToSend = addresses.find(
      (address) => address._id === selectedAddress
    );

    if (!addressToSend) {
      toast.error("Selected address not found.");
      return;
    }

    try {
      console.log("in handle place order================");
      const response = await axiosInstance.post(`/users/order/`, {
        userId: user.id,
        order_items: items,
        address: addressToSend,
        payment_method: selectedPaymentMethod,
        subtotal,
        total_discount: calculateTotalDiscountPercentage() || 0,
        coupon_discount: couponDiscount || 0,
        total_price_with_discount: total || 0,
        shipping_fee: shipping || 0,
        coupon: appliedCoupon?.code || 0,
      });

      setPlacedOrder(response.data.order);
      setShowConfirmation(true);
      setItems([]);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    }
  };

  const getButtonText = () => {
    switch (selectedPaymentMethod) {
      case "Cash on Delivery":
      case "Wallet":
        return "Place Order";
      case "RazorPay":
        return "Pay with RazorPay";
      default:
        return "Place Order";
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-center sm:text-left">
        Checkout
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Delivery Address</h2>
            <RadioGroup
              value={selectedAddress}
              onValueChange={setSelectedAddress}
            >
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className="flex items-center space-x-2 mb-4"
                >
                  <RadioGroupItem
                    value={address._id.toString()}
                    id={`address-${address._id}`}
                  />
                  <Label
                    htmlFor={`address-${address._id}`}
                    className="flex-grow"
                  >
                    <Card>
                      <CardContent className="p-4">
                        <p className="font-medium">{address.address}</p>
                        <p>{address.district}</p>
                        <p>{address.pincode}</p>
                        <p>Contact: {address.phone}</p>
                      </CardContent>
                    </Card>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Button
              className="w-full mt-4"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add New Address
            </Button>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Payment Methods</h2>
            <p className="mb-4 text-gray-600">Select a payment method</p>
            <RadioGroup
              value={selectedPaymentMethod}
              onValueChange={setSelectedPaymentMethod}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="Cash on Delivery" id="cod" />
                <Banknote className="h-6 w-6 text-yellow-500" />
                <Label htmlFor="cod" className="flex-grow">
                  Cash on Delivery
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="Wallet" id="wallet" />
                <Wallet className="h-6 w-6 text-green-500" />
                <Label htmlFor="wallet" className="flex-grow">
                  Wallet
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="RazorPay" id="RazorPay" />
                <img src={paypal} alt="RazorPay" className="h-6 mr-2" />
                <Label htmlFor="RazorPay" className="flex-grow">
                  RazorPay
                </Label>
              </div>
            </RadioGroup>
          </section>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item._id} className="flex items-center space-x-4">
                <img
                  src={item.productId.images[0]}
                  alt={item.productId.name}
                  className="w-20 h-30 object-cover rounded-md"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.productId.name}</h3>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                  <div className="text-sm text-green-600 font-medium">
                    {Math.round(
                      ((item.price - item.offerPrice) / item.price) * 100
                    )}
                    % OFF
                  </div>
                </div>
                <div className="text-right">
                  <p className="line-through text-gray-500">₹{item.price}</p>
                  <p className="font-semibold">₹{item.offerPrice}</p>
                  <p className="text-sm text-gray-600">
                    Total: ₹{item.offerPrice * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-6" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-green-600 font-medium">
              <span>Product Savings:</span>
              <span>₹{totalSavings.toFixed(2)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Coupon Discount:</span>
                <span>₹{couponDiscount.toFixed(2)}</span>
              </div>
            )}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between text-lg font-semibold mb-6">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <div className="flex space-x-2 mb-6">
            <Input
              placeholder="Apply coupon code"
              className="flex-grow"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={appliedCoupon !== null}
            />
            <Button
              variant="outline"
              onClick={appliedCoupon ? removeCoupon : applyCoupon}
            >
              {appliedCoupon ? "Remove Coupon" : "Apply Coupon"}
            </Button>
          </div>
          {getButtonText() === "Place Order" ? (
            <Button
              className="w-full mb-4"
              size="lg"
              onClick={handlePlaceOrder}
              disabled={!selectedAddress || !selectedPaymentMethod}
            >
              {getButtonText()}
            </Button>
          ) : (
            <RazorpayX
              name={user.name}
              email={user.email}
              selectedAddress={selectedAddress}
              selectedPaymentMethod={selectedPaymentMethod}
              amount={total}
              buttonName={getButtonText()}
              handlePlaceOrder={handlePlaceOrder}
            />
          )}
        </div>
      </div>
      {showConfirmation && (
        <OrderConfirmationModal
          order={placedOrder}
          onClose={() => setShowConfirmation(false)}
        />
      )}
      <AddAddressModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddAddress}
      />
    </div>
  );
}
