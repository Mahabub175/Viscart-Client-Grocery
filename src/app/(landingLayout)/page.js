import Banner from "@/components/LandingPages/Home/Banner";
import Brands from "@/components/LandingPages/Home/Brands";
import Categories from "@/components/LandingPages/Home/Categories";
import OfferProducts from "@/components/LandingPages/Home/Products/OfferProducts";
import PopularProducts from "@/components/LandingPages/Home/Products/PopularProducts";
import RecentlyViewedProducts from "@/components/LandingPages/Home/Products/RecentlyViewedProducts";

export const metadata = {
  title: "Home | Viscart",
  description: "This is the homepage of Viscart",
};

const page = async () => {
  return (
    <div className="overflow-x-hidden">
      <Banner />
      <OfferProducts />
      <PopularProducts />
      <Categories />
      <Brands />
      <RecentlyViewedProducts />
    </div>
  );
};

export default page;
