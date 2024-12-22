import { IRawMaterial } from "@/components/raw-material-setup/TypesAndDefault";
import { baseApi } from "../baseApi";
import { IOrder } from "@/redux/features/order/orderSlice";

const order = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postOrder: build.mutation({
      query: (data: IOrder) => ({
        url: "/order",
        method: "POST",
        body: data,
        data: data,
      }),
      invalidatesTags: [
        "order",
        "single-kitchen-order",
        "active-table-list",
        "active-table-list-details",
      ],
    }),
    updateOrder: build.mutation({
      query: (data: { id: string; data: IOrder }) => ({
        url: `/order/${data.id}`,
        method: "PATCH",
        body: data.data,
        data: data.data,
      }),
      invalidatesTags: [
        "order",
        "single-kitchen-order",
        "active-table-list",
        "active-table-list-details",
      ],
    }),

    getOrders: build.query({
      query: () => ({
        url: "/order",
        method: "GET",
      }),
      providesTags: ["order"],
    }),

    getOrderDataForPatch: build.query({
      query: (id: string) => ({
        url: `/order/patch-data/${id}`,
        method: "GET",
      }),
      providesTags: ["single-order"],
    }),

    getActiveTableList: build.query({
      query: (id: string) => ({
        url: `/order/active-table-list`,
        method: "GET",
      }),
      providesTags: ["active-table-list"],
    }),
    singleKitchenOrderList: build.query({
      query: (id: string) => ({
        url: `/order/kitchen-order-list/${id}`,
        method: "GET",
      }),
      providesTags: ["single-kitchen-order"],
    }),
    getActiveTableListDetails: build.query({
      query: () => ({
        url: `/order/active-table-list-details`,
        method: "GET",
      }),
      providesTags: ["active-table-list-details"],
    }),
    statusChanger: build.mutation({
      query: (data: { id: string; data: { status: string } }) => ({
        url: `/order/status/${data.id}`,
        method: "PATCH",
        body: data.data,
        data: data.data,
      }),
      invalidatesTags: [
        "order",
        "single-kitchen-order",
        "active-table-list",
        "active-table-list-details",
      ],
    }),
  }),
});

export const {
  usePostOrderMutation,
  useGetOrdersQuery,
  useLazyGetOrderDataForPatchQuery,
  useGetActiveTableListQuery,
  useSingleKitchenOrderListQuery,
  useGetActiveTableListDetailsQuery,
  useUpdateOrderMutation,
  useStatusChangerMutation,
} = order;

export type IStatusChanger = ReturnType<typeof useStatusChangerMutation>[0];
