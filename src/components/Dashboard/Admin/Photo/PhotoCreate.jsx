import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import FormButton from "@/components/Shared/FormButton";
import { useAddPhotoMutation } from "@/redux/services/photo/photoApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { toast } from "sonner";
import PhotoForm from "./PhotoForm";
import { compressImage } from "@/utilities/lib/compressImage";

const PhotoCreate = ({ open, setOpen }) => {
  const [addPhoto, { isLoading }] = useAddPhotoMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Creating Photo...");

    try {
      let submittedData = {
        ...values,
      };

      if (values.attachment) {
        submittedData.attachment = await compressImage(
          values.attachment[0].originFileObj
        );
      }

      const data = new FormData();

      appendToFormData(submittedData, data);
      const res = await addPhoto(data);
      if (res.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      }
    } catch (error) {
      console.error("Error creating Photo:", error);
    }
  };

  return (
    <CustomDrawer open={open} setOpen={setOpen} title="Create Photo">
      <CustomForm onSubmit={onSubmit}>
        <PhotoForm />
        <FormButton setOpen={setOpen} loading={isLoading} />
      </CustomForm>
    </CustomDrawer>
  );
};

export default PhotoCreate;
