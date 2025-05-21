"use client";

import { Button } from "antd";
import Link from "next/link";
import Image from "next/image";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { useGetOrdersByUserQuery } from "@/redux/services/order/orderApi";
import { useSelector } from "react-redux";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import SuccessAnimation from "@/components/LandingPages/Success/SuccessAnimation";
import { useEffect } from "react";

const SuccessPage = () => {
  const user = useSelector(useCurrentUser);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  const { data: globalData } = useGetAllGlobalSettingQuery();

  const { data: userOrders, isFetching } = useGetOrdersByUserQuery({
    id: user?._id,
  });

  const lastOrder = userOrders?.results?.[0];

  if (isFetching)
    return (
      <section className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </section>
    );

  return (
    <div className="max-w-xl mx-auto mt-5 px-5 text-center">
      <SuccessAnimation />
      <h1 className="text-xl font-semibold text-green-500 mt-5 text-center">
        Congratulation! Your Order has been placed
      </h1>
      <p className="text-lg font-medium">It is being processed right now!</p>

      <div className="mt-5">
        <h3 className="font-medium border-b-2 pb-1 mb-5 text-lg">
          Order #{lastOrder?.orderId}
        </h3>
        <div>
          {lastOrder?.products?.map((item) => (
            <div
              key={item?._id}
              className="flex items-center justify-between mb-5 gap-5"
            >
              <div className="flex items-center gap-5">
                <Image
                  src={formatImagePath(item?.product?.mainImage)}
                  alt={item?.productName ?? "product"}
                  width={100}
                  height={100}
                  className="rounded"
                />
                <Link
                  href={`/products/${item?.product?.slug}`}
                  className="font-medium hover:underline text-start text-sm lg:text-base"
                  target="_blank"
                >
                  {item?.productName}
                </Link>
              </div>
              <p className="font-semibold flex gap-1">
                <span>{item?.quantity}</span> x{" "}
                <span>
                  {globalData?.results?.currency}
                  {item?.product?.offerPrice > 0
                    ? item?.product?.offerPrice
                    : item?.product?.sellingPrice}
                </span>
              </p>
            </div>
          ))}
        </div>
        <div className="text-start pt-5">
          <h2 className="text-xl font-semibold mb-2">Pricing Summary</h2>
          <p className="flex justify-between">
            <strong>Subtotal:</strong> {globalData?.results?.currency}{" "}
            {lastOrder?.subTotal || "0.00"}
          </p>
          <p className="flex justify-between">
            <strong>Shipping Fee:</strong> {globalData?.results?.currency}{" "}
            {lastOrder?.shippingFee + lastOrder?.extraFee || "0.00"}
          </p>
          <p className="flex justify-between pb-2">
            <strong>Discount:</strong> -{globalData?.results?.currency}{" "}
            {lastOrder?.discount || "0.00"}
          </p>
          <p className="flex justify-between border-t-2 pt-2">
            <strong>Grand Total:</strong> {globalData?.results?.currency}{" "}
            {lastOrder?.grandTotal || "0.00"}
          </p>
          <p className="mt-4 text-gray-600 font-medium text-sm">
            Paid by 
            <span className="uppercase">{lastOrder?.paymentMethod}</span>
          </p>
        </div>
      </div>

      <Link href={"/products"}>
        <Button type="primary" className="py-5 px-10 rounded font-bold mt-10">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
};

export default SuccessPage;
