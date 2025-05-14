"use client";

import { useCurrentUser } from "@/redux/services/auth/authSlice";
import {
  useDeleteBlogCommentMutation,
  useGetSingleBlogBySlugQuery,
  useUpdateBlogCommentMutation,
  useUpdateBlogMutation,
} from "@/redux/services/blog/blogApi";
import { base_url_image } from "@/utilities/configs/base_api";
import { Input, Button } from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const { TextArea } = Input;

const SingleBlogDetails = ({ params }) => {
  const user = useSelector(useCurrentUser);
  const { data: item, isLoading } = useGetSingleBlogBySlugQuery(params);

  const [updateBlog, { isLoading: isUpdateLoading }] = useUpdateBlogMutation();
  const [updateComment] = useUpdateBlogCommentMutation();
  const [deleteComment] = useDeleteBlogCommentMutation();

  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  const handlePostComment = async () => {
    if (!user) {
      return toast.info("You must be logged in to post a comment!");
    }
    const toastId = toast.loading("Posting Comment...");

    try {
      const newComment = { comment, user: user?._id };
      const updatedData = {
        id: item?._id,
        data: { comments: [...item?.comments, newComment] },
      };
      const res = await updateBlog(updatedData);

      if (res.data?.success) {
        toast.success("Comment posted successfully!", { id: toastId });
        setComment("");
      } else {
        toast.error(res.data?.errorMessage || "Something went wrong.", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("Failed to post comment.", { id: toastId });
    }
  };

  const handleDeleteComment = async (commentId) => {
    const toastId = toast.loading("Deleting Comment...");
    try {
      const res = await deleteComment({ blogId: item?._id, commentId });
      if (res.data?.success) {
        toast.success("Comment deleted!", { id: toastId });
      } else {
        toast.error("Failed to delete comment.", { id: toastId });
      }
    } catch (error) {
      toast.error("Error deleting comment.", { id: toastId });
    }
  };

  const handleUpdateComment = async () => {
    if (!editedComment.trim()) return toast.error("Comment can't be empty!");

    const toastId = toast.loading("Updating comment...");
    try {
      const res = await updateComment({
        blogId: item?._id,
        commentId: editingId,
        data: { comment: editedComment },
      });

      if (res.data?.success) {
        toast.success("Comment updated!", { id: toastId });
        setEditingId(null);
        setEditedComment("");
      } else {
        toast.error("Update failed.", { id: toastId });
      }
    } catch (error) {
      toast.error("Error updating comment.", { id: toastId });
    }
  };

  if (isLoading) {
    return (
      <section className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </section>
    );
  }

  return (
    <section className="my-container mt-10 mb-20">
      <div className="space-y-4 mb-10">
        <p className="text-2xl lg:text-4xl font-bold">{item?.name}</p>
        <p>Published At: {item?.publishedAt}</p>
      </div>

      <Image
        src={item?.attachment}
        alt={item?.name}
        width={1600}
        height={200}
        className="w-full lg:h-[700px] rounded-xl"
      />

      <div
        dangerouslySetInnerHTML={{ __html: item?.content }}
        className="mt-10 lg:mt-20"
      />

      <div className="mt-10 lg:mt-20">
        <h3 className="text-xl font-semibold mb-4">Leave a Comment</h3>
        <TextArea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment..."
        />
        <Button
          type="primary"
          className="mt-2"
          onClick={handlePostComment}
          loading={isUpdateLoading}
        >
          Post Comment
        </Button>

        <div className="mt-10">
          <h3 className="text-xl font-medium mb-4">
            {item?.comments?.length || 0}{" "}
            {item?.comments?.length === 1 ? "Comment" : "Comments"}
          </h3>

          <div className="space-y-4">
            {item?.comments?.map((commentItem) => {
              const isOwner = commentItem?.user?._id === user?._id;
              const isAdmin = user?.role === "admin";

              return (
                <div
                  key={commentItem._id}
                  className="flex space-x-4 border-b pb-2"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    {commentItem?.user?.profile_image ? (
                      <Image
                        src={`${base_url_image}${commentItem.user.profile_image}`}
                        alt="Profile"
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center font-bold text-white">
                        {commentItem?.user?.name?.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-medium">{commentItem?.user?.name}</div>

                    {editingId === commentItem._id ? (
                      <>
                        <TextArea
                          rows={2}
                          value={editedComment}
                          onChange={(e) => setEditedComment(e.target.value)}
                        />
                        <div className="flex gap-2 mt-1">
                          <Button type="primary" onClick={handleUpdateComment}>
                            Save
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingId(null);
                              setEditedComment("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-700 mt-1">
                          &quot;{commentItem?.comment}&quot;
                        </p>
                        <div className="text-gray-500 text-sm mt-2">
                          {dayjs(commentItem?.createdAt).format(
                            "YYYY-MM-DD : hh:mm A"
                          )}
                        </div>
                      </>
                    )}

                    {(isOwner || isAdmin) && editingId !== commentItem._id && (
                      <div className="flex gap-2 mt-2">
                        {isOwner && (
                          <Button
                            size="small"
                            onClick={() => {
                              setEditingId(commentItem._id);
                              setEditedComment(commentItem.comment);
                            }}
                          >
                            <FaEdit />
                          </Button>
                        )}
                        <Button
                          size="small"
                          danger
                          onClick={() => handleDeleteComment(commentItem._id)}
                        >
                          <MdDelete />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleBlogDetails;
