"use client";

import { paginationNumbers } from "@/assets/data/paginationData";
import ReviewEdit from "@/components/Dashboard/User/Review/ReviewEdit";
import { DeleteButton } from "@/components/Reusable/Button/CustomButton";
import deleteImage from "@/assets/images/Trash-can.png";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import {
  useDeleteProductReviewMutation,
  useGetReviewsByUserQuery,
} from "@/redux/services/product/productApi";
import { Button, Input, Modal, Pagination, Space, Table, Tooltip } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaEdit, FaSearch } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const UserReview = () => {
  const user = useSelector(useCurrentUser);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [productId, setProductId] = useState(null);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const { data: reviews, isFetching } = useGetReviewsByUserQuery({
    id: user?._id,
    page: currentPage,
    limit: pageSize,
  });

  const [deleteProductReview] = useDeleteProductReviewMutation();

  const handleDelete = async () => {
    try {
      const payload = {
        productId: productId,
        reviewId: itemId,
      };

      const res = await deleteProductReview(payload);
      if (res.data.success) {
        setDeleteModalOpen(false);
        toast.success(res.data.message);
      } else {
        setDeleteModalOpen(false);
        toast.error(res.data.message);
      }
    } catch (error) {
      setDeleteModalOpen(false);
      console.error("Error deleting item:", error);
      toast.error("An error occurred while deleting the item.");
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      align: "start",
      render: (item, record) => (
        <Link href={`/products/${record?.slug}`} target="_blank">
          {item}
        </Link>
      ),
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      align: "start",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      align: "start",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (item) => {
        return (
          <Space size="middle">
            <Tooltip placement="top" title={"Edit"}>
              <button
                className="bg-green-500 p-2 rounded-xl text-white hover:scale-110 duration-300"
                onClick={() => {
                  setItemId(item.key);
                  setOpenEdit(true);
                }}
              >
                <FaEdit />
              </button>
            </Tooltip>
            <Tooltip placement="top" title={"Delete"}>
              <button
                onClick={() => {
                  setItemId(item.key);
                  setProductId(item.productId);
                  setDeleteModalOpen(true);
                }}
                className="bg-red-500 p-2 rounded-xl text-white hover:scale-110 duration-300"
              >
                <MdDelete />
              </button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const tableData = reviews?.results?.flatMap((product) =>
    product?.reviews?.map((review) => ({
      key: review?._id,
      productId: product?._id,
      product: product?.name,
      slug: product?.slug,
      rating: review?.rating,
      comment: review?.comment,
    }))
  );

  const filteredTableData = tableData?.filter((item) => {
    if (!search) return true;
    const searchTerm = search.toLowerCase();

    return Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="px-5">
      <div className="flex justify-between">
        <div></div>
        <Input
          suffix={<FaSearch />}
          placeholder="Search..."
          className="py-1.5 lg:w-1/4"
          size="large"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Table
        columns={columns}
        pagination={false}
        dataSource={filteredTableData}
        className="mt-10"
        loading={isFetching}
      />

      <Pagination
        className="flex justify-end items-center !mt-10"
        total={reviews?.meta?.totalCount}
        current={currentPage}
        onChange={handlePageChange}
        pageSize={pageSize}
        showSizeChanger
        pageSizeOptions={paginationNumbers}
        simple
      />

      <ReviewEdit itemId={itemId} open={openEdit} setOpen={setOpenEdit} />

      <Modal
        centered
        open={deleteModalOpen}
        onOk={() => setDeleteModalOpen(false)}
        onCancel={() => setDeleteModalOpen(false)}
        footer={null}
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
            Are your sure you want to permanently delete this review?
          </h2>
          <div className="flex mt-10 gap-6 items-center justify-center">
            <Button
              onClick={() => setDeleteModalOpen(false)}
              type="text"
              className="!font-bold bg-transparent !text-red-500 px-10 py-4 border !border-red-500"
            >
              Cancel
            </Button>
            <DeleteButton func={handleDelete} text={"Delete"} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserReview;
