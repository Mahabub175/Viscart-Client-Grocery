import BackToTop from "@/components/Shared/BackToTop";
import LandingFooter from "@/components/Shared/Footer/LandingFooter";
import BottomNavigation from "@/components/Shared/Navbar/BottomNavigation";
import LandingHeader from "@/components/Shared/Navbar/LandingHeader";
import SidebarCategories from "@/components/Shared/Sidebar/SidebarCategories";

const LandingLayout = ({ children }) => {
  return (
    <>
      <LandingHeader />
      <div className="mt-28 md:mt-[6.4rem] lg:mt-[7.5rem] flex items-start relative">
        <div className="sticky top-5 z-10 w-[300px] hidden lg:block">
          <SidebarCategories />
        </div>

        <div className="lg:my-container overflow-x-hidden lg:pl-5">
          <div>{children}</div>
          <LandingFooter />
        </div>
      </div>
      <BackToTop />
      <BottomNavigation />
    </>
  );
};

export default LandingLayout;
