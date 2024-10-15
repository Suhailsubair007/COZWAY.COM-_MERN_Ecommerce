const ShopByCategories = () => {
    const categories = ['Trousers', 'Cargos', 'Overshirts', 'Oversized Tees'];
    const imageUrl = 'https://www.snitch.co.in/cdn/shop/files/dc12a62f7f8d3502edca38a0259675cc.jpg?v=1726839083&width=1800'; // Same image used for all categories
  
    return (
      <section className='py-12'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Shop by Categories</h2>
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6'>
            {categories.map((category, index) => (
              <div
                key={index}
                className='relative bg-white shadow-lg rounded-lg overflow-hidden'
              >
                <img
                  src={imageUrl}
                  alt={category}
                  className='w-full h-95 object-cover'
                />
                <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3'>
                  <p className='text-center text-base font-semibold tracking-wide'>
                    {category}
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
  