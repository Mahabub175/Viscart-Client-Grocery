import { useGetAllReviewsQuery } from "@/redux/services/review/reviewApi";
import React from "react";
import { Avatar, Rate, Card } from "antd";
import dayjs from "dayjs";
import { formatImagePath } from "@/utilities/lib/formatImagePath";
import { UserOutlined } from "@ant-design/icons";

const ProductReview = ({ productId }) => {
  const { data: reviewData } = useGetAllReviewsQuery();

  const filteredReviews = reviewData?.results.filter((review) =>
    review.product.some((prod) => prod._id === productId)
  );

  if (filteredReviews?.length === 0) {
    return <div className="mt-10 px-5">No reviews found for this product.</div>;
  }

  return (
    <div className="p-4">
      <div className="space-y-4">
        {filteredReviews?.map((review) => {
          const { user, comment, createdAt, rating } = review;
          const { name, profile_image } = user;

          return (
            <Card
              key={review._id}
              className="border p-4 rounded-lg shadow-sm"
              title={
                <div className="flex items-center space-x-3">
                  {profile_image ? (
                    <Avatar
                      src={
                        formatImagePath(profile_image) || "default-avatar.png"
                      }
                      size={40}
                    />
                  ) : (
                    <Avatar size={40} icon={<UserOutlined />} />
                  )}
                  <div>
                    <div className="font-semibold">{name}</div>
                    <div className="text-sm text-gray-500">
                      {dayjs(createdAt).format("DD/MM/YYYY")}
                    </div>
                  </div>
                </div>
              }
            >
              <p className="text-gray-800 mb-2 text-lg">
                &quot;{comment}&quot;
              </p>
              <div className="flex items-center">
                <Rate disabled value={rating} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProductReview;
