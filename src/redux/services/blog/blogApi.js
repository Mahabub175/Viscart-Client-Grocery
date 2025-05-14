import { baseApi } from "@/redux/api/baseApi";

const blogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addBlog: build.mutation({
      query: (data) => {
        return {
          url: "/blog/",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["blog"],
    }),
    getBlogs: build.query({
      query: ({ page = 1, limit = 5, search }) => ({
        url: `/blog?page=${page}&limit=${limit}&searchText=${search}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response.data?.meta,
          results: response.data?.results,
        };
      },
      providesTags: ["blog"],
    }),
    getAllBlogs: build.query({
      query: () => ({
        url: `/blog/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data?.results };
      },
      providesTags: ["blog"],
    }),
    getSingleBlog: build.query({
      query: (id) => ({
        url: `/blog/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["blog"],
    }),
    getSingleBlogBySlug: build.query({
      query: (slug) => ({
        url: `/blog/slug/${slug}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["blog"],
    }),
    updateBlog: build.mutation({
      query: (payload) => ({
        url: `/blog/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["blog"],
    }),
    updateBlogComment: build.mutation({
      query: (payload) => ({
        url: `/blog/${payload.blogId}/comment/${payload.commentId}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["blog"],
    }),
    deleteBlogComment: build.mutation({
      query: (payload) => ({
        url: `/blog/${payload.blogId}/comment/${payload.commentId}/`,
        method: "DELETE",
        body: payload.data,
      }),
      invalidatesTags: ["blog"],
    }),
    deleteBlog: build.mutation({
      query: (id) => ({
        url: `/blog/${id}/`,
        method: "DELETE",
        body: {},
      }),
      invalidatesTags: ["blog"],
    }),
    deleteBulkBlog: build.mutation({
      query: (payload) => {
        return {
          url: `/blog/bulk-delete/`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["blog"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddBlogMutation,
  useGetBlogsQuery,
  useGetAllBlogsQuery,
  useGetSingleBlogQuery,
  useGetSingleBlogBySlugQuery,
  useUpdateBlogMutation,
  useUpdateBlogCommentMutation,
  useDeleteBlogCommentMutation,
  useDeleteBlogMutation,
  useDeleteBulkBlogMutation,
} = blogApi;
