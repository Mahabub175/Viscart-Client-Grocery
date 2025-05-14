"use client";

import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import { useGetAllUsersQuery } from "@/redux/services/auth/authApi";
import { useAddSmsMutation } from "@/redux/services/sms/smsApi";
import { Button, Checkbox, Divider, Form } from "antd";
import { toast } from "sonner";

const BulkSms = () => {
  const { data: users, isFetching } = useGetAllUsersQuery();

  const [sendSms, { isLoading }] = useAddSmsMutation();

  const userOptions = users?.results?.map((item) => ({
    value: item?.number,
    label: item?.name
      ? `${item?.name} (${item?.number})`
      : `User (${item?.number})`,
  }));

  const onSubmit = async (values) => {
    const toastId = toast.loading("Sending SMS...");
    try {
      const payload = {
        message: values.message,
        numbers: [],
      };

      if (values.allUsers) {
        payload.numbers = users?.results
          ?.map((item) => item?.number)
          .filter(Boolean);
      } else {
        if (!values.numbers || values.numbers.length === 0) {
          return toast.info("Please select at least one user.", {
            id: toastId,
          });
        }
        payload.numbers = values.numbers;
      }

      const res = await sendSms(payload);

      if (res.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
      toast.error("Something went wrong. Please try again.", { id: toastId });
    }
  };

  return (
    <section className="lg:w-4/6 mx-auto">
      <Divider orientation="left" orientationMargin={0}>
        Send Bulk SMS
      </Divider>
      <CustomForm onSubmit={onSubmit}>
        <CustomSelect
          label={"Users"}
          name={"numbers"}
          options={userOptions}
          loading={isFetching}
          disabled={isFetching}
          mode={"multiple"}
        />
        <Form.Item name={"allUsers"} valuePropName="checked">
          <Checkbox className="font-semibold">Send to all users</Checkbox>
        </Form.Item>
        <CustomInput
          label={"Message"}
          name={"message"}
          type={"textarea"}
          required
        />
        <Button
          type="primary"
          size="large"
          className="w-full font-bold"
          htmlType="submit"
          disabled
          loading={isLoading}
        >
          Send SMS
        </Button>
      </CustomForm>
    </section>
  );
};

export default BulkSms;
