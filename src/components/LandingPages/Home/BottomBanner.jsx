"use client";

import Image from "next/image";
import "swiper/css";
import { useGetAllSlidersQuery } from "@/redux/services/slider/sliderApi";
import Link from "next/link";

const BottomBanner = () => {
  const { data: sliders } = useGetAllSlidersQuery();

  const activeBanner = sliders?.results?.find(
    (item) => item.status === "Active" && item?.bottomBanner
  );

  if (!activeBanner) {
    return null;
  }

  return (
    <section className="relative mt-10 lg:mt-20">
      <Link
        href={
          activeBanner?.name
            ? activeBanner.name
            : activeBanner?.category?.name
            ? `/products?filter=${activeBanner.category.name}`
            : "/"
        }
        key={activeBanner?._id}
      >
        <Image
          src={
            activeBanner?.attachment ??
            "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
          }
          alt={activeBanner.name}
          width={2500}
          height={600}
          className="h-[200px] lg:h-fit w-full"
        />
      </Link>
    </section>
  );
};

export default BottomBanner;
