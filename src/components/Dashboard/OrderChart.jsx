import { useGetAllOrdersQuery } from "@/redux/services/order/orderApi";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import dayjs from "dayjs";
import { Spin } from "antd";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f"];

const OrderChart = () => {
  const { data, isLoading } = useGetAllOrdersQuery();
  const [lineFilterType, setLineFilterType] = useState("daily");
  const [pieFilterType, setPieFilterType] = useState("daily");

  if (isLoading) return <Spin />;

  const today = dayjs();

  const getDateRange = (type) => {
    let days = 0;
    if (type === "daily") days = 5;
    else if (type === "weekly") days = 7;
    else if (type === "monthly") days = 30;
    else if (type === "yearly") days = 365;

    return Array.from({ length: days }, (_, i) =>
      today
        .subtract(days - 1 - i, "day")
        .startOf("day")
        .format("YYYY-MM-DD")
    );
  };

  const lineDateRange = getDateRange(lineFilterType);
  const lineOrderCounts = {};
  const lineGrandTotals = {};

  const filteredLineOrders =
    data?.results?.filter((order) => {
      const formattedDate = dayjs(order.createdAt)
        .startOf("day")
        .format("YYYY-MM-DD");
      return lineDateRange.includes(formattedDate);
    }) || [];

  filteredLineOrders.forEach((order) => {
    const date = dayjs(order.createdAt).startOf("day").format("YYYY-MM-DD");
    lineOrderCounts[date] = (lineOrderCounts[date] || 0) + 1;
    lineGrandTotals[date] =
      (lineGrandTotals[date] || 0) + (order.grandTotal || 0);
  });

  const lineChartData = lineDateRange.map((date) => ({
    date,
    orders: lineOrderCounts[date] || 0,
    totalAmount: lineGrandTotals[date] || 0,
  }));

  const pieDateRange = getDateRange(pieFilterType);
  const pieProductFrequency = {};

  const filteredPieOrders =
    data?.results?.filter((order) => {
      const formattedDate = dayjs(order.createdAt)
        .startOf("day")
        .format("YYYY-MM-DD");
      return pieDateRange.includes(formattedDate);
    }) || [];

  filteredPieOrders.forEach((order) => {
    order.products?.forEach(({ product, quantity }) => {
      const productName = product?.name;
      if (productName) {
        pieProductFrequency[productName] =
          (pieProductFrequency[productName] || 0) + quantity;
      }
    });
  });

  const topProducts = Object.entries(pieProductFrequency)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="p-4 bg-white shadow-lg rounded-lg mt-10 col-span-2">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0 mb-4">
          <h2 className="text-xl font-semibold">Orders by Date</h2>
          <div className="flex gap-2">
            {["daily", "weekly", "monthly", "yearly"].map((type) => (
              <button
                key={type}
                className={`px-3 py-1 rounded border text-sm ${
                  lineFilterType === type
                    ? "bg-primary text-white"
                    : "bg-white border-gray-300"
                }`}
                onClick={() => setLineFilterType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={lineChartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#8884d8"
              strokeDasharray="5 5"
              strokeWidth={2}
              name="Orders"
            />
            <Line
              type="monotone"
              dataKey="totalAmount"
              stroke="#82ca9d"
              strokeDasharray="3 4 5 2"
              strokeWidth={2}
              name="Grand Total"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="p-4 bg-white shadow-lg rounded-lg mt-10 w-full">
        <div className="flex flex-col justify-between items-center gap-5">
          <h2 className="text-xl font-semibold">Top 5 Ordered Products</h2>
          <div className="flex gap-2">
            {["daily", "weekly", "monthly", "yearly"].map((type) => (
              <button
                key={type}
                className={`px-3 py-1 rounded border text-sm ${
                  pieFilterType === type
                    ? "bg-primary text-white"
                    : "bg-white border-gray-300"
                }`}
                onClick={() => setPieFilterType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={topProducts}
              dataKey="count"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              cx="50%"
              cy="50%"
              label
            >
              {topProducts.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrderChart;
