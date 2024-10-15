import { useState, useEffect } from 'react'

const HeroSection = () => {
  const images = [
    {
      src: 'https://www.snitch.co.in/cdn/shop/files/4_WebBanner_1920x1080_1_1400x.jpg?v=1728392099',
      alt: 'Mens Collection - Exclusive'
    },
    {
      src: 'https://www.westside.com/cdn/shop/files/C2_08_1920X900_FORMAL_SHIRT_3b893f14-041c-4927-a40c-aa6972bb302f.jpg?v=1727421617',
      alt: 'Limited Edition Deals'
    },
    {
      src: 'https://www.snitch.co.in/cdn/shop/files/2_WebBanner_1920x1080_4_1400x.jpg?v=1728458033',
      alt: 'Summer Sale'
    },
    {
      src: 'https://blackberrys.com/cdn/shop/files/WEEKEND_CHILL_03db8124-a03b-420c-b90e-72406a968ba0.jpg?v=1715746352',
      alt: 'Summer Sale'
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const goToSlide = index => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  return (
    <section className='relative w-full h-screen'>
      <div className='relative h-full overflow-hidden'>
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Ensuring images take up full height and width while maintaining aspect ratio */}
            <img
              src={image.src}
              alt={image.alt}
              className='w-full h-full object-cover object-center'
            />
            <div className='absolute inset-0 bg-black bg-opacity-40 flex items-center'>
              <div className='container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-24'>
                <div className='max-w-lg'>
                  <h1 className='text-4xl font-bold text-white mb-2'>
                    Classic Exclusive
                  </h1>
                  <h2 className='text-5xl font-bold text-white mb-4'>
                    Mens Collection
                  </h2>
                  <p className='text-2xl text-white mb-6'>UPTO 40% OFF</p>
                  <button className='bg-white text-black px-6 py-2 rounded-sm hover:bg-gray-200 transition duration-300'>
                    SHOP NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slider indicators */}
      <div className='absolute z-30 flex space-x-3 bottom-5 left-1/2 -translate-x-1/2'>
        {images.map((_, index) => (
          <button
            key={index}
            type='button'
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Slider controls */}
      <button
        type='button'
        className='absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none'
        onClick={goToPrevious}
      >
        <span className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none'>
          <svg
            className='w-4 h-4 text-white'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M15 19l-7-7 7-7'
            ></path>
          </svg>
          <span className='sr-only'>Previous</span>
        </span>
      </button>
      <button
        type='button'
        className='absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none'
        onClick={goToNext}
      >
        <span className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none'>
          <svg
            className='w-4 h-4 text-white'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M9 5l7 7-7 7'
            ></path>
          </svg>
          <span className='sr-only'>Next</span>
        </span>
      </button>
    </section>
  )
}

export default HeroSection
