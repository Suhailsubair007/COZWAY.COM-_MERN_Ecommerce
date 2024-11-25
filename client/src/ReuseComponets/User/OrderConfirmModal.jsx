import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Package,
  MapPin,
  Phone,
  CreditCard,
  ShoppingBag,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Component({ order, onClose }) {

  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();



  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="w-[600px] max-h-[900vh] flex flex-col">
            <CardHeader className="text-center py-4 space-y-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1,
                }}
                className="mx-auto"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              <CardTitle className="text-xl font-bold text-green-600">
                Order Successfully Placed!
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Thank you for your purchase
              </p>
              {order?.payment_status === "Failed" && (
                <p className="text-lg text-red-400">
                  Payment failed, please complete from My Orders
                </p>
              )}
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto space-y-4 px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-muted/50 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <ShoppingBag className="w-4 h-4" />
                  Order Details
                </div>
                <div className="grid gap-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID</span>
                    <span className="font-medium">{order?.order_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Date</span>
                    <span className="font-medium">
                      {new Date(order?.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>

              <Separator className="my-2" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Delivery Expected By
                  </span>
                </div>
                <div className="pl-6 text-sm font-semibold">
                  {new Date(order?.delivery_by).toLocaleDateString()}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Delivery Address</span>
                </div>
                <div className="pl-6 space-y-1 text-xs">
                  <p>{order?.shipping_address?.address}</p>
                  <p>{order?.shipping_address?.district}</p>
                  <p>PIN: {order?.shipping_address?.pincode}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-3 h-3" />
                    <span>{order?.shipping_address?.phone}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-muted/50 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm font-medium">Payment Details</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping Fee</span>
                    <span>₹{order?.shipping_fee}</span>
                  </div>
                  <Separator className="my-1" />
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>₹{order?.total_amount}</span>
                  </div>
                </div>
              </motion.div>
            </CardContent>
            <CardFooter className="flex gap-4 p-4 border-t">
              <Button
                className="flex-1 h-9"
                variant="outline"
                onClick={() => navigate("/profile/orders")}
              >
                View Orders
              </Button>
              <Button className="flex-1 h-9" onClick={() => navigate("/shop")}>
                Continue Shopping
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
