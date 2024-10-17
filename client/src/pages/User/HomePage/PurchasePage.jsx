import React from "react";
import Header from "@/ReuseComponets/User/Header";
import Footer from "@/ReuseComponets/User/Footer";
import ProductDetail from "@/ReuseComponets/User/Purchase";
const PurchasePage = () => {
  return (
    <div>
      <Header />
      <ProductDetail />
      <Footer />
    </div>
  );
};

export default PurchasePage;
