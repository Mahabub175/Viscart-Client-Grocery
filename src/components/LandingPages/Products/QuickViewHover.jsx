"use client";

import QuickProductView from "@/components/Shared/Product/QuickProductView";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import {
  useAddCompareMutation,
  useGetSingleCompareByUserQuery,
} from "@/redux/services/compare/compareApi";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { Tooltip } from "antd";
import { useState } from "react";
import { AiOutlineFullscreen } from "react-icons/ai";
import { FaCodeCompare } from "react-icons/fa6";
import { IoCheckmark } from "react-icons/io5";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useMemo } from "react";

const QuickViewHover = ({ item }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);

  const { data: compareData } = useGetSingleCompareByUserQuery(
    user?._id ?? deviceId
  );

  const [addCompare] = useAddCompareMutation();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const addToCompare = async (id) => {
    const data = {
      ...(user?._id ? { user: user._id } : { deviceId }),
      product: [id],
    };

    const toastId = toast.loading("Adding to Compare");

    try {
      const res = await addCompare(data);
      if (res?.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res?.data?.success) {
        toast.success(res.data.message, { id: toastId });
      }
    } catch (error) {
      console.error("Failed to add item to Compare:", error);
      toast.error("Failed to add item to Compare.", { id: toastId });
    }
  };

  const isItemInCompare = useMemo(() => {
    return compareData?.some((compare) =>
      compare?.product?.some(
        (singleProduct) => String(singleProduct?._id) === String(item?._id)
      )
    );
  }, [compareData, item?._id]);

  return (
    <div className="flex items-center justify-center gap-4 px-3 py-2">
      <Tooltip placement="top" title={"Add to Compare"}>
        <div
          className="text-sm lg:text-xl cursor-pointer hover:scale-110 duration-300 bg-primary text-white p-2 rounded-full"
          onClick={() => addToCompare(item?._id)}
        >
          {!isItemInCompare ? (
            <FaCodeCompare className="rotate-90 text-lg" />
          ) : (
            <IoCheckmark />
          )}
        </div>
      </Tooltip>
      <Tooltip placement="top" title={"Quick View"}>
        <div
          className="text-lg lg:text-2xl cursor-pointer hover:scale-110 duration-300 bg-primary text-white p-2 rounded-full"
          onClick={showModal}
        >
          <AiOutlineFullscreen className="lg:text-xl" />
        </div>
      </Tooltip>

      <QuickProductView
        item={item}
        isModalVisible={isModalVisible}
        handleModalClose={handleModalClose}
      />
    </div>
  );
};

export default QuickViewHover;
