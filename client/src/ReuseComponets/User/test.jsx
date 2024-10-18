import React, { useState } from "react";
// import { Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Star, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
// import { Pagination } from '@/components/ui/pagination'

const products = [
  {
    id: 1,
    name: "Classic T-Shirt",
    category: "Tops",
    price: 29.99,
    image:
      "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg",
    stock: 3,
  },
  {
    id: 2,
    name: "Slim Fit Jeans",
    category: "Bottoms",
    price: 59.99,
    image:
      "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg",
    stock: 10,
  },
  {
    id: 3,
    name: "Hooded Sweatshirt",
    category: "Outerwear",
    price: 49.99,
    image:
      "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg",
    stock: 7,
  },
  {
    id: 4,
    name: "Floral Dress",
    category: "Dresses",
    price: 79.99,
    image:
      "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg",
    stock: 5,
  },
  {
    id: 5,
    name: "Leather Jacket",
    category: "Outerwear",
    price: 129.99,
    image:
      "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg",
    stock: 2,
  },
  {
    id: 6,
    name: "Striped Polo Shirt",
    category: "Tops",
    price: 39.99,
    image:
      "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg",
    stock: 8,
  },
];

export default function ShoppingPage() {
  const [sortBy, setSortBy] = useState("featured");
  // const [sortBy, setSortBy] = useState('featured')
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 8

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="container mx-auto pl10 px-4 py-8 flex">
      {/* Left Sidebar */}
      <div className="w-64 pl-4 mr-8 flex-shrink-0">
        <div className="sticky top-8">
          <h2 className="text-2xl font-bold mb-4">Filters</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="category">
              <AccordionTrigger>Category</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Tops
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Bottoms
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Outerwear
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Dresses
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="fit">
              <AccordionTrigger>Fit</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Slim
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Regular
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Loose
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="sleeve">
              <AccordionTrigger>Sleeve</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Short Sleeve
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Long Sleeve
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Sleeveless
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="size">
              <AccordionTrigger>Size</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Small
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Medium
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Large
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    X-Large
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow pl-8 pr-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Products</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Sort by: {sortBy} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("featured")}>
                Featured
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("price-low-to-high")}>
                Price: Low to High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("price-high-to-low")}>
                Price: High to Low
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("newest")}>
                Newest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col">
              <div className="relative pt-[100%]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4 flex-grow">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="text-lg font-bold mt-2">
                  ${product.price.toFixed(2)}
                </p>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-current text-yellow-400"
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    4.5 (24 reviews)
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 flex justify-between items-center">
                <Button>Add to Cart</Button>
                {product.stock <= 5 && (
                  <Badge variant="destructive" className="ml-2">
                    Only {product.stock} left!
                  </Badge>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            <Button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-l-md"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            {[...Array(Math.ceil(products.length / productsPerPage))].map(
              (_, index) => (
                <Button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`${
                    currentPage === index + 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-background"
                  }`}
                >
                  {index + 1}
                </Button>
              )
            )}
            <Button
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(products.length / productsPerPage)
              }
              className="rounded-r-md"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
