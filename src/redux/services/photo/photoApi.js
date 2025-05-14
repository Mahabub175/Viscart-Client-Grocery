import { baseApi } from "@/redux/api/baseApi";

const photoApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addPhoto: build.mutation({
      query: (data) => {
        return {
          url: "/gallery/",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["photo"],
    }),
    getPhotos: build.query({
      query: ({ page = 1, limit = 5, search }) => ({
        url: `/gallery?page=${page}&limit=${limit}&searchText=${search}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response.data?.meta,
          results: response.data?.results,
        };
      },
      providesTags: ["photo"],
    }),
    getAllPhotos: build.query({
      query: () => ({
        url: `/gallery/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data?.results };
      },
      providesTags: ["photo"],
    }),
    getSinglePhoto: build.query({
      query: (id) => ({
        url: `/gallery/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["photo"],
    }),
    updatePhoto: build.mutation({
      query: (payload) => ({
        url: `/gallery/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["photo"],
    }),
    deletePhoto: build.mutation({
      query: (id) => ({
        url: `/gallery/${id}/`,
        method: "Delete",
        body: {},
      }),
      invalidatesTags: ["photo"],
    }),
    deleteBulkPhoto: build.mutation({
      query: (payload) => {
        return {
          url: `/gallery/bulk-delete/`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["photo"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddPhotoMutation,
  useGetPhotosQuery,
  useGetAllPhotosQuery,
  useGetSinglePhotoQuery,
  useUpdatePhotoMutation,
  useDeletePhotoMutation,
  useDeleteBulkPhotoMutation,
} = photoApi;
