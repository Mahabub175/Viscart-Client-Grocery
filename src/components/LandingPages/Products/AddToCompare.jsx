import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useAddCompareMutation } from "@/redux/services/compare/compareApi";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useAddWishlistMutation } from "@/redux/services/wishlist/wishlistApi";
import { Tooltip } from "antd";
import { FaCodeCompare } from "react-icons/fa6";
import { TbHeart } from "react-icons/tb";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const AddToCompare = ({ item }) => {
  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);

  const [addCompare] = useAddCompareMutation();
  const [addWishlist] = useAddWishlistMutation();

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

  const addToWishlist = async (id) => {
    console.log(id);
    const data = {
      ...(user?._id ? { user: user._id } : { deviceId }),
      product: id,
    };

    const toastId = toast.loading("Adding to wishlist");

    try {
      const res = await addWishlist(data);
      if (res?.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res?.data?.success) {
        toast.success(res.data.message, { id: toastId });
      }
    } catch (error) {
      console.error("Failed to add item to wishlist:", error);
      toast.error("Failed to add item to wishlist.", { id: toastId });
    }
  };
  return (
    <div className="flex justify-center lg:justify-start items-center gap-5">
      <Tooltip placement="top" title={"Add To Compare"}>
        <div
          className="text-lg lg:text-2xl flex items-center gap-2 cursor-pointer"
          onClick={() => addToCompare(item?._id)}
        >
          <FaCodeCompare className="rotate-90" />
          <span className="text-base">Add To Compare</span>
        </div>
      </Tooltip>
      <Tooltip placement="top" title={"Add To Wishlist"}>
        <div
          className="text-lg lg:text-2xl flex items-center gap-2 cursor-pointer"
          onClick={() => addToWishlist(item?._id)}
        >
          <TbHeart />
          <span className="text-base">Add To Wishlist</span>
        </div>
      </Tooltip>
    </div>
  );
};

export default AddToCompare;
