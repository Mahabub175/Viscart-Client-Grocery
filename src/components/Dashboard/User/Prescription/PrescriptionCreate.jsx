import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import FormButton from "@/components/Shared/FormButton";
import { useAddPrescriptionMutation } from "@/redux/services/prescription/prescriptionApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { toast } from "sonner";
import PrescriptionForm from "./PrescriptionForm";
import { compressImage } from "@/utilities/lib/compressImage";
import { useSelector } from "react-redux";

const PrescriptionCreate = ({ open, setOpen }) => {
  const user = useSelector((state) => state.auth.user);
  const [addPrescription, { isLoading }] = useAddPrescriptionMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Creating Prescription...");

    try {
      let submittedData = {
        ...values,
        user: values?.user ?? user?._id,
      };

      if (values.attachment) {
        submittedData.attachment = await compressImage(
          values.attachment[0].originFileObj
        );
      }

      const data = new FormData();

      appendToFormData(submittedData, data);
      const res = await addPrescription(data);
      if (res.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      }
    } catch (error) {
      console.error("Error creating Prescription:", error);
    }
  };

  return (
    <CustomDrawer open={open} setOpen={setOpen} title="Create Prescription">
      <CustomForm onSubmit={onSubmit}>
        <PrescriptionForm />
        <FormButton setOpen={setOpen} loading={isLoading} />
      </CustomForm>
    </CustomDrawer>
  );
};

export default PrescriptionCreate;
