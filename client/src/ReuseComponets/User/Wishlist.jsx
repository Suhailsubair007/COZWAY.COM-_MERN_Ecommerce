import { ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axiosInstance from "@/config/axiosConfig";
import { useSelector } from "react-redux";
import EmptyWishlist from "./EmptyWishlist";
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const userId = useSelector((state) => state.user.userInfo.id);

  useEffect(() => {
    fetchItems();
  }, []);

  const handleRemove = async (id) => {
    try {
      const response = await axiosInstance.post("/users/wishlist/remove", {
        userId,
        id,
      });
      if (response.status === 200) {
        fetchItems();
        toast.success("Item removed from your wishlist!");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove item from wishlist. Please try again.");
    }
  };

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/users/wishlist/${userId}`);

      if (response.data.success) {
        setWishlist(response.data.wishlistItems);
        // Initialize selected sizes
        const initialSizes = {};
        response.data.wishlistItems.forEach((item) => {
          initialSizes[item.product?._id] = item.product.sizes[0]?.size || "";
        });
        setSelectedSizes(initialSizes);
      }
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
      toast.error("Failed to fetch wishlist items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = async (item) => {
    const selectedSize = selectedSizes[item.product?._id];
    if (!selectedSize) {
      toast.error("Please select a size before adding to cart.");
      return;
    }

    try {
      const response = await axiosInstance.post("/users/movetocart", {
        userId,
        productId: item.product?._id,
        size: selectedSize,
      });

      if (response.data.success) {
        toast.success(
          `Added ${item.product.name} (Size: ${selectedSize}) to cart!`
        );
        fetchItems();
      } else {
        toast.error("Failed to add item to cart. Please try again.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    }
  };

  const isOutOfStock = (item) => {
    const selectedSize = selectedSizes[item.product?._id];
    const sizeOption = item.product.sizes.find((s) => s.size === selectedSize);
    return sizeOption?.stock === 0;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-6 max-w-7xl">
        <Skeleton className="w-40 h-6 mb-6" />
        <div className="space-y-6">
          {[1, 2].map((item) => (
            <div key={item} className="flex items-center gap-4 border-b pb-6">
              <Skeleton className="w-[100px] h-[140px]" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-3/4 h-5" />
                <Skeleton className="w-1/4 h-5" />
              </div>
              <div className="w-[180px] space-y-2">
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return <EmptyWishlist />;
  }

  return (
    <div className="container mx-auto py-10 px-6 max-w-7xl">
      <h1 className="text-lg font-medium mb-6">
        Wishlist ({wishlist.length})
      </h1>
      <div className="space-y-6">
        {wishlist.map((item) => (
          <div
            key={item?._id}
            className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b pb-6 ${
              isOutOfStock(item) ? "opacity-50" : ""
            }`}
          >
            <img
              src={item.product.images[2]}
              alt={item.product.name}
              className="w-full sm:w-[100px] h-[140px] object-cover rounded-md"
            />
            <div className="flex-1 min-w-0 space-y-2">
              <h3 className="font-medium text-base">{item.product.name}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-semibold">
                  ₹{item.product.price.toLocaleString()}
                </span>
                {item.product.offerPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{item.product.offerPrice.toLocaleString()}
                  </span>
                )}
                {item.product.offerPrice && (
                  <span className="text-xs text-green-600 font-medium">
                    {(
                      ((item.product.price - item.product.offerPrice) /
                        item.product.price) *
                      100
                    ).toFixed(0)}
                    % off
                  </span>
                )}
              </div>
              <Select
                value={selectedSizes[item.product?._id]}
                onValueChange={(value) =>
                  handleSizeChange(item.product?._id, value)
                }
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  {item.product.sizes.map((sizeOption) => (
                    <SelectItem
                      key={sizeOption?._id}
                      value={sizeOption.size}
                      disabled={sizeOption.stock === 0}
                    >
                      {sizeOption.size}{" "}
                      {sizeOption.stock === 0 && "(Out of Stock)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isOutOfStock(item) && (
                <p className="text-red-500 text-sm font-medium">
                  Out of Stock
                </p>
              )}
            </div>
            <div className="w-full sm:w-[180px] space-y-2">
              <Button
                onClick={() => handleRemove(item.product?._id)}
                variant="destructive"
                className="w-full flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
              <Button
                onClick={() => handleAddToCart(item)}
                className="w-full flex items-center justify-center gap-2 bg-black hover:bg-black/90"
                disabled={isOutOfStock(item)}
              >
                <ShoppingCart className="h-4 w-4" />
                {isOutOfStock(item) ? "Out of Stock" : "Add To Cart"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

