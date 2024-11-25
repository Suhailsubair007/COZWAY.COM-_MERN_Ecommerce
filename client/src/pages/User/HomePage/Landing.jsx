import { motion } from 'framer-motion';
import Footer from "@/ReuseComponets/User/Footer";
import Header from "@/ReuseComponets/User/Header";
import NewArrivals from "@/ReuseComponets/User/NewArrivel";
import HeroSection from "@/ReuseComponets/User/HeroSection";
import TopSelling from "@/ReuseComponets/User/TopSelling";
import ShopByCategories from "@/ReuseComponets/User/ShopByCategories";

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={childVariants}>
          <HeroSection />
        </motion.div>
        <motion.div variants={childVariants}>
          <ShopByCategories />
        </motion.div>
        <motion.div variants={childVariants}>
          <NewArrivals />
        </motion.div>
        <motion.div variants={childVariants}>
          <TopSelling />
        </motion.div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default Landing;

