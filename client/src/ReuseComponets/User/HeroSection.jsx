import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'
import { Button } from "@/components/ui/button"

const HeroSection = () => {
  const images = [
    {
      src: 'https://www.snitch.co.in/cdn/shop/files/4_WebBanner_1920x1080_1_1400x.jpg?v=1728392099',
      alt: 'Mens Collection - Exclusive',
      title: 'Classic Exclusive',
      subtitle: 'Mens Collection',
      offer: 'UPTO 40% OFF'
    },
    {
      src: 'https://www.westside.com/cdn/shop/files/C2_08_1920X900_FORMAL_SHIRT_3b893f14-041c-4927-a40c-aa6972bb302f.jpg?v=1727421617',
      alt: 'Limited Edition Deals',
      title: 'Limited Edition',
      subtitle: 'Formal Shirts',
      offer: 'BUY 2 GET 1 FREE'
    },
    {
      src: 'https://www.snitch.co.in/cdn/shop/files/2_WebBanner_1920x1080_4_1400x.jpg?v=1728458033',
      alt: 'Summer Sale',
      title: 'Summer Sale',
      subtitle: 'Hot Deals',
      offer: 'UP TO 50% OFF'
    },
    {
      src: 'https://blackberrys.com/cdn/shop/files/WEEKEND_CHILL_03db8124-a03b-420c-b90e-72406a968ba0.jpg?v=1715746352',
      alt: 'Weekend Chill',
      title: 'Weekend Chill',
      subtitle: 'Casual Collection',
      offer: 'STARTING AT $29.99'
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)

  useEffect(() => {
    let interval
    if (isAutoplay) {
      interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % images.length)
      }, 5000) // Change slide every 5 seconds
    }
    return () => clearInterval(interval)
  }, [isAutoplay])

  const goToSlide = (index) => {
    setCurrentIndex(index)
    setIsAutoplay(false)
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
    setIsAutoplay(false)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
    setIsAutoplay(false)
  }

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="max-w-lg"
              >
                <h2 className="text-5xl font-bold text-white mb-2">
                  {images[currentIndex].title}
                </h2>
                <h3 className="text-4xl font-semibold text-white mb-4">
                  {images[currentIndex].subtitle}
                </h3>
                <p className="text-2xl text-white mb-6">{images[currentIndex].offer}</p>
                <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                  <ShoppingBag className="mr-2 h-5 w-5" /> SHOP NOW
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slider indicators */}
      <div className="absolute z-30 flex space-x-3 bottom-5 left-1/2 -translate-x-1/2">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Slide ${index + 1}`}

          ></button>
        ))}
      </div>

      {/* Slider controls */}
      <button
        type="button"
        className="absolute top-1/2 left-4 z-30 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
        onClick={goToPrevious}
      >
        <ChevronLeft className="w-6 h-6" />
        <span className="sr-only">Previous</span>
      </button>
      <button
        type="button"
        className="absolute top-1/2 right-4 z-30 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
        onClick={goToNext}
      >
        <ChevronRight className="w-6 h-6" />
        <span className="sr-only">Next</span>
      </button>

      {/* Autoplay toggle */}
      <button
        type="button"
        className="absolute top-4 right-4 z-30 bg-black/30 hover:bg-black/50 text-white px-3 py-1 rounded-full text-sm transition-all duration-300"
        onClick={() => setIsAutoplay(!isAutoplay)}
      >
        {isAutoplay ? 'Pause' : 'Play'}
      </button>
    </section>
  )
}

export default HeroSection