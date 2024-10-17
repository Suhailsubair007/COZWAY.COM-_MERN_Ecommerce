import { Routes, Route } from "react-router-dom";
import Signup from "../pages/User/login/Signup";
import Login from "../pages/User/login/Login";
import { Toaster } from "@/components/ui/sonner";
import Landing from "../pages/User/HomePage/Landing";
// import ProductDetail from '@/ReuseComponets/User/Purchase
import PurchasePage from "@/pages/User/HomePage/PurchasePage";
import ShoppingPage from "@/pages/User/HomePage/Shop";

const UserRoute = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/product" element={<PurchasePage />} />
        <Route path="/shop" element={<ShoppingPage />} />
      </Routes>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default UserRoute;
