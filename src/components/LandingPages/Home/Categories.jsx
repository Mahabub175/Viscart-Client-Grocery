"use client";

import LinkButton from "@/components/Shared/LinkButton";
import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import Image from "next/image";

const Categories = () => {
  const { data: categories } = useGetAllCategoriesQuery();

  const activeCategories = categories?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  return (
    <section className="new-container mt-10 relative">
      <h2 className="text-lg lg:text-3xl font-medium text-center lg:text-start">
        Category
      </h2>
      <div className="grid grid-cols-2 md:flex md:flex-wrap gap-x-5 gap-y-14 justify-center xxl:justify-start mt-10">
        {activeCategories?.map((item) => (
          <div
            className="group relative w-[160px] h-[160px] rounded-xl bg-[#E5F3F3] p-3 border-2 border-transparent hover:border-primary duration-300"
            key={item?._id}
          >
            <LinkButton href={`/products?filter=${item?.name}`}>
              <div className="overflow-hidden w-full h-full rounded-xl">
                <Image
                  src={
                    item?.attachment ??
                    "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
                  }
                  alt={item?.name ?? "demo"}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover rounded-xl"
                />
                <h2 className="text-sm font-medium mt-4">{item?.name}</h2>
              </div>
            </LinkButton>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
