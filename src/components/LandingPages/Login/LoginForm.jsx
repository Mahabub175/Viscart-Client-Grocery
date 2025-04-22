"use client";

import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "@/redux/services/auth/authApi";
import { toast } from "sonner";
import { setUser } from "@/redux/services/auth/authSlice";
import { Checkbox, Form } from "antd";
import { useEffect, useState } from "react";

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [fields, setFields] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (isAdmin) {
      setFields([
        { name: "emailNumber", value: "01700000000", error: "" },
        { name: "password", value: "123456", error: "" },
      ]);
    } else {
      setFields([]);
    }
  }, [isAdmin]);

  const onSubmit = async (values) => {
    const toastId = toast.loading("Logging in...");

    try {
      const res = await login(values).unwrap();
      if (res.success) {
        dispatch(setUser({ user: res.data.user, token: res.data.token }));
        toast.success("Logged in Successfully!", { id: toastId });
        router.push("/");
      }
    } catch (error) {
      toast.error("Invalid credentials. Please try again!", { id: toastId });
    }
  };

  return (
    <div className="lg:w-[450px] mt-6">
      <CustomForm fields={fields} onSubmit={onSubmit}>
        <CustomInput
          label={"Phone Number"}
          name={"emailNumber"}
          type={"text"}
          required={true}
        />
        <CustomInput
          label={"Password"}
          name={"password"}
          type={"password"}
          required={true}
        />
        <Form.Item name="isAdmin" valuePropName="checked">
          <Checkbox
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          >
            Sign in as Admin
          </Checkbox>
        </Form.Item>
        <SubmitButton text={"Log In"} loading={isLoading} fullWidth={true} />
      </CustomForm>
      <div className="flex items-center my-6">
        <div className="border w-full h-0"></div>
        <span className="font-bold">Or</span>
        <div className="border w-full h-0"></div>
      </div>
      <div className="text-center">
        <span>Don’t have an account?</span>
        <Link href={"/sign-up"} className="font-bold text-primary text-lg">
          {" "}
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
