import React, { useMemo } from "react";
import { Table, Loader } from "rsuite";
import "rsuite/dist/rsuite.min.css";

const { Column, HeaderCell, Cell } = Table;

export interface DateWiseSummaryItem {
  _id: {
    branch: string;
    date: string; // ISO date string, e.g. "2025-12-03"
  };
  branchName: string;
  totalBill: number;
  totalVat: number;
  totalGuest: number;
  totalDiscount: number;
  totalScharge: number;
  totalPayable: number;
  totalDue: number;
  totalPaid: number;
}

export type DateWiseSummaryRow = DateWiseSummaryItem & {
  __isTotal?: boolean;
};

export interface DateWiseSummaryTableProps {
  data: DateWiseSummaryItem[];
  loading: boolean;
}

export const formatDate = (isoDate: string) => {
  if (!isoDate) return "-";
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatNumber = (value: number | undefined | null) =>
  (value ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const DateWiseSummaryTableForUsers_v2: React.FC<
  DateWiseSummaryTableProps
> = ({ data, loading }) => {
  const tableData: DateWiseSummaryRow[] = useMemo(() => {
    if (!data || data.length === 0) return [];

    const sorted = [...data].sort(
      (a, b) => new Date(a._id.date).getTime() - new Date(b._id.date).getTime()
    );

    const totals = sorted.reduce(
      (acc, item) => {
        acc.totalBill += item.totalBill ?? 0;
        acc.totalVat += item.totalVat ?? 0;
        acc.totalGuest += item.totalGuest ?? 0;
        acc.totalDiscount += item.totalDiscount ?? 0;
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
      totalScharge: 0,
      totalPayable: totals.totalPayable,
      totalDue: totals.totalDue,
      totalPaid: totals.totalPaid,
      __isTotal: true,
    };

    return [...sorted, totalRow];
  }, [data]);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm">
      {/* Header */}
      {/* <div className="mb-4 flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            Date-wise Summary
          </h2>
          {data?.[0]?.branchName && (
            <p className="text-xs md:text-sm text-gray-500">
              Branch:{" "}
              <span className="font-medium text-gray-700">
                {data[0].branchName}
              </span>
            </p>
          )}
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
            <Loader size="sm" />
            <span>Loading data…</span>
          </div>
        )}
      </div> */}

      {/* Table container */}
      <div className=" overflow-hidden border  bg-white">
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
          {/* Bill Date */}
          <Column flexGrow={1} align="left">
            <HeaderCell>Bill Date</HeaderCell>
            <Cell>
              {(rowData: DateWiseSummaryRow) =>
                rowData?.__isTotal ? (
                  <span className="font-semibold text-gray-900">Total</span>
                ) : (
                  <span className="text-gray-800">
                    {formatDate(rowData._id.date)}
                  </span>
                )
              }
            </Cell>
          </Column>

          {/* Guest */}
          <Column width={90} align="right">
            <HeaderCell>Guest</HeaderCell>
            <Cell>
              {(rowData: DateWiseSummaryRow) => (
                <span className="text-gray-800">{rowData.totalGuest ?? 0}</span>
              )}
            </Cell>
          </Column>

          {/* Total Bill */}
          <Column flexGrow={1} align="right">
            <HeaderCell>Total Bill</HeaderCell>
            <Cell>
              {(rowData: DateWiseSummaryRow) => (
                <span className="text-gray-800">
                  {formatNumber(rowData.totalBill)}
                </span>
              )}
            </Cell>
          </Column>

          {/* Total VAT */}
          <Column flexGrow={1} align="right">
            <HeaderCell>Total VAT</HeaderCell>
            <Cell>
              {(rowData: DateWiseSummaryRow) => (
                <span className="text-gray-800">
                  {formatNumber(rowData.totalVat)}
                </span>
              )}
            </Cell>
          </Column>

          {/* T Discount */}
          <Column flexGrow={1} align="right">
            <HeaderCell>T Discount</HeaderCell>
            <Cell>
              {(rowData: DateWiseSummaryRow) => (
                <span className="text-gray-800">
                  {formatNumber(rowData.totalDiscount)}
                </span>
              )}
            </Cell>
          </Column>

          {/* T service charge */}
          <Column flexGrow={1} align="right">
            <HeaderCell>T S Charge</HeaderCell>
            <Cell>
              {(rowData: DateWiseSummaryRow) => (
                <span className="text-gray-800">
                  {formatNumber(rowData.totalScharge)}
                </span>
              )}
            </Cell>
          </Column>

          {/* Net Payable */}
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

          {/* Due */}
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

          {/* Paid */}
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
    </div>
  );
};
