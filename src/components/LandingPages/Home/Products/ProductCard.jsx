import { Tooltip } from "antd";
import Image from "next/image";
import React, { useState } from "react";
import QuickViewHover from "../../Products/QuickViewHover";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import LinkButton from "@/components/Shared/LinkButton";
import QuickProductView from "@/components/Shared/Product/QuickProductView";
import { useSelector } from "react-redux";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useAddWishlistMutation } from "@/redux/services/wishlist/wishlistApi";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { toast } from "sonner";
import { TbHeart } from "react-icons/tb";
import { useAddCartMutation } from "@/redux/services/cart/cartApi";
import Link from "next/link";
import { calculateDiscountPercentage } from "@/utilities/lib/discountCalculator";

const ProductCard = ({ item }) => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const [isHovered, setIsHovered] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const deviceId = useSelector(useDeviceId);
  const [addCart] = useAddCartMutation();
  const [addWishlist] = useAddWishlistMutation();
  const user = useSelector(useCurrentUser);

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const addToWishlist = async (id) => {
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

  const addToCart = async () => {
    const data = {
      ...(user?._id ? { user: user._id } : { deviceId }),
      product: item?._id,
      quantity: 1,
      sku: item?.sku,
      price: item?.offerPrice ? item?.offerPrice : item?.sellingPrice,
    };

    const toastId = toast.loading("Adding to cart");

    try {
      const res = await addCart(data);
      if (res?.data?.success) {
        toast.success(res.data.message, { id: toastId });
      }
      if (res?.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      toast.error("Failed to add item to cart.", { id: toastId });
    }
  };

  const discountPercentage = calculateDiscountPercentage(
    item?.sellingPrice,
    item?.offerPrice
  );

  return (
    <div
      className="relative group w-full lg:w-[200px] mx-auto h-[330px] lg:h-[360px] hover:shadow-xl duration-500 flex flex-col border border-gray-200 bg-white rounded-xl overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Tooltip placement="top" title={"Add to Wishlist"}>
        <div
          className="text-sm absolute top-2 right-2 z-10 lg:text-xl cursor-pointer hover:scale-110 duration-300 text-white p-2"
          onClick={() => addToWishlist(item?._id)}
        >
          <TbHeart />
        </div>
      </Tooltip>
      <div className="relative overflow-hidden rounded-t-xl">
        <Link href={`/products/${item?.slug}`}>
          {item?.video && isHovered ? (
            <video
              src={formatImagePath(item?.video)}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              autoPlay
              muted
              controls={false}
              className="w-full h-[160px] lg:h-[220px] rounded-t-xl object-cover"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image
              src={
                item?.mainImage
                  ? formatImagePath(item?.mainImage)
                  : "https://thumbs.dreamstime.com/b/demo-demo-icon-139882881.jpg"
              }
              alt={item?.name}
              width={200}
              height={220}
              className="rounded-t-xl w-full lg:w-[200px] h-[160px] lg:h-[220px] group-hover:scale-110 duration-500"
            />
          )}
        </Link>
        <div className="hidden lg:block absolute inset-x-0 bottom-0 transform translate-y-full group-hover:translate-y-0 duration-500 z-10">
          <QuickViewHover item={item} />
        </div>
        <div className="lg:hidden">
          <QuickViewHover item={item} />
        </div>
        {discountPercentage > 0 && (
          <p className="text-xs font-medium absolute top-2 bg-blue-500 text-white left-2 p-1 rounded-xl">
            -{discountPercentage}%
          </p>
        )}
      </div>

      <div className="px-2">
        <div>
          <LinkButton href={`/products/${item?.slug}`}>
            <Tooltip placement="top" title={item?.name}>
              <h2 className="text-sm text-start md:text-[15px] mt-2 lg:mt-3 hover:text-gray-500 duration-300 mb-1">
                {item?.name.length > 40
                  ? item.name.slice(0, 40).concat("...")
                  : item.name}
              </h2>
            </Tooltip>
          </LinkButton>
        </div>
        {item?.weight && item?.unit && (
          <p className="text-xs text-black/60 mt-1">
            {item?.weight} {item?.unit?.name}
          </p>
        )}
      </div>
      <div>
        <div className="flex justify-between items-center mb-2 px-2 absolute bottom-0 w-full">
          <div>
            {(item?.offerPrice || item?.offerPrice > 0) && (
              <p className="text-xs line-through text-black/60">
                {globalData?.results?.currency + " " + item?.sellingPrice}
              </p>
            )}
            {item?.offerPrice || item?.offerPrice > 0 ? (
              <p className="text-black text-xs lg:text-base text-primary font-medium">
                {globalData?.results?.currency + " " + item?.offerPrice}
              </p>
            ) : (
              <p className="text-black text-xs lg:text-base text-primary font-medium">
                {globalData?.results?.currency + " " + item?.sellingPrice}
              </p>
            )}
          </div>
          <div className="text-center text-[10px]">
            {!item?.stock > 0 ? (
              <div className="text-red-500">(Out Of Stock)</div>
            ) : (
              <div className="text-green-500">(In Stock)</div>
            )}
          </div>

          <div className="bg-primary border border-primary hover:bg-transparent duration-300 hover:text-primary px-2 lg:px-4 py-2 text-white rounded-xl text-xs lg:text-sm">
            {item?.isVariant || item?.variants?.length > 0 ? (
              <LinkButton href={`/products/${item?.slug}`}>
                <div>Details</div>
              </LinkButton>
            ) : (
              <button onClick={addToCart}>Add</button>
            )}
          </div>
        </div>
      </div>

      <QuickProductView
        item={item}
        isModalVisible={isModalVisible}
        handleModalClose={handleModalClose}
      />
    </div>
  );
};

export default ProductCard;
