"use client";

import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import ProductCard from "../Home/Products/ProductCard";
import { Pagination, Spin } from "antd";
import { useState, useMemo, useEffect } from "react";

const AllOffers = () => {
  const { data: productData, isLoading: isFetching } = useGetAllProductsQuery();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(28);
  const [loading, setLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

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
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [productData]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, pageSize]);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
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
      ) : paginatedProducts?.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap lg:justify-center lg:items-center gap-5 mt-5 pb-5">
            {paginatedProducts.map((product) => (
              <div key={product?._id}>
                <ProductCard item={product} />
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-10">
            <Pagination
              current={currentPage}
              total={filteredProducts?.length || 0}
              pageSize={pageSize}
              showSizeChanger
              pageSizeOptions={["10", "20", "50", "100"]}
              onChange={handlePageChange}
            />
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
