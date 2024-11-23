import React, { useState } from "react";
import { StarIcon as OutlineStarIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Star, Heart } from "lucide-react";

const productImages = [
  "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg",
  "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg",
  "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg",
  "https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg",
];

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("large");

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
                <Star
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
    </div>
  );
}
