import { useGetAllOrdersQuery } from "@/redux/services/order/orderApi";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import { Spin } from "antd";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";

const OrderChart = () => {
  const { data, isLoading } = useGetAllOrdersQuery();
  const { data: globalData } = useGetAllGlobalSettingQuery();

  if (isLoading) return <Spin />;

  const orderCounts = {};

  data?.results?.forEach((order) => {
    const orderDate = dayjs(order.createdAt).format("YYYY-MM-DD");
    orderCounts[orderDate] = (orderCounts[orderDate] || 0) + 1;
  });

  const chartData = Object.keys(orderCounts).map((date) => ({
    date,
    count: orderCounts[date],
  }));

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-xl font-semibold mb-4">Orders by Date</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill={globalData?.results?.primaryColor} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderChart;
