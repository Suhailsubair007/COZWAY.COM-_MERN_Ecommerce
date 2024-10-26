import React from "react";
import ShoppingCart from "@/ReuseComponets/User/Cart";
import Header from "@/ReuseComponets/User/Header";
import Footer from "@/ReuseComponets/User/Footer";

const CartPage = () => {
  return (
    <div>
      <Header />
      <ShoppingCart />
      <Footer />
    </div>
  );
};

export default CartPage;
