const TopSelling = () => {
    // Example products data
    const products = [
      {
        id: 1,
        title: 'Black Slim Fit Cargo Pants',
        price: 'INR 1,799',
        sizes: '30 32 34 36 38',
        imageUrl: 'https://www.snitch.co.in/cdn/shop/files/4MSO4576-0311.jpg?v=1728648286&width=1800',
      },
      {
        id: 2,
        title: 'Product 2',
        price: 'INR 2,199',
        sizes: '30 32 34 36 38',
        imageUrl: 'https://www.snitch.co.in/cdn/shop/files/4MSO4576-0311.jpg?v=1728648286&width=1800', // Replace with actual product image
      },
      {
        id: 3,
        title: 'Product 3',
        price: 'INR 1,299',
        sizes: '30 32 34 36 38',
        imageUrl: 'https://www.snitch.co.in/cdn/shop/files/4MSO4576-0311.jpg?v=1728648286&width=1800', // Replace with actual product image
      },
      {
        id: 4,
        title: 'Product 4',
        price: 'INR 1,999',
        sizes: '30 32 34 36 38',
        imageUrl: 'https://www.snitch.co.in/cdn/shop/files/4MSO4576-0311.jpg?v=1728648286&width=1800', // Replace with actual product image
      },
    ];
  
    return (
      <section className='py-12'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-2xl font-bold mb-6'>Top Selling</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {products.map((product) => (
              <div
                key={product.id}
                className='bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center'
              >
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className='w-full object-cover'
                />
                <div className='p-4 text-center'>
                  <h3 className='font-semibold mb-2'>
                    {product.title}
                  </h3>
                  <p className='text-sm text-gray-600 mb-2'>{product.price}</p>
                  <p className='font-bold mb-2'>{product.sizes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default TopSelling;
  