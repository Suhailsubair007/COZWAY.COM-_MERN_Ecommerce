import { useState, useEffect } from "react";
import axiosInstance from "@/config/axiosConfig";
import { useNavigate } from "react-router-dom";

const TopSelling = () => {
    // Example products data
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
      <section className='py-12'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Top Selling</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-1'>
            {trendingItems.map((product) => (
              <div
                key={product.id}
                className='h-[500px] w-[300px]  bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center'
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className='w-full object-cover'
                />
                <div className='p-4 text-center'>
                  <h3 className='font-medium text-sm mb-2'>
                    {product.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default TopSelling;
  