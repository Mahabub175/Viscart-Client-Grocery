import { baseApi } from "@/redux/api/baseApi";

const genericApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addGeneric: build.mutation({
      query: (data) => {
        return {
          url: "generic/",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["generic"],
    }),
    getGenerics: build.query({
      query: ({ page = 1, limit = 5, search }) => ({
        url: `/generic?page=${page}&limit=${limit}&searchText=${search}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response.data?.meta,
          results: response.data?.results,
        };
      },
      providesTags: ["generic"],
    }),
    getAllGenerics: build.query({
      query: () => ({
        url: `/generic/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data?.results };
      },
      providesTags: ["generic"],
    }),
    getSingleGeneric: build.query({
      query: (id) => ({
        url: `/generic/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["generic"],
    }),
    updateGeneric: build.mutation({
      query: (payload) => ({
        url: `/generic/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["generic"],
    }),
    deleteGeneric: build.mutation({
      query: (id) => ({
        url: `/generic/${id}/`,
        method: "Delete",
        body: {},
      }),
      invalidatesTags: ["generic"],
    }),
    deleteBulkGeneric: build.mutation({
      query: (payload) => {
        return {
          url: `/generic/bulk-delete/`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["generic"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddGenericMutation,
  useGetGenericsQuery,
  useGetAllGenericsQuery,
  useGetSingleGenericQuery,
  useUpdateGenericMutation,
  useDeleteGenericMutation,
  useDeleteBulkGenericMutation,
} = genericApi;
