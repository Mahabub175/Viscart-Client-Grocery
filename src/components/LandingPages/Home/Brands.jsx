"use client";

import Image from "next/image";
import { useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import { useGetAllBrandsQuery } from "@/redux/services/brand/brandApi";
import LinkButton from "@/components/Shared/LinkButton";
import Link from "next/link";

const Brands = () => {
  const swiperRef = useRef();

  const { data: brands } = useGetAllBrandsQuery();

  const activeBrands = brands?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  return (
    <section className="new-container mt-20 relative -mb-10 lg:mb-0">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg lg:text-3xl font-medium text-center lg:text-start">
          Featured Brands
        </h2>
        <Link
          href={`/products`}
          className="text-black hover:text-primary duration-300 font-semibold text-sm lg:text-base"
        >
          Show All
        </Link>
      </div>
      <div>
        <Swiper
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
            1480: { slidesPerView: 5 },
          }}
          navigation
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="mySwiper"
        >
          {activeBrands?.map((item) => {
            return (
              <SwiperSlide key={item?._id} className="py-5">
                <LinkButton href={`/products?filter=${item?.name}`}>
                  <Image
                    src={
                      item?.attachment ??
                      "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
                    }
                    alt={item?.name ?? "demo"}
                    width={240}
                    height={240}
                    className="bg-white shadow-xl border-2 border-transparent hover:border-primary duration-500 lg:w-[220px] lg:h-[220px] rounded-3xl mx-auto"
                  />
                </LinkButton>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="flex items-center justify-center gap-5 mt-10">
          <button
            className="lg:w-10 lg:h-10 flex z-10 items-center justify-center rounded-full bg-white text-black border border-primary hover:bg-primary hover:text-white duration-300 absolute top-[45%] left-0"
            onClick={() => swiperRef.current.slidePrev()}
          >
            <FaAngleLeft className="text-2xl" />
          </button>
          <button
            className="lg:w-10 lg:h-10 z-10 flex items-center justify-center rounded-full bg-white text-black border border-primary hover:bg-primary hover:text-white duration-300 absolute top-[45%] right-0"
            onClick={() => swiperRef.current.slideNext()}
          >
            <FaAngleRight className="text-2xl" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Brands;
