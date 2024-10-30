import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MinusIcon, PlusIcon, TrashIcon, ChevronRight } from "lucide-react";
import axiosInstance from "@/config/axiosConfig";
import { useSelector } from "react-redux";
import EmptyCart from "./EmptyCart";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const x = item.discount
  const discount = Math.floor(x);
  return (
    <div className="flex items-center py-3">
      <img
        src={item.productId.images[0]}
        alt={item.productId.name}
        className="w-20 h-28 object-cover mr-3"
      />
      <div className="flex-grow">
        <h3 className="font-semibold text-base">{item.productId.name}</h3>
        <p className="text-xs text-gray-600">
          Category: {item.productId.category.name}
        </p>
        <p className="text-lg text-gray-900">Size: {item.size}</p>
        <p className="text-sm text-green-500">Size: {discount}%</p>
        <div className="flex items-center mt-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(item, "decrease")}
          >
            <MinusIcon className="h-3 w-3" />
          </Button>
          <span className="mx-2 w-6 text-center text-sm">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(item, "increase")}
          >
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-base">
          ₹{(item.offerPrice * item.quantity).toFixed(2)}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item)}
          className="mt-1"
        >
          <TrashIcon className="h-3 w-3 mr-1" />
          <span className="text-xs">Remove</span>
        </Button>
      </div>
    </div>
  );
};

export default function ShoppingCart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const userId = useSelector((state) => state.user.userInfo.id);

  // Fetch cart items and calculate subtotal
  useEffect(() => {
    fetchCart();
  }, [userId]);


  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get(`/users/cart/${userId}`);
      console.log(response.data.cartItems);
      setCartItems(response.data.cartItems.products);

      setSubtotal(response.data.cartItems.totalCartPrice);
    } catch (error) {
      console.error("Error fetching cart:", error);
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const updateQuantity = async (item, action) => {
    try {
      const endpoint = action === "increase" ? "add" : "min";
      await axiosInstance.patch(
        `/users/quantity/${endpoint}/${userId}/${item._id}`
      );
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const removeItem = async (item) => {
    try {
      const response = await axiosInstance.delete(
        `/users/delete/${userId}/${item._id}`
      );
      toast.success(response.data.message);
      fetchCart();
    } catch (error) {
      console.error("Error removing item from cart:", error);
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  // const calculateSubtotal = (items) => {
  //   const newSubtotal = items.reduce(
  //     (acc, item) => acc + item.price * item.quantity,
  //     0
  //   );
  //   setSubtotal(newSubtotal);
  // };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="container mx-auto px-6 py-4">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            {cartItems.map((item) => (
              <React.Fragment key={item._id}>
                <CartItem
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
                <Separator />
              </React.Fragment>
            ))}
          </div>
          <div className="md:w-1/3">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
              <div className="flex justify-between mb-2 text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <Button onClick={handleCheckout} className="w-full mt-4">
                Go to Checkout
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
