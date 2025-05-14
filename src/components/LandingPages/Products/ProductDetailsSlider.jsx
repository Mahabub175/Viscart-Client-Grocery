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
    <div className="w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto">
      <Swiper
        spaceBetween={10}
        navigation
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Navigation, Thumbs]}
        className="w-full h-[350px] md:h-[400px]"
      >
        {allMedia.map((media, index) => (
          <SwiperSlide key={index} className="flex justify-center items-center">
            <AntdImage
              src={media}
              alt={`Product image ${index}`}
              width={575}
              height={400}
              className="rounded-xl mx-auto h-[350px] lg:h-full object-cover"
              priority
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
        className="mt-4 w-full border-2 rounded-lg overflow-x-auto"
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
