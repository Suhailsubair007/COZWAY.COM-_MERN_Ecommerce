import React, { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosConfig";
import { Star, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
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

//Side filter bar....

const FilterSidebar = ({ className, categories }) => (
  <div className={className}>
    <h2 className="text-xl font-semibold mb-4">Filters</h2>
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="category">
        <AccordionTrigger className="text-sm font-medium">
          Category
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category._id} className="flex items-center space-x-2">
                <Checkbox id={`category-${category._id}`} />
                <label
                  htmlFor={`category-${category._id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="sleeve">
        <AccordionTrigger className="text-sm font-medium">
          Sleeve
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {["Full Sleeve", "Half Sleeve", "Elbow Sleeve"].map((sleeve) => (
              <div key={sleeve} className="flex items-center space-x-2">
                <Checkbox id={`sleeve-${sleeve}`} />
                <label
                  htmlFor={`sleeve-${sleeve}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {sleeve}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="fit">
        <AccordionTrigger className="text-sm font-medium">Fit</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {["Slim Fit", "Regular Fit", "Loose Fit"].map((fit) => (
              <div key={fit} className="flex items-center space-x-2">
                <Checkbox id={`fit-${fit}`} />
                <label
                  htmlFor={`fit-${fit}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {fit}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

const ShoppingPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const navigate = useNavigate();

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
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(
          "/users/get_active_categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleNavigate = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };
  console.log("Categories fetched:", categories);
  console.log("Products fetched:", products);

  return (
    <div className="container mx-auto  py-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Responsive Sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden mb-4">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <FilterSidebar className={"mt-8"} categories={categories} />
          </SheetContent>
        </Sheet>

        <FilterSidebar
          className={"w-[200px] pl-[50px]"}
          categories={categories}
        />

        <div className="flex-grow pl-8 pr-8">
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
            {products.map((Product) => (
              <Card
                onClick={() => handleNavigate(Product)}
                key={Product.id}
                className="bg-white  overflow-hidden flex flex-col group transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:bg-gray-50"
              >
                <div className="relative pb-[400px] overflow-hidden">
                  <img
                    src={Product.image}
                    alt={Product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <CardContent className="p-4 flex-grow">
                  <p className="text-sm font-semibold group-hover:text-primary transition-colors duration-300 truncate">
                    {Product.name}
                  </p>

                  <p className="text-sm text-gray-500 truncate">
                    {Product.category.name}
                  </p>
                  {Product.stock <= 5 && (
                    <div className="flex pt-2 justify-end">
                      <Badge
                        variant="destructive"
                        className="group-hover:animate-pulse"
                      >
                        Only {Product.stock} left!
                      </Badge>
                    </div>
                  )}
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
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingPage;
