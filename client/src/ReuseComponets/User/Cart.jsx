import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Minus, Plus, Trash2, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import axiosInstance from "@/config/axiosConfig"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import EmptyCart from "./EmptyCart"

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const discount = Math.floor(item.discount)
  const isOutOfStock = item.quantity === 0

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
            <p className="text-sm text-green-600 font-medium">Discount: {discount}%</p>
            {isOutOfStock ? (
              <p className="text-red-500 font-bold">Out of Stock</p>
            ) : item.stock < 5 ? (
              <p className="text-orange-500">Only {item.stock} left in stock</p>
            ) : null}
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">
              ₹{(item.offerPrice * item.quantity).toFixed(2)}
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
  )
}

export default function ShoppingCart() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const userId = useSelector((state) => state.user.userInfo.id)

  useEffect(() => {
    fetchCart()
  }, [userId])

  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get(`/users/cart/${userId}`)
      console.log("cart products=====>",response.data.cartItems.products)
      setCartItems(response.data.cartItems.products)
      setSubtotal(response.data.cartItems.totalCartPrice)
    } catch (error) {
      console.error("Error fetching cart:", error)
      if (error.response) {
        toast.error(error.response.data.message)
      }
    }
  }

  const updateQuantity = async (item, action) => {
    try {
      const endpoint = action === "increase" ? "add" : "min"
      await axiosInstance.patch(`/users/quantity/${endpoint}/${userId}/${item._id}`)
      fetchCart()
    } catch (error) {
      console.error("Error updating quantity:", error)
      if (error.response) {
        toast.error(error.response.data.message)
      }
    }
  }

  const removeItem = async (item) => {
    try {
      const response = await axiosInstance.delete(`/users/delete/${userId}/${item._id}`)
      toast.success("Item removed from cart..")
      fetchCart()
    } catch (error) {
      console.error("Error removing item from cart:", error)
      if (error.response) {
        toast.error(error.response.data.message)
      }
    }
  }

  const handleCheckout = () => {
    navigate("/checkout")
  }

  const isCheckoutDisabled = cartItems.every((item) => item.quantity === 0)

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
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{subtotal.toFixed(2)}</span>
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
  )
}