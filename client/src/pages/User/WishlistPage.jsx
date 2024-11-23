import React from "react";
import Header from "@/ReuseComponets/User/Header";
import Wishlist from "@/ReuseComponets/User/Wishlist";
import Footer from "@/ReuseComponets/User/Footer";

const WishlistPage = () => {
  return (
    <div>
      <Header />
      <div className="min-h-[calc(100vh-200px)]">
        <Wishlist />
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;
