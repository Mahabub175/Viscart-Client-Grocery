"use client";

import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import FileUploader from "@/components/Reusable/Form/FileUploader";
import {
  useBulkProductMutation,
  useGetAllProductsQuery,
  useImportProductMutation,
} from "@/redux/services/product/productApi";
import { Tabs } from "antd";
import { toast } from "sonner";
import { base_url_image } from "@/utilities/configs/base_api";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import { generateSKU } from "@/utilities/lib/generateSKU";

const ImportProduct = () => {
  // const token = useSelector((state) => state.auth.token);
  const araggaUrl = "https://scrapper.moonsgallerysystem.com/";
  const chaldalUrl =
    "https://komedeiscrapper.eddoktapos.xyz/api/scrape/?category=";

  const [importProduct, { isLoading }] = useImportProductMutation();
  const { data: productData } = useGetAllProductsQuery();

  const [bulkProduct, { isLoading: isBulkLoading }] = useBulkProductMutation();

  const handleUpload = async (values) => {
    const toastId = toast.loading("Uploading File...");

    const formData = new FormData();
    formData.append("file", values.file[0].originFileObj);

    const res = await importProduct(formData);
    try {
      if (res.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(res?.error?.data?.errorMessage, { id: toastId });
    }
  };

  const handleAraggaImport = async (values) => {
    const toastId = toast.loading("Fetching Data...");

    const apiUrl = `${araggaUrl}${values?.araggaCategory}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();

      if (!response.ok || !res.success) {
        throw new Error(res?.errorMessage || "Failed to fetch data");
      }

      toast.success("Data fetched successfully!", { id: toastId });

      const uniqueData = res?.data
        ?.map((item, index, self) => {
          const normalizedName = item.name.trim().toLowerCase();

          const isUniqueInData =
            index ===
            self.findIndex(
              (t) => t.name.trim().toLowerCase() === normalizedName
            );

          const existsInResults = productData?.results?.some(
            (result) => result.name.trim().toLowerCase() === normalizedName
          );

          const isDuplicateSku = productData?.results?.some(
            (result) => result.sku === item.sku
          );

          const generatedSku =
            isDuplicateSku || !item.sku ? generateSKU(item.name) : item.sku;

          return isUniqueInData && !existsInResults
            ? {
                ...item,
                sku: generatedSku,
              }
            : null;
        })
        .filter(Boolean);

      toast.loading("Uploading data...", { id: toastId });

      const bulkRes = await bulkProduct(uniqueData);
      if (bulkRes?.data?.error) {
        toast.error(bulkRes?.error?.data?.errorMessage, { id: toastId });
      }
      if (bulkRes?.data?.success) {
        toast.success(bulkRes?.data?.message, { id: toastId });
      }
    } catch (error) {
      console.error("Error importing data:", error);
      toast.error(error.message || "An unexpected error occurred", {
        id: toastId,
      });
    }
  };

  const handleChalDaalImport = async (values) => {
    const toastId = toast.loading("Fetching Data...");

    const apiUrl = `${chaldalUrl}${values?.chaldalCategory}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();

      if (res?.error) {
        toast.error("Failed to fetch data", {
          id: toastId,
        });
        return;
      }

      toast.success("Data fetched successfully!", { id: toastId });

      const uniqueData = res
        ?.map((item, index, self) => {
          const normalizedName = item.name.trim().toLowerCase();

          const isUniqueInData =
            index ===
            self.findIndex(
              (t) => t.name.trim().toLowerCase() === normalizedName
            );

          const existsInResults = productData?.results?.some(
            (result) => result.name.trim().toLowerCase() === normalizedName
          );

          const isDuplicateSku = productData?.results?.some(
            (result) => result.sku === item.sku
          );

          const generatedSku =
            isDuplicateSku || !item.sku ? generateSKU(item.name) : item.sku;

          const sellingPrice = Number(item.sellingPrice);
          const offerPrice = Number(item.offerPrice);
          const weight = Number(item.weight);

          return isUniqueInData && !existsInResults
            ? {
                ...item,
                sku: generatedSku,
                sellingPrice,
                offerPrice,
                weight,
              }
            : null;
        })
        .filter(Boolean);

      toast.loading("Uploading data...", { id: toastId });

      const bulkRes = await bulkProduct(uniqueData);
      if (bulkRes?.data?.error) {
        toast.error(bulkRes?.error?.data?.errorMessage, { id: toastId });
      }
      if (bulkRes?.data?.success) {
        toast.success(bulkRes?.data?.message, { id: toastId });
      }
    } catch (error) {
      console.error("Error importing data:", error);
      toast.error(error.message || "An unexpected error occurred", {
        id: toastId,
      });
    }
  };

  const handleDownload = () => {
    const fileUrl = `${base_url_image}uploads/1737052637481-ProductUploadDemo.xlsx`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "ProductUploadDemo.xlsx";
    link.click();
  };

  const tabs = [
    {
      key: "1",
      label: (
        <div>
          <p className="font-semibold">Import Product (Excel)</p>
        </div>
      ),
      content: (
        <div className="p-8">
          <CustomForm onSubmit={handleUpload}>
            <FileUploader name={"file"} />
            <SubmitButton fullWidth text={"Upload"} loading={isLoading} />
          </CustomForm>
          <p
            className="mt-5 text-center hover:text-primary duration-300"
            onClick={handleDownload}
          >
            Click Here To Download The Sample File
          </p>
        </div>
      ),
    },
    {
      key: "2",
      label: "Import Product (Aragga)",
      content: (
        <div className="p-8">
          <CustomForm onSubmit={handleAraggaImport}>
            <CustomInput
              label={"Product Category"}
              name={"araggaCategory"}
              required
            />
            <SubmitButton fullWidth text={"Import"} loading={isBulkLoading} />
          </CustomForm>
        </div>
      ),
    },
    {
      key: "3",
      label: "Import Product (ChalDaal)",
      content: (
        <div className="p-8">
          <CustomForm onSubmit={handleChalDaalImport}>
            <CustomInput
              label={"Product Category"}
              name={"chaldalCategory"}
              required
            />
            <SubmitButton fullWidth text={"Import"} loading={isLoading} />
          </CustomForm>
        </div>
      ),
    },
  ];
  return (
    <section className="max-w-4xl mx-auto">
      <Tabs
        centered
        tabPosition="top"
        size="large"
        items={tabs.map((tab) => ({
          label: tab.label,
          key: tab.key,
          children: <div>{tab.content}</div>,
        }))}
      />
    </section>
  );
};

export default ImportProduct;
