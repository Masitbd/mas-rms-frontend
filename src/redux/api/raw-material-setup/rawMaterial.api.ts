import { IRawMaterial } from "@/components/raw-material-setup/TypesAndDefault";
import { baseApi } from "../baseApi";

const rawMaterialApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRawMaterial: build.query({
      query: () => ({
        url: "/raw-material",
        method: "GET",
      }),
      providesTags: ["raw-material"],
    }),
    getSingleRawMaterial: build.query({
      query: (id: string) => ({
        url: `/raw-material/${id}`,
        method: "GET",
      }),
    }),

    //  crate table
    postRawMaterial: build.mutation({
      query: (data: IRawMaterial) => ({
        url: "/raw-material",
        method: "POST",
        body: data,
        data: data,
      }),
      invalidatesTags: ["raw-material"],
    }),

    // update

    updateRawMaterial: build.mutation({
      query: (options) => ({
        url: `/raw-material`,
        method: "PATCH",
        body: options,
        data: options,
      }),
      invalidatesTags: ["raw-material"],
    }),

    deleteRawMaterial: build.mutation({
      query: (id) => ({
        url: `/raw-material/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["raw-material"],
    }),
  }),
});

export const {
  useGetRawMaterialQuery,
  usePostRawMaterialMutation,
  useLazyGetRawMaterialQuery,
  useDeleteRawMaterialMutation,
  useUpdateRawMaterialMutation,
  useGetSingleRawMaterialQuery,
  useLazyGetSingleRawMaterialQuery,
} = rawMaterialApi;
