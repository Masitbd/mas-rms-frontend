import { baseApi } from "../baseApi";

const reportsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDailySalesSatementReport: build.query({
      query: (args) => ({
        url: "/reports/daily-statement",
        method: "GET",
        params: args,
      }),
      providesTags: ["reports"],
    }),

    // summery

    getDailySalesSatementSummery: build.query({
      query: (args) => ({
        url: "/reports/daily-statement-summery",
        method: "GET",
        params: args,
      }),
      providesTags: ["reports"],
    }),
    //
    getItemWiseSalesReports: build.query({
      query: (args) => ({
        url: "/reports/itemwise-sales",
        method: "GET",
        params: args,
      }),
      providesTags: ["reports"],
    }),
    //
    getMenuItemsReports: build.query({
      query: (args) => ({
        url: "/reports/menugroup-items",
        method: "GET",
        params: args,
      }),
      providesTags: ["reports"],
    }),
    // menu item consumption

    getMenuItemsConsumptionReports: build.query({
      query: (args) => ({
        url: "/reports/menuitem-consumption",
        method: "GET",
        params: args,
      }),
      providesTags: ["reports"],
    }),
    getMenuItemsConsumpitonCostingReports: build.query({
      query: (args) => ({
        url: "/reports/menuitem-costing",
        method: "GET",
        params: args,
      }),
      providesTags: ["reports"],
    }),
    getRawMaterialsConsumptionReports: build.query({
      query: (args) => ({
        url: "/reports/raw-materials/sales",
        method: "GET",
        params: args,
      }),
      providesTags: ["reports"],
    }),

    //
  }),
});

export const {
  useGetDailySalesSatementReportQuery,
  useGetDailySalesSatementSummeryQuery,
  useGetItemWiseSalesReportsQuery,
  useGetMenuItemsReportsQuery,
  useGetMenuItemsConsumptionReportsQuery,
  useGetMenuItemsConsumpitonCostingReportsQuery,
  useGetRawMaterialsConsumptionReportsQuery,
} = reportsApi;
