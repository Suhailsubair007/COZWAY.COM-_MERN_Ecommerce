import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/config/axiosConfig";
import { logoutUser } from "../../redux/UserSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  Search,
  User,
  LogOut,
  ShoppingBag,
  UserCircle,
  Heart,
  ShoppingCart,
} from "lucide-react";

const Header = () => {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const user = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
  };
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/users/logout");

      console.log(response);
      if (response.status === 200) {
        dispatch(logoutUser());
        localStorage.removeItem("userInfo"); // Clear from localStorage (if applicable)
        navigate("/"); // Navigate to home
        toast.success("User Logged out successfully.."); // Success toast
      } else {
        toast.error("Failed to log out. Please try again.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("An error occurred during logout.");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 shadow-md">
      <div className="container mx-auto px-4">
        <div className="px-6 flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl tracking-wide px-4 py-2">
              <img
                src="https://res.cloudinary.com/dupo7yv88/image/upload/v1728535931/logo-no-background_dx8qjo.png"
                alt="Logo"
                style={{ width: "100px", height: "auto" }}
              />
            </Link>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Shop
            </Link>
            <Link
              to="/our-story"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Our Story
            </Link>
            <Link
              to="/contact-us"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Contact Us
            </Link>
          </nav>

          {/* Search Bar and Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button
              onClick={toggleSearch}
              className="text-muted-foreground hover:text-primary"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Search Input */}
            {isSearchVisible && (
              <div className="relative hidden md:block">
                <Input
                  className="w-[400px] max-w-xs"
                  type="text"
                  placeholder="Search..."
                />
              </div>
            )}

            {/* Cart Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>

            {/* Wishlist Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary"
            >
              <Heart className="h-5 w-5" />
            </Button>

            {/* User Profile or Login Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.name} alt={"no name"} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span>My Orders</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button className="hidden md:inline-flex">Login</Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4">
                  <Link
                    to="/"
                    className="text-sm font-medium hover:text-primary"
                  >
                    Home
                  </Link>
                  <Link
                    to="/shop"
                    className="text-sm font-medium hover:text-primary"
                  >
                    Shop
                  </Link>
                  <Link
                    to="/our-story"
                    className="text-sm font-medium hover:text-primary"
                  >
                    Our Story
                  </Link>
                  <Link
                    to="/contact-us"
                    className="text-sm font-medium hover:text-primary"
                  >
                    Contact Us
                  </Link>
                  {user ? (
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                  ) : (
                    <Button className="w-full">Login</Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
