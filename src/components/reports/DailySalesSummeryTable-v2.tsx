import React from "react";
import { DateWiseSummaryTableForUsers_v2 } from "./DailySalesSummeryForUser_v2";
import DailySalesSummeryForSuperAdmin_v2 from "./DailySalesSummeryForSuperAdmin_v2";
import { useSession } from "next-auth/react";
import DailySalesSummeryPaymentMode from "./DailySalesSummeryPaymentMode";
import { Button } from "rsuite";
import { PrinterIcon } from "lucide-react";
import { printDateWiseSummaryPdfForUsers } from "./dailySalesSummeryPrint";
import { BranchInfo } from "./PrintSalesTableData";
import { useGetBranchQuery } from "@/redux/api/branch/branch.api";
import { printDateWiseSummaryPdfForAdmins } from "./branchWiseSalesSummeryPdf";
type DailySalesSummery_v2 = {
  data: string;
  loading: boolean;
};

const DailySalesSummeryTable_V2 = ({
  dateWiseSummary,
  loading,
  paymentModeSummary,
  branch,
}: {
  dateWiseSummary: any[];
  paymentModeSummary: any[];
  loading: boolean;
  branch: BranchInfo;
}) => {
  const session = useSession();
  const { data: branches } = useGetBranchQuery(undefined);

  const handlePdfPrinting = () => {
    if (
      session?.data?.user?.role == "admin" ||
      session?.data?.user?.role == "super-admin"
    ) {
      printDateWiseSummaryPdfForAdmins(
        dateWiseSummary,
        branch as BranchInfo & { _id: string },
        paymentModeSummary,
        branches?.data
      );
    } else {
      printDateWiseSummaryPdfForUsers(
        dateWiseSummary,
        branch,
        paymentModeSummary,
        {
          title: "test",
          action: "print",
          branchName: "TEST",
          fileName: "test",
        }
      );
    }
  };

  return (
    <div>
      {session?.data?.user?.role == "admin" ||
      session?.data?.user?.role == "super-admin" ? (
        <DailySalesSummeryForSuperAdmin_v2
          data={dateWiseSummary}
          loading={loading}
        />
      ) : (
        <DateWiseSummaryTableForUsers_v2
          data={dateWiseSummary}
          loading={loading}
        />
      )}
      <div>
        <DailySalesSummeryPaymentMode data={paymentModeSummary} />
      </div>

      <div className="grid grid-cols-4 py-4">
        <Button
          className="col-start-4"
          appearance="primary"
          color="blue"
          startIcon={<PrinterIcon />}
          onClick={() => handlePdfPrinting()}
        >
          Print
        </Button>
      </div>
    </div>
  );
};

export default DailySalesSummeryTable_V2;
