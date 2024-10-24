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
import AdminProtect from "./Protected_Routing/admin/adminProtect";
import Cookies from "js-cookie";

const AdminRoute = () => {
  return (
    <div className="flex">
      <Aside />
      <main className="flex-grow">
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
        </Routes>
      </main>
      <Toaster richColors position="bottom-center" />
    </div>
  );
};

export default AdminRoute;
