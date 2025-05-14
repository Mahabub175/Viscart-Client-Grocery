"use client";

import { paginationNumbers } from "@/assets/data/paginationData";
import PhotoCreate from "@/components/Dashboard/Admin/Photo/PhotoCreate";
import PhotoEdit from "@/components/Dashboard/Admin/Photo/PhotoEdit";
import DeleteModal from "@/components/Reusable/Modal/DeleteModal";
import DetailsModal from "@/components/Reusable/Modal/DetailsModal";
import TableHeader from "@/components/Reusable/Table/TableHeader";
import {
  useDeletePhotoMutation,
  useDeleteBulkPhotoMutation,
  useGetPhotosQuery,
  useGetSinglePhotoQuery,
} from "@/redux/services/photo/photoApi";
import {
  Dropdown,
  Image,
  Menu,
  Pagination,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import Link from "next/link";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaCopy, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import { toast } from "sonner";

const Gallery = () => {
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const { data: photos, isFetching } = useGetPhotosQuery({
    page: currentPage,
    limit: pageSize,
    search,
  });

  const { data: photoData } = useGetSinglePhotoQuery(itemId, {
    skip: !itemId,
  });

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const [deletePhoto] = useDeletePhotoMutation();
  const [deleteBulkPhoto] = useDeleteBulkPhotoMutation();

  const handleMenuClick = (key, id) => {
    setItemId(id);
    switch (key) {
      case "edit":
        setOpenEdit(true);
        break;
      case "delete":
        setDeleteModalOpen(true);
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "attachment",
      key: "attachment",
      align: "start",
      render: (item) => (
        <Image
          src={
            item ??
            "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
          }
          alt={"photo image"}
          className="!w-20 h-20 object-cover rounded"
        />
      ),
    },
    {
      title: "Link",
      dataIndex: "attachment",
      key: "attachment",
      align: "start",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Link href={item} target="_blank" className="font-semibold">
            {item}
          </Link>
          <FaCopy
            onClick={() => {
              navigator.clipboard.writeText(item);
              toast.success("Link copied to clipboard!");
            }}
            className="text-xl cursor-pointer text-green-500"
          />
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (item) => (
        <Tag
          color={item == "Active" ? "green" : "red"}
          className="capitalize font-semibold"
        >
          {item == "Active" ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (item) => {
        const menu = (
          <Menu
            onClick={({ key }) => handleMenuClick(key, item.key)}
            className="w-full flex flex-col gap-2"
          >
            <Menu.Item key="edit">
              <Tooltip placement="top" title={"Edit"}>
                <button className="bg-green-500 p-2 rounded-xl text-white hover:scale-110 duration-300">
                  <FaEdit />
                </button>
              </Tooltip>
            </Menu.Item>
            <Menu.Item key="delete">
              <Tooltip placement="top" title={"Delete"}>
                <button className="bg-red-500 p-2 rounded-xl text-white hover:scale-110 duration-300">
                  <MdDelete />
                </button>
              </Tooltip>
            </Menu.Item>
          </Menu>
        );

        return (
          <Space size="middle">
            <Tooltip placement="top" title={"Details"}>
              <button
                onClick={() => {
                  setItemId(item.key);
                  setDetailsModalOpen(true);
                }}
                className="bg-blue-600 p-2 rounded-xl text-white hover:scale-110 duration-300"
              >
                <TbListDetails />
              </button>
            </Tooltip>
            <Dropdown overlay={menu} trigger={["click"]} placement="bottom">
              <Tooltip placement="top" title={"More"}>
                <button className="bg-blue-500 p-2 rounded-xl text-white hover:scale-110 duration-300">
                  <BsThreeDotsVertical />
                </button>
              </Tooltip>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  const tableData = photos?.results?.map((item) => ({
    key: item._id,
    attachment: item?.attachment,
    status: item?.status,
  }));

  return (
    <div className="px-5">
      <TableHeader
        setOpen={setOpen}
        title={"Gallery"}
        selectedRowKeys={selectedRowKeys}
        itemId={itemId}
        setSearch={setSearch}
        openSearch={openSearch}
        setOpenSearch={setOpenSearch}
        deleteBulk={deleteBulkPhoto}
        setSelectedRowKeys={setSelectedRowKeys}
      />

      <Table
        columns={columns}
        rowSelection={rowSelection}
        pagination={false}
        dataSource={tableData}
        className="mt-10"
        loading={isFetching}
      />

      <Pagination
        className="flex justify-end items-center !mt-10"
        total={photos?.meta?.totalCount}
        current={currentPage}
        onChange={handlePageChange}
        pageSize={pageSize}
        showSizeChanger
        pageSizeOptions={paginationNumbers}
        simple
      />

      <PhotoCreate open={open} setOpen={setOpen} />
      <PhotoEdit itemId={itemId} open={openEdit} setOpen={setOpenEdit} />
      <DetailsModal
        itemId={itemId}
        modalOpen={detailsModalOpen}
        setModalOpen={setDetailsModalOpen}
        title={"Image"}
        details={photoData}
      />
      <DeleteModal
        itemId={itemId}
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        text={"Image"}
        func={deletePhoto}
      />
    </div>
  );
};

export default Gallery;
