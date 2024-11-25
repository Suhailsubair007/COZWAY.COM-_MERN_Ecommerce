import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/config/axiosConfig";
import RefferalPopUp from "./RefferalPopUp";
import { LoadingSpinner } from "./LoadingSpinner";

export default function HeroSection() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [banners, setBanners] = useState([]);
  const [seen, setSeen] = useState(true);
  const [showReferralPopup, setShowReferralPopup] = useState(false);
  const userId = useSelector((state) => state.user?.userInfo?.id);

  useEffect(() => {
    fetchBanners();
    let interval;
    if (isAutoplay) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoplay, banners.length]);
  useEffect(() => {
    fetchSeen();
  }, [userId]);

  const fetchBanners = async () => {
    try {
      const response = await axiosInstance.get("/users/banners");
      setBanners(response.data.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  const fetchSeen = async () => {
    try {
      const response = await axiosInstance.get(`/users/seen/${userId}`);
      setSeen(response.data.hasSeen);
      setShowReferralPopup(!response.data.hasSeen);
    } catch (error) {
      console.error("Error fetching seen status:", error);
    }
  };

  const handleClick = () => {
    navigate("/shop");
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoplay(false);
  };

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? banners.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setIsAutoplay(false);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === banners.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setIsAutoplay(false);
  };

  const handleCloseReferralPopup = () => {
    setShowReferralPopup(false);
    setSeen(true);
  };

  if (banners.length === 0) {
    return <div className="relative w-full h-screen overflow-hidden">
      <LoadingSpinner/>
    </div>
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
            src={banners[currentIndex].image}
            alt={banners[currentIndex].heading}
            className="w-full h-full object-cover object-center"
            onClick={handleClick}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="max-w-lg"
              >
                <h2 className="text-4xl font-bold text-white mb-2">
                  {banners[currentIndex].heading}
                </h2>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  {banners[currentIndex].subHeading}
                </h3>
                <p className="text-xl text-white mb-6">
                  {banners[currentIndex].description}
                </p>
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200"
                  onClick={handleClick}
                >
                  <ShoppingBag className="mr-1 h-4 w-4" /> SHOP NOW
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slider indicators */}
      <div className="absolute z-30 flex space-x-3 bottom-5 left-1/2 -translate-x-1/2">
        {banners.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white w-6" : "bg-white/50"
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
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        type="button"
        className="absolute top-1/2 right-4 z-30 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
        onClick={goToNext}
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Autoplay toggle */}
      <button
        type="button"
        className="absolute top-4 right-4 z-30 bg-black/30 hover:bg-black/50 text-white px-3 py-1 rounded-full text-sm transition-all duration-300"
        onClick={() => setIsAutoplay(!isAutoplay)}
      >
        {isAutoplay ? "Pause" : "Play"}
      </button>

      <RefferalPopUp
        isOpen={showReferralPopup}
        seen={seen}
        onClose={handleCloseReferralPopup}
      />
    </section>
  );
}
