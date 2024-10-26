import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MinusIcon, PlusIcon, TrashIcon } from 'lucide-react'

const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
  <div className="flex items-center py-3">
    <img src={item.image} alt={item.name} className="w-20 h-28 object-cover mr-3" />
    <div className="flex-grow">
      <h3 className="font-semibold text-base">{item.name}</h3>
      <p className="text-xs text-gray-600">Category: {item.category}</p>
      <p className="text-xs text-gray-600">Size: {item.size} | Fit: {item.fit} | Sleeve: {item.sleeve}</p>
      <div className="flex items-center mt-1">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
        >
          <MinusIcon className="h-3 w-3" />
        </Button>
        <span className="mx-2 w-6 text-center text-sm">{item.quantity}</span>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onUpdateQuantity(item.id, Math.min(5, item.quantity + 1))}
        >
          <PlusIcon className="h-3 w-3" />
        </Button>
      </div>
    </div>
    <div className="text-right">
      <p className="font-bold text-base">₹{(item.price * item.quantity).toFixed(2)}</p>
      <Button variant="ghost" size="sm" onClick={() => onRemove(item.id)} className="mt-1">
        <TrashIcon className="h-3 w-3 mr-1" />
        <span className="text-xs">Remove</span>
      </Button>
    </div>
  </div>
)

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Turquoise Checks Linen Blend Shirt", category: "Shirts", size: "M", fit: "Regular", sleeve: "Full", price: 999, quantity: 1, image: "https://res.cloudinary.com/dupo7yv88/image/upload/v1729783675/e6jkw4noczsgc5h8vop0.jpg" },
    { id: 2, name: "Olive Green Linen Blend Shirt", category: "Shirts", size: "L", fit: "Slim", sleeve: "Short", price: 1299, quantity: 1, image: "https://res.cloudinary.com/dupo7yv88/image/upload/v1729783675/e6jkw4noczsgc5h8vop0.jpg" },
    { id: 3, name: "Navy Blue Cotton Chinos", category: "Pants", size: "32", fit: "Regular", sleeve: "N/A", price: 1499, quantity: 1, image: "https://res.cloudinary.com/dupo7yv88/image/upload/v1729783675/e6jkw4noczsgc5h8vop0.jpg" },
  ])

  const updateQuantity = (id, newQuantity) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.18 // Assuming 18% tax
  const total = subtotal + tax

  return (
    <div className="container mx-auto px-6 py-4">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          {cartItems.map((item, index) => (
            <React.Fragment key={item.id}>
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
            <div className="flex justify-between mb-2 text-sm">
              <span>Tax (18%)</span>
              <span>₹{tax.toFixed(2)}</span>
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
    </div>
  )
}