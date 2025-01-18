"use client";

import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import ProductCard from "./ProductCard";
import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import Link from "next/link";
import { useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";

const TopProducts = () => {
  const swiperRef = useRef();
  const { data: productData } = useGetAllProductsQuery();
  const { data: categories } = useGetAllCategoriesQuery();

  const activeProducts = productData?.results
    ?.filter((item) => item?.status !== "Inactive")
    ?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));

  const activeCategories = categories?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  const categoryProductMap = activeCategories
    ?.map((category) => {
      const productsInCategory = activeProducts?.filter(
        (product) => product?.category?._id === category?._id
      );
      return {
        category,
        products: productsInCategory,
        count: productsInCategory?.length || 0,
      };
    })
    ?.filter((category) => category.count > 0);

  const sortedCategories = categoryProductMap?.sort(
    (a, b) => b.count - a.count
  );

  return (
    <section>
      {sortedCategories?.length > 0
        ? sortedCategories
            ?.slice(0, 7)
            ?.map(({ category, products }, index) => (
              <div
                key={category?._id}
                className={`py-10 ${
                  index % 2 === 0 ? "bg-[#ffffff]" : "bg-[#013D341A]"
                }`}
              >
                <div className="new-container relative">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg lg:text-3xl font-medium">
                      {category?.name}
                    </h2>
                    <Link
                      href={`/products?filter=${category?.name}`}
                      className="hover:text-primary duration-300 font-semibold text-sm lg:text-base"
                    >
                      Show All
                    </Link>
                  </div>
                  {products?.length > 0 ? (
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
                      {products?.map((product) => (
                        <SwiperSlide key={product?._id}>
                          <ProductCard item={product} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <p className="text-center text-sm text-gray-500">
                      No products available in this category.
                    </p>
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
              </div>
            ))
        : null}
    </section>
  );
};

export default TopProducts;
