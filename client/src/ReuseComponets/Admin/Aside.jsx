import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../../redux/AdminSlice";
import axiosInstance from "@/config/axiosConfig";

import {
  LayoutDashboard,
  Layers,
  ShoppingBag,
  Users,
  ShoppingCart,
  ImageIcon,
  Ticket,
  Settings,
  LogOut,
  CirclePercent,
  FileText,
} from "lucide-react";

const Aside = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/admin/logout");

      console.log(response);
      if (response.status === 200) {
        dispatch(logoutAdmin());
        localStorage.removeItem("adminInfo");
        navigate("/admin");
        toast("User Logged out successfully..");
      } else {
        toast.error("Failed to log out. Please try again.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("An error occurred during logout.");
    }
  };

  return (
    <div>
      <aside className="  w-64 h-full bg-white shadow-md overflow-y-auto">
        <div className="pl-10 p-4 border-b">
          <img
            src="https://res.cloudinary.com/dupo7yv88/image/upload/v1730692045/logo-no-background_poots9.png"
            alt="Logo"
            className="w-32 h-auto"
          />
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {[
              {
                path: "/admin/dashboard",
                icon: <LayoutDashboard size={20} />,
                label: "Dashboard",
              },
              {
                path: "/admin/categories",
                icon: <Layers size={20} />,
                label: "Category",
              },
              {
                path: "/admin/product",
                icon: <ShoppingBag size={20} />,
                label: "Products",
              },
              {
                path: "/admin/customers",
                icon: <Users size={20} />,
                label: "Customers",
              },
              {
                path: "/admin/orders",
                icon: <ShoppingCart size={20} />,
                label: "Orders",
              },
              {
                path: "/admin/coupons",
                icon: <Ticket size={20} />,
                label: "Coupon",
              },
              {
                path: "/admin/offer",
                icon: <CirclePercent size={20} />,
                label: "Offers",
              },
              {
                path: "/admin/report",
                icon: <FileText size={20} />,
                label: "Report",
              },
              {
                path: "/admin/banner",
                icon: <ImageIcon size={20} />,
                label: "Banner",
              },
              {
                path: "/admin/settings",
                icon: <Settings size={20} />,
                label: "Settings",
              },
            ].map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-start p-2 rounded-lg 
                    ${isActive ? "bg-gray-200 text-black" : "text-gray-600"}`
                  }
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </NavLink>
              </li>
            ))}

            {/* Logout button */}
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-start p-2 rounded-lg text-gray-600 hover:bg-gray-200"
              >
                <LogOut size={20} />
                <span className="ml-2">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default Aside;
