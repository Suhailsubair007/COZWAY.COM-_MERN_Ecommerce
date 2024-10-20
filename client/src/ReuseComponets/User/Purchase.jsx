"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Heart } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useParams } from "react-router-dom"
import axiosInstance from "@/config/axiosConfig"

export default function Component() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [userRating, setUserRating] = useState(0)
  const [reviewContent, setReviewContent] = useState("")
  const [productData, setProductData] = useState(null)
  const { productId } = useParams()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/users/product/${productId}`)
        setProductData(response.data)
      } catch (error) {
        console.error("Failed to fetch product details:", error)
      }
    }
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const handleSubmitReview = (e) => {
    e.preventDefault()
    console.log("Submitted review:", { rating: userRating, content: reviewContent })
    setUserRating(0)
    setReviewContent("")
  }

  if (!productData) {
    return <div>Loading...</div>
  }

  const { name, price, images, sizes, description, category } = productData

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-8 p-6 max-w-6xl mx-auto">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Product view ${index + 1}`}
                className={`w-20 h-24 object-cover cursor-pointer border-2 ${
                  selectedImage === index ? "border-primary" : "border-transparent"
                }`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
          <div className="flex-1">
            <img
              src={images[selectedImage]}
              alt="Main product view"
              className="w-full h-[500px] object-cover"
            />
          </div>
        </div>
        <div className="flex-1 space-y-5">
          <h1 className="text-3xl font-bold">{name}</h1>
          <p className="text-2xl font-semibold">${price.toFixed(2)}</p>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < Math.floor(4.5) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
              />
            ))}
            <span className="text-sm text-gray-600">(4.5)</span>
          </div>
          <div>
            <p className="font-semibold mb-3">Select Size:</p>
            <div className="flex gap-1">
              {sizes.map((sizeObj) => (
                <Button
                  key={sizeObj.size}
                  variant={selectedSize === sizeObj.size ? "default" : "outline"}
                  className={`w-12 h-12 ${sizeObj.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => sizeObj.stock > 0 && setSelectedSize(sizeObj.size)}
                  disabled={sizeObj.stock === 0}
                >
                  {sizeObj.size}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button className="w-[400px] py-6">Add to Cart</Button>
            <Button variant="outline" className="w-[400px] py-3 flex items-center justify-center">
              <Heart className="w-4 h-4 mr-2" />
              Wishlist
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
                <h3 className="text-2xl font-semibold mb-4">Customer Reviews</h3>
                <p>No reviews yet.</p>
                <div className="mt-8">
                  <h3 className="text-2xl font-semibold mb-4">Write a Review</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Button
                            key={star}
                            type="button"
                            variant="outline"
                            size="sm"
                            className={`p-1 ${userRating >= star ? "text-yellow-400" : "text-gray-300"}`}
                            onClick={() => setUserRating(star)}
                          >
                            <Star className="w-5 h-5 fill-current" />
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
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
                    <Button type="submit" disabled={userRating === 0 || reviewContent.trim() === ""}>
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
    </div>
  )
}