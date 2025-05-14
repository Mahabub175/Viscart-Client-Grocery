import CustomDrawer from "@/components/Reusable/Drawer/CustomDrawer";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomSelect from "@/components/Reusable/Form/CustomSelect";
import FormButton from "@/components/Shared/FormButton";
import {
  useGetSingleBlogQuery,
  useUpdateBlogMutation,
} from "@/redux/services/blog/blogApi";
import { appendToFormData } from "@/utilities/lib/appendToFormData";
import { transformDefaultValues } from "@/utilities/lib/transformedDefaultValues";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BlogForm from "./BlogForm";
import { compressImage } from "@/utilities/lib/compressImage";
import { Form } from "antd";
import CustomTextEditor from "@/components/Reusable/Form/CustomTextEditor";
import dayjs from "dayjs";

const BlogEdit = ({ open, setOpen, itemId }) => {
  const [fields, setFields] = useState([]);
  const [content, setContent] = useState("");

  const { data: blogData, isFetching: isBlogFetching } = useGetSingleBlogQuery(
    itemId,
    {
      skip: !itemId,
    }
  );

  const [updateBlog, { isLoading }] = useUpdateBlogMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Updating Blog...");
    try {
      const submittedData = {
        ...values,
        content,
        publishedAt: dayjs(values.publishedAt).format("YYYY-MM-DD"),
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

      const updatedBlogData = new FormData();
      appendToFormData(submittedData, updatedBlogData);

      const updatedData = {
        id: itemId,
        data: updatedBlogData,
      };

      const res = await updateBlog(updatedData);

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      } else {
        toast.error(res.data.errorMessage, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating Blog:", error);
      toast.error("An error occurred while updating the Blog.", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    setFields(transformDefaultValues(blogData, []));
    setContent(blogData?.content);
  }, [blogData]);

  return (
    <CustomDrawer
      open={open}
      setOpen={setOpen}
      title="Edit Blog"
      placement={"left"}
      loading={isBlogFetching}
    >
      <CustomForm onSubmit={onSubmit} fields={fields}>
        <BlogForm attachment={blogData?.attachment} />

        <Form.Item label={"Blog Content"} name={"content"} required>
          <CustomTextEditor value={content} onChange={setContent} />
        </Form.Item>

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

export default BlogEdit;
