import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import AdminDashbord from "../pages/Admin/AdminDasboard";
import AddCategory from "../pages/Admin/AddCategory";
import AddProduct from "../pages/Admin/AddProduct";
import Product from "../pages/Admin/Product";
import EditCategory from "../pages/Admin/EditCategory";
import Aside from "@/ReuseComponets/Admin/Aside";
import UserList from "@/pages/Admin/UserList";
import EditProduct from "@/pages/Admin/EditProduct";
import OrderManagement from "@/pages/Admin/OrderManagement";
import AdminOrderDetail from "@/pages/Admin/AdminOrderDetail";
import Coupon from "@/pages/Admin/Coupon";
import Offer from "@/pages/Admin/Offer";
import SalesReport from "@/pages/Admin/SalesReport";
import Banner from "@/pages/Admin/Banner";

// import Cookies from "js-cookie";

const AdminRoute = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Aside />
      <main className="flex-grow lg:ml-64 p-4">
        <Routes>
          <Route path="/dashboard" element={<AdminDashbord />} />
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
    </div>
  );
};

export default AdminRoute;
