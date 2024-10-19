import Footer from "@/ReuseComponets/User/Footer";
import Header from "@/ReuseComponets/User/Header";
import NewArrivals from "@/ReuseComponets/User/NewArrivel";
import HeroSection from "@/ReuseComponets/User/HeroSection";
import TopSelling from "@/ReuseComponets/User/TopSelling";
import ShopByCategories from "@/ReuseComponets/User/ShopByCategories";


const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <div className="pl-16 pr-16 px-6 lg:px-12">
        <ShopByCategories />
        <NewArrivals />
        <TopSelling />
      </div>
      <Footer />
    </div>
  );
};



export default Landing;
