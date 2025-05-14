"use client";

import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { IoChatbubble } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { FaFacebookMessenger, FaPhone, FaWhatsapp } from "react-icons/fa";

const FloatingContact = () => {
  const { data: globalData } = useGetAllGlobalSettingQuery();

  const [isContactOpen, setIsContactOpen] = useState(false);

  const contactButtonRef = useRef(null);
  const contactContainerRef = useRef(null);

  const handleContactClick = (e) => {
    e.preventDefault();
    setIsContactOpen(!isContactOpen);
  };

  const handleIconClick = (e) => {
    e.stopPropagation();
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

  return (
    <div className="relative hidden lg:block">
      <div
        className="fixed bottom-[15%] lg:bottom-[14%] xxl:bottom-[10%] right-2 lg:right-7 z-50 cursor-pointer"
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
            <div className="p-2 bg-primary text-white rounded-full flex items-center justify-center text-sm cursor-pointer">
              <RxCross1 className="text-2xl text-orange" />
            </div>
          ) : (
            <div className="p-2 bg-primary text-white rounded-full flex items-center justify-center text-sm cursor-pointer">
              <IoChatbubble className="text-2xl" />
            </div>
          )}
        </motion.div>
      </div>
      {isContactOpen && (
        <div
          className="fixed bottom-[22%] xxl:bottom-[16%] right-6 z-50 flex flex-col space-y-2"
          ref={contactContainerRef}
        >
          <motion.a
            href={`tel:${globalData?.results?.businessNumber}`}
            className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleIconClick}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaPhone size={20} />
          </motion.a>
          <motion.a
            href={`https://wa.me/${globalData?.results?.businessWhatsapp}`}
            className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onClick={handleIconClick}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp size={20} />
          </motion.a>
          <motion.a
            href={`https://m.me/${globalData?.results?.messengerUsername}`}
            className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={handleIconClick}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookMessenger size={20} />
          </motion.a>
        </div>
      )}
    </div>
  );
};

export default FloatingContact;
