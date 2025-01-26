import BackToTop from "@/components/Shared/BackToTop";
import FixedCart from "@/components/Shared/FixedCart";
import LandingFooter from "@/components/Shared/Footer/LandingFooter";
import MobileCategories from "@/components/Shared/MobileCateogories";
import BottomNavigation from "@/components/Shared/Navbar/BottomNavigation";
import LandingHeader from "@/components/Shared/Navbar/LandingHeader";

const LandingLayout = ({ children }) => {
  return (
    <>
      <LandingHeader />
      <div className="mt-28 md:mt-[6.4rem] lg:mt-[10rem] xxl:mt-[7.5rem]">
        <div>{children}</div>
        <LandingFooter />
      </div>
      <FixedCart />
      <BackToTop />
      <MobileCategories />
      <BottomNavigation />
    </>
  );
};

export default LandingLayout;
