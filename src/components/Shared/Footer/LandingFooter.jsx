"use client";

import { footerData } from "@/assets/data/footerData";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import ContactInfo from "./ContactInfo";
import Image from "next/image";

const LandingFooter = () => {
  const { data: globalData } = useGetAllGlobalSettingQuery();

  return (
    <section className="bg-[#0f0f0f] border-t mt-10 mb-16 lg:mb-0 text-gray-400">
      <footer className="pt-10 ">
        <div className="new-container">
          <Link href={"/"}>
            <Image
              src={globalData?.results?.logo}
              alt="logo"
              width={200}
              height={200}
              className="-ml-5"
            />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 md:gap-0 xl:gap-10 items-start justify-center  new-container">
          <ContactInfo globalData={globalData} />

          {footerData?.map((item, i) => (
            <div key={i}>
              <h3 className="text-2xl font-bold mb-6">{item?.title}</h3>
              <ul>
                {item?.links?.map((link, j) => (
                  <Link key={j} href={link?.to}>
                    <p className="mt-2 hover:underline hover:text-primary duration-300">
                      {link?.name}
                    </p>
                  </Link>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col items-start gap-4">
            <h3 className="text-2xl font-bold mb-2">Follow Us</h3>
            <Link
              href={globalData?.results?.businessFacebook ?? "/"}
              target="_blank"
              className="flex items-center gap-4"
            >
              <FaFacebook className="text-4xl bg-primary p-2 rounded-full text-white hover:scale-110 duration-300" />
              <p>Facebook</p>
            </Link>
            <Link
              href={globalData?.results?.businessLinkedin ?? "/"}
              target="_blank"
              className="flex items-center gap-4"
            >
              <FaLinkedin className="text-4xl bg-primary p-2 rounded-full text-white hover:scale-110 duration-300" />
              <p>Linkedin</p>
            </Link>
            <Link
              href={globalData?.results?.businessInstagram ?? "/"}
              target="_blank"
              className="flex items-center gap-4"
            >
              <FaInstagram className="text-4xl bg-primary p-2 rounded-full text-white hover:scale-110 duration-300" />
              <p>Instagram</p>
            </Link>
            <Link
              href={globalData?.results?.businessTwitter ?? "/"}
              target="_blank"
              className="flex items-center gap-4"
            >
              <FaSquareXTwitter className="text-4xl bg-primary p-2 rounded-full text-white hover:scale-110 duration-300" />
              <p>Twitter</p>
            </Link>
          </div>
        </div>

        <hr className="mt-10 border-textColor" />

        <div className="flex flex-col md:flex-row gap-5 lg:gap-0 justify-between items-center py-5 new-container">
          <p className="font-medium text-white">
            Trade License: TRAD/DNCC/0342302/2022
          </p>
          <p className="font-medium text-white">
            ©{new Date().getFullYear()}, All rights reserved
          </p>
        </div>
      </footer>
    </section>
  );
};

export default LandingFooter;
