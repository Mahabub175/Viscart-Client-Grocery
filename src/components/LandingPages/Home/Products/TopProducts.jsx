"use client";

import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from "./ProductCard";
import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import Link from "next/link";

const TopProducts = () => {
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
                <div className="new-container">
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
                    <div className="mt-5 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-5">
                      {products.map((product) => (
                        <div key={product?._id}>
                          <ProductCard item={product} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-sm text-gray-500">
                      No products available in this category.
                    </p>
                  )}
                </div>
              </div>
            ))
        : null}
    </section>
  );
};

export default TopProducts;
