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
import Address from "@/ReuseComponets/User/Address";
import ShoppingCart from "@/ReuseComponets/User/Cart";
import CartPage from "@/pages/User/HomePage/CartPage";
import Checkout from "@/pages/User/Checkout";
import Order_details from "@/pages/User/Order_details";
import MyOrders from "@/ReuseComponets/User/MyOrder";
import ForgotPassword from "@/pages/User/login/ForgotPassword";
import ResetPassword from "@/pages/User/login/ResetPassword";
import WishlistPage from "@/pages/User/WishlistPage";
import UserWallet from "@/pages/User/UserWallet";
import DisplayCoupens from "@/pages/User/DisplayCoupens";
import ChangePassword from "@/pages/User/ChangePassword";
import ReferralCode from "@/pages/User/ReferealOffer";
import StoryPage from "@/pages/User/HomePage/StoryPage";

const UserRoute = () => {
  return (
    <>
      <Routes>
        {/* Public route */}

        <Route path="/" element={<Landing />} />
        <Route path="/story" element={<StoryPage />} />

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
          path="/forgotPassword"
          element={
            <UserLoginProtect>
              <ForgotPassword />
            </UserLoginProtect>
          }
        />
        <Route
          path="/reset-password"
          element={
            <UserLoginProtect>
              <ResetPassword />
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

        <Route
          path="/cart"
          element={
            <UserPrivate>
              <CartPage />
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
        <Route
          path="/wishlist"
          element={
            <UserPrivate>
              <WishlistPage />
            </UserPrivate>
          }
        />
        <Route
          path="/checkout"
          element={
            <UserPrivate>
              <Checkout />
            </UserPrivate>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <UserPrivate>
              <Order_details />
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
          <Route path="delivery-address" element={<Address />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="wallet" element={<UserWallet />} />
          <Route path="coupons" element={<DisplayCoupens />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="referal" element={<ReferralCode />} />
        </Route>
      </Routes>
      <Toaster richColors position="bottom-center" />
    </>
  );
};

export default UserRoute;
