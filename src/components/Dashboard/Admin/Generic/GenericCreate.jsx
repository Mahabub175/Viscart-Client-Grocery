import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import FormButton from "@/components/Shared/FormButton";
import { useAddGenericMutation } from "@/redux/services/generic/genericApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { compressImage } from "@/utilities/lib/compressImage";
import { toast } from "sonner";
import GenericForm from "./GenericForm";

const GenericCreate = ({ open, setOpen }) => {
  const [addGeneric, { isLoading }] = useAddGenericMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Creating Generic...");

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
      const res = await addGeneric(data);
      if (res.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      }
    } catch (error) {
      console.error("Error creating Generic:", error);
    }
  };

  return (
    <CustomDrawer open={open} setOpen={setOpen} title="Create Generic">
      <CustomForm onSubmit={onSubmit}>
        <GenericForm />
        <FormButton setOpen={setOpen} loading={isLoading} />
      </CustomForm>
    </CustomDrawer>
  );
};

export default GenericCreate;
