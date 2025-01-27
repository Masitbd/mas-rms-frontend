import { baseApi } from "../baseApi";

const deliveryAddress = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllDeliveryAddress: build.query({
      query: () => ({
        url: `/delivery-address/`,
        method: "GET",
      }),
      providesTags: ["delivery-addresses"],
    }),
    getSingleDeliveryAddress: build.query({
      query: () => ({
        url: "/delivery-address",
        method: "GET",
      }),
      providesTags: ["single-delivery-address"],
    }),
    getDefaultDeliveryAddress: build.query({
      query: () => ({
        url: "/delivery-address/default",
        method: "GET",
      }),
      providesTags: ["single-delivery-address"],
    }),

    //  crate table
    postDeliveryAddress: build.mutation({
      query: (data) => ({
        url: "/delivery-address",
        method: "POST",
        body: data,
        data: data,
      }),
      invalidatesTags: ["delivery-addresses", "single-delivery-address"],
    }),

    // update

    updateDeliveryAddress: build.mutation({
      query: (options: { id: string; data: any }) => ({
        url: `/delivery-address/${options.id}`,
        method: "PATCH",
        body: options.data,
        data: options.data,
      }),
      invalidatesTags: ["delivery-addresses", "single-delivery-address"],
    }),

    deleteDeliveryAddress: build.mutation({
      query: (id) => ({
        url: `/delivery-address/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["delivery-addresses", "single-delivery-address"],
    }),
  }),
});

export const {
  usePostDeliveryAddressMutation,
  useUpdateDeliveryAddressMutation,
  useDeleteDeliveryAddressMutation,
  useGetAllDeliveryAddressQuery,
  useGetSingleDeliveryAddressQuery,
  useGetDefaultDeliveryAddressQuery,
  useLazyGetDefaultDeliveryAddressQuery,
} = deliveryAddress;
