import {
  useLoginMutation,
  useSignUpMutation,
} from "@/redux/services/auth/authApi";
import { setUser, useCurrentUser } from "@/redux/services/auth/authSlice";
import { useDeviceId } from "@/redux/services/device/deviceSlice";
import { useAddOrderMutation } from "@/redux/services/order/orderApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import CheckoutDetails from "../Cart/CheckoutDetails";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CheckoutInfo from "../Cart/CheckoutInfo";
import { sendGTMEvent } from "@next/third-parties/google";
import useGetURL from "@/utilities/hooks/useGetURL";
import { useAddServerTrackingMutation } from "@/redux/services/serverTracking/serverTrackingApi";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";

const SingleProductCart = ({ item, count, productId, productName }) => {
  const router = useRouter();
  const user = useSelector(useCurrentUser);
  const dispatch = useDispatch();
  const deviceId = useSelector(useDeviceId);
  const { data: globalData } = useGetAllGlobalSettingQuery();

  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [signUp, { isLoading: signUpLoading }] = useSignUpMutation();

  const [addOrder, { isLoading }] = useAddOrderMutation();

  const [subTotal, setSubTotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [code, setCode] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("insideDhaka");
  const [discount, setDiscount] = useState(null);
  const [grandTotal, setGrandTotal] = useState(0);

  const url = useGetURL();
  const [addServerTracking] = useAddServerTrackingMutation();

  useEffect(() => {
    if (!item) return;

    sendGTMEvent({ event: "PageViewSingleCartPage", value: url });

    const data = {
      event: "PageViewSingleCartPage",
      data: {
        event_source_url: url,
      },
    };
    addServerTracking(data);

    const price =
      item.offerPrice > 0 ? item.offerPrice * count : item.sellingPrice * count;

    setSubTotal(price);
  }, [item, url, count]);

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
        products: [
          {
            product: productId,
            productName:
              productName +
              (item?.attributeCombination?.length > 0
                ? `(${item?.attributeCombination
                    ?.map((combination) => combination?.name)
                    .join(" ")})`
                : ""),
            quantity: count,
            sku: item?.sku,
          },
        ],
        shippingFee,
        extraFee: 0,
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
    <section className="">
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="w-full">
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
            totalCharge={0}
          />
        </div>
        <div className="border-2 border-primary rounded-lg p-5 w-full">
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
    </section>
  );
};

export default SingleProductCart;
