import { SubmitButton } from "@/components/Reusable/Button/CustomButton";
import CustomForm from "@/components/Reusable/Form/CustomForm";
import CustomInput from "@/components/Reusable/Form/CustomInput";
import {
  useGetSingleProductReviewQuery,
  useUpdateProductReviewMutation,
} from "@/redux/services/product/productApi";

import { transformDefaultValues } from "@/utilities/lib/transformedDefaultValues";
import { Form, Modal, Rate } from "antd";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ReviewEdit = ({ open, setOpen, itemId }) => {
  const [fields, setFields] = useState([]);

  const { data: reviewData, isFetching: isReviewFetching } =
    useGetSingleProductReviewQuery(itemId, { skip: !itemId });

  const [updateProductReview, { isLoading }] = useUpdateProductReviewMutation();

  const onSubmit = async (values) => {
    const toastId = toast.loading("Updating Review...");
    try {
      const submittedData = {
        ...values,
      };

      const updatedData = {
        productId: reviewData?.results?.productId,
        reviewId: reviewData?.results?.reviewId,
        data: submittedData,
      };

      const res = await updateProductReview(updatedData);

      if (res.data.success) {
        toast.success(res.data.message, { id: toastId });
        setOpen(false);
      } else {
        toast.error(res.data.errorMessage, { id: toastId });
      }
    } catch (error) {
      console.error("Error updating Review:", error);
      toast.error("An error occurred while updating the Review.", {
        id: toastId,
      });
    }
  };

  useEffect(() => {
    setFields(transformDefaultValues(reviewData?.results?.result, []));
  }, [reviewData]);

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      centered
      destroyOnClose
      loading={isReviewFetching}
    >
      <CustomForm onSubmit={onSubmit} fields={fields}>
        <CustomInput
          type={"textarea"}
          name={"comment"}
          label={"Review"}
          required
        />
        <Form.Item name={"rating"} label={"Rating"} required>
          <Rate />
        </Form.Item>
        <SubmitButton fullWidth text={"Update Review"} loading={isLoading} />
      </CustomForm>
    </Modal>
  );
};

export default ReviewEdit;
