"use client";

import { paginationNumbers } from "@/assets/data/paginationData";
import BlogCreate from "@/components/Dashboard/Admin/Blog/BlogCreate";
import BlogEdit from "@/components/Dashboard/Admin/Blog/BlogEdit";
import DeleteModal from "@/components/Reusable/Modal/DeleteModal";
import DetailsModal from "@/components/Reusable/Modal/DetailsModal";
import TableHeader from "@/components/Reusable/Table/TableHeader";
import {
  useDeleteBlogMutation,
  useDeleteBulkBlogMutation,
  useGetBlogsQuery,
  useGetSingleBlogQuery,
} from "@/redux/services/blog/blogApi";
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
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";

const AdminBlog = () => {
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

  const { data: blogs, isFetching } = useGetBlogsQuery({
    page: currentPage,
    limit: pageSize,
    search,
  });

  const { data: blogData } = useGetSingleBlogQuery(itemId, {
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

  const [deleteBlog] = useDeleteBlogMutation();
  const [deleteBulkBlog] = useDeleteBulkBlogMutation();

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
          alt={"blog image"}
          className="!w-12 h-12 object-cover rounded-full"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "start",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      align: "start",
      render: (item) => (
        <Link href={`/blog/${item}`} target="_blank">
          {item}
        </Link>
      ),
    },
    {
      title: "Published At",
      dataIndex: "publishedAt",
      key: "publishedAt",
      align: "start",
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

  const tableData = blogs?.results?.map((item) => ({
    key: item._id,
    name: item?.name,
    slug: item?.slug,
    publishedAt: item?.publishedAt,
    attachment: item?.attachment,
    status: item?.status,
  }));

  return (
    <div className="px-5">
      <TableHeader
        setOpen={setOpen}
        title={"Blog"}
        selectedRowKeys={selectedRowKeys}
        itemId={itemId}
        setSearch={setSearch}
        openSearch={openSearch}
        setOpenSearch={setOpenSearch}
        deleteBulk={deleteBulkBlog}
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
        total={blogs?.meta?.totalCount}
        current={currentPage}
        onChange={handlePageChange}
        pageSize={pageSize}
        showSizeChanger
        pageSizeOptions={paginationNumbers}
        simple
      />

      <BlogCreate open={open} setOpen={setOpen} />
      <BlogEdit itemId={itemId} open={openEdit} setOpen={setOpenEdit} />
      <DetailsModal
        itemId={itemId}
        modalOpen={detailsModalOpen}
        setModalOpen={setDetailsModalOpen}
        title={"Blog"}
        details={blogData}
      />
      <DeleteModal
        itemId={itemId}
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        text={"blog"}
        func={deleteBlog}
      />
    </div>
  );
};

export default AdminBlog;
