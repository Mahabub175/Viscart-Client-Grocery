"use client";

import DashboardCards from "@/components/Dashboard/DashboardCards";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useGetSingleUserDashboardQuery } from "@/redux/services/dashboard/dashboardApi";
import { useEffect } from "react";
import { TbBrandAirtable } from "react-icons/tb";
import { useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import Image from "next/image";
import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";

const UserDashboard = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  const user = useSelector(useCurrentUser);
  const { data } = useGetSingleUserQuery(user?._id);

  const { data: dashboardData } = useGetSingleUserDashboardQuery(user?._id);

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
          title="Wishlists"
          data={dashboardData?.wishlists}
          href={"/user/orders/wishlist"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Carts"
          data={dashboardData?.carts}
          href={"/user/orders/cart"}
        />
        <DashboardCards
          icon={TbBrandAirtable}
          title="Orders"
          data={dashboardData?.orders}
          href={"/user/orders/order"}
        />
      </div>
    </section>
  );
};

export default UserDashboard;
