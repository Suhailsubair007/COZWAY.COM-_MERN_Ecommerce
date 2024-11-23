import React from "react";
import ShoppingPage from "@/ReuseComponets/User/Shop";
import Header from "@/ReuseComponets/User/Header";
import Footer from "@/ReuseComponets/User/Footer";

const MainShoppingPage = () => {
  return (
    <div>
      <Header />
      <ShoppingPage />
      <Footer />
    </div>
  );
};

export default MainShoppingPage;
