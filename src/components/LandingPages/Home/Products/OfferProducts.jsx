"use client";

import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";

const OfferProducts = () => {
  const swiperRef = useRef();
  const { data: productData } = useGetAllProductsQuery();

  const activeProducts = productData?.results
    ?.filter(
      (item) =>
        (item?.status !== "Inactive" && item?.offerPrice) ||
        item?.offerPrice > 0
    )
    ?.slice(0, 10);

  return (
    <section className="mt-10 bg-[#EB494933] py-10">
      <div className="new-container relative">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg lg:text-3xl font-medium text-center lg:text-start">
            Offer Products
          </h2>
          <Link
            href={`/offers`}
            className="text-black hover:text-primary duration-300 font-semibold"
          >
            Show All
          </Link>
        </div>
        {activeProducts?.length > 0 ? (
          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={10}
            slidesPerView={2}
            breakpoints={{
              480: { slidesPerView: 2 },
              500: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
              1480: { slidesPerView: 5 },
              1680: { slidesPerView: 6 },
            }}
            navigation
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="mySwiper"
          >
            {activeProducts?.map((product) => (
              <SwiperSlide key={product?._id}>
                <ProductCard item={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center text-xl font-semibold my-10">
            No products found.
          </div>
        )}
        <div className="flex items-center justify-center gap-5 mt-10">
          <button
            className="lg:w-10 lg:h-10 flex z-10 items-center justify-center rounded-full bg-white text-black border border-primary hover:bg-primary hover:text-white duration-300 absolute top-[45%] left-0 lg:left-8 xxl:-left-5"
            onClick={() => swiperRef.current.slidePrev()}
          >
            <FaAngleLeft className="text-2xl" />
          </button>
          <button
            className="lg:w-10 lg:h-10 z-10 flex items-center justify-center rounded-full bg-white text-black border border-primary hover:bg-primary hover:text-white duration-300 absolute top-[45%] right-0 lg:right-8 xxl:-right-5"
            onClick={() => swiperRef.current.slideNext()}
          >
            <FaAngleRight className="text-2xl" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default OfferProducts;
