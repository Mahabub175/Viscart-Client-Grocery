import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import FormButton from "@/components/Shared/FormButton";
import { useAddUnitMutation } from "@/redux/services/unit/unitApi";
import { toast } from "sonner";
import UnitForm from "./UnitForm";

const UnitCreate = ({ open, setOpen }) => {
  const [addUnit, { isLoading }] = useAddUnitMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Creating Unit...");

    try {
      const res = await addUnit(values);
      if (res.error) {
        toast.error(res?.error?.data?.errorMessage, { id: toastId });
      }
      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      }
    } catch (error) {
      console.error("Error creating Unit:", error);
    }
  };

  return (
    <CustomDrawer open={open} setOpen={setOpen} title="Create Unit">
      <CustomForm onSubmit={onSubmit}>
        <UnitForm />
        <FormButton setOpen={setOpen} loading={isLoading} />
      </CustomForm>
    </CustomDrawer>
  );
};

export default UnitCreate;
