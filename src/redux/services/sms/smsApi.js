import { baseApi } from "@/redux/api/baseApi";

const smsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addSms: build.mutation({
      query: (data) => {
        return {
          url: "/sms/",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["sms"],
    }),
  }),
  overrideExisting: true,
});

export const { useAddSmsMutation } = smsApi;
