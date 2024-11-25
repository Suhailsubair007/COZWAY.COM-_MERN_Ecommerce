import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import UserLoginProtect from "./Protected_Routing/user/UserLoginProtect";
import UserPrivate from "./Protected_Routing/user/UserPrivate";
import { LoadingSpinner } from "@/ReuseComponets/User/LoadingSpinner";

// Lazy load components
const Landing = lazy(() => import("../pages/User/HomePage/Landing"));
const Login = lazy(() => import("../pages/User/login/Login"));
const Signup = lazy(() => import("../pages/User/login/Signup"));
const PurchasePage = lazy(() => import("@/pages/User/HomePage/PurchasePage"));
const MainShoppingPage = lazy(() => import("@/pages/User/HomePage/MainShoppingPage"));
const ProfilePage = lazy(() => import("@/pages/User/ProfilePage"));
const ProfileUpdate = lazy(() => import("@/ReuseComponets/User/ProfileUpdate"));
const Address = lazy(() => import("@/ReuseComponets/User/Address"));
const CartPage = lazy(() => import("@/pages/User/HomePage/CartPage"));
const Checkout = lazy(() => import("@/pages/User/Checkout"));
const Order_details = lazy(() => import("@/pages/User/Order_details"));
const MyOrders = lazy(() => import("@/ReuseComponets/User/MyOrder"));
const ForgotPassword = lazy(() => import("@/pages/User/login/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/User/login/ResetPassword"));
const WishlistPage = lazy(() => import("@/pages/User/WishlistPage"));
const UserWallet = lazy(() => import("@/pages/User/UserWallet"));
const DisplayCoupens = lazy(() => import("@/pages/User/DisplayCoupens"));
const ChangePassword = lazy(() => import("@/pages/User/ChangePassword"));
const ReferralCode = lazy(() => import("@/pages/User/ReferealOffer"));
const StoryPage = lazy(() => import("@/pages/User/HomePage/StoryPage"));
const ContactUsPage = lazy(() => import("@/pages/User/HomePage/ContactUsPage"));


const UserRoute = () => {
  return (
    <>
     <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public route */}

        <Route path="/" element={<Landing />} />
        <Route path="/story" element={<StoryPage />} />
        <Route path="/contact" element={<ContactUsPage/>} />


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
      </Suspense>
      <Toaster richColors position="bottom-center" />
    </>
  );
};

export default UserRoute;
