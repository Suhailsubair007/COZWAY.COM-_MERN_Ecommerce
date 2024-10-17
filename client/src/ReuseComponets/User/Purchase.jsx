import React, { useState } from "react";
import { Star, Heart } from "lucide-react";
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as OutlineStarIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button'

const productImages = [
  "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg",
  "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg",
  "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg",
  "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg",
];

const reviews = [
  {
    id: 1,
    author: "Samantha D.",
    rating: 4.5,
    content: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt!",
  },
  {
    id: 2,
    author: "Alex M.",
    rating: 4,
    content: "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UX/UI designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me!",
  },
  {
    id: 3,
    author: "Ethan R.",
    rating: 3.5,
    content: "This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of this shirt.",
  },
  {
    id: 4,
    author: "Olivia P.",
    rating: 4,
    content: "As a UX/UI enthusiast, I value simplicity and functionality. This t-shirt not only represents these principles but also feels great to wear. It's evident that the designer poured their creativity into making this shirt stand out.",
  },
];

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("large");
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col md:flex-row lg:w-2/3">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-2 mb-4 md:mb-0 md:mr-4 order-2 md:order-1">
            {productImages.map((src, index) => (
              <button
                key={index}
                className={`relative aspect-w-1 aspect-h-1 rounded-md overflow-hidden w-1/4 md:w-20 ${
                  selectedImage === index ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={src}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="relative aspect-w-3 aspect-h-4 md:aspect-w-4 md:aspect-h-5 lg:aspect-w-3 lg:aspect-h-4 mb-4 md:mb-0 order-1 md:order-2 flex-grow">
            <img
              src={productImages[selectedImage]}
              alt="Product image"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="lg:w-1/3">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">One Life Graphic T-shirt</h1>
          <div className="flex items-center mb-2">
            <div className="flex">
              {[1, 2, 3, 4].map((star) => (
                <StarIcon
                  key={star}
                  className="w-5 h-5 text-yellow-400 fill-current"
                />
              ))}
              <OutlineStarIcon className="w-5 h-5 text-gray-300 fill-current" />
            </div>
            <span className="ml-2 text-sm text-gray-600">4.5/5</span>
          </div>
          <p className="text-xl md:text-2xl font-bold mb-4">₹299</p>
          <p className="mb-4">
            This graphic t-shirt which is perfect for any occasion. Crafted from
            a soft and breathable fabric, it offers superior comfort and style.
          </p>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Choose Size</h3>
            <div className="flex flex-wrap gap-2">
              {["small", "medium", "large", "x-large"].map((size) => (
                <button
                  key={size}
                  className={`px-3 py-2 border-2 rounded-md ${
                    selectedSize === size
                      ? "border-black-500 text-black-500"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-4 mb-6">
            <Button className="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-blue-200">
              Add to Cart
            </Button>
            <button className="border border-gray-300 p-2 rounded-md hover:bg-gray-100">
              <Heart className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Get this for INR 1,189</span>
              <br />
              Flat 10% Off your first purchase. Download the app and use Code:
              APP10
            </p>
            <p className="text-sm">
              <span className="font-semibold">Get this for INR 1,119</span>
              <br />
              Flat 20% Off on minimum purchase of 4599/-. Code: FLAT20
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="border-b border-gray-200 flex">
          <button
            className={`py-2 px-4 ${
              activeTab === "details"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Product Details
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "reviews"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Rating & Reviews
          </button>
        </div>
        {activeTab === "details" && (
          <div className="mt-4 bg-white p-4 md:p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-sm md:text-base">
              Update your everyday shirt collection with this cool and comfy
              slim fit full sleeve shirt from snitch. The slim fit lends you an
              easygoing look and with our breathable shirts in 49.4% cotton,
              44.3% polyester, 6.3% viscose, comfort is no longer reserved for
              the weekends.
            </p>
            <h3 className="text-lg font-semibold mt-4 mb-2">Size & Fit</h3>
            <p className="text-sm md:text-base">Fit - Slim Fit</p>
            <p className="text-sm md:text-base">Size - Model Is Wearing M Size</p>
            <h3 className="text-lg font-semibold mt-4 mb-2">Wash Care</h3>
            <p className="text-sm md:text-base">Machine Wash</p>
            <h3 className="text-lg font-semibold mt-4 mb-2">Specifications</h3>
            <ul className="list-disc list-inside text-sm md:text-base">
              <li>Casual Wear, College Wear</li>
              <li>Checks</li>
              <li>Spread</li>
              <li>49.4% Cotton, 44.3% Polyester, 6.3% Viscose</li>
              <li>Full Sleeve</li>
            </ul>
          </div>
        )}
        {activeTab === "reviews" && (
          <div className="mt-4 bg-white p-4 md:p-6 rounded-lg shadow-sm">
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center mb-1">
                    <div className="flex mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          } fill-current`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-sm md:text-base">{review.author}</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">{review.content}</p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="rating"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Rating
                  </label>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100"
                      >
                        <Star className="w-4 h-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="review"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Review Content
                  </label>
                  <textarea
                    id="review"
                    className="w-full mt-1 p-2 border rounded-md text-sm md:text-base"
                    rows={4}
                    placeholder="Write your review here..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 text-sm md:text-base"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




// <div className="pl-20 flex flex-col md:flex-row gap-8 h-[800px]">
// <div className="flex flex-col gap-2 mr-4 w-[100px] h-[800px]">