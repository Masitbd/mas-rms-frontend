import { baseApi } from "../baseApi";

const menuGroupApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMenuGroup: build.query({
      query: () => ({
        url: "/menu-groups",
        method: "GET",
      }),
      providesTags: ["menuGroupList"],
    }),

    //  crate table
    createMenuGroup: build.mutation({
      query: (data) => ({
        url: "/menu-groups",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["menuGroupList"],
    }),

    // update

    updateMenuGroup: build.mutation({
      query: (options) => ({
        url: `/menu-groups/${options.id}`,
        method: "PATCH",
        body: options.data,
      }),
      invalidatesTags: ["menuGroupList"],
    }),

    deleteMenuGroup: build.mutation({
      query: (id) => ({
        url: `/menu-groups/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["menuGroupList"],
    }),
  }),
});

export const {
  useGetMenuGroupQuery,
  useCreateMenuGroupMutation,
  useUpdateMenuGroupMutation,
  useDeleteMenuGroupMutation,
} = menuGroupApi;
