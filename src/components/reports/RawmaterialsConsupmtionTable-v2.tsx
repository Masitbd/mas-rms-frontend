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
  Package,
  Coins,
  Layers,
  MapPin,
  Sparkles,
  BookOpen,
} from "lucide-react";

type TRecord = {
  materialName: string;
  materialCode: string;
  rawMaterialName: string;
  totalQty: number;
  rate: number;
  unit: string;
  totalPrice: number;
  branch: string;
  itemName: string;
  itemCode: string;
};

type TGroup = {
  branch: string;
  materials: TRecord[];
};

type TRawmaterialsConsumptionTableProps = {
  data: {
    branchInfo: TBranch;
    result: TGroup[];
  };
  isLoading: boolean;
  startDate: Date | null;
  endDate: Date | null;
};

export const RawmaterialsConsumptionTableV2: React.FC<
  TRawmaterialsConsumptionTableProps
> = ({ data, isLoading, startDate, endDate }) => {
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  // Calculate statistics summary
  const stats = useMemo(() => {
    let totalQtySum = 0;
    let totalPriceSum = 0;
    const uniqueMaterialsSet = new Set<string>();
    const totalBranches = data?.result?.length || 0;

    data?.result?.forEach((group) => {
      group?.materials?.forEach((item) => {
        totalQtySum += item.totalQty || 0;
        totalPriceSum += item.totalPrice || 0;
        if (item.itemCode) {
          uniqueMaterialsSet.add(item.itemCode);
        } else if (item.itemName) {
          uniqueMaterialsSet.add(item.itemName);
        }
      });
    });

    return {
      totalBranches,
      totalQtySum,
      totalPriceSum,
      uniqueMaterialsCount: uniqueMaterialsSet.size,
    };
  }, [data]);

  const generatePDF = () => {
    const pdfContent: any[] = [
      // Branch / Restaurant Info
      {
        text: `${data?.branchInfo?.name || "Mas Restaurant"}`,
        style: "header",
        alignment: "center",
        margin: [0, 0, 0, 8],
      },
      {
        text: `${data?.branchInfo?.address1 || ""}`,
        alignment: "center",
        margin: [0, 0, 0, 4],
      },
      {
        text: `Phone: ${data?.branchInfo?.phone || ""}`,
        alignment: "center",
        margin: [0, 0, 0, 4],
      },
      {
        text: `VAT Registration No: ${data?.branchInfo?.vatNo || ""}`,
        alignment: "center",
        margin: [0, 0, 0, 8],
      },
      {
        text: `Raw Materials Consumption: ${
          formattedStartDate === formattedEndDate
            ? formattedStartDate
            : `from ${formattedStartDate} to ${formattedEndDate}`
        }`,
        style: "subheader",
        alignment: "center",
        color: "#2563eb", // blue-600
        bold: true,
        margin: [0, 0, 0, 15],
      },
    ];

    // Add each branch group
    data?.result?.forEach((group) => {
      const branchQty =
        group.materials?.reduce((acc, item) => acc + (item.totalQty || 0), 0) ||
        0;
      const branchPrice =
        group.materials?.reduce(
          (acc, item) => acc + (item.totalPrice || 0),
          0,
        ) || 0;

      pdfContent.push(
        {
          text: `Branch: ${group.branch}`,
          style: "groupHeader",
          margin: [0, 10, 0, 5],
        },
        {
          table: {
            headerRows: 1,
            widths: ["15%", "40%", "15%", "15%", "15%"],
            body: [
              // Table Headers
              [
                { text: "Code", style: "tableHeader" },
                { text: "Item Name", style: "tableHeader" },
                { text: "QTY", style: "tableHeader", alignment: "right" },
                { text: "Rate/Unit", style: "tableHeader", alignment: "right" },
                {
                  text: "Total Amount",
                  style: "tableHeader",
                  alignment: "right",
                },
              ],
              // Items Rows
              ...group.materials?.map((item) => [
                item.materialCode || "N/A",
                item.materialName || "N/A",
                { text: item.totalQty || 0, alignment: "right" },
                {
                  text: item.rate
                    ? `${item.rate} / ${item.unit || "N/A"}`
                    : "N/A",
                  alignment: "right",
                },
                { text: (item.totalPrice || 0).toFixed(2), alignment: "right" },
              ]),
              // Branch Subtotals
              [
                { text: "Subtotal", bold: true, style: "subtotalStyle" },
                "",
                {
                  text: branchQty,
                  bold: true,
                  alignment: "right",
                  style: "subtotalStyle",
                },
                "",
                {
                  text: branchPrice.toFixed(2),
                  bold: true,
                  alignment: "right",
                  style: "subtotalStyle",
                },
              ],
            ],
          },
          margin: [0, 0, 0, 15],
        },
      );
    });

    // Grand Total Section
    pdfContent.push({
      table: {
        widths: ["70%", "30%"],
        body: [
          [
            { text: "Grand Total Consumption Qty:", style: "grandTotalLabel" },
            {
              text: `${stats.totalQtySum}`,
              alignment: "right",
              style: "grandTotalValue",
            },
          ],
          [
            { text: "Grand Total Consumption Cost:", style: "grandTotalLabel" },
            {
              text: `৳${stats.totalPriceSum.toLocaleString("en-BD", { minimumFractionDigits: 2 })}`,
              alignment: "right",
              style: "grandTotalValue",
            },
          ],
        ],
      },
      margin: [0, 15, 0, 10],
    });

    const documentDefinition: any = {
      pageOrientation: "portrait",
      defaultStyle: {
        fontSize: 10,
      },
      pageMargins: [30, 30, 30, 30],
      content: pdfContent,
      styles: {
        header: {
          fontSize: 16,
          bold: true,
        },
        subheader: {
          fontSize: 12,
        },
        groupHeader: {
          fontSize: 12,
          bold: true,
          color: "#1e3a8a",
        },
        tableHeader: {
          bold: true,
          fillColor: "#f3f4f6",
          fontSize: 9,
          margin: [2, 4, 2, 4],
        },
        subtotalStyle: {
          fillColor: "#f9fafb",
          fontSize: 9,
        },
        grandTotalLabel: {
          bold: true,
          fontSize: 11,
          color: "#b91c1c",
        },
        grandTotalValue: {
          bold: true,
          fontSize: 11,
          color: "#15803d",
        },
      },
    };

    pdfMake.createPdf(documentDefinition).print();
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader size="md" content="Loading consumption reports..." />
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
          No Consumption Data Found
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Try running the report for a different branch or date range.
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
              VAT: {data.branchInfo.vatNo}
            </div>
          )}
        </div>
      )}

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {/* Total Cost Value */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50/50 text-red-600">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Total Consumption Cost
            </p>
            <p className="text-lg font-bold text-slate-900">
              ৳
              {stats.totalPriceSum.toLocaleString("en-BD", {
                maximumFractionDigits: 1,
              })}
            </p>
          </div>
        </div>

        {/* Total Quantity */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50/50 text-blue-600">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Total Qty Consumed
            </p>
            <p className="text-lg font-bold text-slate-900">
              {stats.totalQtySum}
            </p>
          </div>
        </div>

        {/* Unique Materials */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50/50 text-purple-600">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Unique Materials
            </p>
            <p className="text-lg font-bold text-slate-900">
              {stats.uniqueMaterialsCount}
            </p>
          </div>
        </div>

        {/* Active Branches */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50/50 text-emerald-600">
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

      {/* Branch Reports */}
      <div className="space-y-6">
        {data.result.map((group, groupIdx) => {
          const branchQty =
            group.materials?.reduce(
              (acc, item) => acc + (item.totalQty || 0),
              0,
            ) || 0;
          const branchPrice =
            group.materials?.reduce(
              (acc, item) => acc + (item.totalPrice || 0),
              0,
            ) || 0;

          return (
            <div
              key={groupIdx}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
            >
              {/* Branch Header */}
              <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/40 px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  <h3 className="font-bold text-slate-800 text-sm md:text-base">
                    {group.branch}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-100 border border-slate-200/50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    Qty: {branchQty}
                  </span>
                  <span className="rounded-full bg-blue-50/50 border border-blue-100/50 px-2.5 py-0.5 text-xs font-bold text-blue-600">
                    Total: ৳
                    {branchPrice.toLocaleString("en-BD", {
                      maximumFractionDigits: 1,
                    })}
                  </span>
                </div>
              </div>

              {/* Table View */}
              <div className="p-4 md:p-6">
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                        <th className="px-4 py-3">Code</th>
                        <th className="px-4 py-3">Item Name</th>
                        <th className="px-4 py-3 text-right">QTY</th>
                        <th className="px-4 py-3 text-right">Rate / Unit</th>
                        <th className="px-4 py-3 text-right">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
                      {group.materials?.map((item, index) => (
                        <tr
                          key={index}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-4 py-3 font-semibold text-slate-400">
                            {item.materialCode || "—"}
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-900">
                            {item.materialName || "—"}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-slate-950">
                            {item.totalQty || 0}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-500 font-medium">
                            {item.rate
                              ? `৳${item.rate} / ${item.unit || "—"}`
                              : "—"}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-blue-600">
                            ৳
                            {(item.totalPrice || 0).toLocaleString("en-BD", {
                              minimumFractionDigits: 1,
                            })}
                          </td>
                        </tr>
                      ))}

                      {/* Subtotal Row */}
                      <tr className="bg-slate-50/30 font-bold border-t border-slate-100">
                        <td
                          colSpan={2}
                          className="px-4 py-3 text-slate-500 uppercase tracking-wider text-[10px]"
                        >
                          Branch Subtotal
                        </td>
                        <td className="px-4 py-3 text-right text-slate-900 font-bold">
                          {branchQty}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-400">
                          —
                        </td>
                        <td className="px-4 py-3 text-right text-blue-700 font-bold">
                          ৳
                          {branchPrice.toLocaleString("en-BD", {
                            minimumFractionDigits: 1,
                          })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grand Total Summary Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 className="text-sm font-bold text-slate-800 border-b border-slate-150 pb-3 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Consumption Summary</span>
        </h4>
        <div className="divide-y divide-slate-100">
          {data.result.map((item) => {
            const branchPrice =
              item.materials?.reduce(
                (acc, m) => acc + (m.totalPrice || 0),
                0,
              ) || 0;
            return (
              <div
                key={item.branch}
                className="flex justify-between py-3 text-xs"
              >
                <span className="font-semibold text-slate-700 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  {item.branch} Total Consumption
                </span>
                <span className="font-bold text-slate-900">
                  ৳
                  {branchPrice.toLocaleString("en-BD", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            );
          })}

          <div className="flex flex-col gap-2 pt-4 border-t border-slate-200 text-sm font-bold">
            <div className="flex justify-between text-slate-700">
              <span className="uppercase tracking-wide">
                Grand Total Qty Consumed:
              </span>
              <span className="text-slate-900">{stats.totalQtySum}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span className="uppercase tracking-wide">
                Grand Total Consumption Cost:
              </span>
              <span>
                ৳
                {stats.totalPriceSum.toLocaleString("en-BD", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
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
          <span>Print Consumption Report</span>
        </Button>
      </div>
    </div>
  );
};

export default RawmaterialsConsumptionTableV2;
