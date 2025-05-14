import { useAddCompareMutation } from "@/redux/services/compare/compareApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, List, Typography } from "antd";
import Image from "next/image";
import { toast } from "sonner";

const { Title } = Typography;

const CompareCreate = ({
  searchBar1Ref,
  selectedProducts,
  handleSearch1,
  handleClear1,
  searchQuery1,
  filteredProducts1,
  handleProductSelect1,
  globalData,
  user,
  deviceId,
  searchBar2Ref,
  handleProductSelect2,
  handleClear2,
  searchQuery2,
  handleSearch2,
  filteredProducts2,
}) => {
  const [addCompare] = useAddCompareMutation();

  const addToCompare = async () => {
    if (selectedProducts.filter((product) => product !== null).length !== 2) {
      toast.error("Please select exactly two products to compare.");
      return;
    }

    const data = {
      ...(user?._id ? { user: user._id } : { deviceId }),
      product: selectedProducts.map((product) => product?._id).filter(Boolean),
    };

    const toastId = toast.loading("Adding to Compare...");

    try {
      const res = await addCompare(data);
      if (res?.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res?.data?.success) {
        toast.success(res.data.message, { id: toastId });
      }
    } catch (error) {
      console.error("Failed to add item to Compare:", error);
      toast.error("Failed to add item to Compare.", { id: toastId });
    }
  };

  return (
    <div className="lg:w-[600px] mx-auto p-4 bg-white rounded-xl shadow-lg">
      <Title level={2} className="text-center text-primary">
        Select Products to Compare
      </Title>

      <div className="relative mb-4 mt-10" ref={searchBar1Ref}>
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
          <List
            dataSource={filteredProducts1}
            renderItem={(product) => (
              <List.Item
                key={product._id}
                className="cursor-pointer hover:bg-gray-100 rounded-md border-b border-b-gray-20"
                onClick={() => handleProductSelect1(product)}
              >
                <div className="flex items-center gap-4 hover:text-primary duration-300 p-2">
                  <Image
                    src={formatImagePath(product?.mainImage)}
                    alt="product"
                    width={80}
                    height={50}
                    className="object-cover rounded-xl"
                  />
                  <div>
                    <p className="text-lg font-medium">{product?.name}</p>
                    <p className="flex items-center gap-4">
                      Price:{" "}
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
                          (product?.offerPrice || product?.sellingPrice)}
                      </span>
                    </p>
                    <p>Category: {product?.category?.name}</p>
                  </div>
                </div>
              </List.Item>
            )}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              maxHeight: "200px",
              overflowY: "scroll",
              backgroundColor: "white",
              zIndex: 10,
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
        )}
      </div>

      <div className="relative mb-4" ref={searchBar2Ref}>
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
          <List
            dataSource={filteredProducts2}
            renderItem={(product) => (
              <List.Item
                key={product._id}
                className="cursor-pointer hover:bg-gray-100 rounded-md border-b border-b-gray-20"
                onClick={() => handleProductSelect2(product)}
              >
                <div className="flex items-center gap-4 hover:text-primary duration-300 p-2">
                  <Image
                    src={formatImagePath(product?.mainImage)}
                    alt="product"
                    width={80}
                    height={50}
                    className="object-cover rounded-xl"
                  />
                  <div>
                    <p className="text-lg font-medium">{product?.name}</p>
                    <p className="flex items-center gap-2">
                      Price:{" "}
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
                          (product?.offerPrice || product?.sellingPrice)}
                      </span>
                    </p>
                    <p>Category: {product?.category?.name}</p>
                  </div>
                </div>
              </List.Item>
            )}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              maxHeight: "200px",
              overflowY: "scroll",
              backgroundColor: "white",
              zIndex: 10,
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
        )}
      </div>

      <Button
        type="primary"
        className="w-full !text-primaryLight py-5 text-lg"
        onClick={addToCompare}
        disabled={
          selectedProducts.filter((product) => product !== null).length !== 2
        }
      >
        Add to Compare
      </Button>
    </div>
  );
};

export default CompareCreate;
