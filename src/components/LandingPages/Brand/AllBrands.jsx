"use client";

import { useGetAllBrandsQuery } from "@/redux/services/brand/brandApi";
import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const AllBrands = () => {
  const { data: brands } = useGetAllBrandsQuery();
  const { data: products } = useGetAllProductsQuery();

  const activeBrands = brands?.results?.filter(
    (item) => item?.status !== "Inactive"
  );
  const activeProducts = products?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  const brandsWithProducts = activeBrands?.map((brand) => ({
    ...brand,
    products: activeProducts?.filter(
      (product) => product?.brand?._id === brand?._id
    ),
  }));

  const alphabets = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  const sectionRefs = useRef({});

  const handleScroll = (alphabet) => {
    const targetSection = sectionRefs.current[alphabet];
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="new-container mt-5">
      <div className="flex justify-center flex-wrap mb-10 gap-2">
        {alphabets.map((alphabet) => (
          <button
            key={alphabet}
            className="px-3 py-1 border rounded hover:bg-gray-200"
            onClick={() => handleScroll(alphabet)}
          >
            {alphabet}
          </button>
        ))}
      </div>

      <div>
        {alphabets.map((alphabet) => {
          const brands = brandsWithProducts?.filter((brand) =>
            brand?.name?.startsWith(alphabet)
          );

          if (activeBrands?.length === 0) return null;

          return (
            <div
              key={alphabet}
              ref={(el) => (sectionRefs.current[alphabet] = el)}
              className="mb-8 border rounded-xl p-5"
            >
              <h2 className="text-xl lg:text-2xl font-medium mb-4">
                {alphabet}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brands.map((brand) => (
                  <Link
                    href={`/product?filter=${brand?.name}`}
                    key={brand._id}
                    className="p-4 border rounded-xl flex items-center gap-5"
                  >
                    <Image
                      src={brand.attachment}
                      alt={brand.name}
                      width={100}
                      height={100}
                      className="object-cover rounded-full border border-primary"
                    />
                    <div>
                      <h3 className="text-xl font-medium mb-2">{brand.name}</h3>
                      <div>{brand.products?.length} Products</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AllBrands;
