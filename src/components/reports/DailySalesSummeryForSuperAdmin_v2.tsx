import React, { useMemo } from "react";
import {
  DateWiseSummaryItem,
  DateWiseSummaryRow,
  DateWiseSummaryTableProps,
  formatDate,
  formatNumber,
} from "./DailySalesSummeryForUser_v2";
import { BranchInfo } from "./PrintSalesTableData";
import { useGetBranchQuery } from "@/redux/api/branch/branch.api";
import { Loader } from "lucide-react";
import { Table } from "rsuite";

type BranchDoc = BranchInfo & { _id: string };

const BranchWiseTable = ({
  branch,
  data,
  loading,
}: {
  branch: BranchDoc;
  data: DateWiseSummaryItem[] | undefined;
  loading: boolean;
}) => {
  const { Cell, Column, HeaderCell } = Table;

  const tableData: DateWiseSummaryItem[] = useMemo(() => {
    const filtered = (data ?? []).filter(
      (d) => d?._id?.branch?.toString() === branch?._id?.toString()
    );

    if (filtered.length === 0) return [];

    const sorted = [...filtered].sort((a, b) => {
      const ta = new Date(a?._id?.date ?? "").getTime();
      const tb = new Date(b?._id?.date ?? "").getTime();
      return (isNaN(ta) ? 0 : ta) - (isNaN(tb) ? 0 : tb);
    });

    const totals = sorted.reduce(
      (acc, item) => {
        acc.totalBill += item.totalBill ?? 0;
        acc.totalVat += item.totalVat ?? 0;
        acc.totalGuest += item.totalGuest ?? 0;
        acc.totalDiscount += item.totalDiscount ?? 0;
        acc.totalScharge += item.totalScharge ?? 0;
        acc.totalPayable += item.totalPayable ?? 0;
        acc.totalDue += item.totalDue ?? 0;
        acc.totalPaid += item.totalPaid ?? 0;
        return acc;
      },
      {
        totalBill: 0,
        totalVat: 0,
        totalGuest: 0,
        totalDiscount: 0,
        totalScharge: 0,
        totalPayable: 0,
        totalDue: 0,
        totalPaid: 0,
      }
    );

    const totalRow: DateWiseSummaryRow = {
      _id: { branch: "total", date: "" },
      branchName: "Total",
      totalBill: totals.totalBill,
      totalVat: totals.totalVat,
      totalGuest: totals.totalGuest,
      totalDiscount: totals.totalDiscount,
      totalScharge: totals.totalScharge,
      totalPayable: totals.totalPayable,
      totalDue: totals.totalDue,
      totalPaid: totals.totalPaid,
      __isTotal: true,
    };

    return [...sorted, totalRow];
  }, [data, branch._id]);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-xs md:text-sm text-gray-500">
            Branch:{" "}
            <span className="font-medium text-gray-700">{branch?.name}</span>
          </p>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
            <Loader className="animate-spin" size={16} />
            <span>Loading data…</span>
          </div>
        )}
      </div>

      <Table
        data={tableData}
        autoHeight
        loading={loading}
        wordWrap="break-word"
        rowHeight={35}
        headerHeight={40}
        className="!text-xs md:text-sm"
        rowClassName={(rowData: DateWiseSummaryRow) =>
          rowData?.__isTotal ? "bg-gray-50 font-semibold" : ""
        }
      >
        <Column flexGrow={1} align="left">
          <HeaderCell>Bill Date</HeaderCell>
          <Cell>
            {(rowData: DateWiseSummaryRow) =>
              rowData?.__isTotal ? (
                <span className="font-semibold text-gray-900">Total</span>
              ) : (
                <span className="text-gray-800">
                  {formatDate(rowData?._id?.date)}
                </span>
              )
            }
          </Cell>
        </Column>

        <Column width={90} align="right">
          <HeaderCell>Guest</HeaderCell>
          <Cell>
            {(rowData: DateWiseSummaryRow) => rowData.totalGuest ?? 0}
          </Cell>
        </Column>

        <Column flexGrow={1} align="right">
          <HeaderCell>Total Bill</HeaderCell>
          <Cell>
            {(rowData: DateWiseSummaryRow) => formatNumber(rowData.totalBill)}
          </Cell>
        </Column>

        <Column flexGrow={1} align="right">
          <HeaderCell>Total VAT</HeaderCell>
          <Cell>
            {(rowData: DateWiseSummaryRow) => formatNumber(rowData.totalVat)}
          </Cell>
        </Column>

        <Column flexGrow={1} align="right">
          <HeaderCell>T Discount</HeaderCell>
          <Cell>
            {(rowData: DateWiseSummaryRow) =>
              formatNumber(rowData.totalDiscount)
            }
          </Cell>
        </Column>

        <Column flexGrow={1} align="right">
          <HeaderCell>T S Charge</HeaderCell>
          <Cell>
            {(rowData: DateWiseSummaryRow) =>
              formatNumber(rowData.totalScharge)
            }
          </Cell>
        </Column>

        <Column flexGrow={1} align="right">
          <HeaderCell>Net Payable</HeaderCell>
          <Cell>
            {(rowData: DateWiseSummaryRow) => (
              <span className="text-gray-900">
                {formatNumber(rowData.totalPayable)}
              </span>
            )}
          </Cell>
        </Column>

        <Column flexGrow={1} align="right">
          <HeaderCell>Due</HeaderCell>
          <Cell>
            {(rowData: DateWiseSummaryRow) => (
              <span className="text-red-500">
                {formatNumber(rowData.totalDue)}
              </span>
            )}
          </Cell>
        </Column>

        <Column flexGrow={1} align="right">
          <HeaderCell>Paid</HeaderCell>
          <Cell>
            {(rowData: DateWiseSummaryRow) => (
              <span className="text-emerald-600">
                {formatNumber(rowData.totalPaid)}
              </span>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

const DailySalesSummeryForSuperAdmin_v2 = ({
  data,
  loading,
}: DateWiseSummaryTableProps) => {
  const {
    data: branchData,
    isLoading,
    isFetching,
  } = useGetBranchQuery(undefined);

  if (isLoading || isFetching) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-2 text-gray-600">
        <Loader className="animate-spin" size={18} />
        <span className="text-sm">Loading branches…</span>
      </div>
    );
  }

  const branches = (branchData?.data ?? []) as BranchDoc[];

  return (
    <div className="space-y-4">
      {branches.map((bd) => (
        <BranchWiseTable
          key={bd._id}
          branch={bd}
          data={data}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default DailySalesSummeryForSuperAdmin_v2;
