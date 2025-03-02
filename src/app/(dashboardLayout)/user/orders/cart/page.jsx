"use client";

import DeleteModal from "@/components/Reusable/Modal/DeleteModal";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import {
  useDeleteCartMutation,
  useGetSingleCartByUserQuery,
} from "@/redux/services/cart/cartApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { Dropdown, Image, Input, Menu, Space, Table, Tooltip } from "antd";
import Link from "next/link";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";

const UserCart = () => {
  const user = useSelector(useCurrentUser);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [search, setSearch] = useState("");

  const { data: carts, isFetching } = useGetSingleCartByUserQuery(user?._id);

  const [deleteCart] = useDeleteCartMutation();

  const handleMenuClick = (key, id) => {
    setItemId(id);
    switch (key) {
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
      dataIndex: "image",
      key: "image",
      align: "start",
      render: (item) => (
        <Image
          src={
            item ??
            "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
          }
          alt={"product image"}
          className="!w-12 !h-12 rounded-full"
        />
      ),
    },
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
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "start",
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

  const tableData = carts?.map((item) => ({
    key: item._id,
    image: formatImagePath(item?.image),
    slug: item?.slug,
    product: item?.productName,
    quantity: item?.quantity,
  }));

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

      <DeleteModal
        itemId={itemId}
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        text={"cart"}
        func={deleteCart}
      />
    </div>
  );
};

export default UserCart;
