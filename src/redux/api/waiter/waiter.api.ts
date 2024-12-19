import { baseApi } from "../baseApi";

const waiterApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWaiterList: build.query({
      query: () => ({
        url: "/waiter",
        method: "GET",
      }),
      providesTags: ["waiterList"],
    }),

    //  crate table
    createWaiterList: build.mutation({
      query: (data) => ({
        url: "/waiter",
        method: "POST",
        body: data,
        data: data,
      }),
      invalidatesTags: ["waiterList"],
    }),

    // update

    updateWaiterList: build.mutation({
      query: (options) => ({
        url: `/waiter/${options.id}`,
        method: "PATCH",
        body: options.data,
        data: options?.data,
      }),
      invalidatesTags: ["waiterList"],
    }),

    deleteWaiterList: build.mutation({
      query: (id) => ({
        url: `/waiter/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["waiterList"],
    }),
  }),
});

export const {
  useGetWaiterListQuery,
  useCreateWaiterListMutation,
  useUpdateWaiterListMutation,
  useDeleteWaiterListMutation,
} = waiterApi;
