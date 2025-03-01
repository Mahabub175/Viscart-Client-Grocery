"use client";

import { useGetAllBrandsQuery } from "@/redux/services/brand/brandApi";
import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import LinkButton from "./LinkButton";
import Image from "next/image";
import { AiFillProduct } from "react-icons/ai";

const MobileCategories = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: brands } = useGetAllBrandsQuery();

  const activeBrands = brands?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  const { data: categories } = useGetAllCategoriesQuery();

  const activeCategories = categories?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <section className="lg:hidden">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggle}
        ></div>
      )}

      <div className="fixed bottom-[15%] right-1 z-40">
        <div
          onClick={toggle}
          className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center text-xl cursor-pointer"
        >
          <AiFillProduct />
        </div>

        {isOpen && (
          <div className="absolute bottom-8 right-0 lg:right-20 w-[370px] p-4 bg-white shadow-lg rounded-lg text-black z-50">
            <div className="flex justify-between">
              <div></div>
              <button
                className="mt-1 bg-gray-200 hover:scale-110 duration-500 rounded-full p-1"
                onClick={toggle}
              >
                <RxCross1 className="text-xl text-gray-700" />
              </button>
            </div>
            <div className="overflow-y-auto h-[400px] xxl:h-[600px] px-2">
              <div>Categories</div>
              <div className="flex flex-wrap gap-x-5 gap-y-14 justify-center mt-2">
                {activeCategories?.map((item) => (
                  <div
                    className="group relative w-[60px] h-[60px] rounded-xl bg-[#E5F3F3] p-1 border-2 border-transparent hover:border-primary duration-300"
                    key={item?._id}
                  >
                    <LinkButton href={`/products?filter=${item?.name}`}>
                      <div
                        className="overflow-hidden w-full h-full rounded-xl"
                        onClick={toggle}
                      >
                        <Image
                          src={
                            item?.attachment ??
                            "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
                          }
                          alt={item?.name ?? "demo"}
                          width={60}
                          height={60}
                          className="object-cover rounded-xl w-[50px] h-[50px] mx-auto"
                        />
                        <h2 className="text-[10px] font-medium mt-2">
                          {item?.name}
                        </h2>
                      </div>
                    </LinkButton>
                  </div>
                ))}
              </div>
              <div className="mt-10">Brands</div>
              <div className="flex flex-wrap gap-x-5 gap-y-14 justify-center mt-2">
                {activeBrands?.map((item) => (
                  <div
                    className="group relative w-[60px] h-[60px] rounded-xl bg-[#E5F3F3] p-1 border-2 border-transparent hover:border-primary duration-300"
                    key={item?._id}
                  >
                    <LinkButton href={`/products?filter=${item?.name}`}>
                      <div
                        className="overflow-hidden w-full h-full rounded-xl"
                        onClick={toggle}
                      >
                        <Image
                          src={
                            item?.attachment ??
                            "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
                          }
                          alt={item?.name ?? "demo"}
                          width={60}
                          height={60}
                          className="object-cover rounded-xl w-[50px] h-[50px] mx-auto"
                        />
                        <h2 className="text-[10px] font-medium mt-2">
                          {item?.name}
                        </h2>
                      </div>
                    </LinkButton>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MobileCategories;
