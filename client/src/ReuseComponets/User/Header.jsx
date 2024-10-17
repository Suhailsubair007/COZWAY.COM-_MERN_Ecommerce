import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, User } from "lucide-react";

const Header = () => {
  const [isSearchVisible, setSearchVisible] = useState(false);

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="font-bold text-xl tracking-wide px-4 py-2">
              <img
                src="https://res.cloudinary.com/dupo7yv88/image/upload/v1728535931/logo-no-background_dx8qjo.png"
                alt="fff"
                style={{ width: "100px", height: "auto" }} // Adjust the width/height here
              />
            </div>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-4">
            <a
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Home
            </a>
            <a
              href="/shop"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Shop
            </a>
            <a
              href="/our-story"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Our Story
            </a>
            <a
              href="/contact-us"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Contact Us
            </a>
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
                  className="w-full max-w-xs"
                  type="text"
                  placeholder="Search..."
                />
              </div>
            )}

            {/* User Icon */}
            <button className="text-muted-foreground hover:text-primary">
              <User className="h-5 w-5" />
            </button>

            {/* Login Button - Hidden on mobile */}

            <Button className="hidden md:inline-flex">Login</Button>

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
                  <a
                    href="/"
                    className="text-sm font-medium hover:text-primary"
                  >
                    Home
                  </a>
                  <a
                    href="/shop"
                    className="text-sm font-medium hover:text-primary"
                  >
                    Shop
                  </a>
                  <a
                    href="/our-story"
                    className="text-sm font-medium hover:text-primary"
                  >
                    Our Story
                  </a>
                  <a
                    href="/contact-us"
                    className="text-sm font-medium hover:text-primary"
                  >
                    Contact Us
                  </a>
                  <Button className="w-full">Login</Button>
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
