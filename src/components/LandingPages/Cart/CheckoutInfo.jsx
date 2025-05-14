import CustomInput from "@/components/Reusable/Form/CustomInput";
import { Radio, Form, Button } from "antd";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { FaCartShopping } from "react-icons/fa6";
import bkash from "@/assets/images/bkash.png";
import cod from "@/assets/images/cod.png";
import eft from "@/assets/images/bank.png";
import ssl from "@/assets/images/ssl.png";
import nagad from "@/assets/images/nagad.png";
import rocket from "@/assets/images/rocket.png";
import upay from "@/assets/images/upay.png";
import surecash from "@/assets/images/surecash.png";
import point from "@/assets/images/point.png";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";
import { useEffect, useState } from "react";

const CheckoutInfo = ({
  subTotal,
  shippingFee,
  discountAmount,
  grandTotal,
  setGrandTotal,
  isLoading,
}) => {
  const form = Form.useFormInstance();
  const selectedPayment = Form.useWatch("paymentMethod", form);

  const { data: globalData } = useGetAllGlobalSettingQuery();

  const user = useSelector(useCurrentUser);

  const [remainingAmount, setRemainingAmount] = useState(grandTotal);
  const [isDisabled, setIsDisabled] = useState(false);

  const { data: userData } = useGetSingleUserQuery(user?._id, {
    skip: !user?._id,
  });

  const userPoints = userData?.point?.toFixed(2) || 0;
  const pointConversion = globalData?.results?.pointConversion || 1;
  const pointsAsCurrency = userPoints / pointConversion;

  const imageMap = {
    cod: cod,
    bkash: bkash,
    bank: eft,
    ssl: ssl,
    Nagad: nagad,
    Bkash: bkash,
    Rocket: rocket,
    Upay: upay,
    SureCash: surecash,
  };

  const manualPayments =
    Array.isArray(globalData?.results?.manualPayments) &&
    globalData.results.manualPayments.filter(
      (item) => item.status === "Active"
    );

  const paymentOptions = [
    {
      value: "cod",
      label: "Cash on Delivery",
      image: imageMap.cod,
      info: globalData?.results?.codMessage,
    },
    ...(globalData?.results?.bkash === "Active"
      ? [
          {
            value: "bkash",
            label: "BKash",
            image: imageMap.bkash,
            info: globalData?.results?.bkashMessage,
          },
        ]
      : []),
    ...(globalData?.results?.ssl === "Active"
      ? [
          {
            value: "ssl",
            label: "SSLCommerz",
            image: imageMap.ssl,
            info: "SSLCommerz: You will be redirected to the SSLCommerz payment gateway.",
          },
        ]
      : []),
    ...(manualPayments
      ? manualPayments.map((item) => ({
          value: "manual" + item.name,
          label: item.name,
          image: imageMap[item.name] || null,
          info: item.description,
          details: (
            <>
              <CustomInput
                type="text"
                name="tranId"
                label="Transaction ID"
                required
              />
              <CustomInput
                type="text"
                name="transaction Number"
                label="Sender Number"
              />
            </>
          ),
        }))
      : []),
    ...(globalData?.results?.bank === "Active"
      ? [
          {
            value: "bank",
            label: "EFT/RTGS",
            image: imageMap.bank,
            info: globalData?.results?.bankMessage,
          },
        ]
      : []),
    ...(globalData?.results?.usePointSystem
      ? [
          {
            value: "point",
            label: `Use Points (${userPoints} points)`,
            image: point,
            info: `
              <p><strong>Available Points:</strong> ${userPoints}</p>
              <p><strong>Conversion Rate:</strong> ${pointConversion} points = 1 ${
              globalData?.results?.currency
            }</p>
              <p><strong>Points Value:</strong> ${pointsAsCurrency.toFixed(
                2
              )} ${globalData?.results?.currency}</p>
            `,
          },
        ]
      : []),
  ];

  useEffect(() => {
    if (selectedPayment === "point") {
      const total = subTotal + shippingFee - discountAmount;
      if (pointsAsCurrency >= total) {
        setRemainingAmount(0);
        setIsDisabled(false);
        setGrandTotal(0);
      } else {
        const remaining = total - pointsAsCurrency;
        setRemainingAmount(remaining);
        setIsDisabled(true);
        setGrandTotal(remaining);
      }
    } else {
      const total = subTotal + shippingFee - discountAmount;
      setRemainingAmount(total);
      setGrandTotal(total);
      setIsDisabled(false);
    }
  }, [selectedPayment, userPoints, subTotal, shippingFee, discountAmount]);

  return (
    <div>
      <CustomInput type="text" name="name" label="Name" required />
      <CustomInput type="number" name="number" label="Number" required />
      <CustomInput type="textarea" name="address" label="Address" required />

      <Form.Item
        name="paymentMethod"
        label="Payment Method"
        required
        rules={[{ required: true, message: `Payment Method is required` }]}
      >
        <Radio.Group className="flex flex-col gap-4">
          {paymentOptions.map((option) => (
            <div key={option.value} className="flex flex-col">
              <Radio value={option.value}>
                <div className="font-semibold flex items-center gap-2 -my-3">
                  <span>{option.label}</span>
                  <Image
                    src={option.image}
                    alt={option.label}
                    width={50}
                    className="object-contain"
                  />
                </div>
              </Radio>
              {selectedPayment === option.value && (
                <div
                  className="mt-1 pl-6 text-sm text-primary font-semibold"
                  dangerouslySetInnerHTML={{ __html: option.info }}
                />
              )}
              {selectedPayment === "manual" + option.label && (
                <div className="mt-5 -mb-5 pl-5">
                  <CustomInput
                    type="text"
                    name="tranId"
                    label="Transaction ID"
                    required
                  />
                  <CustomInput
                    type="text"
                    name="transactionNumber"
                    label="Sender Number"
                  />
                </div>
              )}
            </div>
          ))}
        </Radio.Group>
      </Form.Item>

      {selectedPayment === "point" && (
        <div className="mb-5 pl-1">
          {grandTotal === 0 ? (
            <p className="text-green-600">
              Your order is fully covered by points!
            </p>
          ) : remainingAmount > 0 ? (
            <p className="text-red-600">
              You need{" "}
              <strong>{(remainingAmount * pointConversion).toFixed(2)}</strong>{" "}
              more points to complete the purchase.
            </p>
          ) : (
            <p className="text-green-600">
              Your order is fully covered by points!
            </p>
          )}
        </div>
      )}

      <Button
        htmlType="submit"
        size="large"
        icon={<FaCartShopping />}
        className={`bg-navyBlue text-white font-bold px-10 w-full`}
        loading={isLoading}
        disabled={isLoading || isDisabled}
      >
        Order Now
      </Button>
    </div>
  );
};

export default CheckoutInfo;
