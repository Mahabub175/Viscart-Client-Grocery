import { baseApi } from "@/redux/api/baseApi";

const prescriptionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addPrescription: build.mutation({
      query: (data) => {
        return {
          url: "/prescription/",
          method: "POST",
          body: data,
        };
      },

      invalidatesTags: ["prescription"],
    }),
    getPrescriptions: build.query({
      query: ({ page = 1, limit = 5 }) => ({
        url: `/prescription?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          meta: response?.data?.meta,
          results: response?.data?.results,
        };
      },
      providesTags: ["prescription"],
    }),
    getAllPrescriptions: build.query({
      query: () => ({
        url: `/prescription/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return { results: response.data?.results };
      },
      providesTags: ["prescription"],
    }),
    getSinglePrescription: build.query({
      query: (id) => ({
        url: `/prescription/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["prescription"],
    }),
    getPrescriptionByUser: build.query({
      query: (id) => ({
        url: `/prescription/user/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["prescription"],
    }),
    updatePrescription: build.mutation({
      query: (payload) => ({
        url: `/prescription/${payload.id}/`,
        method: "PATCH",
        body: payload.data,
      }),
      invalidatesTags: ["prescription"],
    }),
    deletePrescription: build.mutation({
      query: (id) => ({
        url: `/prescription/${id}/`,
        method: "Delete",
        body: {},
      }),
      invalidatesTags: ["prescription"],
    }),
    deleteBulkPrescription: build.mutation({
      query: (payload) => {
        return {
          url: `/prescription/bulk-delete/`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["prescription"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddPrescriptionMutation,
  useGetPrescriptionsQuery,
  useGetAllPrescriptionsQuery,
  useGetSinglePrescriptionQuery,
  useGetPrescriptionByUserQuery,
  useUpdatePrescriptionMutation,
  useDeletePrescriptionMutation,
  useDeleteBulkPrescriptionMutation,
} = prescriptionApi;
