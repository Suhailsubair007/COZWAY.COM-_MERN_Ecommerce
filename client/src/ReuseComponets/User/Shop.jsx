import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/config/axiosConfig";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FilterSidebar } from "./ShoppingPage_componets/FilterSidebar ";
import { ProductCard } from "./ShoppingPage_componets/ProductCard ";
import { SortDropdown } from "./ShoppingPage_componets/SortDropdown ";
import { Pagination } from "./ShoppingPage_componets/Pagination";

const ProductList = ({ products, isLoading, error, onNavigate }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No products found matching your criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
};

export default function ShoppingPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortBy, filters]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/users/get_active_categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories. Please try again later.");
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "8",
        sortBy,
        ...filters,
      });
      console.log("oooooooo",queryParams);
      const response = await axiosInstance.get(
        `/users/advanced-search?${queryParams}`
      );
      setProducts(response.data.products);
      console.log("products--->",response.data.products)
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setCurrentPage(1);
    setFilters(newFilters);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handleNavigate = (product) => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden mb-4">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <FilterSidebar
              className="mt-8"
              categories={categories}
              onFilterChange={handleFilterChange}
            />
          </SheetContent>
        </Sheet>

        <div className="hidden lg:block w-1/4">
          <FilterSidebar
            className="sticky top-4"
            categories={categories}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Products</h1>
            <SortDropdown sortBy={sortBy} onSortChange={handleSortChange} />
          </div>

          <ProductList
            products={products}
            isLoading={isLoading}
            error={error}
            onNavigate={handleNavigate}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

// ShoppingPage
