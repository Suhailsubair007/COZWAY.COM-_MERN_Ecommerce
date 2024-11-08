import { useEffect, useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axiosInstance from "@/config/axiosConfig";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddOfferDialog from "@/ReuseComponets/Admin/AddOfferDialog";

export default function Component() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("product");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await axiosInstance.get("/admin/offers");
      setProducts(response.data.productOffers);
      setCategories(response.data.categoryOffers);
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast.error("Failed to load offers");
    }
  };
  const handleOfferAdded = () => {
    fetchOffers();
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Offer Management</h1>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Offer
        </Button>
      </div>

      <Tabs
        defaultValue="product"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="product">Product Offers</TabsTrigger>
          <TabsTrigger value="category">Category Offers</TabsTrigger>
        </TabsList>

        <TabsContent value="product">
          <div className="rounded-lg border bg-card">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Product Offers</h2>
              <p className="text-sm text-muted-foreground">
                Manage offers for specific products
              </p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NAME</TableHead>
                  <TableHead>APPLIED PRODUCT</TableHead>
                  <TableHead>VALUE</TableHead>
                  <TableHead>END DATE</TableHead>
                  <TableHead>ACTION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.target_name}</TableCell>
                    <TableCell>{product.offer_value}</TableCell>
                    <TableCell>
                      {new Date(product.end_date).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="category">
          <div className="rounded-lg border bg-card">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Category Offers</h2>
              <p className="text-sm text-muted-foreground">
                Manage offers for product categories
              </p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NAME</TableHead>
                  <TableHead>APPLIED CATEGORY</TableHead>
                  <TableHead>VALUE</TableHead>
                  <TableHead>END DATE</TableHead>
                  <TableHead>ACTION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>{category.target_name}</TableCell>
                    <TableCell>{category.offer_value}</TableCell>
                    <TableCell>
                      {new Date(category.end_date).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <AddOfferDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        activeTab={activeTab}
        onOfferAdded={handleOfferAdded}
      />
    </div>
  );
}
