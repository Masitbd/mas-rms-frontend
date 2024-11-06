import { baseApi } from "../baseApi";

const itemsCategoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getItemsCategory: build.query({
      query: () => ({
        url: "/item-categories",
        method: "GET",
      }),
      providesTags: ["itemCategory"],
    }),

    //  crate table
    createItemsCategory: build.mutation({
      query: (data) => ({
        url: "/item-categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["itemCategory"],
    }),

    // update

    updateItemsCategory: build.mutation({
      query: (options) => ({
        url: `/item-categories/${options.id}`,
        method: "PATCH",
        body: options.data,
      }),
      invalidatesTags: ["itemCategory"],
    }),

    deleteItemsCategory: build.mutation({
      query: (id) => ({
        url: `/item-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["itemCategory"],
    }),
  }),
});

export const {
  useGetItemsCategoryQuery,
  useCreateItemsCategoryMutation,
  useUpdateItemsCategoryMutation,
  useDeleteItemsCategoryMutation,
} = itemsCategoryApi;
