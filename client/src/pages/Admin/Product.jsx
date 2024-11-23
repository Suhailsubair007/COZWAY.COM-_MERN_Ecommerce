import { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosConfig";
import { useNavigate } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit } from "lucide-react";

export default function Component() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/admin/get_product/?page=${page}&limit=10`
      );
      const { products, totalPages } = response.data;

      const formattedProducts = products.map((product) => ({
        id: product._id,
        name: product.name,
        description: product.description,
        category: product.category,
        fit: product.fit,
        sleeve: product.sleeve,
        price: product.price,
        totalStock: product.totalStock,
        image: product.images[0],
        isListed: product.is_active,
      }));

      setProducts(formattedProducts);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const truncateDescription = (description, maxLength = 100) => {
    return description.length > maxLength
      ? description.slice(0, maxLength) + "..."
      : description;
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/product/edit/${productId}`);
  };

  const handleToggleProductListing = async (productId, currentStatus) => {
    try {
      const updatedStatus = !currentStatus;
      await axiosInstance.patch(`/admin/get_product/${productId}`, {
        is_active: updatedStatus,
      });
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, isListed: updatedStatus }
            : product
        )
      );
      toast.success(
        `Product ${updatedStatus ? "listed" : "unlisted"} successfully!`
      );
    } catch (error) {
      console.error("Error updating product listing:", error);
      toast.error("Failed to update product listing");
    }
  };

  const handleAddNewProduct = () => {
    navigate("/admin/product/add");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4">
        <main className="flex-1 p-6">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/admin/dashboard"
                  className="flex items-center"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Product Management</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h2 className="text-xl font-semibold mb-6">Product Management</h2>
          <div className="flex items-center justify-between mb-6">
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

          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => handlePageChange(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </main>
      </div>
    </div>
  );
}
