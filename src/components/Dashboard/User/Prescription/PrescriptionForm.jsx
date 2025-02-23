import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FileUploader from "@/components/Reusable/Form/FileUploader";
import { useGetAllUsersQuery } from "@/redux/services/auth/authApi";
import { usePathname } from "next/navigation";

const PrescriptionForm = ({ attachment }) => {
  const pathname = usePathname();

  const { data: userData, isFetching: isUserFetching } = useGetAllUsersQuery();

  const userOptions = userData?.results
    ?.filter((item) => item?.status !== "Inactive")
    .map((item) => ({
      value: item?._id,
      label: item?.name + " " + `(${item?.number})` ?? item?.number,
    }));

  return (
    <>
      {pathname?.includes("admin") && (
        <CustomSelect
          label="User"
          name="user"
          options={userOptions}
          required={true}
          loading={isUserFetching}
          disabled={isUserFetching}
        />
      )}
      <FileUploader
        defaultValue={attachment}
        label="Prescription Attachment"
        name="attachment"
        required={true}
      />
    </>
  );
};

export default PrescriptionForm;
