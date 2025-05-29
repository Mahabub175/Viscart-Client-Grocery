"use client";

import Image from "next/image";
import { useRef } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { useGetAllSlidersQuery } from "@/redux/services/slider/sliderApi";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setFilter } from "@/redux/services/device/deviceSlice";

const Banner = () => {
  const swiperRef = useRef();
  const dispatch = useDispatch();

  const { data: sliders } = useGetAllSlidersQuery();

  const activeSliders = sliders?.results?.filter(
    (item) => item.status === "Active"
  );

  const itemClickHandler = (item) => {
    if (item?.category?.name) {
      dispatch(setFilter(item));
    }
  };

  return (
    <section className="relative xxl:w-[1280px] mx-auto lg:px-5 lg:my-5">
      <Swiper
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Autoplay, Pagination]}
        loop={true}
        slidesPerView={1}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="max-h-[500px]"
      >
        {activeSliders?.map((item) => {
          return (
            <SwiperSlide key={item?._id}>
              <Link href={`/products`}>
                <Image
                  src={
                    item?.attachment ??
                    "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
                  }
                  alt={item?.name ?? "image"}
                  width={2500}
                  height={700}
                  className="h-[200px] lg:h-fit w-full rounded-xl"
                  priority
                  onClick={() => itemClickHandler(item)}
                />
                <div className="absolute z-10 top-20 lg:top-[45%] left-[5%]">
                  {item?.name && (
                    <h2 className="text-primary text-3xl lg:text-7xl font-bold mb-2 lg:mb-6">
                      {item?.name}
                    </h2>
                  )}
                  {item?.buttonText && (
                    <button className="bg-primary px-5 py-2 lg:px-10 lg:py-4 lg:text-xl font-bold text-white rounded-xl">
                      {item?.buttonText}
                    </button>
                  )}
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="custom-pagination flex justify-center space-x-2 absolute bottom-5 z-10 left-1/2"></div>
    </section>
  );
};

export default Banner;
