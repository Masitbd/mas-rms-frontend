import React, { FC, useMemo } from "react";
import { Table, Button } from "rsuite";
import { Printer } from "lucide-react";
import { printDueSalesStatementPdf } from "./PrintDueSalesStatementData";

const { Column, HeaderCell, Cell } = Table;

export type DueSalesStatementRecord = {
  billNo: string;
  date: string;
  branchId: string;
  branchName: string;
  customerName: string;
  customerPhone: string;
  totalBill: number;
  paidAmount: number;
  dueAmount: number;
  netPayable: number;
};

export type BranchDueGroup = {
  branchId: string;
  branchName: string;
  records: DueSalesStatementRecord[];
  totalDue: number;
  totalPaid: number;
  totalBill: number;
};

interface DueSalesStatementViewProps {
  data: DueSalesStatementRecord[] | null;
  loading: boolean;
  startDate: Date | null;
  endDate: Date | null;
}

export const DueSalesStatementView_v2: FC<DueSalesStatementViewProps> = ({
  data,
  loading,
  startDate,
  endDate,
}) => {
  const branchGroups = useMemo<BranchDueGroup[]>(() => {
    if (!data || !Array.isArray(data)) return [];
    const groups: Record<string, BranchDueGroup> = {};
    data.forEach((record) => {
      if (!groups[record.branchId]) {
        groups[record.branchId] = {
          branchId: record.branchId,
          branchName: record.branchName,
          records: [],
          totalDue: 0,
          totalPaid: 0,
          totalBill: 0,
        };
      }
      groups[record.branchId].records.push(record);
      groups[record.branchId].totalDue += record.dueAmount;
      groups[record.branchId].totalPaid += record.paidAmount;
      groups[record.branchId].totalBill += record.totalBill;
    });
    return Object.values(groups);
  }, [data]);

  if (!loading && (!data || data.length === 0)) {
    return (
      <p className="text-xs text-gray-500 text-center py-10">
        No data available for the selected range.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {branchGroups.map((group) => (
        <div
          key={group.branchId}
          className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 space-y-3"
        >
          {/* Branch header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                {group.branchName}
              </h2>
              <p className="text-xs text-gray-500">Due Sales Statement</p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white">
            <Table
              data={group.records}
              autoHeight
              loading={loading}
              bordered={false}
              cellBordered={false}
              rowHeight={35}
              headerHeight={40}
              className="text-xs"
            >
              <Column flexGrow={1}>
                <HeaderCell>Bill No</HeaderCell>
                <Cell dataKey="billNo" />
              </Column>

              <Column flexGrow={1}>
                <HeaderCell>Date</HeaderCell>
                <Cell>
                  {(rowData: DueSalesStatementRecord) =>
                    new Date(rowData.date).toLocaleDateString("en-GB")
                  }
                </Cell>
              </Column>

              <Column flexGrow={2}>
                <HeaderCell>Customer</HeaderCell>
                <Cell>
                  {(rowData: DueSalesStatementRecord) =>
                    rowData.customerName || rowData.customerPhone || "N/A"
                  }
                </Cell>
              </Column>

              <Column flexGrow={1} align="right">
                <HeaderCell>Total Bill</HeaderCell>
                <Cell>
                  {(rowData: DueSalesStatementRecord) =>
                    rowData.totalBill.toLocaleString("en-BD", {
                      maximumFractionDigits: 0,
                    })
                  }
                </Cell>
              </Column>

              <Column flexGrow={1} align="right">
                <HeaderCell>Paid</HeaderCell>
                <Cell>
                  {(rowData: DueSalesStatementRecord) =>
                    rowData.paidAmount.toLocaleString("en-BD", {
                      maximumFractionDigits: 0,
                    })
                  }
                </Cell>
              </Column>

              <Column flexGrow={1} align="right">
                <HeaderCell>Due</HeaderCell>
                <Cell>
                  {(rowData: DueSalesStatementRecord) =>
                    rowData.dueAmount.toLocaleString("en-BD", {
                      maximumFractionDigits: 0,
                    })
                  }
                </Cell>
              </Column>

              <Column flexGrow={1} align="right">
                <HeaderCell>Net Payable</HeaderCell>
                <Cell>
                  {(rowData: DueSalesStatementRecord) =>
                    rowData.netPayable.toLocaleString("en-BD", {
                      maximumFractionDigits: 0,
                    })
                  }
                </Cell>
              </Column>
            </Table>

            {/* Branch totals footer */}
            <div className="flex flex-wrap items-center justify-end gap-10 border-t border-gray-200 bg-gray-50 px-3 py-2 text-[11px] text-gray-700">
              <span>
                <span className="font-semibold">Total Bill:</span>{" "}
                {group.totalBill.toLocaleString("en-BD", {
                  maximumFractionDigits: 0,
                })}
              </span>
              <span>
                <span className="font-semibold">Total Paid:</span>{" "}
                {group.totalPaid.toLocaleString("en-BD", {
                  maximumFractionDigits: 0,
                })}
              </span>
              <span>
                <span className="font-semibold text-red-600">Total Due:</span>{" "}
                {group.totalDue.toLocaleString("en-BD", {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          </div>

          {/* Print button for branch */}
          <div className="flex justify-end">
            <Button
              appearance="primary"
              color="blue"
              size="sm"
              startIcon={<Printer className="w-4 h-4" />}
              onClick={() => {
                printDueSalesStatementPdf([group], startDate, endDate);
              }}
            >
              Print
            </Button>
          </div>
        </div>
      ))}

      {branchGroups.length > 0 && (
        <div className="flex justify-end pt-4">
          <Button
            appearance="primary"
            color="blue"
            size="lg"
            startIcon={<Printer className="w-5 h-5" />}
            onClick={() => {
              printDueSalesStatementPdf(branchGroups, startDate, endDate);
            }}
          >
            Print All Branches
          </Button>
        </div>
      )}
    </div>
  );
};
