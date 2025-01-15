"use client";

import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import ProductCard from "./ProductCard";
import Link from "next/link";

const PopularProducts = () => {
  const { data: productData } = useGetAllProductsQuery();

  const activeProducts = productData?.results
    ?.filter((item) => item?.status !== "Inactive")
    ?.sort((a, b) => (b?.ratings?.average || 0) - (a?.ratings?.average || 0))
    ?.slice(0, 8);

  return (
    <section className="new-container relative mt-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg lg:text-3xl font-medium text-center lg:text-start">
          Best Selling Products
        </h2>
        <Link
          href={`/products`}
          className="text-black hover:text-primary duration-300 font-semibold"
        >
          Show All
        </Link>
      </div>
      {activeProducts?.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap justify-center xxl:justify-start gap-5">
          {activeProducts?.map((product) => (
            <div key={product?._id}>
              <ProductCard item={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-xl font-semibold my-10">
          No products found.
        </div>
      )}
    </section>
  );
};

export default PopularProducts;
