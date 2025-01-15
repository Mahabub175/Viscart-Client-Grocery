"use client";

import {
  useDeleteCartMutation,
  useUpdateCartMutation,
} from "@/redux/services/cart/cartApi";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { Tooltip } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { MdDelete } from "react-icons/md";

const DrawerCart = ({ data }) => {
  const [counts, setCounts] = useState({});
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const [deleteCart] = useDeleteCartMutation();
  const [updateCart] = useUpdateCartMutation();

  useEffect(() => {
    if (data?.length) {
      setCounts(
        data.reduce(
          (acc, item) => ({
            ...acc,
            [item._id]: Number(item.quantity) || 1,
          }),
          {}
        )
      );
    }
  }, [data]);

  const subtotal = useMemo(() => {
    return data?.reduce((total, item) => {
      const quantity = counts[item._id] || 1;
      return total + item.price * quantity;
    }, 0);
  }, [data, counts]);

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    setCounts((prev) => ({ ...prev, [id]: newQuantity }));

    try {
      const updatedData = {
        id,
        data: { quantity: newQuantity },
      };
      await updateCart(updatedData).unwrap();
    } catch (error) {
      toast.error("Failed to update quantity!");
      console.error("Error updating cart:", error);
    }
  };

  const handleDeleteCart = async (id) => {
    try {
      await deleteCart(id).unwrap();
      toast.success("Item removed from cart!");
    } catch (error) {
      toast.error("Failed to delete item!");
      console.error("Error deleting cart:", error);
    }
  };

  return (
    <div>
      {data?.length ? (
        <div className="pb-20 lg:pb-32 max-w-[500px] lg:max-w-full">
          {data.map((item) => (
            <div
              key={item._id}
              className="flex flex-col lg:flex-row items-center gap-4 justify-between pb-5 mt-5 first:mt-0 border-b border-gray-300 last:border-b-0"
            >
              <div className="flex items-center gap-4 relative group flex-[3]">
                <div className="relative">
                  <Image
                    src={formatImagePath(item.image)}
                    alt={item.product?.name || "Product Image"}
                    width={128}
                    height={128}
                    className="lg:w-[150px] lg:h-32 rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center rounded-xl transition-opacity duration-300">
                    <button
                      onClick={() => handleDeleteCart(item._id)}
                      className="bg-white px-2 py-1 rounded-full"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="w-full">
                  <Link
                    href={`/products/${item.slug}`}
                    className="text-base font-normal hover:underline hover:text-black"
                  >
                    <Tooltip placement="top" title={item.productName}>
                      <h2 className="text-md font-semibold">
                        {item.productName}
                      </h2>
                    </Tooltip>
                    {item.variant &&
                      ` (${item.variant.attributeCombination
                        .map((comb) => comb.name)
                        .join(", ")})`}
                  </Link>

                  <div className="flex justify-between items-start">
                    <div className="mt-2">
                      <p className="font-semibold">
                        Quantity: {counts[item._id]}
                      </p>
                      <div className="flex items-center border rounded w-fit my-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(item._id, counts[item._id] - 1)
                          }
                          className="px-2 py-1 bg-gray-200 text-sm font-bold"
                          disabled={counts[item._id] <= 1}
                        >
                          -
                        </button>
                        <span className="px-4">{counts[item._id]}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item._id, counts[item._id] + 1)
                          }
                          className="px-2 py-1 bg-gray-200 text-sm font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <MdDelete
                      onClick={() => handleDeleteCart(item._id)}
                      className="text-xl cursor-pointer mt-2 hover:scale-105 duration-300"
                    />
                  </div>
                  <div>
                    <p className="text-primary text-xl font-bold">
                      {globalData?.results?.currency +
                        " " +
                        (item.price * counts[item._id]).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg mt-10">
          Your cart is empty.
        </div>
      )}

      {data?.length > 0 && (
        <Link
          href="/cart"
          className="hover:text-white text-white lg:text-xl absolute bottom-5 left-1/2 -translate-x-1/2 lg:-translate-x-0 lg:left-10 w-5/6 mx-auto"
        >
          <div className="flex items-center justify-between bg-primary gap-5 px-5 py-4 rounded-xl">
            <p>Proceed To Checkout</p>
            <p className="font-bold">
              {globalData?.results?.currency} {subtotal?.toFixed(2)}
            </p>
          </div>
        </Link>
      )}
    </div>
  );
};

export default DrawerCart;
