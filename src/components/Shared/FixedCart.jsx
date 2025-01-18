"use client";

import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useGetSingleCartByUserQuery } from "@/redux/services/cart/cartApi";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { Drawer } from "antd";
import { useMemo, useState } from "react";
import { GiCancel } from "react-icons/gi";
import { useSelector } from "react-redux";
import DrawerCart from "./Product/DrawerCart";
import { FaShoppingCart } from "react-icons/fa";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";

const FixedCart = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);
  const { data: cartData } = useGetSingleCartByUserQuery(user?._id ?? deviceId);
  const { data: globalData } = useGetAllGlobalSettingQuery();

  const subtotal = useMemo(() => {
    return cartData?.reduce((total, item) => {
      return total + item.price * item?.quantity;
    }, 0);
  }, [cartData]);

  return (
    <section className="hidden lg:block">
      <div className="fixed bottom-[45%] right-1 z-20">
        <div
          className="relative cursor-pointer text-white"
          onClick={(e) => {
            e.preventDefault();
            setIsCartOpen(true);
          }}
        >
          <div className="bg-primary p-1 rounded-tl-xl flex flex-col items-center px-2">
            <FaShoppingCart className="mb-1 mt-2.5 text-lg" />
            <p className="text-xs">{cartData?.length} Item</p>
          </div>
          <div className="bg-orange rounded-bl-xl text-center px-2 text-xs font-semibold py-0.5">
            {globalData?.results?.currency} {subtotal?.toFixed(2)}
          </div>
        </div>
      </div>
      <Drawer
        placement="right"
        onClose={() => setIsCartOpen(false)}
        open={isCartOpen}
        width={450}
        destroyOnClose
      >
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <p className="text-2xl font-semibold">Shopping Cart</p>
          <button
            className="mt-1 bg-gray-200 hover:scale-110 duration-500 rounded-full p-1"
            onClick={() => setIsCartOpen(false)}
          >
            <GiCancel className="text-xl text-gray-700" />
          </button>
        </div>
        <DrawerCart data={cartData} />
      </Drawer>
    </section>
  );
};

export default FixedCart;
