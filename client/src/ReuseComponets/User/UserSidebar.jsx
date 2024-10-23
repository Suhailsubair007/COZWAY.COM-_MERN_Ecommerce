import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  User,
  MapPin,
  ShoppingBag,
  Wallet,
  Ticket,
  Key,
  LogOut,
} from "lucide-react";

export default function UserProfileSidebar({ userName = "Suhail Subair" }) {
  const navigate = useNavigate();

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

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...");
    navigate("/login");
  };

  return (
    <Card className="w-[290px] min-h-screen bg-white shadow-lg rounded-none overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-20 h-20 mb-4">
            <AvatarImage
              src="/placeholder.svg?height=80&width=80"
              alt={userName}
            />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold text-gray-800">{userName}</h2>
        </div>
        <Separator className="mb-6" />
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  end={item.path === "/profile"}
                  className={({ isActive }) =>
                    `flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-gray-500 text-primary-foreground"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`
                  }
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <Separator className="my-6" />
        <Button
          variant=""
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </CardContent>
    </Card>
  );
}
