import { Routes, Route } from "react-router-dom";
import Signup from "../pages/User/login/Signup";
import Login from "../pages/User/login/Login";
import { Toaster } from "sonner";
import Landing from "../pages/User/HomePage/Landing";
import PurchasePage from "@/pages/User/HomePage/PurchasePage";
import MainShoppingPage from "@/pages/User/HomePage/MainShoppingPage";
import UserLoginProtect from "./Protected_Routing/user/UserLoginProtect";
import UserPrivate from "./Protected_Routing/user/UserPrivate";

const UserRoute = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
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

        {/* Protect the product route */}
        <Route
          path="/product/:id"
          element={
            <UserPrivate>
              <PurchasePage />
            </UserPrivate>
          }
        />

        {/* Protect the shop route */}
        <Route
          path="/shop"
          element={
            <UserPrivate>
              <MainShoppingPage />
            </UserPrivate>
          }
        />
      </Routes>

      <Toaster richColors position="bottom-center" />
    </div>
  );
};

export default UserRoute;
