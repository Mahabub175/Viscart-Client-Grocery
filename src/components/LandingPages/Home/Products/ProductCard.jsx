import { Tooltip } from "antd";
import Image from "next/image";
import React, { useState } from "react";
import QuickViewHover from "../../Products/QuickViewHover";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { usePathname } from "next/navigation";
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

const ProductCard = ({ item }) => {
  const { data: globalData } = useGetAllGlobalSettingQuery();
  const pathname = usePathname();
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

  return (
    <div
      className="relative group lg:w-[220px] mx-auto h-[330px] lg:h-[360px] flex flex-col border border-gray-200 bg-white rounded-xl overflow-hidden"
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
                pathname === "/products"
                  ? item?.mainImage
                  : formatImagePath(item?.mainImage)
              }
              alt={item?.name}
              width={230}
              height={220}
              className="rounded-t-xl w-[250px] h-[160px] lg:h-[220px] group-hover:scale-110 duration-500"
            />
          )}
        </Link>
        <div className="hidden lg:block absolute inset-x-0 bottom-0 transform translate-y-full group-hover:translate-y-0 duration-500 z-10">
          <QuickViewHover item={item} />
        </div>
        <div className="lg:hidden">
          <QuickViewHover item={item} />
        </div>
      </div>

      <div className="px-2">
        <div>
          <LinkButton href={`/products/${item?.slug}`}>
            <Tooltip placement="top" title={item?.name}>
              <h2 className="text-sm text-start md:text-base mt-2 lg:mt-3 hover:text-gray-500 duration-300 mb-1">
                {item?.name.length > 40
                  ? item.name.slice(0, 40).concat("...")
                  : item.name}
              </h2>
            </Tooltip>
          </LinkButton>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-2 px-2 absolute bottom-0 w-full">
          <div>
            {(item?.offerPrice || item?.offerPrice > 0) && (
              <p className="text-xs lg:text-base line-through text-black/60">
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
