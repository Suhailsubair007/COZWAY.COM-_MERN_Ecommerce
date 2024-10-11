import Footer from '@/ReuseComponets/Footer'
import Header from '@/ReuseComponets/Header'
import NewArrivals from '@/ReuseComponets/NewArrivel'
import HeroSection from '@/ReuseComponets/HeroSection'
import TopSelling from '@/ReuseComponets/TopSelling'
import ShopByCategories from '@/ReuseComponets/ShopByCategories'
const Landing = () => {
  return (
    <div className='min-h-screen bg-white'>
      <Header />
      <HeroSection />
      <ShopByCategories />
      <NewArrivals />
      <TopSelling />
      <Footer />
    </div>
  )
}

export default Landing
