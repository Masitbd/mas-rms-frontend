import { BranchInfo } from "./ItemWiseSalesReportType";

export interface WaiterWiseSalesResponse_v2 {
  branchInfo: BranchInfo;
  result: WaiterGroupResult_v2[];
}

export interface WaiterGroupResult_v2 {
  waiterName: string;
  branchName: string;
  totalAmount: number;
}
