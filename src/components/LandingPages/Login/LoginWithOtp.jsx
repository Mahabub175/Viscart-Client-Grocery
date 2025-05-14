import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import {
  useForgotPasswordMutation,
  useLoginMutation,
} from "@/redux/services/auth/authApi";
import { setUser } from "@/redux/services/auth/authSlice";
import { verifyToken } from "@/utilities/lib/verifyToken";
import { Modal } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const LoginWithOtp = () => {
  const [openModal, setOpenModal] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const onSubmit = async (values) => {
    if (otp) {
      if (values.otp !== otp) {
        toast.error("Invalid OTP!");
        return;
      }
      try {
        const res = await login(values).unwrap();
        if (res.success) {
          dispatch(setUser({ user: res.data.user, token: res.data.token }));
          setOpenModal(false);
          setOtp("");
          toast.success("Logged in Successfully!");
          router.push("/");
        }
      } catch (error) {
        toast.error("Invalid credentials. Please try again!");
        setOtp("");
      }
    } else {
      try {
        const res = await forgotPassword({
          number: values.emailNumber,
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
        Log in with OTP!
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
          <CustomInput name={"emailNumber"} label={"Phone Number"} required />
          {otp && (
            <>
              <CustomInput name={"otp"} label={"OTP"} required />
              <p
                className="hover:underline hover:text-blue-500 duration-300 -mt-2 mb-4"
                onClick={() => setOtp("")}
              >
                Try Again?
              </p>
            </>
          )}
          <SubmitButton
            text={otp ? "Log in" : "Send OTP"}
            loading={isLoading || isLoginLoading}
            fullWidth
          />
        </CustomForm>
      </Modal>
    </div>
  );
};

export default LoginWithOtp;
