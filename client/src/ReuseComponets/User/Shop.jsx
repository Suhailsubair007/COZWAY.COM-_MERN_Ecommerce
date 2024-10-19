import React, { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosConfig";
import { Star, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
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

const FilterSidebar = ({ className }) => (
  <div className={className}>
    <h2 className="text-xl font-semibold mb-4">Filters</h2>
    <Accordion type="single" collapsible className="w-full">
      {["Category", "Fit", "Sleeve", "Size"].map((filter) => (
        <AccordionItem key={filter} value={filter.toLowerCase()}>
          <AccordionTrigger className="text-sm font-medium">
            {filter}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {["Option 1", "Option 2", "Option 3"].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox id={`${filter}-${option}`} />
                  <label
                    htmlFor={`${filter}-${option}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

const ShoppingPage = () => {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get("/users/fetch_all_product");
        console.log(response.data);

        const fetchedProducts = response.data.map((product) => ({
          name: product.name,
          image: product.images[0],
          id: product._id,
          description: product.description,
          price: product.price,
          category: product.category,
          stock: product.totalStock,
        }));
        console.log(fetchedProducts);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProduct();
  }, []);

  useEffect(() => {
    console.log(products);
  }, [products]);

  // console.log('first')
  // const mine = products.map((x) => {
  //   console.log("hiii", x.image);
  // });
  // console.log('second')
  // console.log(mine);
  // console.log('third')

  console.log("helooooooooooooooooo", products);
  return (
    <div className="container mx-auto px-2 py-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Responsive Sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden mb-4">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <FilterSidebar className={"mt-4"} />
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <FilterSidebar className={"hidden lg:block w-64 flex-shrink-0"} />

        {/* Main Content */}
        <div className="flex-grow pl-8 pr-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold">Products</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Sort by: {sortBy} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("featured")}>
                  Featured
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("price-low-to-high")}
                >
                  Price: Low to High
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("price-high-to-low")}
                >
                  Price: High to Low
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("newest")}>
                  Newest
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="px-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products &&
              products.map((Product) => (
                <Card
                  key={Product.id}
                  className="bg-white overflow-hidden flex flex-col group transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:bg-gray-50"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={Product.image}
                      alt={Product.name}
                      className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">
                      {Product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {Product.category.name}
                    </p>
                    <p className="text-sm font-bold mt-2 group-hover:text-primary transition-colors duration-300">
                      ₹{Product.price}
                    </p>
                    <div className="flex items-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-current text-yellow-400"
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        4.5 (24 reviews)
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between items-center">
                    {Product.stock <= 5 && (
                      <Badge
                        variant="destructive"
                        className="ml-2 group-hover:animate-pulse"
                      >
                        Only {Product.stock} left!
                      </Badge>
                    )}
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingPage;
