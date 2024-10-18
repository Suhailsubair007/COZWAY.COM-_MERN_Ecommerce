import { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosConfig";
import { useNavigate } from "react-router-dom";

const ShopByCategories = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(
          "/users/fetch_product_display"
        );
        const fetchedProducts = response.data.slice(0, 4).map((product) => ({
          name: product.name,
          image: product.images[0],
          id: product._id,
        }));

        setProducts(fetchedProducts);
        // console.log(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProduct();
  }, []);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Latest collections</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[440px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3">
                <p className="text-center text-base font-semibold tracking-wide">
                  {product.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategories;
