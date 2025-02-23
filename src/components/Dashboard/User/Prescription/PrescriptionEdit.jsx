import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FormButton from "@/components/Shared/FormButton";
import {
  useGetSinglePrescriptionQuery,
  useUpdatePrescriptionMutation,
} from "@/redux/services/prescription/prescriptionApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { transformDefaultValues } from "@/utilities/lib/transformedDefaultValues";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PrescriptionForm from "./PrescriptionForm";
import { compressImage } from "@/utilities/lib/compressImage";
import { useSelector } from "react-redux";

const PrescriptionEdit = ({ open, setOpen, itemId }) => {
  const user = useSelector((state) => state.auth.user);

  const [fields, setFields] = useState([]);

  const { data: prescriptionData, isFetching: isPrescriptionFetching } =
    useGetSinglePrescriptionQuery(itemId, {
      skip: !itemId,
    });

  const [updatePrescription, { isLoading }] = useUpdatePrescriptionMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Updating Prescription...");
    try {
      const submittedData = {
        ...values,
        user: values?.user ?? user?._id,
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

      const updatedPrescriptionData = new FormData();
      appendToFormData(submittedData, updatedPrescriptionData);

      const updatedData = {
        id: itemId,
        data: updatedPrescriptionData,
      };

      const res = await updatePrescription(updatedData);

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      } else {
        toast.error(res.data.errorMessage, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating Prescription:", error);
      toast.error("An error occurred while updating the Prescription.", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    setFields(
      transformDefaultValues(prescriptionData, [
        {
          name: "user",
          value: prescriptionData?.user?._id,
          errors: "",
        },
      ])
    );
  }, [prescriptionData]);

  return (
    <CustomDrawer
      open={open}
      setOpen={setOpen}
      title="Edit Prescription"
      placement={"left"}
      loading={isPrescriptionFetching}
    >
      <CustomForm onSubmit={onSubmit} fields={fields}>
        <PrescriptionForm attachment={prescriptionData?.attachment} />

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

export default PrescriptionEdit;
