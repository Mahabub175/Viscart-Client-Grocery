/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Radio, Input, Button } from "antd";
import { useGetSingleCouponByCodeQuery } from "@/redux/services/coupon/couponAPi";
import { useGetSingleGiftCardByCodeQuery } from "@/redux/services/giftCard/giftCardApi";
import { toast } from "sonner";
import moment from "moment";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import Link from "next/link";
import { FaInfoCircle } from "react-icons/fa";

const CheckoutDetails = ({
  subTotal,
  grandTotal,
  code,
  setCode,
  discount,
  setDiscount,
  deliveryOption,
  setDeliveryOption,
  setShippingFee,
  shippingFee,
  setGrandTotal,
  totalCharge,
}) => {
  const [discountOption, setDiscountOption] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const { data: globalData } = useGetAllGlobalSettingQuery();

  const {
    data: couponData,
    isFetching: isCouponFetching,
    error: couponError,
  } = useGetSingleCouponByCodeQuery(code, {
    skip: !code || discountOption !== "coupon",
  });

  const {
    data: giftCardData,
    isFetching: isGiftCardFetching,
    error: giftCardError,
  } = useGetSingleGiftCardByCodeQuery(code, {
    skip: !code || discountOption !== "giftCard",
  });

  useEffect(() => {
    if (deliveryOption === "insideDhaka") {
      setShippingFee(
        parseInt(globalData?.results?.deliveryChargeInsideDhaka) || 0
      );
    } else if (deliveryOption === "outsideDhaka") {
      setShippingFee(
        parseInt(globalData?.results?.deliveryChargeOutsideDhaka) || 0
      );
    }
  }, [deliveryOption, setShippingFee, globalData]);

  const handleCode = () => {
    if (!code) {
      toast.error("Please enter a code");
      return;
    }
    if (!discountOption) {
      toast.error("Please select a discount option");
      return;
    }
    if (isCouponFetching || isGiftCardFetching) {
      toast.loading("Loading...");
    }

    if (couponError?.data?.errorMessage || giftCardError?.data?.errorMessage) {
      toast.error(
        couponError?.data?.errorMessage || giftCardError?.data?.errorMessage
      );
      setDiscount(null);
    } else if (
      (couponData && couponData.minimumAmount > subTotal) ||
      (giftCardData && giftCardData.minimumAmount > subTotal)
    ) {
      toast.error("Minimum amount is not met");
      setDiscount(null);
    } else if (
      (couponData && couponData.expiredDate < moment().format("YYYY-MM-DD")) ||
      (giftCardData && giftCardData.expiredDate < moment().format("YYYY-MM-DD"))
    ) {
      toast.error("This discount code is expired");
      setDiscount(null);
    } else if (
      (couponData && couponData.count < 0) ||
      (giftCardData && giftCardData.count < 0)
    ) {
      toast.error("This discount code usage limit exceeded");
      setDiscount(null);
    } else {
      const appliedDiscount =
        discountOption === "coupon" ? couponData : giftCardData;
      setDiscount(appliedDiscount);
      toast.success("Discount applied");
    }
  };

  useEffect(() => {
    if (!code) {
      setDiscount(null);
      setDiscountAmount(0);
    }
  }, [code]);

  useEffect(() => {
    if (!code || !discount) {
      setDiscountAmount(0);
      return;
    }

    let discountValue = Number(discount.amount) || 0;
    const totalSubTotal = Number(subTotal) || 0;

    if (!discount.type) {
      setDiscountAmount(discountValue);
    } else if (discount.type === "fixed") {
      setDiscountAmount(discountValue);
    } else if (discount.type === "percentage") {
      setDiscountAmount((totalSubTotal * discountValue) / 100);
    } else {
      setDiscountAmount(0);
    }
  }, [subTotal, discount, code, couponData, giftCardData]);

  useEffect(() => {
    const total =
      (Number(subTotal) || 0) +
      (Number(totalCharge) || 0) +
      (Number(shippingFee) || 0) -
      discountAmount;
    setGrandTotal(total);
  }, [subTotal, shippingFee, discountAmount, setGrandTotal, totalCharge]);

  return (
    <>
      <div className="space-y-2 p-5 border-2 border-primary rounded-lg mb-4">
        <p className="font-semibold">Discount Option</p>
        <Radio.Group
          value={discountOption}
          onChange={(e) => setDiscountOption(e.target.value)}
        >
          <Radio value="coupon">Coupon</Radio>
          <Radio value="giftCard">Gift Card</Radio>
        </Radio.Group>
        <div className="flex items-center gap-2 w-full mt-2">
          <Input
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code"
          />
          <Button type="primary" onClick={handleCode}>
            Apply
          </Button>
        </div>
      </div>

      <div className="space-y-2 p-5 border-2 border-primary rounded-lg mb-4">
        <p className="font-semibold">Delivery Option</p>
        <Radio.Group
          value={deliveryOption}
          onChange={(e) => setDeliveryOption(e.target.value)}
        >
          <Radio value="insideDhaka">Inside Dhaka</Radio>
          <Radio value="outsideDhaka">Outside Dhaka</Radio>
        </Radio.Group>
      </div>

      <div className="bg-primaryLight p-5 rounded-lg border-2 border-primary space-y-3 font-semibold">
        <Link
          href={"/delivery"}
          className="text-white rounded px-2 py-2 flex items-center gap-2 justify-center hover:underline font-medium bg-primary lg:w-4/6 mx-auto text-sm"
        >
          Shipping Fee Details
          <FaInfoCircle />
        </Link>
        <div className="flex justify-between items-center">
          <p>Sub Total</p>
          <p>{globalData?.results?.currency + " " + subTotal || 0}</p>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p>
              <span>Shipping Fee </span>
            </p>
          </div>
          <p>
            {globalData?.results?.currency +
              " " +
              (shippingFee + totalCharge) || 0}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <p>Discount</p>
          <p>{globalData?.results?.currency + " " + discountAmount || 0}</p>
        </div>

        <hr className="border border-primary" />

        <div className="flex justify-between items-center">
          <p>Grand Total</p>
          <p>{globalData?.results?.currency + " " + grandTotal || 0}</p>
        </div>
      </div>
    </>
  );
};

export default CheckoutDetails;
