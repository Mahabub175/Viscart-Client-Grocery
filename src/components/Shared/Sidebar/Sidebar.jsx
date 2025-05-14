"use client";

import { Button, Input, Layout, Menu } from "antd";
import { useState } from "react";
import { TbArrowBadgeRight } from "react-icons/tb";
import { usePathname } from "next/navigation";
import "./sidebar.css";
import { sidebarItemsGenerator } from "@/utilities/lib/sidebarItemsGenerator";
import { userSidebarRoutes } from "@/routes/user.routes";
import { adminSidebarRoutes } from "@/routes/admin.routes";
import { useSelector } from "react-redux";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { FaSearch } from "react-icons/fa";
import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";

const { Sider } = Layout;

const Sidebar = () => {
  const user = useSelector(useCurrentUser);
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data } = useGetSingleUserQuery(user?._id);

  const routes =
    data?.role === "admin"
      ? adminSidebarRoutes
      : user?.role === "user"
      ? userSidebarRoutes
      : [];

  const fullSidebarItems = sidebarItemsGenerator(routes, pathname, user?.role);

  const filteredSidebarItems =
    searchTerm.trim() === ""
      ? fullSidebarItems
      : fullSidebarItems.filter(
          (item) =>
            item?.key?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
            item?.children?.some((child) =>
              child?.key?.toLowerCase()?.includes(searchTerm.toLowerCase())
            )
        );

  return (
    <div className="relative border-r border-gray-200 drop-shadow-primary">
      <Sider
        className="!bg-white overflow-y-auto h-[calc(100vh-56px)]"
        trigger={null}
        breakpoint="lg"
        collapsedWidth="0"
        collapsed={collapsed}
        onBreakpoint={(broken) => setCollapsed(broken)}
        onCollapse={(collapsedState) => setCollapsed(collapsedState)}
      >
        <div className="p-3 mt-2">
          <Input
            placeholder="Search menu..."
            prefix={<FaSearch />}
            allowClear
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-md text-sm px-2 py-2 !bg-[#A2C8C81A]"
          />
        </div>

        <Menu
          mode="inline"
          className="mt-2"
          items={searchTerm ? filteredSidebarItems : fullSidebarItems}
          defaultSelectedKeys={[
            pathname
              ?.split("/")
              ?.slice(-1)?.[0]
              ?.replace(/-/g, " ")
              ?.replace(/\b\w/g, (char) => char.toUpperCase()),
          ]}
        />
      </Sider>

      <div className="sidebar-toggle-button">
        <Button
          className="-mr-1 bg-white border border-gray-200 rounded-full text-primary"
          icon={
            collapsed ? (
              <TbArrowBadgeRight className="text-2xl" />
            ) : (
              <TbArrowBadgeRight className="rotate-180 text-2xl" />
            )
          }
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            position: "absolute",
            right: -25,
            top: -10,
            zIndex: 1000,
            padding: "10px",
            borderRadius: "9999px",
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
