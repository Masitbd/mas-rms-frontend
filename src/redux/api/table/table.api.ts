import { baseApi } from "../baseApi";

const tableApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTableList: build.query({
      query: () => ({
        url: "/table-list",
        method: "GET",
      }),
      providesTags: ["tableList"],
    }),

    //  crate table
    createTableList: build.mutation({
      query: (data) => ({
        url: "/table-list",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["tableList"],
    }),

    // update

    updateTableList: build.mutation({
      query: (options) => ({
        url: `/table-list/${options.id}`,
        method: "PATCH",
        body: options.data,
      }),
      invalidatesTags: ["tableList"],
    }),

    deleteTableList: build.mutation({
      query: (id) => ({
        url: `/table-list/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tableList"],
    }),
  }),
});

export const {
  useGetTableListQuery,
  useCreateTableListMutation,
  useUpdateTableListMutation,
  useDeleteTableListMutation,
} = tableApi;
