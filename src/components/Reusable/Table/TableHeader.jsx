"use client";

import { Input, Modal } from "antd";
import { usePathname } from "next/navigation";
import {
  FaInfoCircle,
  FaPlus,
  FaSearch,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import { toast } from "sonner";
import CustomForm from "../Form/CustomForm";
import FileUploader from "../Form/FileUploader";
import { SubmitButton } from "../Button/CustomButton";
import { useAddProductByFileMutation } from "@/redux/services/product/productApi";
import { base_url_image } from "@/utilities/configs/base_api";
import { useState } from "react";
import { HiX } from "react-icons/hi";

const TableHeader = ({
  setOpen,
  title,
  setSearch,
  selectedRowKeys,
  deleteBulk,
  setSelectedRowKeys,
}) => {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [addProductByFile, { isLoading }] = useAddProductByFileMutation();

  const handleBulkDelete = async () => {
    const toastId = toast.loading(`Deleting ${title}...`);
    try {
      const res = await deleteBulk(selectedRowKeys);
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId, duration: 2000 });
        setSelectedRowKeys(null);
      } else {
        toast.error(res.data.message, { id: toastId, duration: 2000 });
      }
    } catch (error) {
      console.error(`Error deleting ${title}:`, error);
      toast.error(`An error occurred while creating the ${title}.`, {
        id: toastId,
        duration: 2000,
      });
    }
  };

  const handleUpload = async (values) => {
    const toastId = toast.loading("Uploading File...");

    try {
      const formData = new FormData();
      formData.append("file", values?.file[0].originFileObj);

      const res = await addProductByFile(formData);

      if (res?.error) {
        toast.error(res?.error?.data?.errorMessage || "Something went wrong.", {
          id: toastId,
        });
      } else if (res?.data?.success) {
        toast.success(res.data.message, { id: toastId });
        setIsModalOpen(false);
      } else {
        toast.error("Unexpected response from server.", { id: toastId });
      }
    } catch (error) {
      console.error("Error uploading file:", error);

      const errorMessage =
        error?.response?.data?.errorMessage ||
        error?.message ||
        "An unexpected error occurred while uploading the file.";

      toast.error(errorMessage, { id: toastId });
    }
  };

  const handleDownload = () => {
    const fileUrl = `${base_url_image}uploads/1744871811931-Product Demo.xlsx`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "ProductUploadDemo.xlsx";
    link.click();
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-6">
          <div className="flex flex-wrap gap-3 items-center justify-center">
            <button
              className="bg-primary rounded-lg px-6 py-2 border border-primary flex items-center gap-2 text-white font-bold text-md hover:bg-transparent hover:text-primary duration-300"
              onClick={() => setOpen(true)}
            >
              <FaPlus className="text-2xl" />
              Create {title}
            </button>
            {pathname === "/admin/products/product" && (
              <button
                className="bg-transparent rounded-lg px-6 py-2 border border-primary flex items-center gap-2 text-primary font-bold text-md hover:bg-primary hover:text-white duration-300"
                onClick={() => setIsModalOpen(true)}
              >
                <FaUpload className="text-2xl" />
                Upload {title} File
              </button>
            )}
          </div>

          <div>
            {selectedRowKeys?.length > 0 && (
              <div className="flex w-full gap-6">
                <button
                  className="bg-[#d11b1bf1] rounded-lg px-6 py-2 border border-primary flex items-center gap-2 text-white font-bold text-md hover:bg-transparent hover:text-primary duration-300"
                  onClick={handleBulkDelete}
                >
                  <FaTrash className="mr-2 inline-block" />
                  Bulk Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="relative lg:w-1/4 mt-5 lg:mt-0">
          <div className="flex">
            <Input
              suffix={<FaSearch />}
              placeholder="Search..."
              className="py-1.5"
              size="large"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title={
          <div className="flex items-center gap-3">
            <FaInfoCircle
              style={{
                fontSize: "20px",
              }}
            />
            <span>Upload {title} File</span>
          </div>
        }
        closeIcon={
          <HiX className="text-2xl text-gray-600 hover:text-gray-800" />
        }
        centered
        footer={null}
        destroyOnClose
      >
        <div className="lg:p-8">
          <CustomForm onSubmit={handleUpload}>
            <FileUploader
              name={"file"}
              label={"Product File"}
              required={true}
            />
            <SubmitButton fullWidth text={"Upload"} loading={isLoading} />
          </CustomForm>
          <p
            className="mt-5 text-center hover:text-blue-500 cursor-pointer duration-300"
            onClick={handleDownload}
          >
            Click Here To Download The Sample File
          </p>
        </div>
      </Modal>
    </>
  );
};

export default TableHeader;
