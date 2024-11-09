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
} = rawMaterialConsumption;
