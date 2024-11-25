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
import { Banknote, Wallet, X } from "lucide-react";
import { toast } from "sonner";
import OrderConfirmationModal from "./OrderConfirmModal";
import RazorpayX from "./Payment/Razorpay";
import { CouponDisplayAtCheckout } from './CoupenDisplayAtCheckout';
import { CheckoutSkeleton } from "./CheckoutSkeleton";

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true)
  const [items, setItems] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const user = useSelector((state) => state.user.userInfo);

  const shipping = 0;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        await Promise.all([fetchAddresses(), fetchItems()])
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load checkout data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])


  useEffect(() => {
    setTotal(subtotal - couponDiscount + shipping);
  }, [subtotal, couponDiscount, shipping]);

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
      setSubtotal(response.data.totalCartPrice);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to fetch cart items");
    }
  };
  const handleAddAddress = (newAddress) => {
    setAddresses([...addresses, newAddress]);
    setIsAddModalOpen(false);
  };

  const calculateTotalDiscountPrice = () => {
    const totalOriginalPrice = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const totalDiscountedPrice = items.reduce(
      (acc, item) =>
        acc +
        (item.offerPrice -
          (item.offerPrice *
            (item?.productId?.offer?.offer_value
              ? item?.productId?.offer?.offer_value
              : 0)) /
          100) *
        item.quantity,
      0
    );
    return totalOriginalPrice - totalDiscountedPrice + couponDiscount;
  };
  const calculateTotalSavings = () => {
    return items.reduce((acc, item) => {
      const originalTotal = item.price * item.quantity;
      const discountedTotal =
        (item.offerPrice -
          (item.offerPrice *
            (item?.productId?.offer?.offer_value
              ? item?.productId?.offer?.offer_value
              : 0)) /
          100) *
        item.quantity;
      return acc + (originalTotal - discountedTotal);
    }, 0);
  };

  const applyCoupon = async () => {
    try {
      const response = await axiosInstance.post("/users/coupon/apply", {
        code: couponCode,
        userId: user.id,
        subtotal,
      });
      setAppliedCoupon(response.data.coupon);
      setCouponDiscount(response.data.discountAmount);
      toast.success("Coupon applied successfully!");
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
    toast.success("Coupon removed successfully!");
  };

  const handlePlaceOrder = async (paymentStatus = "Pending") => {
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
      const response = await axiosInstance.post(`/users/order/`, {
        userId: user.id,
        order_items: items.map((item) => {
          const discountedPrice =
            item.offerPrice -
            (item.offerPrice *
              (item?.productId?.offer?.offer_value
                ? item?.productId?.offer?.offer_value
                : 0)) /
            100;

          return {
            ...item,
            price: discountedPrice,
            totalProductPrice: (discountedPrice * item.quantity).toFixed(0),
          };
        }),
        address: addressToSend,
        payment_method: selectedPaymentMethod,
        payment_status: paymentStatus,
        subtotal,
        total_discount: calculateTotalDiscountPrice(),
        coupon_discount: couponDiscount,
        total_price_with_discount: total,
        shipping_fee: shipping,
        coupon: appliedCoupon?.code || null,
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


  if (isLoading) {
    return <CheckoutSkeleton />
  }
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
                  {item.discount > 2 && (
                    <div className="text-sm text-green-600 font-medium">
                      {item.discount.toFixed(0)}% OFF
                    </div>
                  )}

                </div>
                <div className="text-right">
                  <p className="line-through text-gray-500">₹{item.price}</p>
                  <p className="font-semibold">
                    ₹
                    {(
                      (item.offerPrice -
                        (item.offerPrice *
                          (item?.productId?.offer?.offer_value
                            ? item?.productId?.offer?.offer_value
                            : 0)) /
                        100) *
                      item.quantity
                    ).toFixed(0)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total: ₹{item.totalProductPrice.toFixed(0)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-6" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>₹{subtotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(0)}`}</span>
            </div>
            <div className="flex justify-between text-green-600 font-medium">
              <span>Product Savings:</span>
              <span>₹{calculateTotalSavings().toFixed(0)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Coupon Discount:</span>
                <span>₹{couponDiscount.toFixed(0)}</span>
              </div>
            )}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between text-lg font-semibold mb-6">
            <span>Total:</span>
            {total.toFixed(0)}
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex space-x-2">
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
            <CouponDisplayAtCheckout />
          </div>
          {getButtonText() === "Place Order" ? (
            <Button
              className="w-full mb-4"
              size="lg"
              onClick={() => handlePlaceOrder()}
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
              amount={total.toFixed(0)}
              buttonName={getButtonText()}
              handlePlaceOrder={handlePlaceOrder}
              items={items}
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
