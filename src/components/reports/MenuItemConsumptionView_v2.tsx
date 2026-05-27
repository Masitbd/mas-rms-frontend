import React, { FC, useMemo } from "react";
import { Table, Button } from "rsuite";
import { Printer } from "lucide-react";
import { printMenuItemConsumptionReportPdf } from "./PrintMenuItemConsumptionData";

const { Column, HeaderCell, Cell } = Table;

export type MenuItemConsumptionRecord = {
  totalQuantity: number;
  totalRevenue: number;
  branchId: string;
  branchName: string;
  itemId: string;
  itemName: string;
  itemCode: string;
};

export type BranchGroup = {
  branchId: string;
  branchName: string;
  records: MenuItemConsumptionRecord[];
  totalQuantity: number;
  totalRevenue: number;
};

interface MenuItemConsumptionViewProps {
  data: MenuItemConsumptionRecord[] | null;
  loading: boolean;
  startDate: Date | null;
  endDate: Date | null;
}

export const MenuItemConsumptionView_v2: FC<MenuItemConsumptionViewProps> = ({
  data,
  loading,
  startDate,
  endDate,
}) => {
  const branchGroups = useMemo<BranchGroup[]>(() => {
    if (!data || !Array.isArray(data)) return [];
    const groups: Record<string, BranchGroup> = {};
    data.forEach((record) => {
      if (!groups[record.branchId]) {
        groups[record.branchId] = {
          branchId: record.branchId,
          branchName: record.branchName,
          records: [],
          totalQuantity: 0,
          totalRevenue: 0,
        };
      }
      groups[record.branchId].records.push(record);
      groups[record.branchId].totalQuantity += record.totalQuantity;
      groups[record.branchId].totalRevenue += record.totalRevenue;
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
              <p className="text-xs text-gray-500">Menu Item Consumption</p>
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
                <HeaderCell>Item Code</HeaderCell>
                <Cell dataKey="itemCode" />
              </Column>

              <Column flexGrow={3}>
                <HeaderCell>Item Name</HeaderCell>
                <Cell dataKey="itemName" />
              </Column>

              <Column flexGrow={1} align="right">
                <HeaderCell>Quantity</HeaderCell>
                <Cell dataKey="totalQuantity" />
              </Column>

              <Column flexGrow={1} align="right">
                <HeaderCell>Revenue</HeaderCell>
                <Cell>
                  {(rowData: MenuItemConsumptionRecord) =>
                    rowData.totalRevenue.toLocaleString("en-BD", {
                      maximumFractionDigits: 0,
                    })
                  }
                </Cell>
              </Column>
            </Table>

            {/* Branch totals footer */}
            <div className="flex flex-wrap items-center justify-end gap-10 border-t border-gray-200 bg-gray-50 px-3 py-2 text-[11px] text-gray-700">
              <span>
                <span className="font-semibold">Total Quantity:</span>{" "}
                {group.totalQuantity}
              </span>

              <span>
                <span className="font-semibold">Total Revenue:</span>{" "}
                {group.totalRevenue.toLocaleString("en-BD", {
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
                printMenuItemConsumptionReportPdf([group], startDate, endDate);
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
              printMenuItemConsumptionReportPdf(branchGroups, startDate, endDate);
            }}
          >
            Print All Branches
          </Button>
        </div>
      )}
    </div>
  );
};
