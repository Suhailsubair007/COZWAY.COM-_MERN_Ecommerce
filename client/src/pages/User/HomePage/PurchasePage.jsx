import React from "react";
import Header from "@/ReuseComponets/User/Header";
import Footer from "@/ReuseComponets/User/Footer";
import ProductDetail from "@/ReuseComponets/User/Purchase";
import RelatedProducts from "@/ReuseComponets/User/RelatedProduct";

const PurchasePage = () => {
  return (
    <div>
      <Header />
      <ProductDetail />
      <RelatedProducts />
      <Footer />
    </div>
  );
};

export default PurchasePage;
