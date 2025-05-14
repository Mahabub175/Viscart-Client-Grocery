import { baseApi } from "@/redux/api/baseApi";

const serverTrackingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addServerTracking: build.mutation({
      query: (data) => {
        return {
          url: "/server-tracking/",
          method: "POST",
          body: data,
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const { useAddServerTrackingMutation } = serverTrackingApi;
