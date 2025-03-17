/* eslint-disable react-hooks/exhaustive-deps */
import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";
import { useCurrentUser } from "@/redux/services/auth/authSlice";
import { Form } from "antd";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const CheckoutInfo = ({
  grandTotal,
  setGrandTotal,
  globalData,
  subTotal,
  shippingFee,
  discountAmount,
  isOrderLoading,
  isSignUpLoading,
  isLoginLoading,
}) => {
  const form = Form.useFormInstance();
  const paymentType = Form.useWatch("paymentType", form);
  const user = useSelector(useCurrentUser);
  const { data: userData } = useGetSingleUserQuery(user?._id, {
    skip: !user?._id,
  });

  const [remainingAmount, setRemainingAmount] = useState(grandTotal);
  const [isDisabled, setIsDisabled] = useState(false);

  const userPoints = userData?.point || 0;
  const pointConversion = globalData?.pointConversion || 1;
  const pointsAsCurrency = userPoints / pointConversion;

  useEffect(() => {
    if (paymentType === "point") {
      if (pointsAsCurrency >= grandTotal) {
        setRemainingAmount(0);
        setIsDisabled(false);
      } else {
        setRemainingAmount(grandTotal - pointsAsCurrency);
        setIsDisabled(true);
      }
    } else {
      setRemainingAmount(subTotal + shippingFee - discountAmount);
      setGrandTotal(subTotal + shippingFee - discountAmount);
      setIsDisabled(false);
    }
  }, [paymentType, subTotal, discountAmount, shippingFee, grandTotal]);

  const paymentOptions = [
    { value: "manual", label: "Manual" },
    { value: "cod", label: "Cash on Delivery" },
    ...(globalData?.ssl === "Active"
      ? [{ value: "ssl", label: "SSL Commerz" }]
      : []),
    ...(userPoints > 0
      ? [{ value: "point", label: `Use Points (${userPoints} points)` }]
      : []),
  ];

  return (
    <div>
      <CustomInput type="text" name="name" label="Name" required />
      <CustomInput type="number" name="number" label="Number" required />
      <CustomInput type="textarea" name="address" label="Address" required />
      <CustomSelect
        name="paymentType"
        label="Payment Type"
        options={paymentOptions}
        required
      />

      {paymentType === "manual" && (
        <div>
          <CustomSelect
            name="paymentMethod"
            label="Payment Method"
            options={[
              { value: "bkash", label: "Bkash" },
              { value: "nagad", label: "Nagad" },
              { value: "rocket", label: "Rocket" },
              { value: "upay", label: "Upay" },
            ]}
            required
          />
          <CustomInput
            type="text"
            name="tranId"
            label="Transaction ID"
            required
          />
        </div>
      )}

      {paymentType === "point" && (
        <div className="mb-5">
          <p>
            <strong>Available Points:</strong> {userPoints}
          </p>
          <p>
            <strong>Conversion Rate:</strong> {pointConversion} points = 1
            {globalData?.currency}
          </p>
          <p>
            <strong>Points Value:</strong> {pointsAsCurrency.toFixed(2)}{" "}
            {globalData?.currency}
          </p>

          {grandTotal === 0 ? (
            <p style={{ color: "green" }}>
              Your order is fully covered by points!
            </p>
          ) : remainingAmount > 0 ? (
            <p style={{ color: "red" }}>
              You need{" "}
              <strong>{remainingAmount.toFixed(2) * pointConversion}</strong>{" "}
              more points to complete the purchase.
            </p>
          ) : (
            <p style={{ color: "green" }}>
              Your order is fully covered by points!
            </p>
          )}
        </div>
      )}

      <SubmitButton
        fullWidth
        text="Order Now"
        disabled={
          isDisabled || isLoginLoading || isOrderLoading || isSignUpLoading
        }
        loading={isOrderLoading || isSignUpLoading || isLoginLoading}
      />
    </div>
  );
};

export default CheckoutInfo;
