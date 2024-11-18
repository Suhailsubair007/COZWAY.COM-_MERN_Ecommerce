import React, { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import axiosInstance from "@/config/axiosConfig"
import { logoutUser } from "../../redux/UserSlice"
import { useDispatch } from "react-redux"
import { User, MapPin, ShoppingBag, Wallet, Ticket, Key, LogOut, Menu } from 'lucide-react'
import { toast } from "react-hot-toast"

const menuItems = [
  { icon: User, label: "My Profile", path: "/profile" },
  { icon: MapPin, label: "Delivery Address", path: "/profile/delivery-address" },
  { icon: ShoppingBag, label: "My Orders", path: "/profile/orders" },
  { icon: Wallet, label: "My Wallet", path: "/profile/wallet" },
  { icon: Ticket, label: "My Coupon", path: "/profile/coupons" },
  { icon: Key, label: "Change Password", path: "/profile/change-password" },
]

export default function UserProfileSidebar({ userName = "Suhail Subair" }) {
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

  const SidebarContent = ({ isMobile }) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-4 p-4">
        <Avatar>
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt={userName} />
          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">{userName}</h2>
          <p className="text-sm text-muted-foreground">View Profile</p>
        </div>
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
                  ? "bg-primary text-primary-foreground"
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
        <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[300px]">
            <SidebarContent isMobile />
          </SheetContent>
        </Sheet>
      
     
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r bg-card">
        <SidebarContent />
      </div>

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Add your main content here */}
      </div>
    </>
  )
}