const TrendingNow = () => {
  
    // Example data array with 4 items
    const trendingItems = [
      { title: 'Trending Item 1' },
      { title: 'Trending Item 2' },
      { title: 'Trending Item 3' },
      { title: 'Trending Item 4' }
    ];
  
    return (
      <section className='py-12'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-bold mb-8'>TRENDING NOW</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {trendingItems.map((item, index) => (
              <div key={index} className='rounded-lg shadow-lg overflow-hidden'>
                <img
                  src='https://www.snitch.co.in/cdn/shop/files/b3f2ffe6726b45be503c044ce6b842a3.jpg?v=1728373682&width=1800'
                  alt={item.title}
                  className='w-full h-[400px] object-cover'
                />
                <div className='p-4'>
                  <h3 className='font-semibold text-gray-800 text-lg'>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default TrendingNow;
  