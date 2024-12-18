// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { axiosBaseQuery } from "@/shared/axios/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

// initialize an empty api service that we'll inject endpoints into later as needed
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery({ baseUrl: "http://localhost:3001/api/v1" }),
  endpoints: () => ({}),
  tagTypes: [
    "tableList",
    "custmerList",
    "menuGroupList",
    "itemCategory",

    "waiterList",
    "branch",
  ],
});
