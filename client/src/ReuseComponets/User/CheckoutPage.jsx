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
import { CreditCard, Smartphone, Banknote, Wallet } from "lucide-react";
import { toast } from "sonner";
import OrderConfirmationModal from "./OrderConfirmModal";

const CheckoutPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const user = useSelector((state) => state.user.userInfo.id);

  useEffect(() => {
    fetchAddresses();
    fetchItems();
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get(`/users/addresses/${user}`);
      setAddresses(response.data.addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axiosInstance.get(`/users/items/${user}`);
      setItems(response.data.products);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleAddAddress = (newAddress) => {
    setAddresses([...addresses, newAddress]);
    setIsAddModalOpen(false);
  };

  const calculateTotalSavings = () => {
    return items.reduce((acc, item) => {
      const originalTotal = item.offerPrice * item.quantity;
      const actualTotal = item.price * item.quantity;
      return acc + (originalTotal - actualTotal);
    }, 0);
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.offerPrice * item.quantity,
    0
  );
  const shipping = "Free";
  const total = subtotal;
  const totalSavings = calculateTotalSavings();

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedPaymentMethod) {
      toast(
        "Please select both a delivery address and a payment method before placing your order."
      );
      return;
    }

    const addressToSend = addresses.find(
      (address) => address._id === selectedAddress
    );

    console.log("selected addresss============================", addressToSend);

    if (!addressToSend) {
      toast("Selected address not found.");
      return;
    }

    try {
      const response = await axiosInstance.post(`/users/order/`, {
        userId: user,
        order_items: items,
        address: addressToSend,
        payment_method: selectedPaymentMethod,
        subtotal,
      });

      console.log("Response received:", response.data);
      setPlacedOrder(response.data.order);
      setShowConfirmation(true);
      setItems([]); // Clear cart items after successful order
    } catch (error) {
      console.error("Error placing order:", error);
      toast("Error placing order. Please try again.");
    }
  };

  // const handlePlcaceOrder = async () => {};

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
                        <p>pincode: {address.pincode}</p>
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

          <AddAddressModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddAddress}
          />

          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Payment Methods</h2>
            <p className="mb-4 text-gray-600">Select a payment method</p>
            <RadioGroup
              value={selectedPaymentMethod}
              onValueChange={setSelectedPaymentMethod}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="Credit Card/ Debit Card" id="card" />
                <CreditCard className="h-6 w-6 text-blue-500" />
                <Label htmlFor="card" className="flex-grow">
                  Credit Card/ Debit Card
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="Wallet" />
                {/* <Landmark /> */}
                <Wallet className="h-6 w-6 text-green-500" />
                <Label htmlFor="bank" className="flex-grow">
                  Wallet
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="UPI" id="upi" />
                <Smartphone className="h-6 w-6 text-purple-500" />
                <Label htmlFor="UPI" className="flex-grow">
                  UPI
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="Cash on Delivery" id="cod" />
                <Banknote className="h-6 w-6 text-yellow-500" />
                <Label htmlFor="cod" className="flex-grow">
                  Cash on Delivery
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
                  alt={item.name}
                  className="w-20 h-30 object-cover rounded-md"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.productId.name}</h3>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                  <div className="text-sm text-green-600 font-medium">
                    {Math.round(item.discount)}% OFF
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
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span>{shipping}</span>
            </div>
            <div className="flex justify-between text-green-600 font-medium">
              <span>Total Savings:</span>
              <span>₹{totalSavings}</span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between text-lg font-semibold mb-6">
            <span>Total:</span>
            <span>₹{total}</span>
          </div>
          <div className="flex space-x-2 mb-6">
            <Input placeholder="Apply coupon code" className="flex-grow" />
            <Button variant="outline">Apply</Button>
          </div>
          <Button
            className="w-full mb-4"
            size="lg"
            onClick={handlePlaceOrder}
            // disabled={!selectedAddress || !selectedPaymentMethod}
          >
            Place Order
          </Button>
          <Button variant="outline" className="w-full" size="lg">
            <img src={paypal} alt="PayPal" className="h-10 mr-2" />
            Pay with PayPal
          </Button>
        </div>
      </div>
      {showConfirmation && (
        <OrderConfirmationModal
          order={placedOrder}
          onClose={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
