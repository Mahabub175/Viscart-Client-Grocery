"use client";

import DashboardCards from "@/components/Dashboard/DashboardCards";
import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useGetAdminDashboardQuery } from "@/redux/services/dashboard/dashboardApi";
import { Avatar } from "antd";
import Image from "next/image";
import { useEffect } from "react";
import { TbBrandAirtable } from "react-icons/tb";
import { useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import OrderChart from "./OrderChart";

const AdminDashboard = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
  const user = useSelector(useCurrentUser);
  const { data } = useGetSingleUserQuery(user?._id);
  const { data: dashboardData } = useGetAdminDashboardQuery();

  return (
    <section>
      <div className="mb-10 flex items-center gap-5">
        <div>
          {data?.profile_image ? (
            <Image
              src={data?.profile_image}
              alt="profile"
              height={100}
              width={100}
              className="rounded-full w-[100px] h-[100px] border-2 border-primaryLight object-contain"
            />
          ) : (
            <Avatar
              className="rounded-full w-[100px] h-[100px] border-2 border-primaryLight"
              size={100}
              icon={<UserOutlined />}
            />
          )}
        </div>
        <div>
          <p>Hello,</p>
          <p className="text-base lg:text-4xl font-medium">{data?.name}</p>
          <p className="text-base font-medium mt-2">
            Total Points: {data?.point}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
        <DashboardCards
          icon={TbBrandAirtable}
          title="Brands"
          data={dashboardData?.results?.brands}
          href={"/admin/products/brand"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Categories"
          data={dashboardData?.results?.categories}
          href={"/admin/products/category"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Products"
          data={dashboardData?.results?.products}
          href={"/admin/products/product"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Coupons"
          data={dashboardData?.results?.coupons}
          href={"/admin/orders/coupon"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Gift Cards"
          data={dashboardData?.results?.giftCards}
          href={"/admin/orders/coupon"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Wishlists"
          data={dashboardData?.results?.wishlists}
          href={"/admin/orders/wishlist"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Carts"
          data={dashboardData?.results?.carts}
          href={"/admin/orders/cart"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Orders"
          data={dashboardData?.results?.orders}
          href={"/admin/orders/order"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Sliders"
          data={dashboardData?.results?.sliders}
          href={"/admin/slider"}
        />
      </div>
      <OrderChart />
    </section>
  );
};

export default AdminDashboard;
