"use client";

import QuickProductView from "@/components/Shared/Product/QuickProductView";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import {
  useDeleteCompareMutation,
  useDeleteCompareProductMutation,
  useGetSingleCompareByUserQuery,
  useUpdateCompareMutation,
} from "@/redux/services/compare/compareApi";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import {
  useGetAllProductsQuery,
  useGetSingleProductBySlugQuery,
} from "@/redux/services/product/productApi";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import CompareCreate from "./CompareCreate";
import CompareTable from "./CompareTable";

const CompareList = () => {
  const [productId, setProductId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);
  const { data: globalData, isLoading: isGlobalDataLoading } =
    useGetAllGlobalSettingQuery();
  const { data: compareData, isLoading: isCompareDataLoading } =
    useGetSingleCompareByUserQuery(user?._id ?? deviceId);
  const { data: productData, isLoading: isProductDataLoading } =
    useGetSingleProductBySlugQuery(productId, {
      skip: !productId,
    });
  const [deleteCompare] = useDeleteCompareMutation();
  const [deleteCompareProduct] = useDeleteCompareProductMutation();
  const [updateCompare] = useUpdateCompareMutation();

  const { data: products } = useGetAllProductsQuery();

  const activeProducts = products?.results?.filter(
    (item) => item?.status !== "Inactive"
  );

  const [selectedProducts, setSelectedProducts] = useState([null, null]);
  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const searchBar1Ref = useRef(null);
  const searchBar2Ref = useRef(null);

  const handleSearch1 = (query) => {
    setSearchQuery1(query);
  };

  const handleSearch2 = (query) => {
    setSearchQuery2(query);
  };

  const filteredProducts1 = activeProducts?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery1.toLowerCase()) &&
      product._id !== selectedProducts[1]?._id
  );

  const filteredProducts2 = activeProducts?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery2.toLowerCase()) &&
      product._id !== selectedProducts[0]?._id
  );

  const handleProductSelect1 = (product) => {
    setSelectedProducts((prev) => {
      const newSelectedProducts = [...prev];
      newSelectedProducts[0] = product;

      if (compareData?.[0]?._id && compareData[0]?.product?.length > 0) {
        updateCompareProduct({
          productIds: [
            newSelectedProducts[0]?._id,
            newSelectedProducts[1]?._id,
          ].filter(Boolean),
        });
      }

      return newSelectedProducts;
    });
    setSearchQuery1("");
  };

  const handleProductSelect2 = (product) => {
    setSelectedProducts((prev) => {
      const newSelectedProducts = [...prev];
      newSelectedProducts[1] = product;

      if (compareData?.[0]?._id && compareData[0]?.product?.length > 0) {
        updateCompareProduct({
          productIds: [
            newSelectedProducts[0]?._id,
            newSelectedProducts[1]?._id,
          ].filter(Boolean),
        });
      }

      return newSelectedProducts;
    });
    setSearchQuery2("");
  };

  if (isGlobalDataLoading || isCompareDataLoading || isProductDataLoading) {
    return (
      <section className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </section>
    );
  }

  const showModal = (id) => {
    setProductId(id);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (itemId) => {
    deleteCompare(itemId);
    toast.success("Products deleted from compare list");
  };

  const handleDeleteProduct = (itemId) => {
    const data = {
      id: compareData?.[0]?._id,
      data: {
        product: itemId,
      },
    };
    deleteCompareProduct(data);
    toast.success("Product deleted from compare list");
  };

  const updateCompareProduct = async ({ productIds }) => {
    if (!compareData?.[0]?._id) {
      return;
    }
    const toastId = toast.loading("Updating Compare...");
    try {
      const submittedData = {
        product: productIds,
      };

      const updatedData = {
        id: compareData?.[0]?._id,
        data: submittedData,
      };

      const res = await updateCompare(updatedData);

      if (res?.error) {
        toast.error(res.error.data.errorMessage, { id: toastId });
        return;
      }

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating compare:", error);
      toast.error("An error occurred while updating the compare.", {
        id: toastId,
      });
    }
  };

  const handleClear1 = () => {
    setSelectedProducts((prev) => {
      const newSelectedProducts = [...prev];
      newSelectedProducts[0] = null;
      setSearchQuery1("");
      return newSelectedProducts;
    });

    if (compareData?.[0]?._id && compareData[0]?.product?.length > 0) {
      updateCompareProduct({ productIds: [null, selectedProducts[1]?._id] });
    }
  };

  const handleClear2 = () => {
    setSelectedProducts((prev) => {
      const newSelectedProducts = [...prev];
      newSelectedProducts[1] = null;
      setSearchQuery2("");
      return newSelectedProducts;
    });

    if (compareData?.[0]?._id && compareData[0]?.product?.length > 0) {
      updateCompareProduct({ productIds: [selectedProducts[0]?._id, null] });
    }
  };

  return (
    <section className="my-container p-5 rounded-xl mt-10 relative my-20">
      {compareData?.[0]?.product?.length === 0 || compareData?.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-5">
          <CompareCreate
            selectedProducts={selectedProducts}
            globalData={globalData}
            user={user}
            deviceId={deviceId}
            searchBar1Ref={searchBar1Ref}
            searchBar2Ref={searchBar2Ref}
            handleSearch1={handleSearch1}
            handleSearch2={handleSearch2}
            handleClear1={handleClear1}
            handleClear2={handleClear2}
            searchQuery1={searchQuery1}
            searchQuery2={searchQuery2}
            filteredProducts1={filteredProducts1}
            filteredProducts2={filteredProducts2}
            handleProductSelect1={handleProductSelect1}
            handleProductSelect2={handleProductSelect2}
          />
        </div>
      ) : (
        <CompareTable
          compareData={compareData}
          handleDelete={handleDelete}
          selectedProducts={selectedProducts}
          searchBar1Ref={searchBar1Ref}
          searchBar2Ref={searchBar2Ref}
          handleSearch1={handleSearch1}
          handleSearch2={handleSearch2}
          handleClear1={handleClear1}
          handleClear2={handleClear2}
          searchQuery1={searchQuery1}
          searchQuery2={searchQuery2}
          filteredProducts1={filteredProducts1}
          filteredProducts2={filteredProducts2}
          handleProductSelect1={handleProductSelect1}
          handleProductSelect2={handleProductSelect2}
          globalData={globalData}
          handleDeleteProduct={handleDeleteProduct}
          showModal={showModal}
        />
      )}

      <QuickProductView
        item={productData}
        isModalVisible={isModalVisible}
        handleModalClose={handleModalClose}
      />
    </section>
  );
};

export default CompareList;
