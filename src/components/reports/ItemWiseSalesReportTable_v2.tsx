"use client";

import React from "react";
import { ItemWiseSalesResponse } from "./ItemWiseSalesReportType";
import { Button, Table } from "rsuite";
import {
  calculateTotalForItemWiseSalesReport,
  SalesItem,
} from "./itemWiseSalesReportHelper";
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
        "w-full rounded-2xl border border-slate-200 bg-white shadow-sm",
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

// --------- grouping helpers for YOUR data shape ---------
type CategoryGroup = {
  category: SalesItem["itemCategory"] | null;
  items: SalesItem[];
  totalQty: number;
  totalAmount: number;
};

function groupItemsByCategoryForUi(items: SalesItem[]): CategoryGroup[] {
  const safeItems = Array.isArray(items) ? items : [];

  const map = new Map<string, CategoryGroup>();

  for (const it of safeItems) {
    const cat = (it as any)?.itemCategory ?? null;
    const catId = cat?._id ?? "uncategorized";

    const qty = Number((it as any)?.qty ?? 0) || 0;
    const rate = Number((it as any)?.rate ?? 0) || 0;
    const amount = qty * rate;

    if (!map.has(catId)) {
      map.set(catId, {
        category: cat,
        items: [],
        totalQty: 0,
        totalAmount: 0,
      });
    }

    const bucket = map.get(catId)!;
    bucket.items.push(it);
    bucket.totalQty += qty;
    bucket.totalAmount += amount;
  }

  return Array.from(map.values()).sort((a, b) => {
    const an = (a.category?.name ?? "Uncategorized").toLowerCase();
    const bn = (b.category?.name ?? "Uncategorized").toLowerCase();
    return an.localeCompare(bn);
  });
}

function computeMenuGroupTotals(items: SalesItem[]) {
  const safeItems = Array.isArray(items) ? items : [];
  const totalQty = safeItems.reduce(
    (sum, it: any) => sum + (Number(it?.qty ?? 0) || 0),
    0,
  );
  const totalAmount = safeItems.reduce((sum, it: any) => {
    const qty = Number(it?.qty ?? 0) || 0;
    const rate = Number(it?.rate ?? 0) || 0;
    return sum + qty * rate;
  }, 0);

  return { totalQty, totalAmount, totalItems: safeItems.length };
}

// --------- component ---------
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
        const { totalAmount, totalItem, totalQuantity } =
          calculateTotalForItemWiseSalesReport(branch?.result ?? []);

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
                {/* <p className="text-[11px] text-gray-500">
                  Period: {from?.toLocalString("en-GB")} —{" "}
                  {to?.toLocalString("en-GB")}
                </p> */}
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-medium text-gray-700">
                {branch?.branchInfo?.phone ?? "No Phone no."}
              </span>
            </div>

            {/* Menu group -> Category groups */}
            <div className="space-y-3">
              {(branch?.result ?? []).length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-600">
                  No menu group data found for this branch.
                </div>
              ) : (
                (branch?.result ?? []).map((mg, mgIdx) => {
                  const menuGroupName = (mg as any)?.menuGroup ?? "Menu Group";
                  const items: SalesItem[] = (mg as any)?.items ?? [];

                  const categories = groupItemsByCategoryForUi(items);
                  const menuTotals = computeMenuGroupTotals(items);

                  return (
                    <div
                      key={(mg as any)?._id ?? `${menuGroupName}-${mgIdx}`}
                      className="w-full bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm"
                    >
                      {/* Menu group header */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold uppercase tracking-wide text-gray-800">
                          {menuGroupName}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {menuTotals.totalItems} records
                        </span>
                      </div>

                      {/* Category groups */}
                      {categories.length === 0 ? (
                        <div className="mt-4 rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-600">
                          No categories/items found under this menu group.
                        </div>
                      ) : (
                        categories.map((cg, cgIdx) => {
                          const categoryName =
                            cg.category?.name ?? "Uncategorized";

                          return (
                            <div
                              key={
                                cg.category?._id ?? `${categoryName}-${cgIdx}`
                              }
                              className="mt-4"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                                  {categoryName}
                                </span>
                                <span className="text-[10px] text-gray-500">
                                  {cg.items.length} records
                                </span>
                              </div>

                              <div className="mt-2">
                                <Table
                                  data={cg.items}
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

                                  <Column flexGrow={3}>
                                    <HeaderCell>Item Name</HeaderCell>
                                    <Cell dataKey="itemName" />
                                  </Column>

                                  <Column flexGrow={1}>
                                    <HeaderCell>Quantity</HeaderCell>
                                    <Cell dataKey="qty" />
                                  </Column>

                                  <Column flexGrow={1}>
                                    <HeaderCell>Rate</HeaderCell>
                                    <Cell dataKey="rate" />
                                  </Column>

                                  <Column flexGrow={1}>
                                    <HeaderCell>Total</HeaderCell>
                                    <Cell>
                                      {(rowData: SalesItem) => {
                                        const rate = Number(
                                          (rowData as any)?.rate ?? 0,
                                        );
                                        const qty = Number(
                                          (rowData as any)?.qty ?? 0,
                                        );
                                        const total = rate * qty;

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

                                {/* Category totals */}
                                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 bg-gray-50 px-3 py-2 text-[11px] text-gray-700">
                                  <span>
                                    <span className="font-semibold">
                                      Total Item:
                                    </span>{" "}
                                    {cg.items.length}
                                  </span>

                                  <span>
                                    <span className="font-semibold">
                                      Total Quantity:
                                    </span>{" "}
                                    {cg.totalQty.toLocaleString("en-BD", {
                                      maximumFractionDigits: 0,
                                    })}
                                  </span>

                                  <span>
                                    <span className="font-semibold">
                                      Total Amount:
                                    </span>{" "}
                                    {cg.totalAmount.toLocaleString("en-BD", {
                                      maximumFractionDigits: 0,
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}

                      {/* Menu group totals */}
                      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 space-y-3 mt-5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold uppercase tracking-wide text-gray-800">
                            {menuGroupName} Total:
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 bg-gray-50 px-3 py-2 text-[11px] text-gray-700">
                          <span />
                          <span>
                            <span className="font-semibold">
                              Total Quantity
                            </span>{" "}
                            {menuTotals.totalQty.toLocaleString("en-BD", {
                              maximumFractionDigits: 0,
                            })}
                          </span>

                          <span>
                            <span className="font-semibold">Total Amount:</span>{" "}
                            {menuTotals.totalAmount.toLocaleString("en-BD", {
                              maximumFractionDigits: 0,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Branch grand totals + print */}
            <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm">
              <TotalsCard
                totals={{ totalAmount, totalItem, totalQuantity }}
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
                    // ✅ Print only this branch block (since button is inside branch card)
                    printItemWiseSalesReportPdf([branch], from, to, {
                      openInsteadOfDownload: true,
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

export default ItemWiseSalesReportTable_v2;
