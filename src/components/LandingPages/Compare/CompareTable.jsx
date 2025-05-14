import { Button, Input, Rate } from "antd";
import Image from "next/image";
import { FaCartShopping } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import LinkButton from "@/components/Shared/LinkButton";
import { SearchOutlined } from "@ant-design/icons";

const CompareTable = ({
  compareData,
  handleDelete,
  searchBar1Ref,
  searchBar2Ref,
  selectedProducts,
  handleSearch1,
  handleClear1,
  searchQuery1,
  filteredProducts1,
  handleProductSelect1,
  handleSearch2,
  handleClear2,
  searchQuery2,
  filteredProducts2,
  handleProductSelect2,
  globalData,
  handleDeleteProduct,
  showModal,
}) => {
  return (
    <div>
      <div className="overflow-x-auto">
        <div
          className="text-sm px-4 py-1 rounded-xl cursor-pointer bg-red-500 text-primaryLight items-center gap-2 flex absolute right-[27%] lg:right-[33%] top-0 hover:scale-105 duration-300"
          onClick={() => handleDelete(compareData[0]?._id)}
        >
          <MdDelete />
          Clear Comparison
        </div>
        <table className="w-full table-auto items-start border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="p-4 text-left hidden lg:table-cell">
                <span className="">Product Comparison</span>
              </th>
              {compareData?.[0]?.product?.map((item, index) => (
                <th
                  key={item?._id}
                  className="border border-gray-300 p-4 text-center"
                >
                  <div className="relative mb-4 mt-10">
                    {/* First Search Bar */}
                    {index === 0 && (
                      <div ref={searchBar1Ref}>
                        <Input
                          prefix={<SearchOutlined />}
                          placeholder="Search and Select Product"
                          value={selectedProducts[0]?.name || searchQuery1}
                          onChange={(e) => handleSearch1(e.target.value)}
                          className="rounded-md"
                          allowClear
                          size="large"
                          onClear={handleClear1}
                        />
                        {searchQuery1 && (
                          <div className="absolute top-full left-0 w-full max-h-52 overflow-y-scroll bg-white z-10 rounded-lg shadow-lg">
                            {filteredProducts1?.map((product) => (
                              <div
                                key={product._id}
                                className="cursor-pointer hover:bg-gray-100 rounded-md border-b border-gray-200"
                                onClick={() => handleProductSelect1(product)}
                              >
                                <div className="flex flex-col lg:flex-row items-center gap-4 hover:text-primary duration-300 p-2">
                                  <Image
                                    src={formatImagePath(product?.mainImage)}
                                    alt="product"
                                    width={80}
                                    height={50}
                                    className="object-cover rounded-xl"
                                  />
                                  <div>
                                    <p className="text-sm lg:text-lg font-medium text-center lg:text-start">
                                      {product?.name}
                                    </p>
                                    <div className="flex flex-col items-center lg:items-start gap-1 my-2 lg:my-0">
                                      <div className="flex items-center gap-2">
                                        {product?.offerPrice && (
                                          <span className="text-xs line-through text-red-500">
                                            {globalData?.results?.currency +
                                              " " +
                                              product?.sellingPrice}
                                          </span>
                                        )}
                                        <span className="text-xs lg:text-sm">
                                          {globalData?.results?.currency +
                                            " " +
                                            (product?.offerPrice ||
                                              product?.sellingPrice)}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-500">
                                        Category: {product?.category?.name}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {/* Second Search Bar */}
                    {index === 1 && (
                      <div ref={searchBar2Ref}>
                        <Input
                          prefix={<SearchOutlined />}
                          placeholder="Search and Select Product"
                          value={selectedProducts[1]?.name || searchQuery2}
                          onChange={(e) => handleSearch2(e.target.value)}
                          className="rounded-md"
                          allowClear
                          size="large"
                          onClear={handleClear2}
                        />
                        {searchQuery2 && (
                          <div className="absolute top-full left-0 w-full max-h-52 overflow-y-scroll bg-white z-10 rounded-lg shadow-lg">
                            {filteredProducts2?.map((product) => (
                              <div
                                key={product._id}
                                className="cursor-pointer hover:bg-gray-100 rounded-md border-b border-gray-200"
                                onClick={() => handleProductSelect2(product)}
                              >
                                <div className="flex flex-col lg:flex-row items-center gap-4 hover:text-primary duration-300 p-2">
                                  <Image
                                    src={formatImagePath(product?.mainImage)}
                                    alt="product"
                                    width={80}
                                    height={50}
                                    className="object-cover rounded-xl"
                                  />
                                  <div>
                                    <p className="text-sm lg:text-lg font-medium text-center lg:text-start">
                                      {product?.name}
                                    </p>
                                    <div className="flex flex-col items-center lg:items-start gap-1 my-2 lg:my-0">
                                      <div className="flex items-center gap-2">
                                        {product?.offerPrice && (
                                          <span className="text-xs line-through text-red-500">
                                            {globalData?.results?.currency +
                                              " " +
                                              product?.sellingPrice}
                                          </span>
                                        )}
                                        <span className="text-xs lg:text-sm">
                                          {globalData?.results?.currency +
                                            " " +
                                            (product?.offerPrice ||
                                              product?.sellingPrice)}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-500">
                                        Category: {product?.category?.name}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <Image
                    src={formatImagePath(item?.mainImage)}
                    alt={item?.name || "Product Image"}
                    width={200}
                    height={200}
                    className="mx-auto rounded-md mb-4 w-[200px] h-[160px] object-cover"
                  />
                  <LinkButton href={`/products/${item?.slug}`}>
                    <span className="text-xs lg:text-base">
                      {item?.name || "Product Name"}
                    </span>
                  </LinkButton>
                  <div
                    className="text-2xl cursor-pointer text-red-500 flex justify-center mt-5 hover:scale-105 duration-300"
                    onClick={() => handleDeleteProduct(item?._id)}
                  >
                    <MdDelete />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-4 font-bold hidden lg:table-cell">
                Category
              </td>
              {compareData?.[0]?.product?.map((item) => (
                <td
                  key={item?._id}
                  className="border border-gray-300 p-4 text-center"
                >
                  <div className="lg:hidden bg-gray-500 px-5 py-1 rounded text-white mb-5 text-sm">
                    Category
                  </div>
                  {item?.category?.name || "N/A"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-300 p-4 font-bold hidden lg:table-cell">
                Brand
              </td>
              {compareData?.[0]?.product?.map((item) => (
                <td
                  key={item?._id}
                  className="border border-gray-300 p-4 text-center"
                >
                  <div className="lg:hidden bg-gray-500 px-5 py-1 rounded text-white mb-5 text-sm">
                    Brand
                  </div>
                  {item?.brand?.name || "N/A"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-300 p-4 font-bold hidden lg:table-cell">
                Model
              </td>
              {compareData?.[0]?.product?.map((item) => (
                <td
                  key={item?._id}
                  className="border border-gray-300 p-4 text-center"
                >
                  <div className="lg:hidden bg-gray-500 px-5 py-1 rounded text-white mb-5 text-sm">
                    Model
                  </div>
                  {item?.productModel || "N/A"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-300 p-4 font-bold hidden lg:table-cell">
                Price
              </td>
              {compareData?.[0]?.product?.map((item) => (
                <td
                  key={item?._id}
                  className="border border-gray-300 p-4 text-center"
                >
                  <div className="lg:hidden bg-gray-500 px-5 py-1 rounded text-white mb-5 text-sm">
                    Price
                  </div>
                  <span className="flex justify-center gap-4">
                    {item?.offerPrice && (
                      <p className="text-sm font-bold line-through text-red-500 ">
                        {globalData?.results?.currency +
                          " " +
                          item?.sellingPrice}
                      </p>
                    )}
                    {item?.offerPrice ? (
                      <p className="text-primary font-bold">
                        {globalData?.results?.currency + " " + item?.offerPrice}
                      </p>
                    ) : (
                      <p className="text-primary font-bold">
                        {globalData?.results?.currency +
                          " " +
                          item?.sellingPrice}
                      </p>
                    )}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-300 p-4 font-bold hidden lg:table-cell">
                Stock
              </td>
              {compareData?.[0]?.product?.map((item) => (
                <td
                  key={item?._id}
                  className={`border border-gray-300 p-4 text-center ${
                    item?.stock > 0
                      ? "text-green-500 font-bold"
                      : "text-red-500 font-bold"
                  }`}
                >
                  <div className="lg:hidden bg-gray-500 px-5 py-1 rounded text-white mb-5 text-sm">
                    Stock
                  </div>
                  {item?.stock > 0 ? "In Stock" : "Out of Stock"}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-300 p-4 font-bold hidden lg:table-cell">
                Rating
              </td>
              {compareData?.[0]?.product?.map((item) => (
                <td
                  key={item?._id}
                  className="border border-gray-300 p-4 text-center"
                >
                  <div className="lg:hidden bg-gray-500 px-5 py-1 rounded text-white mb-5 text-sm">
                    Rating
                  </div>
                  <div className="flex justify-center items-center lg:gap-4 font-medium">
                    <Rate
                      disabled
                      value={item?.ratings?.average}
                      allowHalf
                      className="text-[10px] lg:text-base"
                    />
                    ({item?.ratings?.count})
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-300 p-4 font-bold hidden lg:table-cell"></td>
              {compareData?.[0]?.product?.map((item) => (
                <td
                  key={item?._id}
                  className="border border-gray-300 p-4 text-center"
                >
                  <Button
                    size="small"
                    type="primary"
                    icon={<FaCartShopping />}
                    onClick={() => showModal(item?.slug)}
                    className="mb-2 lg:w-4/6 py-5 font-semibold"
                  >
                    Add to Cart
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareTable;
