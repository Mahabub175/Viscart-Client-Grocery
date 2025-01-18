import { baseApi } from "@/redux/api/baseApi";

const unitApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addUnit: build.mutation({
      query: (data) => {
        return {
          url: "unit/",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["unit"],
    }),
    getUnits: build.query({
      query: ({ page = 1, limit = 5, search }) => ({
        url: `/unit?page=${page}&limit=${limit}&searchText=${search}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response.data?.meta,
          results: response.data?.results,
        };
      },
      providesTags: ["unit"],
    }),
    getAllUnits: build.query({
      query: () => ({
        url: `/unit/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data?.results };
      },
      providesTags: ["unit"],
    }),
    getSingleUnit: build.query({
      query: (id) => ({
        url: `/unit/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["unit"],
    }),
    updateUnit: build.mutation({
      query: (payload) => ({
        url: `/unit/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["unit"],
    }),
    deleteUnit: build.mutation({
      query: (id) => ({
        url: `/unit/${id}/`,
        method: "Delete",
        body: {},
      }),
      invalidatesTags: ["unit"],
    }),
    deleteBulkUnit: build.mutation({
      query: (payload) => {
        return {
          url: `/unit/bulk-delete/`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["unit"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddUnitMutation,
  useGetUnitsQuery,
  useGetAllUnitsQuery,
  useGetSingleUnitQuery,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
  useDeleteBulkUnitMutation,
} = unitApi;
