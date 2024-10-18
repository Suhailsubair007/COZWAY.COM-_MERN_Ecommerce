import { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit } from "lucide-react";

const Product = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get("/admin/get_product");
        const fetchedProducts = response.data.map((product) => ({
          id: product._id,
          name: product.name,
          description: product.description,
          category: product.category,
          fit: product.fit,
          sleeve: product.sleeve,
          price: product.price,
          totalStock: product.totalStock,
          image: product.images[0], // Display only the first image
          isListed: product.is_active,
        }));

        setProducts(fetchedProducts);
        console.log(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProduct();
  }, []);
  

  const truncateDescription = (description, maxLength = 100) => {
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + "...";
    }
    return description;
  };

  const handleEditProduct = (productId) => {
    console.log(`Editing product with ID: ${productId}`);
    navigate(`/admin/product/edit/${productId}`);
    // Add your edit logic here
  };

  const handleToggleProductListing = async (productId, currentStatus) => {
    try {
      const updatedStatus = !currentStatus;

      await axiosInstance.patch(`/admin/get_product/${productId}`, {
        is_active: updatedStatus,
      });

      // Update the local state to reflect the change
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, isListed: updatedStatus }
            : product
        )
      );
      console.log(
        `Product ${productId} is now ${updatedStatus ? "listed" : "unlisted"}`
      );
      toast(`Product ${updatedStatus ? "listed" : "unlisted"} successfully!`);
    } catch (error) {
      console.error("Error updating product listing:", error);
    }
  };
  const handleSearch = () => {};

  const handleAddNewProduct = () => {
    navigate("/admin/product/add");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4">
        <main className="flex-1 p-6">
          <h2 className="text-xl font-semibold mb-6">Product Management</h2>
          <div className="flex items-center justify-between mb-6">
            {/* Search bar */}
            <input
              type="text"
              placeholder="Search product..."
              className="border border-gray-300 rounded-lg p-2 text-sm w-full lg:w-1/2"
              onChange={(e) => handleSearch(e.target.value)}
            />

            {/* Add new product button */}
            <Button
              className="ml-4 bg-black text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
              onClick={handleAddNewProduct}
            >
              Add New Product
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Product</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="h-32">
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-[100px] aspect-[2/3] object-cover rounded"
                      />
                      <div>
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="text-sm text-gray-500">
                          {truncateDescription(product.description)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p>
                          <span className="font-semibold">Category:</span>{" "}
                          {product.category}
                        </p>
                        <p>
                          <span className="font-semibold">Fit:</span>{" "}
                          {product.fit}
                        </p>
                        <p>
                          <span className="font-semibold">Sleeve:</span>{" "}
                          {product.sleeve}
                        </p>
                      </div>
                      <div>
                        <p>
                          <span className="font-semibold">Price:</span> ₹
                          {product.price.toFixed(2)}
                        </p>
                        <p>
                          <span className="font-semibold">Total Stock:</span>{" "}
                          {product.totalStock}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product.id)}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit Product
                      </Button>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">
                          {product.isListed ? "Listed" : "Unlisted"}
                        </span>
                        <Switch
                          checked={product.isListed}
                          onCheckedChange={() =>
                            handleToggleProductListing(
                              product.id,
                              product.isListed
                            )
                          }
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </main>
      </div>
    </div>
  );
};

export default Product;
