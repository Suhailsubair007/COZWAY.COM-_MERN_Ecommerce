import React, { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { toast } from "react-hot-toast"
import {
  User,
  MapPin,
  ShoppingBag,
  Wallet,
  Ticket,
  Key,
  LogOut,
  Menu,
  DollarSign,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axiosInstance from "@/config/axiosConfig"
import { logoutUser } from "../../redux/UserSlice"

const menuItems = [
  { icon: User, label: "My Profile", path: "/profile" },
  { icon: MapPin, label: "Delivery Address", path: "/profile/delivery-address" },
  { icon: ShoppingBag, label: "My Orders", path: "/profile/orders" },
  { icon: Wallet, label: "My Wallet", path: "/profile/wallet" },
  { icon: Ticket, label: "My Coupon", path: "/profile/coupons" },
  { icon: Key, label: "Change Password", path: "/profile/change-password" },
  { icon: DollarSign, label: "Refer a friend", path: "/profile/referal" },
]

export default function UserProfileSidebar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/users/logout")
      if (response.status === 200) {
        dispatch(logoutUser())
        localStorage.removeItem("userInfo")
        navigate("/")
        toast.success("User Logged out successfully.")
      } else {
        toast.error("Failed to log out. Please try again.")
      }
    } catch (err) {
      console.error("Logout error:", err)
      toast.error("An error occurred during logout.")
    }
  }

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center justify-center py-5 pr-5 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <Avatar className="w-24 h-24 bg-gray-600 bg-slate-600">
          <AvatarFallback className="text-2xl text-black font-bold">Home</AvatarFallback>
        </Avatar>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            end={item.path === "/profile"}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
            onClick={() => isMobile && setIsOpen(false)}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will end your current session. You'll need to log in again to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>Log out</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )

  return (
    <>
      <div className="lg:hidden flex items-center justify-between p-4 border-b">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            <SidebarContent isMobile />
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
          <SidebarContent />
        </div>
      </div>

      <div className="lg:pl-64">
        {/* Add your main content here */}
      </div>
    </>
  )
}

