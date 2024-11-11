import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import axiosInstance from "@/config/axiosConfig";
import debounce from "lodash/debounce";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AddOfferDialog({
  isOpen,
  setIsOpen,
  activeTab,
  onOfferAdded,
}) {
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    target: activeTab,
    targetId: "",
    targetName: "",
    endDate: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    // Update formData.target when activeTab changes
    setFormData((prev) => ({ ...prev, target: activeTab }));
  }, [activeTab]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/admin/getCategories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (searchTerm) => {
      if (searchTerm.length > 2) {
        try {
          const response = await axiosInstance.get(
            `/admin/products?searchTerm=${searchTerm}`
          );
          setProducts(response.data.products);
          setIsDropdownVisible(true);
        } catch (error) {
          console.error("Error fetching products:", error);
          toast.error("Failed to search products");
        }
      } else {
        setProducts([]);
        setIsDropdownVisible(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (activeTab === "product") {
      debouncedSearch(searchValue);
    } else if (activeTab === "category") {
      fetchCategories();
    }
  }, [searchValue, activeTab, debouncedSearch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductSelect = (product) => {
    setSearchValue(product.name);
    setFormData((prev) => ({
      ...prev,
      targetId: product._id,
      targetName: product.name,
    }));
    setIsDropdownVisible(false);
  };

  const handleCategorySelect = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    setFormData((prev) => ({
      ...prev,
      targetId: categoryId,
      targetName: category.name,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/admin/addoffer", formData);
      toast.success("Offer added successfully");
      setFormData({
        name: "",
        value: "",
        target: activeTab,
        targetId: "",
        targetName: "",
        endDate: "",
      });
      setIsOpen(false);
      onOfferAdded();
    } catch (error) {
      console.error("Error adding offer:", error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Offer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Offer Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter offer name"
              required
            />
          </div>

          <div>
            <Label htmlFor="value">Offer Value</Label>
            <Input
              id="value"
              name="value"
              type="number"
              value={formData.value}
              onChange={handleInputChange}
              placeholder="Enter value"
              required
            />
          </div>

          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>

          {activeTab === "product" ? (
            <div className="relative">
              <Label htmlFor="productSearch">Select Product</Label>
              <div className="relative">
                <Input
                  id="productSearch"
                  type="text"
                  placeholder="Search for a product"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
              {isDropdownVisible && (
                <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {products.length === 0 ? (
                    <li className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9">
                      No products found.
                    </li>
                  ) : (
                    products.map((product) => (
                      <li
                        key={product._id}
                        className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                        onClick={() => handleProductSelect(product)}
                      >
                        {product.name}
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          ) : (
            <div>
              <Label htmlFor="category">Select Category</Label>
              <Select onValueChange={handleCategorySelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Offer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
