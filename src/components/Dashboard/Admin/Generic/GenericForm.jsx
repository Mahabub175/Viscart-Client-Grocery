import CustomInput from "@/components/Reusable/Form/CustomInput";
import FileUploader from "@/components/Reusable/Form/FileUploader";

const GenericForm = ({ attachment }) => {
  return (
    <>
      <CustomInput label={"Name"} name={"name"} type={"text"} required={true} />
      <FileUploader
        defaultValue={attachment}
        label="Generic Image"
        name="attachment"
      />
    </>
  );
};

export default GenericForm;
