import { WaiterGroupResult_v2 } from "./WaiterWiseSalesReportType_v2";

export function calculateTotalForWaiterWiseSalesReport(result: WaiterGroupResult_v2[]) {
  let totalAmount = 0;
  const totalItem = result.length;

  for (const row of result) {
    totalAmount += Number(row.totalAmount ?? 0) || 0;
  }

  return { totalItem, totalAmount };
}
