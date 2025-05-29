import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import Image from "next/image";
import { Image as AntdImage } from "antd";

const ProductDetailsSlider = ({ allMedia }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <div className="w-full max-w-xs md:max-w-lg">
      <Swiper
        spaceBetween={10}
        navigation
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Navigation, Thumbs]}
        className="w-full h-full"
      >
        {allMedia.map((media, index) => (
          <SwiperSlide key={index} className="relative w-full h-full">
            <AntdImage
              src={media}
              alt={`Product image ${index}`}
              className="object-contain rounded-xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        breakpoints={{
          640: { slidesPerView: 4 },
          768: { slidesPerView: 5 },
        }}
        watchSlidesProgress
        modules={[Thumbs]}
        className="mt-4 border-2 rounded-lg overflow-x-auto"
      >
        {allMedia?.map((media, index) => (
          <SwiperSlide
            key={index}
            className="cursor-pointer flex justify-center p-2"
          >
            <Image
              src={media}
              alt={`Thumbnail ${index}`}
              width={80}
              height={80}
              className="rounded-md border-2 border-transparent hover:border-primary w-[80px] h-[60px] lg:h-[80px] object-cover mx-auto p-1"
              priority
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductDetailsSlider;
