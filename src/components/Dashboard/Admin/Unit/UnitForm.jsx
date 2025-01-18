import CustomInput from "@/components/Reusable/Form/CustomInput";

const GenericForm = () => {
  return (
    <>
      <CustomInput label={"Name"} name={"name"} type={"text"} required={true} />
    </>
  );
};

export default GenericForm;
