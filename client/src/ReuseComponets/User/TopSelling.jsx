import { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosConfig";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

export default function TopSelling() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get("/users/formal");
        const fetchedProducts = response.data.slice(0, 4).map((product) => ({
          name: product.name,
          image: product.image,
          id: product.id,
        }));
        setProducts(fetchedProducts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const handleClick = () => {
    navigate("/shop");
  };

  return (
    <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
          Formal Collections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, index) => (
                  <Skeleton
                    key={index}
                    className="w-full h-[440px] rounded-lg"
                  />
                ))
            : products.map((product) => (
                <div
                  key={product.id}
                  onClick={handleClick}
                  className="relative bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden cursor-pointer group"
                >
                  <div className="aspect-w-3 aspect-h-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-lg font-semibold text-center">
                      {product.name}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
