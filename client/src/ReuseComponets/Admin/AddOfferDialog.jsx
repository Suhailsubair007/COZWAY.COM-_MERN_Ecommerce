import { useEffect, useCallback, useState } from "react";
import { Search } from 'lucide-react';
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
import { useFormik } from "formik";
import { addOfferValidationSchema } from "../../utils/Validations";

export default function AddOfferDialog({
  isOpen,
  setIsOpen,
  activeTab,
  onOfferAdded,
}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      value: "",
      target: activeTab,
      targetId: "",
      targetName: "",
      endDate: "",
    },
    validationSchema: addOfferValidationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axiosInstance.post("/admin/addoffer", values);
        toast.success("Offer added successfully");
        formik.resetForm();
        setIsOpen(false);
        onOfferAdded();
      } catch (error) {
        console.error("Error adding offer:", error);
        toast.error(error.response?.data?.message || "Failed to add offer");
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("target", activeTab);
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
      debouncedSearch(formik.values.targetName);
    } else if (activeTab === "category") {
      fetchCategories();
    }
  }, [formik.values.targetName, activeTab, debouncedSearch]);

  const handleProductSelect = (product) => {
    formik.setFieldValue("targetId", product._id);
    formik.setFieldValue("targetName", product.name);
    setIsDropdownVisible(false);
  };

  const handleCategorySelect = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    formik.setFieldValue("targetId", categoryId);
    formik.setFieldValue("targetName", category.name);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Offer</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Offer Name</Label>
            <Input
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter offer name"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500">{formik.errors.name}</div>
            )}
          </div>

          <div>
            <Label htmlFor="value">Offer Value (%)</Label>
            <Input
              id="value"
              name="value"
              type="number"
              value={formik.values.value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter value"
            />
            {formik.touched.value && formik.errors.value && (
              <div className="text-red-500">{formik.errors.value}</div>
            )}
          </div>

          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formik.values.endDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.endDate && formik.errors.endDate && (
              <div className="text-red-500">{formik.errors.endDate}</div>
            )}
          </div>

          {activeTab === "product" ? (
            <div className="relative">
              <Label htmlFor="productSearch">Select Product</Label>
              <div className="relative">
                <Input
                  id="productSearch"
                  name="targetName"
                  type="text"
                  placeholder="Search for a product"
                  value={formik.values.targetName}
                  onChange={(e) => {
                    formik.handleChange(e);
                    debouncedSearch(e.target.value);
                  }}
                  onBlur={formik.handleBlur}
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
              <Select
                onValueChange={handleCategorySelect}
                value={formik.values.targetId}
              >
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
          {formik.touched.targetId && formik.errors.targetId && (
            <div className="text-red-500">{formik.errors.targetId}</div>
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
