import { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosConfig";
import { useParams } from "react-router-dom";

export default function RelatedProducts({ id }) {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await axiosInstance.get(
          `/users/related/${id}`
        );
        setRelatedProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      }
    };

    if (id) {
      fetchRelatedProducts();
    }
  }, [id]);

  return (
    <section className="py-10 px-20 bg-background">
      <div className="container px-4 mx-auto">
        <h2 className="text font-bold text-center mb-8">YOU MAY ALSO LIKE</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {relatedProducts.map((product) => (
            <a
              key={product._id}
              href={`/product/${product._id}`}
              className="group"
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-gray-100 rounded-sm">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="object-cover transition-transform duration-300 group-hover:scale-105 w-full h-full"
                />
              </div>
              <h3 className="mt-2 text-xs text-center font-small text-foreground">
                {product.name}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
