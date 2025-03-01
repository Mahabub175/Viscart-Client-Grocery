import CustomInput from "@/components/Reusable/Form/CustomInput";
import FileUploader from "@/components/Reusable/Form/FileUploader";
import { Checkbox, Form } from "antd";

const BrandForm = ({ attachment }) => {
  return (
    <>
      <CustomInput label={"Name"} name={"name"} type={"text"} required={true} />
      <FileUploader
        defaultValue={attachment}
        label="Brand Logo"
        name="attachment"
        required={true}
      />
      <Form.Item name={"isFeatured"} valuePropName="checked">
        <Checkbox className="font-semibold">
          This Brand Is Featured In Homepage
        </Checkbox>
      </Form.Item>
    </>
  );
};

export default BrandForm;
