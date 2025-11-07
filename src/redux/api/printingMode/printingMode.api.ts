import { baseApi } from "../baseApi";

const printingMode = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPrintingMode: build.query({
      query: () => ({
        url: "/cash-memo-type",
        method: "GET",
      }),
      providesTags: ["cash-memo-type"],
    }),

    // update

    updatePrintingMode: build.mutation({
      query: (data: { cashMemoType: string }) => ({
        url: `/cash-memo-type`,
        method: "PATCH",
        body: data,
        data: data,
      }),
      invalidatesTags: ["cash-memo-type"],
    }),
  }),
});

export const {
  useGetPrintingModeQuery,
  useUpdatePrintingModeMutation,
  useLazyGetPrintingModeQuery,
} = printingMode;
