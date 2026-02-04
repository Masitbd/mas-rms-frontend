import React from "react";
import { ItemWiseSalesResponse } from "./ItemWiseSalesReportType";
import { Button, Table } from "rsuite";
import {
  calculateTotalForItemWiseSalesReport,
  groupItemsByCategory,
  SalesItem,
} from "./itemWiseSalesReportHelper";

// ! Total card
import { Boxes, Hash, Banknote, Printer } from "lucide-react";
import { printItemWiseSalesReportPdf } from "./PrintItemWiseSalesData";

type Totals = {
  totalItem: number;
  totalQuantity: number;
  totalAmount: number;
};

type TotalsCardProps = {
  totals: Totals;
  title?: string;
  currency?: string; // e.g. "BDT"
  locale?: string; // e.g. "en-BD"
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
        "w-full  rounded-2xl border border-slate-200 bg-white shadow-sm",
        className,
      ].join(" ")}
    >
      <div className="flex items-center justify-between px-4 pt-4">
        <div>
          <div className="text-sm font-semibold text-black">{title}</div>
          <div className="text-xs text-slate-600">
            Items • Quantity • Amount
          </div>
        </div>

        <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
          Summary
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-3">
        <Stat
          icon={<Boxes className="h-4 w-4" />}
          label="Total items"
          value={num(totals.totalItem)}
        />
        <Stat
          icon={<Hash className="h-4 w-4" />}
          label="Total quantity"
          value={num(totals.totalQuantity)}
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

const ItemWiseSalesReportTable_v2 = ({
  data,
  loading,
  from,
  to,
}: {
  loading: boolean;
  data: ItemWiseSalesResponse[];
  from: string;
  to: string;
}) => {
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  return data?.map((d) => {
    const { totalAmount, totalItem, totalQuantity } =
      calculateTotalForItemWiseSalesReport(d?.result ?? []);
    return (
      <>
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 space-y-3">
          {/* Date header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                {d?.branchInfo?.name ?? "No Branch Name"}
              </h2>
              <p className="text-xs text-gray-500">
                {d?.branchInfo?.address1 ?? "No Address"}
              </p>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-medium text-gray-700">
              {d?.branchInfo?.phone ?? "No Phone no."}
            </span>
          </div>
          <div>
            {d?.result?.map((e) => {
              const { categories, grandTotalAmount, grandTotalQty } =
                groupItemsByCategory(e?.items);
              return (
                <>
                  <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm my-2">
                    {/* menu group */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold uppercase tracking-wide text-gray-800">
                        {e.menuGroup}
                      </span>
                    </div>
                    {/* Category wise data */}
                    {categories?.map((el) => {
                      return (
                        <>
                          <div className="mt-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                {el.category?.name}
                              </span>
                              <span className="text-[10px] text-gray-500">
                                {el?.items?.length} records
                              </span>
                            </div>
                            <div>
                              <Table
                                data={el.items}
                                autoHeight
                                loading={loading}
                                bordered={false}
                                cellBordered={false}
                                rowHeight={35}
                                headerHeight={40}
                                className="text-xs"
                              >
                                <Column flexGrow={2}>
                                  <HeaderCell>Item Code</HeaderCell>
                                  <Cell dataKey="itemCode" />
                                </Column>
                                <Column flexGrow={2}>
                                  <HeaderCell>Item Name</HeaderCell>
                                  <Cell dataKey="itemName" />
                                </Column>
                                <Column flexGrow={2}>
                                  <HeaderCell>Quantity</HeaderCell>
                                  <Cell dataKey="qty" />
                                </Column>
                                <Column flexGrow={2}>
                                  <HeaderCell>Rate</HeaderCell>
                                  <Cell dataKey="rate" />
                                </Column>
                                <Column flexGrow={2}>
                                  <HeaderCell>Total</HeaderCell>
                                  <Cell>
                                    {(rowData: SalesItem) => {
                                      const rate = Number(rowData?.rate ?? 0);
                                      const Quantity = Number(
                                        rowData?.qty ?? 0,
                                      );
                                      const total = rate * Quantity;
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

                              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 bg-gray-50 px-3 py-2 text-[11px] text-gray-700">
                                <span>
                                  <span className="font-semibold">
                                    Total Item:
                                  </span>{" "}
                                  {el?.items?.length ?? 0}
                                </span>
                                <span>
                                  <span className="font-semibold">
                                    Total Quantity
                                  </span>{" "}
                                  {el?.items?.reduce(
                                    (v, v1) => v + v1.qty,
                                    0,
                                  ) ?? 0}
                                </span>

                                <span>
                                  <span className="font-semibold">
                                    Total Amount:
                                  </span>{" "}
                                  {(
                                    el?.items?.reduce(
                                      (v, v1) => v + v1?.qty * v1?.rate,
                                      0,
                                    ) ?? 0
                                  ).toLocaleString("en-BD", {
                                    maximumFractionDigits: 0,
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}

                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 space-y-3 my-2">
                      <div
                        className="flex items-center justify-between
                      "
                      >
                        <span className="text-sm font-semibold uppercase tracking-wide text-gray-800">
                          {e.menuGroup} Total:
                        </span>
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 bg-gray-50 px-3 py-2 text-[11px] text-gray-700">
                          <span>
                            {/* <span className="font-semibold">
                              Total Quantity
                            </span>{" "}
                            {grandTotalQty} */}
                          </span>
                          <span>
                            <span className="font-semibold">
                              Total Quantity
                            </span>{" "}
                            {grandTotalQty}
                          </span>

                          <span>
                            <span className="font-semibold">Total Amount:</span>{" "}
                            {grandTotalAmount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
          <div>
            <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm my-2">
              {/* <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    Total Item: {totalItem ?? 0}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    Total Quantity:{" "}
                    {totalQuantity.toLocaleString("bd-EN", {
                      maximumFractionDigits: 0,
                    }) ?? 0}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    Total amount:{" "}
                    {totalAmount.toLocaleString("bd-EN", {
                      maximumFractionDigits: 0,
                    }) ?? 0}
                  </div>
                </div>
              </div> */}
              {TotalsCard({
                totals: { totalAmount, totalItem, totalQuantity },
                title: `${d?.branchInfo?.name} Grand Total`,
                currency: "BDT",
              })}
            </div>
            <div className="flex justify-end w-full mt-5">
              <Button
                className=""
                appearance="primary"
                color="blue"
                size="md"
                startIcon={<Printer />}
                onClick={() =>
                  printItemWiseSalesReportPdf(data, from, to, {
                    openInsteadOfDownload: true,
                  })
                }
              >
                Print
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  });
};

export default ItemWiseSalesReportTable_v2;
