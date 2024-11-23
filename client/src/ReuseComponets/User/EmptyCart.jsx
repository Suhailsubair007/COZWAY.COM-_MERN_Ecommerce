import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart as ShoppingCartIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
const EmptyCart = () => {
  const navigate = useNavigate();
  const handleShop = () => {
    navigate("/shop");
  };
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <ShoppingCartIcon className="w-24 h-24 text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-4">
          Looks like you haven't added any items to your cart yet.
        </p>

        <Button onClick={handleShop} className="px-6 py-2">
          Start Shopping
        </Button>
      </div>
    </div>
  );
};

export default EmptyCart;
