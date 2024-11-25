import { useState, useEffect } from "react";
import RelatedProducts from "./RelatedProduct";
import { useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Home } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/config/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import {
  Star,
  MessageSquare,
  Heart,
  X,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ProductDetail = () => {
  const userId = useSelector((state) => state.user.userInfo.id);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [productName, setProductName] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [productData, setProductData] = useState(null);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [inWishList, setInWishlist] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/users/product/${id}`);
        setProductData(response.data);
        setProductName(response.data.name);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        setIsLoading(false);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    checkWishlistStatus();
  }, [userId, id]);

  useEffect(() => {
    checkCartForSize();

    if (userId && selectedSize) {
      checkCartForSize();
    }
  }, [userId, selectedSize, id]);

  const checkCartForSize = async () => {
    try {
      const response = await axiosInstance.get("/users/get-cart-details", {
        params: {
          userId,
          productId: id,
          size: selectedSize,
        },
      });
      const cart = response.data;
      setIsInCart(cart.inCart);
    } catch (error) {
      console.error("Failed to fetch cart details:", error);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await axiosInstance.get("/users/inwishlist", {
        params: { userId, id },
      });
      setInWishlist(response.data.isInWishlist);
    } catch (error) {
      console.error("Failed to fetch wishlist status:", error);
    }
  };


  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.warning("You must choose a size before adding to cart.");
      return;
    }
    const selectedProduct = productData.sizes.find(
      (sizeObj) => sizeObj.size === selectedSize
    );
    if (!selectedProduct) {
      toast.error("Selected size is not available.");
      return;
    }

    const { stock } = selectedProduct;

    try {
      const response = await axiosInstance.post("/users/add-to-cart", {
        userId,
        product: {
          productId: id,
          price: productData.price,
          offerPrice: productData.offerPrice,
          quantity: 1,
          stock,
          size: selectedSize,
        },
      });

      if (response.status === 200) {
        setIsInCart(true);
        toast.success("The product has been added to your cart.");
      } else if (response.data.message === "Product is already in cart") {
        setIsInCart(true);
        toast.warning("This item is already in your cart.");
      }
    } catch (error) {
      if (error.status == 403) {
        toast.error(error.response.data.message);
      }
      console.error("Failed to add product to cart:", error);
    }
  };

  const addToWishlist = async () => {
    try {
      const response = await axiosInstance.post("/users/wishlist/add", {
        userId,
        id,
      });
      if (response.status === 200) {
        setInWishlist(true);
        toast.success("Item added to your wishlist!");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add item to wishlist. Please try again.");
    }
  };

  const removeFromWishlist = async () => {
    try {
      const response = await axiosInstance.post("/users/wishlist/remove", {
        userId,
        id,
      });
      if (response.status === 200) {
        setInWishlist(false);
        toast.success("Item removed from your wishlist!");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove item from wishlist. Please try again.");
    }
  };

  const handleWishlistClick = () => {
    if (inWishList) {
      removeFromWishlist();
    } else {
      addToWishlist();
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setUserRating(0);
    setReviewContent("");
  };

  const openZoomModal = () => {
    setIsZoomModalOpen(true);
  };

  const closeZoomModal = () => {
    setIsZoomModalOpen(false);
  };
  const goToCart = () => {
    navigate("/cart");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <Skeleton className="w-full h-[500px] rounded-lg" />
            <div className="flex gap-2 mt-4">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="w-20 h-24 rounded" />
              ))}
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!productData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
        <p className="text-gray-600">The requested product could not be found. It may have been removed or doesn't exist.</p>
      </div>
    );
  }

  const {
    name,
    price,
    offerPrice,
    images,
    sizes,
    description,
    category,
    offer,
  } = productData;

  const dummyCoupons = [
    { code: "SUMMER10", discount: "10% off" },
    { code: "FREESHIP", discount: "Free Shipping" },
    { code: "NEWUSER", discount: "15% off first order" },
    { code: "FLASH25", discount: "25% off for next 2 hours" },
  ];

  return (
    <div>
      <div className="container mx-3 px-[100px] py-4">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{productName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex flex-col md:flex-row gap-8 p-6 px-[100px] max-w-6xl mx-auto">
        {/* Product images code... */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Product view ${index + 1}`}
                className={`w-20 h-24 object-cover cursor-pointer border-2 ${
                  selectedImage === index
                    ? "border-primary"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
          <div className="flex-1 relative overflow-hidden">
            <img
              src={images[selectedImage]}
              alt="Main product view"
              className="w-full h-[500px] object-cover cursor-zoom-in"
              onClick={openZoomModal}
            />
          </div>
        </div>
        <div className="flex-1 space-y-5">
          <h1 className="text-3xl font-bold">{name}</h1>
          <div className="flex items-center space-x-2">
            <p className="text-2xl font-semibold">
              ₹
              {offer?.offer_value
                ? offerPrice - (offerPrice * offer?.offer_value) / 100
                : offerPrice}
            </p>
            {/* <p className="text-[16px] font-thin line-through text-gray-500">
              ₹{price}
            </p> */}
          </div>
          {productData.totalStock === 0 ? (
            <p className="text-red-500 font-semibold">Out of stock!</p>
          ) : (
            productData.totalStock < 5 && (
              <p className="text-red-500 font-semibold">
                Only {productData.totalStock} left in stock!
              </p>
            )
          )}
          {/* Rating stars... */}

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(4.5)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-gray-600">(4.5)</span>
          </div>
          {/* Available Coupons... */}
          <div className="space-y-2">
            <p className="font-semibold">Available Coupons:</p>
            {dummyCoupons.map((coupon, index) => (
              <Badge key={index} variant="secondary" className="mr-2">
                {coupon.code}: {coupon.discount}
              </Badge>
            ))}
          </div>

          <div>
            <p className="font-semibold mb-3">Select Size:</p>
            <div className="flex gap-1">
              {sizes.map((sizeObj) => (
                <Button
                  key={sizeObj.size}
                  variant={
                    selectedSize === sizeObj.size ? "default" : "outline"
                  }
                  className={`w-12 h-12 ${
                    sizeObj.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() =>
                    sizeObj.stock > 0 && setSelectedSize(sizeObj.size)
                  }
                  disabled={sizeObj.stock === 0}
                >
                  {sizeObj.size}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              className="w-[400px] py-6"
              onClick={handleAddToCart}
              disabled={productData.totalStock === 0 || isInCart}
            >
              Add to Cart
            </Button>
            <Button
              className="w-[400px] py-6"
              onClick={goToCart}
              disabled={!isInCart}
            >
              Go to Cart
            </Button>
            <Button
              onClick={handleWishlistClick}
              variant="outline"
              className="w-[400px] py-3 flex items-center justify-center"
            >
              <Heart
                className={`w-4 h-4 mr-2 ${
                  inWishList ? "fill-red-500 text-red-500" : ""
                }`}
              />
              {inWishList ? "Remove from Wishlist" : "Add to Wishlist"}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-8 max-w-4xl mx-auto">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="reviews">Rating & Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-4">Description</h3>
                <p className="text-gray-700 mb-6">{description}</p>

                <h3 className="text-xl font-semibold mb-2">Category</h3>
                <p className="text-gray-700 mb-4">{category.name}</p>

                <h3 className="text-xl font-semibold mb-2">Specifications</h3>
                <ul className="list-disc list-inside text-gray-700">
                  <li>Sleeve: {productData.sleeve}</li>
                  <li>Fit: {productData.fit}</li>
                  <li>Total Stock: {productData.totalStock}</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-4">
                  Customer Reviews
                </h3>
                <p>No reviews yet.</p>
                <div className="mt-8">
                  <h3 className="text-2xl font-semibold mb-4">
                    Write a Review
                  </h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Rating
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Button
                            key={star}
                            type="button"
                            variant="outline"
                            size="sm"
                            className={`p-1 ${
                              userRating >= star
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            onClick={() => setUserRating(star)}
                          >
                            <Star className="w-5 h-5 fill-current" />
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="review"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Your Review
                      </label>
                      <Textarea
                        id="review"
                        placeholder="Write your review here..."
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={userRating === 0 || reviewContent.trim() === ""}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Submit Review
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AnimatePresence>
        {isZoomModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={closeZoomModal}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-[30vw] max-h-[100vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-white hover:text-gray-200 z-10"
                onClick={closeZoomModal}
              >
                <X className="h-6 w-6" />
              </Button>

              <div className="relative w-full h-full">
                <img
                  src={images[selectedImage]}
                  alt="Zoomed product view"
                  className="w-full h-full object-contain transition-transform duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full overflow-hidden">
                    <img
                      src={images[selectedImage]}
                      alt="Zoomed product view"
                      className="w-full h-full object-contain transition-transform duration-300 transform hover:scale-150"
                      style={{ transformOrigin: "center" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <RelatedProducts id={category._id} />
    </div>
  );
};

export default ProductDetail;
