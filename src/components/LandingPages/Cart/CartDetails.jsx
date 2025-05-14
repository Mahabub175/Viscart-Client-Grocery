"use client";

import deleteImage from "@/assets/images/Trash-can.png";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import { setUser, useCurrentUser } from "@/redux/services/auth/authSlice";
import {
  useDeleteBulkCartMutation,
  useDeleteCartMutation,
  useGetSingleCartByUserQuery,
} from "@/redux/services/cart/cartApi";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { useAddOrderMutation } from "@/redux/services/order/orderApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import CheckoutDetails from "./CheckoutDetails";
import CheckoutInfo from "./CheckoutInfo";
import {
  useLoginMutation,
  useSignUpMutation,
} from "@/redux/services/auth/authApi";
import { sendGTMEvent } from "@next/third-parties/google";
import useGetURL from "@/utilities/hooks/useGetURL";
import { useAddServerTrackingMutation } from "@/redux/services/serverTracking/serverTrackingApi";

const CartDetails = () => {
  const router = useRouter();
  const user = useSelector(useCurrentUser);
  const dispatch = useDispatch();
  const deviceId = useSelector(useDeviceId);
  const { data: globalData } = useGetAllGlobalSettingQuery();

  const { data: cartData, isError } = useGetSingleCartByUserQuery(
    user?._id ?? deviceId
  );

  const [deleteCart] = useDeleteCartMutation();
  const [deleteBulkCart] = useDeleteBulkCartMutation();

  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [signUp, { isLoading: signUpLoading }] = useSignUpMutation();

  const [addOrder, { isLoading }] = useAddOrderMutation();

  const [counts, setCounts] = useState({});
  const [weight, setWeight] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [code, setCode] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("insideDhaka");
  const [discount, setDiscount] = useState(null);
  const [grandTotal, setGrandTotal] = useState(0);

  const url = useGetURL();
  const [addServerTracking] = useAddServerTrackingMutation();

  useEffect(() => {
    if (cartData) {
      setSubTotal(
        cartData?.reduce((acc, item) => acc + item.price * item.quantity, 0)
      );
      setCounts(
        cartData?.reduce(
          (acc, item) => ({ ...acc, [item._id]: Number(item.quantity) || 1 }),
          {}
        )
      );

      setWeight(
        cartData?.reduce(
          (acc, item) => ({
            ...acc,
            [item._id]: Number(item.weight) || 0,
          }),
          {}
        )
      );
    }
  }, [cartData]);

  const extraCharge = cartData?.map(
    (item) =>
      item?.weight ||
      0 * globalData?.results?.pricePerWeight * (counts[item._id] || 1)
  );

  const totalCharge = Math.max(
    extraCharge?.reduce((total, charge) => total + charge, 0) -
      globalData?.results?.pricePerWeight,
    0
  );

  const handleDelete = (itemId) => {
    deleteCart(itemId);
    toast.success("Product removed from cart");
  };

  const handleUserAuth = async (values) => {
    try {
      if (user) return user?._id;

      const signUpData = {
        name: values?.name,
        number: values?.number,
        password: values?.number,
      };

      try {
        const signUpResponse = await signUp(signUpData).unwrap();
        const loginData = {
          emailNumber: values?.number,
          defaultPassword: values?.number,
        };

        const loginResponse = await login(loginData).unwrap();
        if (loginResponse.success) {
          dispatch(
            setUser({
              user: loginResponse.data.user,
              token: loginResponse.data.token,
            })
          );
        }
        return signUpResponse?.data?._id;
      } catch (error) {
        if (error?.data?.errorMessage === "number already exists") {
          try {
            const loginData = {
              emailNumber: values?.number,
              defaultPassword: values?.number,
            };

            const loginResponse = await login(loginData).unwrap();
            if (loginResponse.success) {
              dispatch(
                setUser({
                  user: loginResponse.data.user,
                  token: loginResponse.data.token,
                })
              );
              return loginResponse.data.user._id;
            }
          } catch (loginError) {
            toast.error("Failed to login. Please try again!");
          }
        } else {
          toast.error("Sign-up failed. Please try again!");
        }
      }
    } catch (error) {
      toast.error("Authentication process failed!");
    }
    return null;
  };

  const onSubmit = async (values) => {
    const toastId = toast.loading("Creating Order...");

    try {
      const userId = await handleUserAuth(values);

      if (!userId) {
        toast.error("User authentication failed!", { id: toastId });
        return;
      }

      const submittedData = {
        ...values,
        user: userId,
        deviceId,
        products: cartData?.map((item) => ({
          product: item?.productId,
          productName:
            item?.productName +
            (item?.variant && item?.variant?.attributeCombination?.length > 0
              ? ` (${item?.variant?.attributeCombination
                  ?.map((combination) => combination?.name)
                  .join(" ")})`
              : ""),
          quantity: item?.quantity,
          weight: item?.weight,
          sku: item?.sku,
        })),
        shippingFee,
        extraFee: totalCharge,
        paymentType: values?.paymentMethod,
        discount,
        deliveryOption,
        code,
        subTotal: parseFloat(subTotal?.toFixed(2)),
        grandTotal: Number(grandTotal?.toFixed(2)),
      };

      if (values.paymentType === "cod") {
        submittedData.paymentMethod = "cod";
        submittedData.paymentType = "COD";
      }
      if (
        typeof values.paymentMethod === "string" &&
        values.paymentMethod.startsWith("manual")
      ) {
        submittedData.paymentMethod = "manual";
      }

      if (values.paymentType === "point") {
        submittedData.paymentMethod = "point";
        submittedData.point =
          (subTotal + shippingFee - discount) *
          (globalData?.results?.pointConversion || 1);
      }

      const data = new FormData();
      appendToFormData(submittedData, data);

      const res = await addOrder(data);

      if (res?.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      } else if (res?.data?.success) {
        sendGTMEvent({ event: "Purchase", value: submittedData });
        const data = {
          event: "Purchase",
          data: {
            ...submittedData,
            event_source_url: url,
          },
        };
        await addServerTracking(data);

        if (res?.data?.data?.gatewayUrl) {
          window.location.href = res?.data?.data?.gatewayUrl;
        }

        toast.success(res.data.message, { id: toastId });

        const cartIds = cartData?.map((item) => item._id);
        await deleteBulkCart(cartIds);

        router.push("/success");
      }
    } catch (error) {
      toast.error("Something went wrong while creating Order!", {
        id: toastId,
      });
      console.error("Error creating Order:", error, { id: toastId });
    }
  };

  return (
    <section className="container mx-auto px-5 lg:py-10 relative rounded-lg mb-10">
      <h2 className="font-normal text-2xl">Order List</h2>
      <div>
        {cartData?.length === 0 || !cartData || isError ? (
          <div className="flex items-center justify-center bg-white shadow-xl rounded-xl p-10 my-10">
            <h2 className="lg:text-2xl font-bold text-black/80 text-center text-xl">
              Please add a product to cart to see them here
            </h2>
          </div>
        ) : (
          <div>
            <h2 className="font-normal text-xl mt-6">
              {cartData?.length} Items
            </h2>
            <div className="flex flex-col lg:flex-row items-start gap-4 justify-between my-10">
              <div className="lg:w-3/6 border-2 border-primary rounded-lg p-5 lg:sticky top-10 w-full">
                {cartData?.map((item) => (
                  <div
                    key={item?._id}
                    className="flex flex-col xl:flex-row items-center gap-4 justify-center pb-5 mt-5 first:mt-0 border-b border-gray-300 last:border-b-0"
                  >
                    <div className="flex flex-[3] items-center gap-4">
                      <Image
                        src={formatImagePath(item?.image)}
                        alt={item?.product?.name || "Product Image"}
                        width={128}
                        height={128}
                        className="w-28 h-28 rounded-xl border-2 border-primary"
                      />
                      <div>
                        <Link
                          href={`/products/${item?.slug}`}
                          className="text-base font-normal hover:underline"
                        >
                          {item?.productName}
                          {item?.variant &&
                            ` (${item?.variant?.attributeCombination
                              ?.map((combination) => combination?.name)
                              .join(" ")})`}
                        </Link>
                        <div className="mt-2 font-semibold">
                          Quantity: {counts[item._id]}
                        </div>
                        {item?.weight > 0 ? (
                          <div className="mt-2 font-semibold">
                            Weight:{" "}
                            {(weight[item._id] * counts[item._id]).toFixed(1)}{" "}
                            KG
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-1 items-center gap-4">
                      <p className="text-primary text-2xl font-bold">
                        {globalData?.results?.currency +
                          " " +
                          item?.price * counts[item._id]}
                      </p>
                    </div>
                    <div
                      onClick={() => handleDelete(item?._id)}
                      className="flex-1 "
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
              <div className="lg:w-4/12 w-full">
                <CheckoutDetails
                  subTotal={subTotal}
                  grandTotal={grandTotal}
                  code={code}
                  setCode={setCode}
                  setDeliveryOption={setDeliveryOption}
                  deliveryOption={deliveryOption}
                  setDiscount={setDiscount}
                  discount={discount}
                  shippingFee={shippingFee}
                  setShippingFee={setShippingFee}
                  setGrandTotal={setGrandTotal}
                  totalCharge={totalCharge}
                />
              </div>

              <div className="lg:w-2/6 w-full border-2 border-primary rounded-lg p-5">
                <CustomForm onSubmit={onSubmit}>
                  <CheckoutInfo
                    grandTotal={grandTotal}
                    setGrandTotal={setGrandTotal}
                    globalData={globalData?.results}
                    subTotal={subTotal}
                    shippingFee={shippingFee}
                    discountAmount={discount}
                    isLoading={isLoading || loginLoading || signUpLoading}
                  />
                </CustomForm>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CartDetails;
