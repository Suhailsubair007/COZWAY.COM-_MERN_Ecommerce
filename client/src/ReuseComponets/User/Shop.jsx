import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "@/config/axiosConfig"
import { Star, ChevronDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FilterSidebar = ({ className, categories, onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  const sizes = ["S", "M", "L", "XL", "XXL"]

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    )
  }

  useEffect(() => {
    onFilterChange({
      categories: selectedCategories.join(','),
      sizes: selectedSizes.join(','),
      searchTerm,
    })
  }, [selectedCategories, selectedSizes, searchTerm])

  return (
    <div className={`${className} flex flex-col space-y-6 p-4 bg-background rounded-lg shadow`}>
      <h2 className="text-2xl font-semibold">Filters</h2>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Search</h3>
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category._id}`}
                    checked={selectedCategories.includes(category._id)}
                    onCheckedChange={() => handleCategoryChange(category._id)}
                  />
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

        <AccordionItem value="size">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {sizes.map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox
                    id={`size-${size}`}
                    checked={selectedSizes.includes(size)}
                    onCheckedChange={() => handleSizeChange(size)}
                  />
                  <label
                    htmlFor={`size-${size}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {size}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        onClick={() => {
          setSelectedCategories([])
          setSelectedSizes([])
          setSearchTerm("")
        }}
        variant="outline"
        className="w-full"
      >
        Reset Filters
      </Button>
    </div>
  )
}

const ProductCard = ({ product, onNavigate }) => (
  <Card
    onClick={() => onNavigate(product)}
    className="bg-white overflow-hidden flex flex-col group transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:bg-gray-50"
  >
    <div className="relative pb-[400px] overflow-hidden">
      <img
        src={product.images[0]}
        alt={product.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
    </div>

    <CardContent className="p-4 flex-grow">
      <p className="text-sm font-semibold group-hover:text-primary transition-colors duration-300 truncate">
        {product.name}
      </p>

      <p className="text-sm text-gray-500 truncate">
        {product.category.name}
      </p>
      {product.totalStock === 0 ? (
        <div className="flex pt-2 justify-end">
          <Badge
            variant="destructive"
            className="group-hover:animate-pulse"
          >
            Out of stock!
          </Badge>
        </div>
      ) : (
        product.totalStock <= 5 && (
          <div className="flex pt-2 justify-end">
            <Badge
              variant="destructive"
              className="group-hover:animate-pulse"
            >
              Only {product.totalStock} left!
            </Badge>
          </div>
        )
      )}

      <p className="text-sm font-bold mt-2 group-hover:text-primary transition-colors duration-300">
        ₹{product.offerPrice}
      </p>
    </CardContent>
  </Card>
)

const ShoppingPage = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [currentPage, sortBy, filters])

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/users/get_active_categories")
      setCategories(response.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      setError("Failed to load categories. Please try again later.")
    }
  }

  const fetchProducts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '8',
        sortBy,
        ...filters
      })
      const response = await axiosInstance.get(`/users/advanced-search?${queryParams}`)
      setProducts(response.data.products)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Failed to load products. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    setCurrentPage(1)
    setFilters(newFilters)
  }

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy)
    setCurrentPage(1)
  }

  const handleNavigate = (product) => {
    navigate(`/product/${product._id}`, { state: { product } })
  }

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Sort by: {sortBy} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSortChange("newest")}>
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange("price_asc")}>
                  Price: Low to High
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange("price_desc")}>
                  Price: High to Low
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} onNavigate={handleNavigate} />
                ))}
              </div>
              {products.length === 0 && (
                <div className="text-center text-gray-500 mt-8">No products found matching your criteria.</div>
              )}
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="mx-4 flex items-center">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShoppingPage