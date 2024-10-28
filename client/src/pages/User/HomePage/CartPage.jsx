import React from "react";
import ShoppingCart from "@/ReuseComponets/User/Cart";
import Header from "@/ReuseComponets/User/Header";
import Footer from "@/ReuseComponets/User/Footer";

const CartPage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-[calc(100vh-200px)]">
        <ShoppingCart />
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
