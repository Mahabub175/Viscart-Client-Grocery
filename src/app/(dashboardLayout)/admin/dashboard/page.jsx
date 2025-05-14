"use client";

import DashboardCards from "@/components/Dashboard/DashboardCards";
import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useGetAdminDashboardQuery } from "@/redux/services/dashboard/dashboardApi";
import { Avatar } from "antd";
import Image from "next/image";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import LogOutButton from "@/components/Dashboard/LogOutButton";
import OrderChart from "@/components/Dashboard/OrderChart";

import settings from "@/assets/images/settings.png";
import message from "@/assets/images/message.png";
import settings2 from "@/assets/images/settings2.png";
import products from "@/assets/images/products.png";
import carts from "@/assets/images/carts.png";
import orders from "@/assets/images/orders.png";
import users from "@/assets/images/users.png";
import OrderCards from "@/components/Dashboard/OrderCards";
import CustomMarquee from "@/components/Reusable/Marquee/CustomMarquee";
import Link from "next/link";

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

  const orderMessage = (
    <div className="text-red-500">
      ⚠️ আপনার অর্ডার লিমিটেশন শেষ। লিমিটেশন এক্সটেন্ড করতে দ্রুত{" "}
      <Link
        href="https://your-support-link.com"
        className="text-blue-600 font-bold underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        ক্রেতা
      </Link>{" "}
      এর সাপোর্ট এ যোগাযোগ করুন। 📞
    </div>
  );

  return (
    <section>
      {dashboardData?.results?.remainingOrders === 0 && (
        <div className="-mt-16">
          <CustomMarquee data={orderMessage} />
        </div>
      )}
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
        </div>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-10">
        <DashboardCards
          image={products}
          title="Products"
          data={dashboardData?.results?.products}
          href={"/admin/products/product"}
          size={50}
        />
        <DashboardCards
          image={carts}
          title="Carts"
          data={dashboardData?.results?.carts}
          href={"/admin/orders/cart"}
          size={60}
        />
        <DashboardCards
          image={orders}
          title="Remaining Orders"
          data={dashboardData?.results?.remainingOrders}
          href={"/admin/orders/order"}
        />
        <DashboardCards
          image={users}
          title="Users"
          data={dashboardData?.results?.users}
          href={"/admin/user"}
          size={50}
        />
        <DashboardCards
          image={message}
          title="Message Platform"
          href={"/admin/message-platform"}
        />
        <DashboardCards
          image={settings2}
          title="Account Setting"
          href={"/admin/account-setting"}
        />
        <DashboardCards
          image={settings}
          title="Global Settings"
          href={"/admin/global-setting"}
        />
        <LogOutButton />
      </div>
      <OrderCards />
      <OrderChart />
    </section>
  );
};

export default AdminDashboard;
