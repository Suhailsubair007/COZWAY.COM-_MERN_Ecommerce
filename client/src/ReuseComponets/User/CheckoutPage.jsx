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

const CheckoutPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const user = useSelector((state) => state.user.userInfo.id);

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get(`/users/addresses/${user}`);
      setAddresses(response.data.addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleAddAddress = (newAddress) => {
    setAddresses([...addresses, newAddress]);
    setIsAddModalOpen(false);
  };

  const items = [
    {
      id: 1,
      name: "Mint Green Slim Fit Shirt",
      price: 1120,
      quantity: 1,
      image:
        "https://res.cloudinary.com/dupo7yv88/image/upload/v1730002040/nnklwxujgbahhpwkmf32.jpg",
    },
    {
      id: 2,
      name: "Mint Green Slim Fit Shirt",
      price: 1120,
      quantity: 1,
      image:
        "https://res.cloudinary.com/dupo7yv88/image/upload/v1730002040/nnklwxujgbahhpwkmf32.jpg",
    },
  ];

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = "Free";
  const total = subtotal;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-normal mb-8">CHECKOUT DETAILS</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <RadioGroup defaultValue="1">
            {addresses.map((address) => (
              <div
                key={address._id}
                className="flex items-center space-x-2 mb-4"
              >
                <RadioGroupItem
                  value={address._id.toString()}
                  id={`address-${address._id}`}
                />
                <Label htmlFor={`address-${address._id}`} className="flex-grow">
                  <Card>
                    <CardContent className="p-4">
                      <p>{address.address}</p>
                      <p>{address.district}</p>
                      <p>{address.pincode}</p>
                      <p>Contact : {address.phone}</p>
                    </CardContent>
                  </Card>
                </Label>
              </div>
            ))}
          </RadioGroup>
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add New Address
          </Button>

          <AddAddressModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddAddress}
          />

          <h2 className="text-2xl font-semibold mt-8 mb-4">Payment Methods</h2>
          <p className="mb-4">Select any payment methods</p>
          <RadioGroup>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card">Debit Card / Credit Card</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="bank" id="bank" />
              <Label htmlFor="bank">Bank</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="upi" id="upi" />
              <Label htmlFor="upi">UPI Method</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod">Cash on delivery</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="wallet" id="wallet" />
              <Label htmlFor="wallet">Wallet</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="p-4 border shadow-md">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 mb-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-30 object-cover"
              />
              <div className="flex-grow">
                <h3 className="font-semibold">{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
              </div>
              <p className="font-semibold">₹{item.price}</p>
            </div>
          ))}
          <Separator className="my-4" />
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping:</span>
            <span>{shipping}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold">₹{total}</span>
          </div>
          <div className="flex space-x-2 mb-4">
            <Input placeholder="Apply coupon code" />
            <Button>Apply Coupon</Button>
          </div>
          <Button className="w-full">Place Order</Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;