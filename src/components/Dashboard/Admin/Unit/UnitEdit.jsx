import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FormButton from "@/components/Shared/FormButton";
import {
  useGetSingleUnitQuery,
  useUpdateUnitMutation,
} from "@/redux/services/unit/unitApi";
import { transformDefaultValues } from "@/utilities/lib/transformedDefaultValues";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UnitForm from "./UnitForm";

const UnitEdit = ({ open, setOpen, itemId }) => {
  const [fields, setFields] = useState([]);

  const { data: unitData, isFetching: isUnitFetching } = useGetSingleUnitQuery(
    itemId,
    {
      skip: !itemId,
    }
  );

  const [updateUnit, { isLoading }] = useUpdateUnitMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Updating Unit...");
    try {
      const updatedData = {
        id: itemId,
        data: values,
      };

      const res = await updateUnit(updatedData);

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      } else {
        toast.error(res.data.errorMessage, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating Unit:", error);
      toast.error("An error occurred while updating the Unit.", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    setFields(transformDefaultValues(unitData, []));
  }, [unitData]);

  return (
    <CustomDrawer
      open={open}
      setOpen={setOpen}
      title="Edit Unit"
      placement={"left"}
      loading={isUnitFetching}
    >
      <CustomForm onSubmit={onSubmit} fields={fields}>
        <UnitForm attachment={unitData?.attachment} />

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

export default UnitEdit;
