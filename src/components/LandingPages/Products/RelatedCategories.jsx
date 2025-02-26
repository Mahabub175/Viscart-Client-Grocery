import LinkButton from "@/components/Shared/LinkButton";
import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import Image from "next/image";
import React, { useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Navigation, Pagination } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";

const RelatedCategories = ({ searchParam }) => {
  const swiperRef = useRef();
  const { data } = useGetAllCategoriesQuery();
  const filteredData = data?.results?.find(
    (item) =>
      item?.status !== "Inactive" &&
      item?.name.toLowerCase() === searchParam.toLowerCase()
  );
  return (
    <div>
      <div className="new-container relative">
        <Swiper
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            480: { slidesPerView: 2 },
            500: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
            1480: { slidesPerView: 5 },
          }}
          navigation
          className="mySwiper"
        >
          {filteredData?.level === "parentCategory" &&
            filteredData?.categories?.map((item) => (
              <SwiperSlide
                key={item?._id}
                className="group relative w-[250px] h-[150px] mx-auto rounded-xl"
              >
                <div className="bg-[#E5F3F3] rounded-xl p-2 border-2 border-transparent hover:border-primary duration-300">
                  <LinkButton href={`/products?filter=${item?.name}`}>
                    <div className="overflow-hidden w-full h-full rounded-xl">
                      <Image
                        src={
                          formatImagePath(item?.attachment) ??
                          "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
                        }
                        alt={item?.name ?? "demo"}
                        width={160}
                        height={160}
                        className="w-[120px] h-[120px] object-contain rounded-xl mx-auto"
                      />
                    </div>
                  </LinkButton>
                </div>
                <h2 className="text-base font-medium text-center mt-2">
                  {item?.name}
                </h2>
              </SwiperSlide>
            ))}
          {filteredData?.level === "category" &&
            filteredData?.subCategories?.map((item) => (
              <SwiperSlide
                key={item?._id}
                className="group relative w-[250px] h-[150px] mx-auto rounded-xl"
              >
                <div className="bg-[#E5F3F3] rounded-xl p-2 border-2 border-transparent hover:border-primary duration-300">
                  <LinkButton href={`/products?filter=${item?.name}`}>
                    <div className="overflow-hidden w-full h-full rounded-xl">
                      <Image
                        src={
                          formatImagePath(item?.attachment) ??
                          "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
                        }
                        alt={item?.name ?? "demo"}
                        width={160}
                        height={160}
                        className="w-[120px] h-[120px] object-contain rounded-xl mx-auto"
                      />
                    </div>
                  </LinkButton>
                </div>
                <h2 className="text-base font-medium text-center mt-2">
                  {item?.name}
                </h2>
              </SwiperSlide>
            ))}
        </Swiper>
        <div className="flex items-center justify-center gap-5 mt-10">
          <button
            className="lg:w-10 lg:h-10 flex z-10 items-center justify-center rounded-full bg-white text-black border border-primary hover:bg-primary hover:text-white duration-300 absolute top-[25%] left-0 lg:left-8 xxl:left-0"
            onClick={() => swiperRef.current.slidePrev()}
          >
            <FaAngleLeft className="text-2xl" />
          </button>
          <button
            className="lg:w-10 lg:h-10 z-10 flex items-center justify-center rounded-full bg-white text-black border border-primary hover:bg-primary hover:text-white duration-300 absolute top-[25%] right-0 lg:right-8 xxl:right-0"
            onClick={() => swiperRef.current.slideNext()}
          >
            <FaAngleRight className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatedCategories;
