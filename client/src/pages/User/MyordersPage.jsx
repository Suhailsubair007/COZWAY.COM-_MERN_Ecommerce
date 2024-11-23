import React from "react";
import Header from "@/ReuseComponets/User/Header";
import Footer from "@/ReuseComponets/User/Footer";
import MyOrders from "@/ReuseComponets/User/MyOrder";

const MyordersPage = () => {
  return (
    <div>
      <Header />
      <MyOrders />
      <Footer />
    </div>
  );
};

export default MyordersPage;
