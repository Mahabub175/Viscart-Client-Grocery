"use client";

import { Button, Input, Modal } from "antd";
import { FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import deleteImage from "@/assets/images/Trash-can.png";
import { useState } from "react";
import Image from "next/image";
import { DeleteButton, SubmitButton } from "../Button/CustomButton";
import { usePathname } from "next/navigation";
import CustomForm from "../Form/CustomForm";
import FileUploader from "../Form/FileUploader";
import { CiImport } from "react-icons/ci";
import { useImportProductMutation } from "@/redux/services/product/productApi";
import { base_url_image } from "@/utilities/configs/base_api";

const TableHeader = ({
  setOpen,
  title,
  setSearch,
  selectedRowKeys,
  deleteBulk,
  setSelectedRowKeys,
}) => {
  const pathname = usePathname();
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const [importProduct, { isLoading }] = useImportProductMutation();

  const handleBulkDelete = async () => {
    const toastId = toast.loading(`Deleting ${title}...`);
    try {
      const res = await deleteBulk(selectedRowKeys);
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId, duration: 2000 });
        setSelectedRowKeys(null);
        setModalOpen(false);
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

    const formData = new FormData();
    formData.append("file", values.file[0].originFileObj);

    try {
      const res = await importProduct(formData);
      if (res.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setImportModalOpen(false);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("An error occurred while uploading the file.", {
        id: toastId,
      });
    }
  };

  const handleDownload = () => {
    const fileUrl = `${base_url_image}uploads/1737043704779-ProductUploadDemo.xlsx`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "ProductUploadDemo.xlsx";
    link.click();
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-6">
          <div
            className="flex gap-3 items-center justify-center"
            onClick={() => setOpen(true)}
          >
            <button className="bg-primary rounded-lg px-6 py-2 border border-primary flex items-center gap-2 text-white font-bold text-md hover:bg-transparent hover:text-primary duration-300">
              <FaPlus className="text-2xl" />
              Create {title}
            </button>
          </div>

          {pathname === "/admin/products/product" && (
            <div
              className="flex gap-3 items-center justify-center"
              onClick={() => setImportModalOpen(true)}
            >
              <button className="bg-transparent rounded-lg px-6 py-2 border border-primary flex items-center gap-2 text-primary font-bold text-md hover:bg-primary hover:text-white duration-300">
                <CiImport className="text-2xl" />
                Import {title}
              </button>
            </div>
          )}

          <div>
            {selectedRowKeys?.length > 0 && (
              <div className="flex w-full gap-6">
                <button
                  className="bg-[#d11b1bf1] rounded-lg px-6 py-2 border border-primary flex items-center gap-2 text-white font-bold text-md hover:bg-transparent hover:text-primary duration-300"
                  onClick={() => setModalOpen(true)}
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
        centered
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <div className="p-8">
          <Image
            height={60}
            width={60}
            src={deleteImage}
            alt="delete image"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h2 className="text-center text-2xl font-bold">
            Are your sure you want to permanently delete this{" "}
            {title.toLowerCase()}s?
          </h2>
          <div className="lg:flex mt-10 gap-6 items-center justify-center">
            <Button
              onClick={() => setModalOpen(false)}
              type="text"
              className="!font-bold bg-transparent !text-red-500 px-10 py-4 border !border-red-500"
            >
              Cancel
            </Button>
            <DeleteButton func={handleBulkDelete} text={"Delete"} />
          </div>
        </div>
      </Modal>
      <Modal
        centered
        open={importModalOpen}
        onOk={() => setImportModalOpen(false)}
        onCancel={() => setImportModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <div className="p-8">
          <CustomForm onSubmit={handleUpload}>
            <FileUploader name={"file"} />
            <SubmitButton fullWidth text={"Upload"} loading={isLoading} />
          </CustomForm>
          <p
            className="mt-5 text-center hover:text-primary duration-300"
            onClick={handleDownload}
          >
            Click To Download The Sample File
          </p>
        </div>
      </Modal>
    </>
  );
};

export default TableHeader;
