import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "../pages/User/HomePage/Landing";
import Login from "../pages/User/login/Login";
import Signup from "../pages/User/login/Signup";
import PurchasePage from "@/pages/User/HomePage/PurchasePage";
import MainShoppingPage from "@/pages/User/HomePage/MainShoppingPage";
import UserLoginProtect from "./Protected_Routing/user/UserLoginProtect";
import UserPrivate from "./Protected_Routing/user/UserPrivate";
import ProfilePage from "@/pages/User/ProfilePage";
import ProfileUpdate from "@/ReuseComponets/User/ProfileUpdate";
import AddNewAddress from "@/ReuseComponets/User/AddAddress";
// import DeliveryAddress from "@/ReuseComponets/User/DeliveryAddress";
// import Orders from "@/ReuseComponets/User/Orders";
// import Wallet from "@/ReuseComponets/User/Wallet";
// import Coupons from "@/ReuseComponets/User/Coupons";
// import ChangePassword from "@/ReuseComponets/User/ChangePassword";

const UserRoute = () => {
  return (
    <>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Landing />} />

        {/* Login routes */}
        <Route
          path="/login"
          element={
            <UserLoginProtect>
              <Login />
            </UserLoginProtect>
          }
        />
        <Route
          path="/signup"
          element={
            <UserLoginProtect>
              <Signup />
            </UserLoginProtect>
          }
        />

        {/* Protected product route */}
        <Route
          path="/product/:id"
          element={
            <UserPrivate>
              <PurchasePage />
            </UserPrivate>
          }
        />

        {/* Protected shop route */}
        <Route
          path="/shop"
          element={
            <UserPrivate>
              <MainShoppingPage />
            </UserPrivate>
          }
        />

        {/* Protected profile routes */}
        <Route
          path="/profile"
          element={
            <UserPrivate>
              <ProfilePage />
            </UserPrivate>
          }
        >
          <Route index element={<ProfileUpdate />} />
          <Route path="delivery-address" element={<AddNewAddress />} />
          {/* <Route path="orders" element={<Orders />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="change-password" element={<ChangePassword />} /> */}
        </Route>
      </Routes>
      <Toaster richColors position="bottom-center" />
    </>
  );
};

export default UserRoute;