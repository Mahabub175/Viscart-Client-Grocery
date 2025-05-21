import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { Input } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const ProductSearchBar = ({ products, globalData, isMobile }) => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (value) => {
    setSearchValue(value);
    if (!value) {
      setFilteredOptions([]);
      return;
    }

    const results =
      Array.isArray(products?.results) &&
      products?.results
        ?.filter(
          (product) =>
            product?.name?.toLowerCase().includes(value.toLowerCase()) ||
            product?.category?.name?.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 15);

    setFilteredOptions(results || []);
  };
  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 150);
  };

  return (
    <div
      className={`${isMobile && "hidden lg:block"} ${
        !isMobile && "lg:hidden"
      } w-full`}
    >
      <div className="relative w-full">
        <Input
          type="text"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder="Search for Products..."
          className="w-full rounded-lg"
          size="large"
        />
        <div className="absolute right-[1px] top-1/2 -translate-y-1/2 bg-primary p-[9.5px] rounded-r">
          <FaSearch className="text-white text-xl" />
        </div>

        {/* Search Results */}
        {isFocused && searchValue && filteredOptions.length > 0 && (
          <div className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg w-full mt-2 max-h-[25rem] lg:max-h-[35rem] overflow-y-auto">
            {filteredOptions?.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product?.slug}`}
                className="flex items-center gap-4 hover:text-primary duration-300 p-4 border-b border-b-gray-200"
              >
                <Image
                  src={
                    formatImagePath(product?.mainImage) ??
                    "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
                  }
                  alt="product"
                  width={80}
                  height={50}
                  className="object-cover rounded-xl"
                />
                <div>
                  <p className="text-lg font-medium">{product?.name}</p>
                  <p className="flex items-center gap-4">
                    Price:{" "}
                    {product?.offerPrice > 0 && (
                      <span className="text-xs lg:text-sm line-through text-red-500">
                        {globalData?.results?.currency +
                          " " +
                          product?.sellingPrice}
                      </span>
                    )}
                    <span className="text-xs lg:text-sm">
                      {globalData?.results?.currency +
                        " " +
                        (product?.offerPrice > 0
                          ? product?.offerPrice
                          : product?.sellingPrice)}
                    </span>
                  </p>
                  <p>Category: {product?.category?.name}</p>
                </div>
              </Link>
            ))}

            {filteredOptions.length >= 10 && (
              <Link
                href="/products"
                className="block text-center text-primary py-2 hover:bg-gray-100"
              >
                View All
              </Link>
            )}
          </div>
        )}

        {isFocused && searchValue && filteredOptions?.length === 0 && (
          <div className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg w-full mt-2 p-4 text-gray-500">
            No products found
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearchBar;
