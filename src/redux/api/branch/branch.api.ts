import { baseApi } from "../baseApi";

const branchApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBranch: build.query({
      query: () => ({
        url: "/branch",
        method: "GET",
      }),
      providesTags: ["branch"],
    }),

    //  crate table
    createBranch: build.mutation({
      query: (data) => ({
        url: "/branch",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["branch"],
    }),

    // update

    updateBranch: build.mutation({
      query: (options) => ({
        url: `/branch/${options.id}`,
        method: "PATCH",
        body: options.data,
      }),
      invalidatesTags: ["branch"],
    }),

    deleteBranch: build.mutation({
      query: (id) => ({
        url: `/branch/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["branch"],
    }),
  }),
});

export const {
  useCreateBranchMutation,
  useGetBranchQuery,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} = branchApi;
