import React, { Suspense, lazy } from 'react';
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Aside from "@/ReuseComponets/Admin/Aside";
import { LoadingSpinner } from "@/ReuseComponets/User/LoadingSpinner";

const AdminDashboard = lazy(() => import("../pages/Admin/AdminDasboard"));
const AddCategory = lazy(() => import("../pages/Admin/AddCategory"));
const AddProduct = lazy(() => import("../pages/Admin/AddProduct"));
const Product = lazy(() => import("../pages/Admin/Product"));
const EditCategory = lazy(() => import("../pages/Admin/EditCategory"));
const UserList = lazy(() => import("@/pages/Admin/UserList"));
const EditProduct = lazy(() => import("@/pages/Admin/EditProduct"));
const OrderManagement = lazy(() => import("@/pages/Admin/OrderManagement"));
const AdminOrderDetail = lazy(() => import("@/pages/Admin/AdminOrderDetail"));
const Coupon = lazy(() => import("@/pages/Admin/Coupon"));
const Offer = lazy(() => import("@/pages/Admin/Offer"));
const SalesReport = lazy(() => import("@/pages/Admin/SalesReport"));
const Banner = lazy(() => import("@/pages/Admin/Banner"));



const AdminRoute = () => {
  return (
    <>
    <Suspense fallback={<LoadingSpinner />}>
      <Aside />
      <main className="flex-grow lg:ml-64 p-4">
        <Routes>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/categories" element={<AddCategory />} />
          <Route
            path="/categories/edit/:categoryId"
            element={<EditCategory />}
          />
          <Route path="/product/add" element={<AddProduct />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/edit/:productId" element={<EditProduct />} />
          <Route path="/product" element={<Product />} />
          <Route path="/customers" element={<UserList />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/new/:id" element={<AdminOrderDetail />} />
          <Route path="/coupons" element={<Coupon />} />
          <Route path="/offer" element={<Offer />} />
          <Route path="/report" element={<SalesReport />} />
          <Route path="/banner" element={<Banner />} />
        </Routes>
      </main>
      <Toaster richColors position="bottom-center" />
      </Suspense>
    </>
  );
};

export default AdminRoute;
