"use client";

import React from "react";
import { Button, Table } from "rsuite";
import { Banknote, Printer, Users } from "lucide-react";
import { WaiterWiseSalesResponse_v2 } from "./WaiterWiseSalesReportType_v2";
import { calculateTotalForWaiterWiseSalesReport } from "./waiterWiseSalesReportHelper_v2";
import { printWaiterWiseSalesReportPdf } from "./PrintWaiterWiseSalesData_v2";

type Totals = {
  totalItem: number;
  totalAmount: number;
};

type TotalsCardProps = {
  totals: Totals;
  title?: string;
  currency?: string;
  locale?: string;
  className?: string;
};

export function TotalsCard({
  totals,
  title = "Totals",
  currency = "BDT",
  locale = "en-BD",
  className = "",
}: TotalsCardProps) {
  const money = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(totals.totalAmount || 0);

  const num = (n: number) => new Intl.NumberFormat(locale).format(n || 0);

  const Stat = ({
    icon,
    label,
    value,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }) => (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-black">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] text-slate-600">{label}</div>
        <div className="truncate text-base font-semibold text-black">
          {value}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={[
        "w-full rounded-2xl border border-slate-200 bg-white shadow-sm",
        className,
      ].join(" ")}
    >
      <div className="flex items-center justify-between px-4 pt-4">
        <div>
          <div className="text-sm font-semibold text-black">{title}</div>
          <div className="text-xs text-slate-600">
            Waiters • Amount
          </div>
        </div>

        <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
          Summary
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2">
        <Stat
          icon={<Users className="h-4 w-4" />}
          label="Total Waiters"
          value={num(totals.totalItem)}
        />
        <Stat
          icon={<Banknote className="h-4 w-4" />}
          label="Total amount"
          value={money}
        />
      </div>
    </div>
  );
}

const WaiterWiseSalesReportTable_v2 = ({
  data,
  loading,
  from,
  to,
}: {
  loading: boolean;
  data: WaiterWiseSalesResponse_v2[];
  from: string;
  to: string;
}) => {
  const { Column, HeaderCell, Cell } = Table;

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
        No data found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((branch, branchIdx) => {
        const { totalAmount, totalItem } =
          calculateTotalForWaiterWiseSalesReport(branch?.result ?? []);

        return (
          <div
            key={(branch as any)?._id ?? branchIdx}
            className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 space-y-3"
          >
            {/* Branch header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  {branch?.branchInfo?.name ?? "No Branch Name"}
                </h2>
                <p className="text-xs text-gray-500">
                  {branch?.branchInfo?.address1 ?? "No Address"}
                </p>
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-medium text-gray-700">
                {branch?.branchInfo?.phone ?? "No Phone no."}
              </span>
            </div>

            <div className="space-y-3">
              {(branch?.result ?? []).length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-600">
                  No waiter data found for this branch.
                </div>
              ) : (
                <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm">
                  <Table
                    data={branch.result}
                    autoHeight
                    loading={loading}
                    bordered={false}
                    cellBordered={false}
                    rowHeight={35}
                    headerHeight={40}
                    className="text-xs"
                  >
                    <Column flexGrow={2}>
                      <HeaderCell>Branch</HeaderCell>
                      <Cell dataKey="branchName" />
                    </Column>

                    <Column flexGrow={3}>
                      <HeaderCell>Waiter Name</HeaderCell>
                      <Cell dataKey="waiterName" />
                    </Column>

                    <Column flexGrow={1}>
                      <HeaderCell>Total Amount</HeaderCell>
                      <Cell>
                        {(rowData: any) => {
                          const total = Number(rowData?.totalAmount ?? 0);
                          return (
                            <>
                              {total.toLocaleString("en-BD", {
                                maximumFractionDigits: 0,
                              })}
                            </>
                          );
                        }}
                      </Cell>
                    </Column>
                  </Table>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 bg-gray-50 px-3 py-2 text-[11px] text-gray-700 mt-2">
                    <span>
                      <span className="font-semibold">Total Waiters:</span>{" "}
                      {totalItem}
                    </span>

                    <span>
                      <span className="font-semibold">Total Amount:</span>{" "}
                      {totalAmount.toLocaleString("en-BD", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Branch grand totals + print */}
            <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm">
              <TotalsCard
                totals={{ totalAmount, totalItem }}
                title={`${branch?.branchInfo?.name ?? "Branch"} Grand Total`}
                currency="BDT"
              />

              <div className="flex justify-end w-full mt-5">
                <Button
                  appearance="primary"
                  color="blue"
                  size="md"
                  startIcon={<Printer />}
                  onClick={() =>
                    printWaiterWiseSalesReportPdf([branch], from, to, {
                      action: "open",
                    })
                  }
                >
                  Print
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WaiterWiseSalesReportTable_v2;
