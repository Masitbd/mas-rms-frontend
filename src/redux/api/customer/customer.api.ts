import { baseApi } from "../baseApi";

const customerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCustomerList: build.query({
      query: () => ({
        url: "/customer-list",
        method: "GET",
      }),
      providesTags: ["custmerList"],
    }),

    //  crate table
    createCustomerList: build.mutation({
      query: (data) => ({
        url: "/customer-list",
        method: "POST",
        body: data,
        data: data,
      }),
      invalidatesTags: ["custmerList"],
    }),

    // update

    updateCustomerList: build.mutation({
      query: (options) => ({
        url: `/customer-list/${options.id}`,
        method: "PATCH",
        body: options.data,
        data: options.data,
      }),
      invalidatesTags: ["custmerList"],
    }),

    deleteCustomerList: build.mutation({
      query: (id) => ({
        url: `/customer-list/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["custmerList"],
    }),
    getCustomerByDiscountCode: build.query({
      query: (discountCode: string) => ({
        url: `/customer-list/discount-code/${discountCode}`,
        method: "GET",
        providesTags: ["singleCustomer"],
      }),
    }),
  }),
});

export const {
  useGetCustomerListQuery,
  useCreateCustomerListMutation,
  useDeleteCustomerListMutation,
  useUpdateCustomerListMutation,
  useLazyGetCustomerListQuery,
  useLazyGetCustomerByDiscountCodeQuery,
} = customerApi;
