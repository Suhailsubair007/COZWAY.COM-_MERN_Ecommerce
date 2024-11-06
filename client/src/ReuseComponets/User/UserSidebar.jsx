import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/config/axiosConfig";
import { logoutUser } from "../../redux/UserSlice";
import { useDispatch } from "react-redux";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  User,
  MapPin,
  ShoppingBag,
  Wallet,
  Ticket,
  Key,
  LogOut,
  Menu,
} from "lucide-react";

export default function UserProfileSidebar({ userName = "Suhail Subair" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();




  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/users/logout");

      console.log(response);
      if (response.status === 200) {
        dispatch(logoutUser());
        localStorage.removeItem("userInfo");
        navigate("/");
        toast.success("User Logged out successfully..");
      } else {
        toast.error("Failed to log out. Please try again.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("An error occurred during logout.");
    }
  };

  const menuItems = [
    { icon: User, label: "My Profile", path: "/profile" },
    {
      icon: MapPin,
      label: "Delivery Address",
      path: "/profile/delivery-address",
    },
    { icon: ShoppingBag, label: "My Orders", path: "/profile/orders" },
    { icon: Wallet, label: "My Wallet", path: "/profile/wallet" },
    { icon: Ticket, label: "My Coupon", path: "/profile/coupons" },
    { icon: Key, label: "Change Password", path: "/profile/change-password" },
  ];

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarHeader className="border-b px-6 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src="/placeholder.svg?height=40&width=40"
                alt={userName}
              />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{userName}</span>
              <span className="text-xs text-muted-foreground">
                View Profile
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  asChild
                  isActive={
                    location.pathname === item.path ||
                    (item.path === "/profile" &&
                      location.pathname === item.path)
                  }
                >
                  <NavLink
                    to={item.path}
                    end={item.path === "/profile"}
                    className="flex items-center gap-3 px-3 py-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t p-6">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </SidebarFooter>
      </Sidebar>
      <div className="flex items-center border-b px-4 py-2 lg:hidden">
        <SidebarTrigger>
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
        <span className="ml-2 text-lg font-semibold">User Profile</span>
      </div>
    </SidebarProvider>
  );
}
