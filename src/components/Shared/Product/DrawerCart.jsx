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
import { useRouter } from "next/navigation";
import { sendGTMEvent } from "@next/third-parties/google";
import { useSelector } from "react-redux";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";
import useGetURL from "@/utilities/hooks/useGetURL";
import { useAddServerTrackingMutation } from "@/redux/services/serverTracking/serverTrackingApi";

const DrawerCart = ({ data, setDrawer }) => {
  const deviceId = useSelector(useDeviceId);
  const user = useSelector(useCurrentUser);

  const { data: userData } = useGetSingleUserQuery(user?._id, {
    skip: !user?._id,
  });

  const url = useGetURL();
  const [addServerTracking] = useAddServerTrackingMutation();

  const [counts, setCounts] = useState({});
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const [deleteCart] = useDeleteCartMutation();
  const [updateCart] = useUpdateCartMutation();

  const router = useRouter();

  const proceedToCheckout = () => {
    router.push("/cart");
    setDrawer(false);
  };

  useEffect(() => {
    if (data?.length) {
      const productData = data?.map((item) => {
        return {
          id: item._id,
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          sku: item.sku,
          slug: item.slug,
          quantity: item.quantity,
          image: formatImagePath(item.image),
          ...(user?._id
            ? {
                userName: userData?.name,
                userNumber: userData?.number,
                userEmail: userData?.email,
              }
            : { deviceId }),
          ...(user?._id && {
            name: userData?.name,
            number: userData?.number,
            email: userData?.email,
          }),
          url,
        };
      });
      sendGTMEvent({ event: "cartView", value: productData });

      const serverData = {
        event: "cartView",
        data: {
          event_source_url: url,
        },
      };
      addServerTracking(serverData);

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
  }, [data, user?._id, userData, deviceId]);

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
              className="flex items-center gap-3 pb-5 mt-5 first:mt-0 border-b border-gray-300 last:border-b-0"
            >
              <div className="border rounded-xl">
                <Image
                  src={formatImagePath(item.image)}
                  alt={item.product?.name || "Product Image"}
                  width={128}
                  height={128}
                  className="w-[100px] lg:w-[120px] lg:h-32 rounded-xl"
                />
              </div>

              <div className="flex-1 space-y-2">
                <Link
                  href={`/products/${item.slug}`}
                  className="text-base font-normal hover:underline hover:text-black"
                  onClick={() => setDrawer(false)}
                >
                  <Tooltip placement="top" title={item.productName}>
                    <h2 className="text-xs lg:text-base lg:font-medium">
                      {item.productName}
                    </h2>
                  </Tooltip>
                  {item.variant &&
                    ` (${item.variant.attributeCombination
                      .map((comb) => comb.name)
                      .join(", ")})`}
                </Link>
                <div className="flex items-center border rounded w-fit">
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
                <p className="text-primary text-xl font-bold">
                  {globalData?.results?.currency +
                    " " +
                    (item.price * counts[item._id]).toFixed(2)}
                </p>
              </div>

              <MdDelete
                onClick={() => handleDeleteCart(item._id)}
                className="text-xl cursor-pointer hover:scale-105 duration-300"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg mt-10">
          Your cart is empty.
        </div>
      )}

      {data?.length > 0 && (
        <div
          onClick={proceedToCheckout}
          className="hover:text-white text-white lg:text-xl absolute bottom-5 left-1/2 -translate-x-1/2 lg:-translate-x-0 lg:left-5 w-11/12  mx-auto cursor-pointer"
        >
          <div className="flex items-center justify-between bg-primary gap-5 px-5 py-4 rounded-xl cursor-pointer">
            <p>Proceed To Checkout</p>
            <p className="font-bold">
              {globalData?.results?.currency} {subtotal?.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawerCart;
