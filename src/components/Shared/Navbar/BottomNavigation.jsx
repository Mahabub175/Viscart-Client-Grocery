"use client";

import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useGetSingleCompareByUserQuery } from "@/redux/services/compare/compareApi";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { useGetSingleWishlistByUserQuery } from "@/redux/services/wishlist/wishlistApi";
import { AppstoreOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FaFacebookMessenger,
  FaHeart,
  FaPhone,
  FaUser,
  FaWhatsapp,
} from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import { IoChatbubble } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { useSelector } from "react-redux";

const BottomNavigation = () => {
  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);
  const { data } = useGetSingleUserQuery(user?._id);
  const { data: compareData } = useGetSingleCompareByUserQuery(
    user?._id ?? deviceId
  );
  const { data: wishListData } = useGetSingleWishlistByUserQuery(
    user?._id ?? deviceId
  );
  const pathname = usePathname();
  const router = useRouter();

  const { data: globalData } = useGetAllGlobalSettingQuery();

  const [isContactOpen, setIsContactOpen] = useState(false);

  const contactButtonRef = useRef(null);
  const contactContainerRef = useRef(null);

  const handleIconClick = (e) => {
    e.stopPropagation();
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    setIsContactOpen(!isContactOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        contactContainerRef.current &&
        !contactContainerRef.current.contains(e.target) &&
        !contactButtonRef.current.contains(e.target)
      ) {
        setIsContactOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    {
      name: "Contact",
      href: "#",
      icon: (
        <div
          className="relative cursor-pointer"
          onClick={handleContactClick}
          ref={contactButtonRef}
        >
          <motion.div
            key={isContactOpen ? "close" : "chat"}
            initial={{ rotate: 0, scale: 1 }}
            animate={{ rotate: isContactOpen ? 180 : 0, scale: 1.1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {isContactOpen ? (
              <RxCross1 className="mb-1 mt-2.5 text-orange" />
            ) : (
              <IoChatbubble className="mb-1 mt-2.5" />
            )}
          </motion.div>
        </div>
      ),
    },
    {
      name: "Offers",
      href: "/offers",
      icon: (
        <AppstoreOutlined
          className={`mb-1 mt-2.5 ${
            pathname === "/offers" ? "text-orange" : ""
          }`}
        />
      ),
    },
    {
      name: "Wishlist",
      href: "/wishlist",
      icon: (
        <div className="relative">
          <FaHeart
            className={`mb-1 mt-2.5 ${
              pathname === "/wishlist" ? "text-orange" : ""
            }`}
          />
          {wishListData?.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {wishListData.length}
            </span>
          )}
        </div>
      ),
    },
    {
      name: "Compare",
      href: "/compare",
      icon: (
        <div className="relative">
          <FaCodeCompare
            className={`rotate-90 mt-2.5 mb-0.5 ${
              pathname === "/compare" ? "text-orange" : ""
            }`}
          />
          {compareData?.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {compareData.length}
            </span>
          )}
        </div>
      ),
    },
    {
      name: "My Account",
      href: user ? `/${data?.role}/dashboard` : "/sign-in",
      icon: user ? (
        <FaUser
          className={`mt-[13px] mb-1 cursor-pointer ${
            pathname.includes(`/${data?.role}/`) ? "text-orange" : "text-white"
          }`}
          onClick={() => router.push(`/${data?.role}/dashboard`)}
        />
      ) : (
        <FaUser
          className={`mt-[13px] mb-1 cursor-pointer ${
            pathname === ("/sign-in" || "/sign-up")
              ? "text-orange"
              : "text-white"
          }`}
          onClick={() => router.push("/sign-in")}
        />
      ),
    },
  ];

  return (
    <div className="relative">
      <div className="fixed -bottom-[1px] left-0 z-50 w-full bg-primary border-t border-gray-300 shadow-md lg:hidden">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center text-primaryLight relative"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {isContactOpen && (
        <div
          className="fixed bottom-16 left-5 z-50 flex flex-col space-y-2"
          ref={contactContainerRef}
        >
          <motion.a
            href={`tel:${globalData?.results?.businessNumber}`}
            className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleIconClick}
          >
            <FaPhone size={20} />
          </motion.a>
          <motion.a
            href={`https://wa.me/${globalData?.results?.businessWhatsapp}`}
            className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleIconClick}
          >
            <FaWhatsapp size={20} />
          </motion.a>
          <motion.a
            href={`https://m.me/${globalData?.results?.messengerUsername}`}
            className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleIconClick}
          >
            <FaFacebookMessenger size={20} />
          </motion.a>
        </div>
      )}
    </div>
  );
};

export default BottomNavigation;
