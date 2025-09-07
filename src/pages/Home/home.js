import TopBanner from "../../components/TopBanner/TopBanner";
import HeroCarousel from "../../components/Carousel/HeroCarousel";
import ProductTabs from "../../components/home/ProductTabs";
import TimeToEat from "../../components/home/TimeToEat";
import InstaFeed from "../../components/home/InstaFeed/InstaFeed";
import AboutUs from "../../components/home/AboutUs/AboutUs";
import Footer from "../../components/Footer/Footer";
import BlogHome from "../../components/home/Blog/BlogHome";
import Navbar from "../../components/Navbar/navbar";

function Home() {
  return (
    <div className="home">
      <Navbar />
      <TopBanner />
      <HeroCarousel />
      <ProductTabs />
      <TimeToEat />
      <BlogHome />
      <AboutUs />
      <InstaFeed />
      <Footer />
    </div>
  );
}

export default Home;
