'use client'

import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import axiosInstance from '@/config/axiosConfig'
import {
  LayoutDashboard,
  Layers,
  ShoppingBag,
  Users,
  ShoppingCart,
  ImageIcon,
  Ticket,
  LogOut,
  CirclePercent,
  FileText,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Assuming you have a logoutAdmin action in your AdminSlice
import { logoutAdmin } from '@/redux/AdminSlice'

export default function Component() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post('/admin/logout')

      if (response.status === 200) {
        dispatch(logoutAdmin())
        localStorage.removeItem('adminInfo')
        navigate('/admin')
        toast('User Logged out successfully..')
      } else {
        toast.error('Failed to log out. Please try again.')
      }
    } catch (err) {
      console.error('Logout error:', err)
      toast.error('An error occurred during logout.')
    }
    setIsLogoutDialogOpen(false)
  }

  const navItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/categories', icon: <Layers size={20} />, label: 'Category' },
    { path: '/admin/product', icon: <ShoppingBag size={20} />, label: 'Products' },
    { path: '/admin/customers', icon: <Users size={20} />, label: 'Customers' },
    { path: '/admin/orders', icon: <ShoppingCart size={20} />, label: 'Orders' },
    { path: '/admin/coupons', icon: <Ticket size={20} />, label: 'Coupon' },
    { path: '/admin/offer', icon: <CirclePercent size={20} />, label: 'Offers' },
    { path: '/admin/report', icon: <FileText size={20} />, label: 'Report' },
    { path: '/admin/banner', icon: <ImageIcon size={20} />, label: 'Banner' },
  ]

  const NavContent = () => (
    <>
      <div className="pl-10 p-4 border-b">
        <img
          src="https://res.cloudinary.com/dupo7yv88/image/upload/v1730692045/logo-no-background_poots9.png"
          alt="Logo"
          className="w-32 h-auto"
        />
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  w-full flex items-center justify-start p-2 rounded-lg 
                  ${isActive ? 'bg-gray-200 text-black' : 'text-gray-600 hover:bg-gray-100'}
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </NavLink>
            </li>
          ))}
          <li>
            <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
              <DialogTrigger asChild>
                <button
                  className="w-full flex items-center justify-start p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <LogOut size={20} />
                  <span className="ml-2">Logout</span>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Logout</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to log out? You will be redirected to the login page.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleLogout}>Logout</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </li>
        </ul>
      </nav>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed top-4 left-4 z-40 lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen bg-white shadow-md overflow-y-auto fixed left-0 top-0">
        <NavContent />
      </aside>
    </>
  )
}