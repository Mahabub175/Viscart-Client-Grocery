import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FormButton from "@/components/Shared/FormButton";
import {
  useGetSingleGenericQuery,
  useUpdateGenericMutation,
} from "@/redux/services/generic/genericApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { compressImage } from "@/utilities/lib/compressImage";
import { transformDefaultValues } from "@/utilities/lib/transformedDefaultValues";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import GenericForm from "./GenericForm";

const GenericEdit = ({ open, setOpen, itemId }) => {
  const [fields, setFields] = useState([]);

  const { data: genericData, isFetching: isGenericFetching } =
    useGetSingleGenericQuery(itemId, {
      skip: !itemId,
    });

  const [updateGeneric, { isLoading }] = useUpdateGenericMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Updating Generic...");
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

      const updatedGenericData = new FormData();
      appendToFormData(submittedData, updatedGenericData);

      const updatedData = {
        id: itemId,
        data: updatedGenericData,
      };

      const res = await updateGeneric(updatedData);

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      } else {
        toast.error(res.data.errorMessage, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating Generic:", error);
      toast.error("An error occurred while updating the Generic.", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    setFields(transformDefaultValues(genericData, []));
  }, [genericData]);

  return (
    <CustomDrawer
      open={open}
      setOpen={setOpen}
      title="Edit Generic"
      placement={"left"}
      loading={isGenericFetching}
    >
      <CustomForm onSubmit={onSubmit} fields={fields}>
        <GenericForm attachment={genericData?.attachment} />

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

export default GenericEdit;
