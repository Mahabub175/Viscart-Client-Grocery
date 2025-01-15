"use client";

import { useGetAllBrandsQuery } from "@/redux/services/brand/brandApi";
import { useGetAllCategoriesQuery } from "@/redux/services/category/categoryApi";
import { useGetProductsQuery } from "@/redux/services/product/productApi";
import {
  Pagination,
  Slider,
  Checkbox,
  Select,
  Button,
  Modal,
  Radio,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { paginationNumbers } from "@/assets/data/paginationData";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import ProductCard from "../Home/Products/ProductCard";
import { debounce } from "lodash";

const { Option } = Select;

const AllProducts = ({ searchParams }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(18);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sorting, setSorting] = useState("");
  const [filterModal, setFilterModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [availability, setAvailability] = useState("inStock");

  const { data: globalData } = useGetAllGlobalSettingQuery();
  const { data: brandData } = useGetAllBrandsQuery();
  const { data: categoryData } = useGetAllCategoriesQuery();
  const { data: productData } = useGetProductsQuery({
    page: currentPage,
    limit: pageSize,
    search: "",
  });

  const activeBrands = useMemo(
    () => brandData?.results?.filter((item) => item?.status !== "Inactive"),
    [brandData]
  );

  const activeCategories = useMemo(
    () => categoryData?.results?.filter((item) => item?.status !== "Inactive"),
    [categoryData]
  );

  const activeProducts = useMemo(
    () => productData?.results?.filter((item) => item?.status !== "Inactive"),
    [productData]
  );

  const debouncedSetSearchFilter = useMemo(
    () => debounce((value) => setSearchFilter(value?.toLowerCase()), 300),
    []
  );

  useEffect(() => {
    if (searchParams) {
      debouncedSetSearchFilter(searchParams);
    } else {
      setSelectedBrands([]);
      setSelectedCategories([]);
      setPriceRange([0, 10000]);
      setSorting("");
    }
    return () => debouncedSetSearchFilter.cancel();
  }, [searchParams, debouncedSetSearchFilter]);

  useEffect(() => {
    if (searchFilter) {
      const matchedBrands = activeBrands
        ?.filter((brand) => brand?.name?.toLowerCase().includes(searchFilter))
        .map((brand) => brand.name);
      const matchedCategories = activeCategories
        ?.filter((category) =>
          category?.name?.toLowerCase().includes(searchFilter)
        )
        .map((category) => category.name);

      setSelectedBrands(matchedBrands || []);
      setSelectedCategories(matchedCategories || []);
    }
  }, [searchFilter, activeBrands, activeCategories]);

  const filteredProducts = useMemo(() => {
    const filtered = activeProducts?.filter((product) => {
      const isBrandMatch = selectedBrands.length
        ? selectedBrands.includes(product?.brand?.name)
        : true;
      const isCategoryMatch = selectedCategories.length
        ? selectedCategories.includes(product?.category?.name)
        : true;
      const isPriceMatch =
        product.sellingPrice >= priceRange[0] &&
        product.sellingPrice <= priceRange[1];
      const isAvailabilityMatch =
        availability === "inStock"
          ? product.stock > 0
          : availability === "outOfStock"
          ? product.stock === 0
          : true;
      const isGenericMatch = searchFilter
        ? product?.generic?.name?.toLowerCase().includes(searchFilter)
        : true;

      return (
        isBrandMatch &&
        isCategoryMatch &&
        isPriceMatch &&
        isAvailabilityMatch &&
        isGenericMatch
      );
    });

    if (sorting === "PriceLowToHigh") {
      return filtered?.sort((a, b) => a.sellingPrice - b.sellingPrice);
    }
    if (sorting === "PriceHighToLow") {
      return filtered?.sort((a, b) => b.sellingPrice - a.sellingPrice);
    }
    return filtered;
  }, [
    activeProducts,
    selectedBrands,
    selectedCategories,
    priceRange,
    sorting,
    availability,
    searchFilter,
  ]);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleBrandChange = (checkedValues) => {
    setSelectedBrands(checkedValues);
  };

  const handleCategoryChange = (checkedValues) => {
    setSelectedCategories(checkedValues);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handleSortingChange = (value) => {
    setSorting(value);
  };

  const handleAvailabilityChange = (e) => {
    setAvailability(e.target.value);
  };

  return (
    <section className="py-10 relative -mt-5">
      <div className="xxl:px-32">
        <div className="bg-gray-200 flex items-center gap-2 justify-between py-3 px-2 lg:px-6 mb-6 rounded-xl">
          <p className="text-xs md:text-base">{searchParams || "Products"}</p>
          <Button type="primary" onClick={() => setFilterModal(true)}>
            Advance Filter
          </Button>
          <div className="flex items-center lg:w-1/4">
            <Select
              allowClear
              placeholder="Select Sorting"
              style={{ width: "100%" }}
              onChange={handleSortingChange}
            >
              <Option value="PriceLowToHigh">Price Low To High</Option>
              <Option value="PriceHighToLow">Price High To Low</Option>
            </Select>
          </div>
        </div>
        <div>
          {filteredProducts?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap justify-center gap-5">
              {filteredProducts?.map((product) => (
                <ProductCard key={product?._id} item={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-32 text-xl">
              No products found.
            </p>
          )}
          <Pagination
            className="flex justify-end items-center !mt-10"
            total={filteredProducts?.length}
            current={currentPage}
            onChange={handlePageChange}
            pageSize={pageSize}
            showSizeChanger
            pageSizeOptions={paginationNumbers}
            simple
          />
        </div>
      </div>
      <Modal
        open={filterModal}
        onCancel={() => setFilterModal(false)}
        footer={null}
        centered
      >
        <div className="w-full p-4">
          <h2 className="mb-4 text-lg font-semibold">Filter Products</h2>
          <div className="mb-6 border p-5 rounded-xl max-h-[500px] overflow-y-auto">
            <label className="block mb-2 font-semibold">Brands</label>
            <Checkbox.Group
              options={activeBrands?.map((brand) => ({
                label: brand.name,
                value: brand.name,
              }))}
              value={selectedBrands}
              onChange={handleBrandChange}
              className="flex flex-col gap-2"
            />
          </div>
          <div className="mb-6 border p-5 rounded-xl max-h-[500px] overflow-y-auto">
            <label className="block mb-2 font-semibold">Categories</label>
            <Checkbox.Group
              options={activeCategories?.map((category) => ({
                label: category.name,
                value: category.name,
              }))}
              value={selectedCategories}
              onChange={handleCategoryChange}
              className="flex flex-col gap-2"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-semibold">Price Range</label>
            <Slider
              range
              min={0}
              max={10000}
              defaultValue={[0, 10000]}
              value={priceRange}
              onChange={handlePriceChange}
              step={50}
              tooltip={{
                formatter: (value) =>
                  `${globalData?.results?.currency} ${value}`,
              }}
            />
            <div className="flex justify-between mt-2 text-sm">
              <span>{globalData?.results?.currency + " " + priceRange[0]}</span>
              <span>{globalData?.results?.currency + " " + priceRange[1]}</span>
            </div>
          </div>
          <div className="mb-6 rounded-xl border p-5">
            <label className="block mb-2 font-semibold">Availability</label>
            <Radio.Group
              value={availability}
              onChange={handleAvailabilityChange}
              className="flex flex-col gap-2"
            >
              <Radio value="inStock">
                In Stock (
                {filteredProducts?.filter?.((item) => item?.stock > 0).length})
              </Radio>
              <Radio value="outOfStock">
                Out of Stock (
                {filteredProducts?.filter?.((item) => item?.stock < 0).length})
              </Radio>
            </Radio.Group>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default AllProducts;
