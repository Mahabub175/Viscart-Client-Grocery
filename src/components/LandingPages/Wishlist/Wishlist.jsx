"use client";

import deleteImage from "@/assets/images/Trash-can.png";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useGetAllProductsQuery } from "@/redux/services/product/productApi";
import {
  useDeleteWishlistMutation,
  useGetSingleWishlistByUserQuery,
} from "@/redux/services/wishlist/wishlistApi";
import Image from "next/image";
import { useSelector } from "react-redux";
import ProductCard from "../Home/Products/ProductCard";

const Wishlist = () => {
  const user = useSelector(useCurrentUser);
  const deviceId = useSelector(useDeviceId);

  const { data: wishlistData, isError } = useGetSingleWishlistByUserQuery(
    user?._id ?? deviceId
  );

  const { data: products } = useGetAllProductsQuery();

  const wishlistProducts = products?.results
    ?.map((product) => {
      const matchedWishlistItem = wishlistData?.find(
        (wishlistItem) => wishlistItem?.product?._id === product?._id
      );

      return {
        ...product,
        wishlistId: matchedWishlistItem?._id || null,
      };
    })
    .filter((product) => product.wishlistId);

  const [deleteWishlist] = useDeleteWishlistMutation();

  const handleDelete = (itemId) => {
    deleteWishlist(itemId);
  };

  return (
    <section className="container mx-auto px-5 pb-10 lg:pb-0 lg:py-10">
      <h2 className="font-normal text-2xl">My Wishlist</h2>
      <div>
        {wishlistData?.length === 0 || !wishlistData || isError ? (
          <div className="flex items-center justify-center my-10 bg-white p-10 rounded-xl shadow">
            <h2 className="lg:text-2xl font-bold text-black/80 text-center text-xl">
              Please add a product to wishlist to see them here
            </h2>
          </div>
        ) : (
          <div>
            <h2 className="font-normal text-xl mt-6">
              {wishlistData?.length} Items
            </h2>
            <div className="mt-10 grid grid-cols-2 lg:grid-cols-3 lg:flex lg:flex-wrap justify-center items-center gap-5">
              {wishlistProducts?.map((item) => (
                <div key={item?._id}>
                  <ProductCard item={item} />
                  <div
                    onClick={() => handleDelete(item?.wishlistId)}
                    className="mt-2"
                  >
                    <Image
                      height={20}
                      width={20}
                      src={deleteImage}
                      alt="delete image"
                      className="w-8 h-8 mx-auto hover:cursor-pointer hover:scale-110 duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Wishlist;
