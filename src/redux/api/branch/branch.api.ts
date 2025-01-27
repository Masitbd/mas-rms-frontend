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
    getDoesDeliver: build.query({
      query: (param: string) => ({
        url: `/branch/does-deliver/${param}`,
        method: "GET",
      }),
      providesTags: ["branch"],
    }),
    getDeliverableCIty: build.query({
      query: (params: string) => ({
        url: `/branch/deliverable-city/${params}`,
        method: "GET",
      }),
    }),
    getDeliverableZone: build.query({
      query: (params: { division: string; city: string }) => ({
        url: `/branch/deliverable-zone/zone`,
        method: "GET",
        params,
      }),
    }),

    //  crate table
    createBranch: build.mutation({
      query: (data) => ({
        url: "/branch",
        method: "POST",
        body: data,
        data: data,
      }),
      invalidatesTags: ["branch"],
    }),

    // update

    updateBranch: build.mutation({
      query: (options) => ({
        url: `/branch/${options.id}`,
        method: "PATCH",
        body: options.data,
        data: options.data,
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
  useGetDeliverableCItyQuery,
  useLazyGetDeliverableCItyQuery,
  useLazyGetDeliverableZoneQuery,
  useGetDoesDeliverQuery,
  useLazyGetDoesDeliverQuery,
} = branchApi;
