import React, { useState } from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import axiosInstance from "@/config/axiosConfig"
import { logoutUser } from "../../redux/UserSlice"
import { useDispatch } from "react-redux"
import { User, MapPin, ShoppingBag, Wallet, Ticket, Key, LogOut, Menu, X } from 'lucide-react'
import { toast } from "react-hot-toast"

export default function UserProfileSidebar({ userName = "Suhail Subair" }) {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  const menuItems = [
    { icon: User, label: "My Profile", path: "/profile" },
    { icon: MapPin, label: "Delivery Address", path: "/profile/delivery-address" },
    { icon: ShoppingBag, label: "My Orders", path: "/profile/orders" },
    { icon: Wallet, label: "My Wallet", path: "/profile/wallet" },
    { icon: Ticket, label: "My Coupon", path: "/profile/coupons" },
    { icon: Key, label: "Change Password", path: "/profile/change-password" },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const renderMenuItems = (isMobile = false) => (
    <>
      {menuItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          end={item.path === "/profile"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            } ${isMobile ? "text-lg" : ""}`
          }
          onClick={isMobile ? toggleMobileMenu : undefined}
        >
          <item.icon className={`${isMobile ? "h-6 w-6" : "h-4 w-4"}`} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </>
  )

  return (
    <div className="flex h-full">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt={userName} />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-3 flex flex-col">
              <span className="text-sm font-medium">{userName}</span>
              <span className="text-xs text-muted-foreground">View Profile</span>
            </div>
          </div>
          <nav className="mt-5 flex-1 flex flex-col divide-y divide-gray-200 overflow-y-auto" aria-label="Sidebar">
            <div className="px-2 space-y-1">
              {renderMenuItems()}
            </div>
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
          <button onClick={toggleMobileMenu} className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <span className="text-lg font-semibold">User Profile</span>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={userName} />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 flex z-40">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={toggleMobileMenu}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-shrink-0 flex items-center px-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-3 flex flex-col">
                <span className="text-sm font-medium">{userName}</span>
                <span className="text-xs text-muted-foreground">View Profile</span>
              </div>
            </div>
            <nav className="mt-5 flex-1 flex flex-col divide-y divide-gray-200 overflow-y-auto" aria-label="Sidebar">
              <div className="px-2 space-y-1">
                {renderMenuItems(true)}
              </div>
            </nav>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <Button variant="outline" className="w-full justify-center" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Add your main content here */}
      </div>
    </div>
  )
}