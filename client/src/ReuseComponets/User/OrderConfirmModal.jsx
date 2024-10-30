import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const OrderConfirmationModal = ({ order, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Order Placed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-10 h-10 text-white" />
              </div>
            </motion.div>
          </div>
          <div className="space-y-2">
            <p><strong>Order ID:</strong> {order.order_id}</p>
            <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Delivery Date:</strong> {new Date(order.delivery_by).toLocaleString()}</p>
            <p><strong>Address:</strong> {order.shipping_address.address}, {order.shipping_address.district}</p>
            <p><strong>Phone:</strong> {order.shipping_address.phone}</p>
            <p><strong>Shipping Fee:</strong> ₹{order.shipping_fee}</p>
            <p><strong>Total Amount:</strong> ₹{order.total_amount}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => window.location.href = '/orders'}>View Orders</Button>
          <Button onClick={() => window.location.href = '/'}>Continue Shopping</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default OrderConfirmationModal