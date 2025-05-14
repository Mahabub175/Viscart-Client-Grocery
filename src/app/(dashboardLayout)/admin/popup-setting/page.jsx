"use client";

import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import FileUploader from "@/components/Reusable/Form/FileUploader";
import {
  useGetAllGlobalSettingQuery,
  useUpdateGlobalSettingMutation,
} from "@/redux/services/globalSetting/globalSettingApi";
import { base_url_image } from "@/utilities/configs/base_api";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { compressImage } from "@/utilities/lib/compressImage";
import { transformDefaultValues } from "@/utilities/lib/transformedDefaultValues";
import { Divider, Form, TimePicker } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PopUp = () => {
  const [fields, setFields] = useState([]);
  const { data } = useGetAllGlobalSettingQuery();

  const [updateGlobalSetting, { isLoading }] = useUpdateGlobalSettingMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Updating Pop Up Setting...");
    try {
      const submittedData = {
        ...values,
        announcement: data?.results?.announcement,
        popUpDuration: values.popUpDuration
          ? values.popUpDuration.minute() * 60 + values.popUpDuration.second()
          : 0,
      };

      if (values.popUpImage && values.popUpImage[0]?.url) {
        submittedData.popUpImage = values.popUpImage[0].url.replace(
          base_url_image,
          ""
        );
      } else if (values.popUpImage && values.popUpImage[0]?.originFileObj) {
        submittedData.popUpImage = await compressImage(
          values.popUpImage[0].originFileObj
        );
      }

      const updatedUserData = new FormData();
      appendToFormData(submittedData, updatedUserData);

      const updatedData = {
        id: data?.results?._id,
        data: updatedUserData,
      };

      const res = await updateGlobalSetting(updatedData);

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        location.reload();
      } else {
        toast.error(res.data.message, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating global setting:", error);
      toast.error("An error occurred while updating the popup setting.", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    const seconds = data?.results?.popUpDuration ?? 0;
    const minutesPart = Math.floor(seconds / 60);
    const secondsPart = seconds % 60;

    setFields(
      transformDefaultValues(data?.results, [
        {
          name: "popUpDuration",
          value: dayjs().hour(0).minute(minutesPart).second(secondsPart),
          errors: "",
        },
      ])
    );
  }, [data]);

  return (
    <section className="lg:w-4/6 mx-auto">
      <Divider orientation="left" orientationMargin={0}>
        Pop Up Settings
      </Divider>
      <CustomForm fields={fields} onSubmit={onSubmit}>
        <CustomInput name={"popUpLink"} label={"Pop Up Link"} />
        <Form.Item label={"Pop Up Duration"} name={"popUpDuration"}>
          <TimePicker
            format="mm:ss"
            showHour={false}
            showMinute={true}
            showSecond={true}
            secondStep={1}
          />
        </Form.Item>

        <FileUploader
          defaultValue={data?.results?.popUpImage}
          label="Pop Up Image"
          name="popUpImage"
        />

        <div className="flex justify-center my-10">
          <SubmitButton text={"Save"} loading={isLoading} fullWidth={true} />
        </div>
      </CustomForm>
    </section>
  );
};

export default PopUp;
