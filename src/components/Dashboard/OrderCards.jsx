import { useGetAllOrdersQuery } from "@/redux/services/order/orderApi";
import { Spin } from "antd";
import pending from "@/assets/images/pending.png";
import outForDelivery from "@/assets/images/outForDelivery.png";
import cancelled from "@/assets/images/cancelled.png";
import delivered from "@/assets/images/delivered.png";
import Image from "next/image";
import Link from "next/link";

const OrderCards = () => {
  const { data, isLoading } = useGetAllOrdersQuery();

  if (isLoading) return <Spin />;

  const pendingOrders = data?.results?.filter(
    (order) => order.orderStatus === "pending"
  );
  const outForDeliveryOrders = data?.results?.filter(
    (order) => order.orderStatus === "out for delivery"
  );
  const cancelledOrders = data?.results?.filter(
    (order) => order.orderStatus === "cancelled"
  );

  const deliveredOrders = data?.results?.filter(
    (order) => order.orderStatus === "delivered"
  );

  const orderData = [
    {
      id: 1,
      name: "Pending Orders",
      count: pendingOrders?.length,
      image: pending,
    },
    {
      id: 2,
      name: "Out For Delivery",
      count: outForDeliveryOrders?.length,
      image: outForDelivery,
    },
    {
      id: 3,
      name: "Cancelled Orders",
      count: cancelledOrders?.length,
      image: cancelled,
    },
    {
      id: 4,
      name: "Delivered Orders",
      count: deliveredOrders?.length,
      image: delivered,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10 lg:mt-20 lg:mb-10">
      {orderData?.map((item) => (
        <Link
          href={`/admin/orders/order`}
          key={item?.id}
          className="flex items-center justify-between gap-5 bg-white p-5 rounded-xl cursor-pointer hover:text-primary"
        >
          <div className="flex items-center gap-2">
            <Image src={item?.image} alt={item?.name} width={40} height={100} />
            <p className="lg:text-base font-semibold">{item?.name}</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{item?.count}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default OrderCards;
