import React from "react";

const products = [
  { id: "1", title: "Burgundy Textured Slim Fit Shirt", imageUrl: "https://res.cloudinary.com/dupo7yv88/image/upload/v1729002694/fmtuchtyuqdaqnqfryem.jpg" },
  { id: "2", title: "Brown Cuban Textured Shirt", imageUrl: "https://res.cloudinary.com/dupo7yv88/image/upload/v1729002694/fmtuchtyuqdaqnqfryem.jpg" },
  { id: "3", title: "Pink Cuban Textured Shirt", imageUrl: "https://res.cloudinary.com/dupo7yv88/image/upload/v1729002694/fmtuchtyuqdaqnqfryem.jpg" },
  { id: "4", title: "Pink Textured Slim Fit Shirt", imageUrl: "https://res.cloudinary.com/dupo7yv88/image/upload/v1729002694/fmtuchtyuqdaqnqfryem.jpg" },
  { id: "5", title: "Black Textured Slim Fit Shirt", imageUrl: "https://res.cloudinary.com/dupo7yv88/image/upload/v1729002694/fmtuchtyuqdaqnqfryem.jpg" },
];

export default function RelatedProducts() {
  return (
    <section className="py-10 px-20 bg-background">
      <div className="container px-4 mx-auto">
        <h2 className="text font-bold text-center mb-8">YOU MAY ALSO LIKE</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <a key={product.id} href={`/product/${product.id}`} className="group">
              <div className="aspect-[3/4] relative overflow-hidden bg-gray-100 rounded-sm">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="object-cover transition-transform duration-300 group-hover:scale-105 w-full h-full"
                />
              </div>
              <h3 className="mt-2 text-xs text-center font-small text-foreground ">
                {product.title}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
