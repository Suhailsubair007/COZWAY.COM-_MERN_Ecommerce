import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import axiosInstance from "@/config/axiosConfig";
import { useSelector } from "react-redux";
import EmptyCart from "./EmptyCart";
import { toast } from "sonner";


//cart card...
const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
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
      <p className="text-xs text-gray-600">
        Size: {item.size} | Fit: {item.productId.fit} | Sleeve:{" "}
        {item.productId.sleeve}
      </p>
      <div className="flex items-center mt-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const sizeData = item.productId.sizes.find(
              (s) => s.size === item.size
            );
            onUpdateQuantity(
              item._id,
              Math.max(1, item.quantity - 1),
              item.size
            );
          }}
        >
          <MinusIcon className="h-3 w-3" />
        </Button>
        <span className="mx-2 w-6 text-center text-sm">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const sizeData = item.productId.sizes.find(
              (s) => s.size === item.size
            );
            if (sizeData) {
              const maxQuantity = Math.min(sizeData.stock, 5);

              if (item.quantity + 1 > 5) {
                toast.info("Maximum 5 items allowed per size");
              } else if (item.quantity + 1 > sizeData.stock) {
                toast.info(
                  `Only ${sizeData.stock} items available for size ${item.size}`
                );
              } else {
                onUpdateQuantity(item._id, item.quantity + 1, item.size);
              }
            }
          }}
        >
          <PlusIcon className="h-3 w-3" />
        </Button>
      </div>
    </div>
    <div className="text-right">
      <p className="font-bold text-base">
        ₹{(item.price * item.quantity).toFixed(2)}
      </p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(item._id)}
        className="mt-1"
      >
        <TrashIcon className="h-3 w-3 mr-1" />
        <span className="text-xs">Remove</span>
      </Button>
    </div>
  </div>
);

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const userId = useSelector((state) => state.user.userInfo.id);

  //fetching cart items...
  useEffect(() => {
    fetchCart();
  }, [userId]);

  //function for fetchcart items...
  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get(`/users/cart/${userId}`);
      setCartItems(response.data.cartItems);
      console.log("Cart items :", response.data.cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  //updating quantity..
  const updateQuantity = async (itemId, newQuantity, size) => {
    try {
      const item = cartItems.find((cartItem) => cartItem._id === itemId);
      const sizeData = item.productId.sizes.find((s) => s.size === size);

      if (newQuantity > sizeData.stock) {
        toast.warning(`Only ${sizeData.stock} items left for ${size} size`);
        return;
      }
      console.log("sizes is :", size);
      await axiosInstance.patch(`/users/quantity/${userId}/${itemId}`, {
        quantity: newQuantity,
      });
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axiosInstance.delete(`/users/delete/${userId}/${itemId}`);
      fetchCart();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = subtotal;

  return (
    <div className="container mx-auto px-6 py-4">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            {cartItems.map((item, index) => (
              <React.Fragment key={item._id}>
                <CartItem
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
                {index < cartItems.length - 1 && <Separator />}
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
                <span>₹{total.toFixed(2)}</span>
              </div>
              <Button className="w-full mt-4">Proceed to Checkout</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
