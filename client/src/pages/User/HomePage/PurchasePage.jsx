import React from "react";
import Header from "@/ReuseComponets/User/Header";
import Footer from "@/ReuseComponets/User/Footer";
import RelatedProducts from "@/ReuseComponets/User/RelatedProduct";
import ProductDetail from "@/ReuseComponets/User/Purchase";
import Reviews from "@/ReuseComponets/Review";
const PurchasePage = () => {
  return (
    <div>
      <Header />
      <div className="px-[200px] py-[50px]">
        <ProductDetail />
      </div>
      {/* <RelatedProducts /> */}
      <Footer />
    </div>
  );
};

export default PurchasePage;
