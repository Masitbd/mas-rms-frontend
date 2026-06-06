/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import { Loader, Button } from "rsuite";
import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import { formatDate } from "@/utils/formateDate";
import { TBranch } from "./DailySalesSummeryTable";
import {
  Printer,
  BookOpen,
  MapPin,
  Sparkles,
  Utensils,
  Coins,
  Users,
} from "lucide-react";

type TCategory = {
  categoryName: string;
  items: TItem[];
};

type TItem = {
  itemName: string;
  itemCode: string;
  rate: number;
  totalQty: number;
  totalAmount: number;
};

type TGroup = {
  categories: TCategory[];
  items: TItem[];
  waiterName: string;
  branchName: string;
};

type TReportsTable = {
  data: {
    branchInfo: TBranch;
    result: TGroup[];
  };
  isLoading: boolean;
  startDate: Date | null;
  endDate: Date | null;
};

const WaiterSalesDetailsTable: React.FC<TReportsTable> = ({
  startDate,
  endDate,
  data,
  isLoading,
}) => {
  const formattedStartDate = startDate ? formatDate(startDate) : "";
  const formattedEndDate = endDate ? formatDate(endDate) : "";

  // Calculate statistics summary
  const stats = useMemo(() => {
    let totalSales = 0;
    let totalQty = 0;
    const branchesSet = new Set<string>();
    const waitersSet = new Set<string>();

    data?.result?.forEach((group) => {
      if (group.branchName) branchesSet.add(group.branchName);
      if (group.waiterName) waitersSet.add(group.waiterName);

      group?.categories?.forEach((category) => {
        category?.items?.forEach((item) => {
          totalSales += Number(item.totalAmount) || 0;
          totalQty += Number(item.totalQty) || 0;
        });
      });
    });

    return {
      totalBranches: branchesSet.size || 0,
      totalWaiters: waitersSet.size || 0,
      totalSales,
      totalQty,
    };
  }, [data]);

  const generatePDF = () => {
    const documentDefinition: any = {
      pageOrientation: "landscape",
      defaultStyle: {
        fontSize: 10,
        color: "#334155",
      },
      pageMargins: [30, 30, 30, 30],
      content: [
        // Header info
        {
          text: `${data?.branchInfo?.name || "Mas Restaurant"}`,
          style: "header",
          alignment: "center",
          margin: [0, 0, 0, 5],
        },
        {
          text: `${data?.branchInfo?.address1 || ""}`,
          alignment: "center",
          style: "subheader",
          margin: [0, 0, 0, 3],
        },
        {
          text: `Phone: ${data?.branchInfo?.phone || ""}`,
          alignment: "center",
          style: "subheader",
          margin: [0, 0, 0, 3],
        },
        {
          text: `VAT Registration No: ${data?.branchInfo?.vatNo || ""}`,
          style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
        {
          text: `Waiter Wise Sales Details${
            formattedStartDate
              ? ` (${
                  formattedStartDate === formattedEndDate
                    ? formattedStartDate
                    : `from ${formattedStartDate} to ${formattedEndDate}`
                })`
              : ""
          }`,
          style: "reportTitle",
          alignment: "center",
          margin: [0, 0, 0, 15],
        },

        // Data rows for Waiters
        ...data?.result?.map((group) => {
          const waiterSales = group?.categories?.reduce(
            (catAcc, category) =>
              catAcc +
              category.items.reduce(
                (itemAcc, item) => itemAcc + (Number(item.totalAmount) || 0),
                0
              ),
            0
          ) || 0;

          return [
            {
              text: `Branch: ${group.branchName || "N/A"}`,
              style: "branchHeader",
              margin: [0, 15, 0, 4],
            },
            {
              text: `Waiter: ${group.waiterName || "N/A"} (Total Sales: ৳${waiterSales.toFixed(
                2
              )})`,
              style: "waiterHeader",
              margin: [0, 0, 0, 8],
            },

            // Loop through Categories
            ...group?.categories?.map((category) => {
              const categorySales =
                category?.items?.reduce(
                  (acc, item) => acc + (Number(item.totalAmount) || 0),
                  0
                ) || 0;

              return [
                {
                  text: `Category: ${category.categoryName || "N/A"}`,
                  style: "categoryHeader",
                  margin: [0, 6, 0, 4],
                },
                {
                  table: {
                    headerRows: 1,
                    widths: ["15%", "45%", "10%", "15%", "15%"],
                    body: [
                      [
                        { text: "Item Code", style: "tableHeader" },
                        { text: "Item Name", style: "tableHeader" },
                        { text: "QTY", style: "tableHeader", alignment: "right" },
                        { text: "Rate (৳)", style: "tableHeader", alignment: "right" },
                        { text: "Amount (৳)", style: "tableHeader", alignment: "right" },
                      ],
                      ...category?.items?.map((item) => [
                        { text: item.itemCode || "N/A", style: "tableCell" },
                        { text: item.itemName || "N/A", style: "tableCellBold" },
                        { text: item.totalQty || 0, style: "tableCell", alignment: "right" },
                        { text: (Number(item.rate) || 0).toFixed(2), style: "tableCell", alignment: "right" },
                        { text: (Number(item.totalAmount) || 0).toFixed(2), style: "tableCell", alignment: "right" },
                      ]),
                    ],
                  },
                  layout: "lightHorizontalLines",
                },
                {
                  table: {
                    widths: ["70%", "15%", "15%"],
                    body: [
                      [
                        {
                          text: `Total for ${category.categoryName}:`,
                          bold: true,
                          alignment: "right",
                          style: "subtotalText",
                        },
                        {
                          text: category?.items?.reduce((a, c) => a + (c.totalQty || 0), 0) || 0,
                          bold: true,
                          alignment: "right",
                          style: "subtotalValue",
                        },
                        {
                          text: categorySales.toFixed(2),
                          bold: true,
                          alignment: "right",
                          style: "subtotalValue",
                        },
                      ],
                    ],
                  },
                  margin: [0, 2, 0, 12],
                },
              ];
            }),
          ];
        }),

        // Grand Total Section
        {
          table: {
            widths: ["60%", "20%", "20%"],
            body: [
              [
                { text: "Grand Total Summary", bold: true, fontSize: 11, color: "#0f172a" },
                {
                  text: `Items Sold: ${stats.totalQty}`,
                  bold: true,
                  fontSize: 10,
                  color: "#1e293b",
                  alignment: "right",
                },
                {
                  text: `Sales: ৳${stats.totalSales.toFixed(2)}`,
                  bold: true,
                  fontSize: 10,
                  color: "#15803d",
                  alignment: "right",
                },
              ],
            ],
          },
          margin: [0, 20, 0, 0],
        },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          color: "#1e293b",
        },
        subheader: {
          fontSize: 9,
          color: "#64748b",
        },
        reportTitle: {
          fontSize: 12,
          bold: true,
          color: "#2563eb",
        },
        branchHeader: {
          fontSize: 11,
          bold: true,
          color: "#0f172a",
        },
        waiterHeader: {
          fontSize: 10,
          bold: true,
          color: "#0284c7", // sky-600
        },
        categoryHeader: {
          fontSize: 9,
          bold: true,
          color: "#4f46e5", // indigo-600
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          color: "#475569",
          fillColor: "#f8fafc",
        },
        tableCell: {
          fontSize: 8.5,
          color: "#334155",
        },
        tableCellBold: {
          fontSize: 8.5,
          bold: true,
          color: "#0f172a",
        },
        subtotalText: {
          fontSize: 8,
          color: "#475569",
        },
        subtotalValue: {
          fontSize: 8.5,
          color: "#4f46e5",
        },
      },
    };

    pdfMake.createPdf(documentDefinition).print();
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader size="md" content="Loading sales reports..." />
      </div>
    );
  }

  if (!data || !data.result || data.result.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <BookOpen className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-slate-900">
          No Sales Data Found
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Try selecting a different branch or date range.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Branch Info Pill */}
      {data.branchInfo && (
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {data.branchInfo.name}
              </h2>
              <p className="text-xs text-slate-500">
                {data.branchInfo.address1}{" "}
                {data.branchInfo.phone ? `· ${data.branchInfo.phone}` : ""}
              </p>
            </div>
          </div>
          {data.branchInfo.vatNo && (
            <div className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-100 self-start sm:self-center">
              VAT No: {data.branchInfo.vatNo}
            </div>
          )}
        </div>
      )}

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {/* Total Sales Revenue */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50/50 text-emerald-600">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Total Sales Revenue
            </p>
            <p className="text-lg font-bold text-slate-900">
              ৳{stats.totalSales.toLocaleString("en-BD", { maximumFractionDigits: 1 })}
            </p>
          </div>
        </div>

        {/* Total Qty Sold */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50/50 text-indigo-600">
            <Utensils className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Total Quantity Sold
            </p>
            <p className="text-lg font-bold text-slate-900">
              {stats.totalQty}
            </p>
          </div>
        </div>

        {/* Active Waiters */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50/50 text-purple-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Active Waiters
            </p>
            <p className="text-lg font-bold text-slate-900">
              {stats.totalWaiters}
            </p>
          </div>
        </div>

        {/* Active Branches */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50/50 text-blue-600">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Active Branches
            </p>
            <p className="text-lg font-bold text-slate-900">
              {stats.totalBranches}
            </p>
          </div>
        </div>
      </div>

      {/* Branch & Waiter Reports */}
      <div className="space-y-8">
        {data.result.map((group, groupIdx) => {
          const waiterSales = group?.categories?.reduce(
            (catAcc, category) =>
              catAcc +
              category.items.reduce(
                (itemAcc, item) => itemAcc + (Number(item.totalAmount) || 0),
                0
              ),
            0
          ) || 0;

          return (
            <div
              key={groupIdx}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
            >
              {/* Card Header */}
              <div className="flex flex-col gap-3 border-b border-slate-50 bg-slate-50/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-sky-50 text-sky-600 font-bold text-[10px]">
                    W
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm md:text-base">
                      {group.waiterName || "Unnamed Waiter"}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      Branch: {group.branchName}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 self-start sm:self-center">
                  Total Sales: ৳{waiterSales.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Waiter Sales Details Breakdown */}
              <div className="p-6 space-y-6">
                {group?.categories?.map((category, catIdx) => {
                  const categorySales =
                    category?.items?.reduce(
                      (acc, item) => acc + (Number(item.totalAmount) || 0),
                      0
                    ) || 0;
                  const categoryQty =
                    category?.items?.reduce((acc, item) => acc + (Number(item.totalQty) || 0), 0) || 0;

                  return (
                    <div
                      key={catIdx}
                      className="rounded-xl border border-slate-100/80 bg-slate-50/20 p-4 md:p-5 space-y-3"
                    >
                      {/* Category Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <h4 className="font-bold text-indigo-900 text-xs md:text-sm">
                          Category: {category.categoryName}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                          <span>Qty: {categoryQty}</span>
                          <span>·</span>
                          <span>Sales: ৳{categorySales.toLocaleString("en-BD", { maximumFractionDigits: 1 })}</span>
                        </div>
                      </div>

                      {/* Items Table */}
                      <div className="overflow-x-auto rounded-lg border border-slate-100 bg-white">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                              <th className="px-4 py-2">Item Code</th>
                              <th className="px-4 py-2">Item Name</th>
                              <th className="px-4 py-2 text-right">Qty</th>
                              <th className="px-4 py-2 text-right">Unit Rate</th>
                              <th className="px-4 py-2 text-right">Total Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
                            {category.items?.map((item, itemIdx) => (
                              <tr
                                key={itemIdx}
                                className="hover:bg-slate-50/30 transition-colors"
                              >
                                <td className="px-4 py-2.5 font-semibold text-slate-400">
                                  {item.itemCode || "—"}
                                </td>
                                <td className="px-4 py-2.5 font-bold text-slate-900">
                                  {item.itemName}
                                </td>
                                <td className="px-4 py-2.5 text-right font-semibold text-slate-900">
                                  {item.totalQty || 0}
                                </td>
                                <td className="px-4 py-2.5 text-right text-slate-500 font-medium">
                                  ৳{(Number(item.rate) || 0).toFixed(2)}
                                </td>
                                <td className="px-4 py-2.5 text-right font-bold text-blue-600">
                                  ৳{(Number(item.totalAmount) || 0).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Print bar */}
      <div className="flex justify-end pt-2">
        <Button
          appearance="primary"
          color="blue"
          size="lg"
          className="flex items-center gap-2 rounded-xl px-6 py-2.5 font-semibold text-white shadow-sm"
          onClick={generatePDF}
        >
          <Printer className="w-5 h-5" />
          <span>Print Waiter Report</span>
        </Button>
      </div>
    </div>
  );
};

export default WaiterSalesDetailsTable;
