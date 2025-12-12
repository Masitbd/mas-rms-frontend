import React from "react";
import { DateWiseSummaryTableForUsers_v2 } from "./DailySalesSummeryForUser_v2";
import DailySalesSummeryForSuperAdmin_v2 from "./DailySalesSummeryForSuperAdmin_v2";
import { useSession } from "next-auth/react";
import DailySalesSummeryPaymentMode from "./DailySalesSummeryPaymentMode";
type DailySalesSummery_v2 = {
  data: string;
  loading: boolean;
};

const dummmyData = [
  {
    _id: { branch: "690dc148222d37a99dd0a012", date: "2025-12-03" },
    branchName: "Mishal Korai Gosto",
    totalBill: 8810,
    totalVat: 0,
    totalGuest: 0,
    totalDiscount: 25,
    totalScharge: 0,
    totalPayable: 8785,
    totalDue: 625,
    totalPaid: 8160,
  },
  {
    _id: { branch: "690dc148222d37a99dd0a012", date: "2025-12-05" },
    branchName: "Mishal Korai Gosto",
    totalBill: 7920,
    totalVat: 0,
    totalGuest: 0,
    totalDiscount: 230,
    totalScharge: 0,
    totalPayable: 7690,
    totalDue: 3145,
    totalPaid: 4545,
  },
  {
    _id: { branch: "690dc148222d37a99dd0a012", date: "2025-12-02" },
    branchName: "Mishal Korai Gosto",
    totalBill: 10820,
    totalVat: 16,
    totalGuest: 0,
    totalDiscount: 155,
    totalScharge: 0,
    totalPayable: 10681,
    totalDue: 566,
    totalPaid: 10115,
  },
  {
    _id: { branch: "690dc148222d37a99dd0a012", date: "2025-11-30" },
    branchName: "Mishal Korai Gosto",
    totalBill: 18810,
    totalVat: 940,
    totalGuest: 5,
    totalDiscount: 0,
    totalScharge: 0,
    totalPayable: 19750,
    totalDue: 17398,
    totalPaid: 2352,
  },
  {
    _id: { branch: "690dc148222d37a99dd0a012", date: "2025-12-04" },
    branchName: "Mishal Korai Gosto",
    totalBill: 22465,
    totalVat: 0,
    totalGuest: 0,
    totalDiscount: 119,
    totalScharge: 0,
    totalPayable: 22346,
    totalDue: 150,
    totalPaid: 22196,
  },
  {
    _id: { branch: "690dc148222d37a99dd0a012", date: "2025-12-07" },
    branchName: "Mishal Korai Gosto",
    totalBill: 21110,
    totalVat: 0,
    totalGuest: 0,
    totalDiscount: 1030,
    totalScharge: 0,
    totalPayable: 20080,
    totalDue: 0,
    totalPaid: 20080,
  },
  {
    _id: { branch: "690dc148222d37a99dd0a012", date: "2025-12-08" },
    branchName: "Mishal Korai Gosto",
    totalBill: 19310,
    totalVat: 0,
    totalGuest: 0,
    totalDiscount: 490,
    totalScharge: 0,
    totalPayable: 18820,
    totalDue: 0,
    totalPaid: 18820,
  },
  {
    _id: { branch: "690dc148222d37a99dd0a012", date: "2025-12-09" },
    branchName: "Mishal Korai Gosto",
    totalBill: 8965,
    totalVat: 0,
    totalGuest: 0,
    totalDiscount: 170,
    totalScharge: 0,
    totalPayable: 8795,
    totalDue: 0,
    totalPaid: 8795,
  },
  {
    _id: { branch: "690dc148222d37a99dd0a012", date: "2025-12-10" },
    branchName: "Mishal Korai Gosto",
    totalBill: 9750,
    totalVat: 0,
    totalGuest: 0,
    totalDiscount: 85,
    totalScharge: 0,
    totalPayable: 9665,
    totalDue: 0,
    totalPaid: 9665,
  },
  {
    _id: { branch: "690dc148222d37a99dd0a012", date: "2025-12-11" },
    branchName: "Mishal Korai Gosto",
    totalBill: 117780,
    totalVat: 2,
    totalGuest: 0,
    totalDiscount: 350,
    totalScharge: 0,
    totalPayable: 117432,
    totalDue: 2,
    totalPaid: 117430,
  },
  {
    _id: { branch: "690dc148222d37a99dd0a012", date: "2025-12-12" },
    branchName: "Mishal Korai Gosto",
    totalBill: 2000,
    totalVat: 100,
    totalGuest: 0,
    totalDiscount: 0,
    totalScharge: 100,
    totalPayable: 2200,
    totalDue: 0,
    totalPaid: 2200,
  },
  {
    _id: { branch: "690dc148222d37a99dd0a012", date: "2025-12-06" },
    branchName: "Mishal Korai Gosto",
    totalBill: 11755,
    totalVat: 0,
    totalGuest: 0,
    totalDiscount: 665,
    totalScharge: 0,
    totalPayable: 11090,
    totalDue: 0,
    totalPaid: 11090,
  },
  {
    _id: { branch: "690dc148222d37a99dd0a012", date: "2025-12-01" },
    branchName: "Mishal Korai Gosto",
    totalBill: 13565,
    totalVat: 299.5,
    totalGuest: 0,
    totalDiscount: 60,
    totalScharge: 0,
    totalPayable: 13804.5,
    totalDue: 2605.5,
    totalPaid: 11199,
  },
];
const DailySalesSummeryTable_V2 = ({
  dateWiseSummary,
  loading,
  paymentModeSummary,
}: {
  dateWiseSummary: any[];
  paymentModeSummary: any[];
  loading: boolean;
}) => {
  const session = useSession();

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
    </div>
  );
};

export default DailySalesSummeryTable_V2;
