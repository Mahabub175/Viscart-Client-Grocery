"use client";

import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import ProductCard from "../Home/Products/ProductCard";
import { Spin } from "antd";
import { useState, useEffect } from "react";

const AllOffers = () => {
  const { data: productData, isLoading: isFetching } = useGetAllProductsQuery();

  const [loading, setLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!productData?.results) return;

    setLoading(true);

    const timer = setTimeout(() => {
      const offers = productData.results.filter(
        (item) =>
          item?.status !== "Inactive" &&
          (item?.offerPrice || item?.offerPrice > 0)
      );
      setFilteredProducts(offers);
      setVisibleProducts(offers.slice(0, 35));
      setHasMore(offers.length > 35);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [productData]);

  const loadMoreProducts = () => {
    if (filteredProducts.length > visibleProducts.length) {
      setVisibleProducts((prevVisibleProducts) => {
        const nextVisibleProducts = [
          ...prevVisibleProducts,
          ...filteredProducts.slice(
            prevVisibleProducts.length,
            prevVisibleProducts.length + 21
          ),
        ];
        return nextVisibleProducts;
      });
    } else {
      setHasMore(false);
    }
  };

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && hasMore) {
      loadMoreProducts();
    }
  };

  return (
    <section className="my-container relative border p-2 rounded-xl mt-5">
      <h2 className="my-5 lg:mb-10 text-3xl font-bold text-center">
        Offer Products
      </h2>
      {loading || isFetching ? (
        <div className="flex justify-center items-center h-32">
          <Spin size="large" />
        </div>
      ) : visibleProducts?.length > 0 ? (
        <>
          <div
            style={{ maxHeight: "80vh", overflowY: "auto" }}
            onScroll={handleScroll}
            className="overflow-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap lg:justify-center lg:items-center gap-5 mt-5 pb-5">
              {visibleProducts?.map((product) => (
                <div key={product?._id}>
                  <ProductCard item={product} />
                </div>
              ))}
            </div>
            {hasMore && !loading && (
              <div className="text-center py-4">
                <Spin size="large" />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center text-xl font-semibold my-10">
          No offer products found.
        </div>
      )}
    </section>
  );
};

export default AllOffers;
