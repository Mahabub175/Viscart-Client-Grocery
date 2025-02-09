import { baseApi } from "@/redux/api/baseApi";

const messageApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addMessage: build.mutation({
      query: (data) => {
        return {
          url: "/message/send/",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["message"],
    }),
    replyMessage: build.mutation({
      query: (data) => {
        return {
          url: "/message/admin/reply/",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["message"],
    }),
    getAllMessages: build.query({
      query: () => ({
        url: `/message/conversations/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data };
      },
      providesTags: ["message"],
    }),
    getSingleMessage: build.query({
      query: (id) => ({
        url: `/message/conversations/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["message"],
    }),
    getSingleMessageByUser: build.query({
      query: (id) => ({
        url: `/message/conversations/user/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["message"],
    }),
    updateMessage: build.mutation({
      query: (payload) => ({
        url: `/message/read/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["message"],
    }),
    deleteMessage: build.mutation({
      query: (id) => ({
        url: `/message/${id}/`,
        method: "Delete",
        body: {},
      }),
      invalidatesTags: ["message"],
    }),
    deleteBulkMessage: build.mutation({
      query: (payload) => {
        return {
          url: `/message/bulk-delete/`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["message"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddMessageMutation,
  useReplyMessageMutation,
  useGetAllMessagesQuery,
  useGetSingleMessageQuery,
  useGetSingleMessageByUserQuery,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
  useDeleteBulkMessageMutation,
} = messageApi;
