import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FormButton from "@/components/Shared/FormButton";
import {
  useGetSinglePhotoQuery,
  useUpdatePhotoMutation,
} from "@/redux/services/photo/photoApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { transformDefaultValues } from "@/utilities/lib/transformedDefaultValues";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PhotoForm from "./PhotoForm";
import { compressImage } from "@/utilities/lib/compressImage";

const PhotoEdit = ({ open, setOpen, itemId }) => {
  const [fields, setFields] = useState([]);

  const { data: photoData, isFetching: isPhotoFetching } =
    useGetSinglePhotoQuery(itemId, {
      skip: !itemId,
    });

  const [updatePhoto, { isLoading }] = useUpdatePhotoMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Updating Photo...");
    try {
      const submittedData = {
        ...values,
      };

      if (
        values?.attachment &&
        Array.isArray(values.attachment) &&
        !values.attachment[0]?.url
      ) {
        submittedData.attachment = await compressImage(
          values.attachment[0].originFileObj
        );
      } else {
        delete submittedData.attachment;
      }

      const updatedPhotoData = new FormData();
      appendToFormData(submittedData, updatedPhotoData);

      const updatedData = {
        id: itemId,
        data: updatedPhotoData,
      };

      const res = await updatePhoto(updatedData);

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      } else {
        toast.error(res.data.errorMessage, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating Photo:", error);
      toast.error("An error occurred while updating the Photo.", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    setFields(transformDefaultValues(photoData, []));
  }, [photoData]);

  return (
    <CustomDrawer
      open={open}
      setOpen={setOpen}
      title="Edit Photo"
      placement={"left"}
      loading={isPhotoFetching}
    >
      <CustomForm onSubmit={onSubmit} fields={fields}>
        <PhotoForm attachment={photoData?.attachment} />

        <CustomSelect
          name={"status"}
          label={"Status"}
          options={[
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" },
          ]}
        />

        <FormButton setOpen={setOpen} loading={isLoading} />
      </CustomForm>
    </CustomDrawer>
  );
};

export default PhotoEdit;
