import React from "react";
import { Star } from "lucide-react";

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

export default function Reviews() {
  return (
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
                      star <= review.rating ? "text-yellow-400" : "text-gray-300"
                    } fill-current`}
                  />
                ))}
              </div>
              <span className="font-semibold text-sm md:text-base">
                {review.author}
              </span>
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
              Your Review
            </label>
            <textarea
              id="review"
              name="review"
              rows={4}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your review here"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
