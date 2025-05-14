import FileUploader from "@/components/Reusable/Form/FileUploader";

const PhotoForm = ({ attachment }) => {
  return (
    <>
      <FileUploader
        defaultValue={attachment}
        label="Image"
        name="attachment"
        required={true}
      />
    </>
  );
};

export default PhotoForm;
