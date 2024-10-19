import { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosConfig";
import { useNavigate } from "react-router-dom";

const TrendingNow = () => {
  const [trendingItems, setTrendingItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingItems = async () => {
      try {
        const response = await axiosInstance.get(
          "/users/fetch_product_by_date"
        );
        console.log(response.data)

        const fetchedItems = response.data.slice(0, 4).map((item) => ({
          name: item.name,
          image: item.images[0],
          id: item._id,
        }));

        setTrendingItems(fetchedItems);
        console.log(fetchedItems);
      } catch (error) {
        console.error("Error fetching trending items:", error);
      }
    };

    fetchTrendingItems();
  }, []);

  const handleclick =()=>{
    navigate('/shop')
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
        <h2 className="text-2xl font-bold mb-6">Trending now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingItems.map((item) => (
            <div onClick={handleclick} key={item.id} className="rounded-lg shadow-lg overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-[400px] object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-lg">
                  {item.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingNow;
