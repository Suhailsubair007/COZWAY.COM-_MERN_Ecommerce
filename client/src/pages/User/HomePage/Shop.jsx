import React, { useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

const products = [
  { id: 1, name: "Shiny Dress", price: 95.50, rating: 5, image: "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg" },
  { id: 2, name: "Shiny Dress", price: 95.50, rating: 5, image: "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg" },
  { id: 3, name: "Shiny Dress", price: 95.50, rating: 5, image: "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg" },
  { id: 4, name: "Shiny Dress", price: 95.50, rating: 5, image: "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg" },
  { id: 5, name: "Shiny Dress", price: 95.50, rating: 5, image: "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg" },
  { id: 6, name: "Shiny Dress", price: 95.50, rating: 5, image: "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg" },
  { id: 7, name: "Shiny Dress", price: 95.50, rating: 5, image: "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg" },
  { id: 8, name: "Shiny Dress", price: 95.50, rating: 5, image: "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg" },
  { id: 9, name: "Shiny Dress", price: 95.50, rating: 5, image: "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg" },
  { id: 10, name: "Shiny Dress", price: 95.50, rating: 5, image: "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg" },
  { id: 11, name: "Shiny Dress", price: 95.50, rating: 5, image: "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg" },
  { id: 12, name: "Shiny Dress", price: 95.50, rating: 5, image: "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg" },
]

const FilterCheckbox = ({ label }) => (
    <div className="flex items-center space-x-2">
      <Checkbox id={label} />
      <label
        htmlFor={label}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  )
  
  export default function ShoppingPage() {
    const [sortBy, setSortBy] = useState("popularity")
  
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Filter By</h2>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Categories</h3>
                    <div className="space-y-2">
                      <FilterCheckbox label="Formal" />
                      <FilterCheckbox label="Premium" />
                      <FilterCheckbox label="Casual" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Size</h3>
                    <div className="space-y-2">
                      <FilterCheckbox label="S" />
                      <FilterCheckbox label="M" />
                      <FilterCheckbox label="L" />
                      <FilterCheckbox label="XL" />
                      <FilterCheckbox label="XXL" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Sleeves</h3>
                    <div className="space-y-2">
                      <FilterCheckbox label="Full sleeve" />
                      <FilterCheckbox label="Half Sleeve" />
                      <FilterCheckbox label="Elbow Sleeve" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Fit</h3>
                    <div className="space-y-2">
                      <FilterCheckbox label="Regular fit" />
                      <FilterCheckbox label="Slim fit" />
                      <FilterCheckbox label="Box fit" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Products</h1>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
  
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                  <div className="relative pb-[150%] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-gray-600">Al Karam</p>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < product.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-red-500 mt-1">Almost Sold Out</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
  
            <div className="flex justify-center items-center space-x-2 mt-8">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {[1, 2, 3, "...", 5].map((page, index) => (
                <Button key={index} variant={page === 1 ? "default" : "outline"}>
                  {page}
                </Button>
              ))}
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
  
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">High Quality</h3>
              <p className="text-sm text-gray-600">crafted from top materials</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Warranty Protection</h3>
              <p className="text-sm text-gray-600">Over 2 years</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Free Shipping</h3>
              <p className="text-sm text-gray-600">Order over 150 $</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">24 / 7 Support</h3>
              <p className="text-sm text-gray-600">Dedicated support</p>
            </div>
          </div>
        </div>
      </div>
    )
  }