/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";
import { logout, useCurrentUser } from "@/redux/services/auth/authSlice";
import { useGetSingleCartByUserQuery } from "@/redux/services/cart/cartApi";
import { useGetSingleCompareByUserQuery } from "@/redux/services/compare/compareApi";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import { useGetSingleWishlistByUserQuery } from "@/redux/services/wishlist/wishlistApi";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Drawer, Popover } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import { GiCancel } from "react-icons/gi";
import { IoMdArrowDropdown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import DrawerCart from "../Product/DrawerCart";
import CategoryNavigation from "./CategoryNavigation";
import ProductSearchBar from "./ProductSearchBar";
import logo from "@/assets/images/logo-white.png";

const LandingHeader = () => {
  const pathname = usePathname();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);
  const { data } = useGetSingleUserQuery(user?._id);
  const { data: compareData } = useGetSingleCompareByUserQuery(
    user?._id ?? deviceId
  );
  const { data: wishListData } = useGetSingleWishlistByUserQuery(
    user?._id ?? deviceId
  );
  const { data: cartData } = useGetSingleCartByUserQuery(user?._id ?? deviceId);

  const { data: globalData } = useGetAllGlobalSettingQuery();
  const { data: products } = useGetAllProductsQuery();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
  };

  const links = {
    Dashboard: `/${data?.role}/dashboard`,
    Order: `/${data?.role}/orders/order`,
    Profile: `/${data?.role}/account-setting`,
    Prescription: `/${data?.role}/prescription`,
  };

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const content = (
    <div>
      <div className="rounded-md px-16 py-3">
        <div className="flex flex-col items-start gap-4 text-md">
          {["Dashboard", "Order", "Profile", "Prescription"].map(
            (item, index) => (
              <Link
                key={index}
                href={links[item]}
                className={`gap-2 font-bold duration-300 ${
                  pathname === links[item]
                    ? "text-primary hover:text-primary"
                    : "text-black hover:text-primary"
                }`}
              >
                {item}
              </Link>
            )
          )}
        </div>
      </div>

      <div className="flex w-full justify-end pt-3">
        <Button
          onClick={handleLogout}
          className={`w-full font-bold`}
          size="large"
          type="primary"
        >
          Log Out
        </Button>
      </div>
    </div>
  );

  return (
    <header
      className={`fixed bg-white top-0 left-0 w-full lg:shadow-md transition-transform duration-300 z-50 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav className="lg:px-5 lg:my-2 pb-5 lg:pb-0">
        <div className="flex justify-between items-center gap-10">
          <Link href={"/"} className="flex flex-[1] lg:flex-none">
            <Image
              src={globalData?.results?.logo ?? logo}
              alt="logo"
              width={100}
              height={100}
            />
          </Link>

          <ProductSearchBar
            products={products}
            globalData={globalData}
            isMobile
          />

          <div className="flex gap-2 items-center text-lg">
            <Link
              href={"/compare"}
              className="hidden lg:flex hover:bg-grey p-3 rounded-full cursor-pointer hover:text-primary duration-300"
            >
              {compareData?.[0]?.product?.length > 0 ? (
                <span className="relative">
                  <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {compareData?.[0]?.product?.length}
                  </span>
                  <FaCodeCompare className="rotate-90" />
                </span>
              ) : (
                <FaCodeCompare className="rotate-90" />
              )}
            </Link>
            <Link
              href={"/wishlist"}
              className="hidden lg:flex hover:bg-grey p-3 rounded-full cursor-pointer hover:text-primary duration-300"
            >
              {wishListData?.length > 0 ? (
                <span className="relative">
                  <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {wishListData?.length}
                  </span>
                  <FaHeart />
                </span>
              ) : (
                <FaHeart />
              )}
            </Link>
            {user?._id ? (
              <>
                {" "}
                <div className="lg:mr-3">
                  <Popover
                    placement="bottomRight"
                    content={content}
                    className="cursor-pointer flex items-center gap-1"
                  >
                    {data?.profile_image ? (
                      <Image
                        src={data?.profile_image}
                        alt="profile"
                        height={40}
                        width={40}
                        className="rounded-full w-[35px] h-[35px] border-2 border-primary"
                      />
                    ) : (
                      <Avatar size={30} icon={<UserOutlined />} />
                    )}
                    <div className="font-normal text-sm flex items-center lg:mr-2 lg:gap-1">
                      <h2>
                        {data?.name ?? "User"}
                        <p className="text-xs flex items-center gap-1">
                          Point:{" "}
                          <span className="text-primary font-semibold">
                            {data?.point}
                          </span>
                        </p>
                      </h2>
                      <IoMdArrowDropdown />
                    </div>
                  </Popover>
                </div>
              </>
            ) : (
              <>
                <Link
                  href={"/sign-in"}
                  className="hover:bg-grey p-3 rounded-full flex items-center gap-2 lg:w-[160px] cursor-pointer hover:text-primary duration-300"
                >
                  <FaUser />
                  <span className="text-sm hidden lg:block">
                    Login / Register
                  </span>
                </Link>
              </>
            )}
            <div
              className="hidden lg:flex hover:bg-grey p-3 rounded-full cursor-pointer hover:text-primary duration-300"
              onClick={() => setIsCartOpen(true)}
            >
              {cartData?.length > 0 ? (
                <span className="relative">
                  <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {cartData?.length}
                  </span>
                  <FaShoppingCart />
                </span>
              ) : (
                <FaShoppingCart className="cursor-pointer hover:text-primary duration-300" />
              )}
            </div>
          </div>
        </div>
        <ProductSearchBar products={products} globalData={globalData} />
      </nav>

      <hr className="hidden lg:block" />
      <div className="hidden lg:flex gap-6 items-center">
        <CategoryNavigation />
      </div>

      <Drawer
        placement="right"
        onClose={() => setIsCartOpen(false)}
        open={isCartOpen}
        width={450}
        keyboard={true}
        destroyOnClose
      >
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <p className="lg:text-2xl font-semibold">Shopping Cart</p>
          <button
            className="mt-1 bg-gray-200 hover:scale-110 duration-500 rounded-full p-1"
            onClick={() => setIsCartOpen(false)}
          >
            <GiCancel className="text-xl text-gray-700" />
          </button>
        </div>
        <DrawerCart data={cartData} setDrawer={setIsCartOpen} />
      </Drawer>
    </header>
  );
};

export default LandingHeader;
