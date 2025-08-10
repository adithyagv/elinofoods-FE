import Navbar from "../../components/Navbar/navbar";
import TopBanner from "../../components/TopBanner/TopBanner";
import HeroCarousel from "../../components/Carousel/HeroCarousel";
import ProductTabs from "../../components/home/ProductTabs";
import TimeToEat from "../../components/home/TimeToEat";
import InstaFeed from "../../components/InstaFeed/InstaFeed";
import AboutUs from "../../components/AboutUs/AboutUs";
import Footer from "../../components/Footer/Footer";
import BlogHome from "../../components/Blog/BlogHome";

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
