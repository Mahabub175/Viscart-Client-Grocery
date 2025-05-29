"use client";

import LinkButton from "@/components/Shared/LinkButton";
import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import { setFilter } from "@/redux/services/device/deviceSlice";
import Image from "next/image";
import { useDispatch } from "react-redux";

const Categories = () => {
  const dispatch = useDispatch();

  const { data: categories } = useGetAllCategoriesQuery();

  const activeCategories = categories?.results?.filter(
    (item) => item?.status !== "Inactive" && item?.isFeatured
  );

  const itemClickHandler = (item) => {
    if (item?.name) {
      dispatch(setFilter(item?.name));
    }
  };

  return (
    <section className="new-container mt-10 relative">
      <h2 className="text-lg lg:text-3xl font-medium text-center lg:text-start">
        Featured Categories
      </h2>
      <div className="grid grid-cols-2 md:flex md:flex-wrap gap-x-5 gap-y-14 justify-center mt-10">
        {activeCategories?.length === 0 ? (
          <div className="w-full text-center text-lg font-medium text-gray-600">
            No Featured categories available at the moment.
          </div>
        ) : (
          activeCategories?.map((item) => (
            <div
              key={item?._id}
              className="group relative w-[160px] h-[145px] mx-auto rounded-xl"
            >
              <div className="bg-[#E5F3F3] rounded-xl p-2 border-2 border-transparent hover:border-primary duration-300">
                <LinkButton href={`/products`}>
                  <div className="overflow-hidden w-full h-full rounded-xl">
                    <Image
                      src={
                        item?.attachment ??
                        "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
                      }
                      alt={item?.name ?? "demo"}
                      width={160}
                      height={160}
                      className="w-[120px] h-[120px] object-contain rounded-xl mx-auto"
                      priority
                      onClick={() => itemClickHandler(item)}
                    />
                  </div>
                </LinkButton>
              </div>
              <h2 className="text-sm font-medium text-center mt-2">
                {item?.name}
              </h2>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Categories;
