import { IRawMaterial } from "@/components/raw-material-setup/TypesAndDefault";
import { baseApi } from "../baseApi";
import {
  IItemConsumption,
  IMenuItemConsumption,
} from "@/components/menu-item-consumption/TypesAndDefault";

const rawMaterialConsumption = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getConsumption: build.query({
      query: (queryParams) => ({
        url: "/raw-material-consumption",
        method: "GET",
        params: queryParams,
      }),
      providesTags: ["consumption"],
    }),
    getSingleConsumption: build.query({
      query: (id: string) => ({
        url: `/raw-material-consumption/${id}`,
        method: "GET",
      }),
      providesTags: ["consumption"],
    }),

    postConsumption: build.mutation({
      query: (data: IMenuItemConsumption) => ({
        url: "/raw-material-consumption",
        method: "POST",
        body: data,
        data: data,
      }),
      invalidatesTags: ["consumption"],
    }),

    // update

    updateConsumption: build.mutation({
      query: (options: IMenuItemConsumption) => ({
        url: `/raw-material-consumption/${options?._id}`,
        method: "PATCH",
        body: options,
        data: options,
      }),
      invalidatesTags: ["consumption"],
    }),

    deleteConsumption: build.mutation({
      query: (id) => ({
        url: `/raw-material-consumption/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["consumption"],
    }),

    uploadConsumptionImages: build.mutation({
      query: (formData: FormData) => ({
        url: `/image`,
        method: "POST",
        data: formData,
        contentType: "multipart/form-data",
      }),
      invalidatesTags: ["consumption"],
    }),
    updateConsumptionImages: build.mutation({
      query: (data: { data: FormData; id: string }) => ({
        url: `/image/${data?.id}`,
        method: "PATCH",
        data: data?.data,
        contentType: "multipart/form-data",
      }),
      invalidatesTags: ["consumption"],
    }),
    deleteConsumptionImage: build.mutation({
      query: (data: { id: string; publicUrl: string }) => ({
        url: `/image/${data.id}/${data.publicUrl}`,
        method: "DELETE",
      }),
      invalidatesTags: ["consumption"],
    }),
  }),
});

export const {
  usePostConsumptionMutation,
  useDeleteConsumptionMutation,
  useGetConsumptionQuery,
  useLazyGetConsumptionQuery,
  useUpdateConsumptionMutation,
  useGetSingleConsumptionQuery,
  useLazyGetSingleConsumptionQuery,
  useUploadConsumptionImagesMutation,
  useUpdateConsumptionImagesMutation,
  useDeleteConsumptionImageMutation,
} = rawMaterialConsumption;

export type TuseUploadConsumptionImagesMutation = ReturnType<
  typeof useUploadConsumptionImagesMutation
>;

export type TuseUpdateConsumptionImagesMutation = ReturnType<
  typeof useUpdateConsumptionImagesMutation
>;

export type TuseDeleteConsumptionImagesMutation = ReturnType<
  typeof useDeleteConsumptionImageMutation
>;
