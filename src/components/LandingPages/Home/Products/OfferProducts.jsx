"use client";

import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import ProductCard from "./ProductCard";
import Link from "next/link";

const OfferProducts = () => {
  const { data: productData } = useGetAllProductsQuery();

  const activeProducts = productData?.results
    ?.filter(
      (item) =>
        (item?.status !== "Inactive" && item?.offerPrice) ||
        item?.offerPrice > 0
    )
    ?.slice(0, 10);

  return (
    <section className="relative mt-10 bg-[#EB494933] py-10">
      <div className="new-container ">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg lg:text-3xl font-medium text-center lg:text-start">
            Offer Products
          </h2>
          <Link
            href={`/offers`}
            className="text-black hover:text-primary duration-300 font-semibold"
          >
            Show All
          </Link>
        </div>
        {activeProducts?.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-5">
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
      </div>
    </section>
  );
};

export default OfferProducts;
