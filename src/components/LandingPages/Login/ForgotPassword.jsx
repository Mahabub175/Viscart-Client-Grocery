import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "@/redux/services/auth/authApi";
import { verifyToken } from "@/utilities/lib/verifyToken";
import { Modal } from "antd";
import { useState } from "react";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [openModal, setOpenModal] = useState(false);
  const [otp, setOtp] = useState("");

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetLoading }] =
    useResetPasswordMutation();

  const onSubmit = async (values) => {
    if (otp) {
      if (values.otp !== otp) {
        toast.error("Invalid OTP!");
        return;
      }
      try {
        const response = await resetPassword({
          number: values.number,
          otp: values.otp,
          newPassword: values.newPassword,
        }).unwrap();
        if (response.success) {
          toast.success("Password reset successfully!");
          setOpenModal(false);
          setOtp("");
        } else {
          toast.error("Failed to reset password. Please try again!");
          setOtp("");
        }
      } catch (error) {
        toast.error(
          error.data?.message || "Error resetting password. Please try again."
        );
        setOtp("");
      }
    } else {
      try {
        const res = await forgotPassword({
          number: values.number,
        });
        if (res.error) {
          toast.error(res?.error?.data?.errorMessage);
        }
        if (res.data.success) {
          toast.success(res.data.message);
          const decodedToken = verifyToken(res.data.data.otp);
          setOtp(decodedToken?.otp);
        }
      } catch (error) {
        toast.error(
          error.data?.message || "Error sending OTP. Please try again."
        );
      }
    }
  };

  return (
    <div className="-mt-2 mb-4">
      <p
        className="hover:underline hover:text-blue-500 duration-300 inline-flex cursor-pointer"
        onClick={() => setOpenModal(true)}
      >
        Forgot Password?
      </p>

      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        centered
        destroyOnClose
        keyboard
      >
        <CustomForm onSubmit={onSubmit}>
          <CustomInput name={"number"} label={"Phone Number"} required />
          {otp && (
            <>
              <CustomInput name={"otp"} label={"OTP"} required />
              <CustomInput
                name={"newPassword"}
                label={"New Password"}
                type="password"
                required
              />
              <p
                className="hover:underline hover:text-blue-500 duration-300 -mt-2 mb-4"
                onClick={() => setOtp("")}
              >
                Try Again?
              </p>
            </>
          )}
          <SubmitButton
            text={otp ? "Reset Password" : "Send OTP"}
            loading={isLoading || isResetLoading}
            fullWidth
          />
        </CustomForm>
      </Modal>
    </div>
  );
};

export default ForgotPassword;
