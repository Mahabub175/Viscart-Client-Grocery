"use client";

import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import ProductCard from "./ProductCard";
import Link from "next/link";

const FeaturedProducts = () => {
  const { data: productData } = useGetAllProductsQuery();

  const activeProducts = productData?.results
    ?.filter((item) => item?.status !== "Inactive" && item?.isFeatured)
    ?.slice(0, 12);

  return (
    <section className="my-container relative mt-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg lg:text-3xl font-medium text-center lg:text-start">
          Top Selling Products
        </h2>
        <Link
          href={`/products`}
          className="text-black border-b border-primary font-semibold"
        >
          Show All
        </Link>
      </div>
      {activeProducts?.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap gap-10">
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

export default FeaturedProducts;
