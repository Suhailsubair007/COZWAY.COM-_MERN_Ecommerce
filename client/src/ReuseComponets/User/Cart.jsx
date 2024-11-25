import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/config/axiosConfig";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import EmptyCart from "./EmptyCart";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const discount = Math.floor(item.discount);


  const sizeInfo = item.productId.sizes.find((size) => size.size === item.size);
  const availableStock = sizeInfo ? sizeInfo.stock : 0;
  const isOutOfStock = availableStock === 0;



  return (
    <Card className={`mb-4 ${isOutOfStock ? "opacity-50" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <img
            src={item.productId.images[0]}
            alt={item.productId.name}
            className="w-24 h-32 object-cover rounded-md"
          />
          <div className="flex-grow">
            <h3 className="font-semibold text-lg">{item.productId.name}</h3>
            <p className="text-sm text-muted-foreground">
              Category: {item.productId.category.name}
            </p>
            <p className="text-sm font-medium">Size: {item.size}</p>
            {
              discount > 2 && (
                <p className="text-sm text-green-600 font-medium">
                  Discount: {discount}%
                </p>
              )
            }
            {isOutOfStock ? (
              <p className="text-red-500 font-bold">Out of Stock</p>
            ) : availableStock < 5 ? (
              <p className="text-orange-500">
                Only {availableStock} left in stock
              </p>
            ) : null}
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">
              ₹
              {(
                (item.offerPrice -
                  (item.offerPrice *
                    (item?.productId?.offer?.offer_value
                      ? item?.productId?.offer?.offer_value
                      : 0)) /
                  100) *
                item.quantity
              ).toFixed()}
            </p>
            <div className="flex items-center mt-2 space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onUpdateQuantity(item, "decrease")}
                disabled={isOutOfStock}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onUpdateQuantity(item, "increase")}
                disabled={isOutOfStock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item)}
              className="mt-2"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ShoppingCart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const userId = useSelector((state) => state.user.userInfo.id);

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get(`/users/cart/${userId}`);
      setCartItems(response.data.cartItems.products);
      setSubtotal(response.data.cartItems.totalCartPrice);
    } catch (error) {
      console.error("Error fetching cart:", error);
      if (error.response) {
        toast.error(error.response.data.message);
      }
    } finally {
      setIsLoading(false);
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
      toast.success("Item removed from cart..");
      fetchCart();
    } catch (error) {
      console.error("Error removing item from cart:", error);
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const isCheckoutDisabled = cartItems.every((item) => item.quantity === 0);

  if (isLoading) {
    return (
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(1)].map((_, index) => (
              <Card key={index} className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-24 h-32 rounded-md" />
                    <div className="flex-grow space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <div className="text-right space-y-2">
                      <Skeleton className="h-6 w-20 ml-auto" />
                      <Skeleton className="h-8 w-24 ml-auto" />
                      <Skeleton className="h-8 w-20 ml-auto" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toFixed()}</span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{subtotal.toFixed()}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  disabled={isCheckoutDisabled}
                >
                  Go to Checkout
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
