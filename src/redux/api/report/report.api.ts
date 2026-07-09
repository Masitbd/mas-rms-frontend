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
    getItemWiseSalesReports_v2: build.query({
      query: (args) => ({
        url: "/reports/itemwise-sales-v2",
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
    //
    getRawMaterialsConsumptionReports: build.query({
      query: (args) => ({
        url: "/reports/raw-materials/sales",
        method: "GET",
        params: args,
      }),
      providesTags: ["reports"],
    }),
    getItemWiseRawMaterialsConsumptionReports: build.query({
      query: (args) => ({
        url: "/reports/item/raw-materials",
        method: "GET",
        params: args,
      }),
      providesTags: ["reports"],
    }),
    getDueStatementReports: build.query({
      query: (args) => ({
        url: "/reports/sales/due-statement",
        method: "GET",
        params: args,
      }),
      providesTags: ["reports"],
    }),
    getWaiterWiseSalesReports: build.query({
      query: (args) => ({
        url: "/reports/waiter-wise-sales",
        method: "GET",
        params: args,
      }),
      providesTags: ["reports"],
    }),
    getWaiterWiseSaleStatementReports: build.query({
      query: (args: any) => ({
        url: "/reports/waiter-wise-sales/statement",
        method: "GET",
        params: args,
      }),
      providesTags: ["reports"],
    }),
    getDashboardStaticsData: build.query({
      query: () => ({
        url: "/reports/dashboard-statistics",
        method: "GET",
      }),
      providesTags: ["reports"],
    }),
    getWaiterWiseSalesReport_v2: build.query({
      query: (args: any) => ({
        url: "/reports/waiter-wise-sales-v2",
        method: "GET",
        params: args,
      }),
      providesTags: ["reports"],
    }),
    getRawMaterialsConsumption: build.query({
      query: (args: any) => ({
        url: "/reports/raw-material-consumption",
        method: "GET",
        params: args,
      }),
      providesTags: ["reports"],
    }),
    //For getting kitchen order cost
    getKitchenOrdersCost: build.query({
      query: (args: any) => ({
        url: "/reports/kitchen-orders-cost",
        method: "GET",
        params: args,
      }),
      providesTags: ["reports"],
    }),
  }),
});

export const {
  useLazyGetDailySalesSatementReportQuery,
  useGetDailySalesSatementReportQuery,
  useGetDailySalesSatementSummeryQuery,
  useLazyGetDailySalesSatementSummeryQuery,
  useGetItemWiseSalesReportsQuery,
  useGetMenuItemsReportsQuery,
  useLazyGetMenuItemsReportsQuery,
  useGetMenuItemsConsumptionReportsQuery,
  useLazyGetMenuItemsConsumptionReportsQuery,
  useGetMenuItemsConsumpitonCostingReportsQuery,
  useLazyGetMenuItemsConsumpitonCostingReportsQuery,
  useGetRawMaterialsConsumptionReportsQuery,
  useLazyGetRawMaterialsConsumptionReportsQuery,
  useGetItemWiseRawMaterialsConsumptionReportsQuery,
  useLazyGetItemWiseRawMaterialsConsumptionReportsQuery,
  useGetDueStatementReportsQuery,
  useLazyGetDueStatementReportsQuery,
  useGetWaiterWiseSaleStatementReportsQuery,
  useLazyGetWaiterWiseSaleStatementReportsQuery,
  useGetWaiterWiseSalesReportsQuery,
  useGetDashboardStaticsDataQuery,
  useGetItemWiseSalesReports_v2Query,
  useLazyGetItemWiseSalesReports_v2Query,
  useGetWaiterWiseSalesReport_v2Query,
  useLazyGetWaiterWiseSalesReport_v2Query,
  useGetRawMaterialsConsumptionQuery,
  useGetKitchenOrdersCostQuery,
  useLazyGetKitchenOrdersCostQuery,
} = reportsApi;
