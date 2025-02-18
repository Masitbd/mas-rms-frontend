// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import config from "@/config";
import { axiosBaseQuery } from "@/shared/axios/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

// initialize an empty api service that we'll inject endpoints into later as needed
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery({ baseUrl: config.server_url as string }),
  endpoints: () => ({}),
  tagTypes: [
    "tableList",
    "custmerList",
    "menuGroupList",
    "itemCategory",

    "user-list",
    "waiterList",
    "raw-material",
    "consumption",
    "singleCustomer",
    "order",
    "single-order",
    "single-kitchen-order",
    "active-table-list",
    "active-table-list-details",
    "single-user",

    "reports",
    "waiterList",
    "branch",
    "due-collection-history",
    "delivery-addresses",
    "single-delivery-address",
    "user-orders",
    "single-profile",
    "cancellation-list",
  ],
});
