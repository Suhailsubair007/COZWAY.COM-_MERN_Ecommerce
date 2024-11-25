
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronRight } from 'lucide-react'

export default function OurStory() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="container mx-auto my-10 px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.6 }}
        className="grid md:grid-cols-2 gap-12 items-center"
      >
        <div className="space-y-6">
          <nav className="flex items-center text-sm text-muted-foreground mb-4">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span>About</span>
          </nav>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text"
          >
            Our Story
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4 text-muted-foreground"
          >
            <p className="text-lg leading-relaxed">
              Welcome to <span className="font-semibold text-primary">COZWAY.COM</span>, your ultimate destination for premium men's shirts that combine style and comfort. Since our launch, we've been dedicated to offering top-quality apparel that redefines modern men's fashion.
            </p>
            <p className="text-lg leading-relaxed">
              Our mission is to provide a diverse collection of shirts tailored to fit every occasion, style preference, and budget. Whether you're seeking sharp formal wear, trendy casual styles, or versatile classics, COZWAY.COM is your go-to for elevating your wardrobe effortlessly.
            </p>

          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-r from-blue-100 to-blue-50 p-6 rounded-lg shadow-lg"
          >
            <p className="text-blue-800 font-medium">
              COZWAY.COM proudly offers an extensive collection of men's shirts, with new styles and designs added regularly. From timeless classics to the latest trends, we’re committed to redefining your wardrobe with options that suit every occasion.
            </p>

          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 rounded-lg transform rotate-3 scale-105 opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <img
              src="https://res.cloudinary.com/dupo7yv88/image/upload/v1732515955/8ed0705c55574e61e2d81345c131c500458c7154_ghpoyc.avif"
              alt="Model showcasing the latest smartphone"
              width={300}
              height={400}
              className="rounded-lg shadow-lg object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-primary rounded-lg transform -rotate-3 scale-105 opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <img
              src="https://res.cloudinary.com/dupo7yv88/image/upload/v1732516475/21ce93c9945a1c7d9df9749b6a555d85373a616f_aix514.avif"
              alt="Stylish smartphone display"
              width={300}
              height={400}
              className="rounded-lg shadow-lg object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

