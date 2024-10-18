const RelatedProducts = () => {
  
    // Example data array with 4 related products
    const relatedItems = [
      { title: 'Product 1', price: '$49.99', imageUrl: 'https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg' },
      { title: 'Product 2', price: '$59.99', imageUrl: 'https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg' },
      { title: 'Product 3', price: '$39.99', imageUrl: 'https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg' },
      { title: 'Product 4', price: '$29.99', imageUrl: 'https://res.cloudinary.com/dupo7yv88/image/upload/v1729091942/ya9agzofv8tchupo7riy.jpg' }
    ];
  
    return (
      <section className='py-12 bg-gray-100'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h4 className='text-4xl font-bold mb-10 text-gray-800'>Related Products</h4>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            {relatedItems.map((item, index) => (
              <div
                key={index}
                className='group relative bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105'
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className='w-full h-[350px] object-cover transition duration-300 ease-in-out group-hover:opacity-90'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50'></div>
                <div className='p-4 relative'>
                  <h3 className='font-semibold text-white text-lg transition duration-300 group-hover:text-yellow-400'>
                    {item.title}
                  </h3>
                  <p className='text-white mt-2'>{item.price}</p>
                </div>
                <div className='absolute bottom-0 w-full text-center py-2 bg-yellow-400 text-black font-bold opacity-0 group-hover:opacity-100 transition duration-300'>
                  View Product
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default RelatedProducts;
  