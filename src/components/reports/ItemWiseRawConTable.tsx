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
  Layers,
  Utensils,
  Coins,
  ArrowRight,
} from "lucide-react";

export type TConsumption = {
  rawMaterialName: string;
  rawMaterialId: string;
  rate: number;
  unit: string;
  totalQty: number;
  totalPrice: number;
  itemCode?: string;
  itemName?: string;
  totalItemQty?: number;
  totalAmount?: number;
};

type TMaterials = {
  itemCode: string;
  itemName: string;
  itemRate: number;
  totalItemQty: number;
  totalAmount: number;
  consumptions: TConsumption[];
};

type TGroup = {
  branch: string;
  materials: TMaterials[];
};

type TItemWiseRawConProps = {
  data: {
    branchInfo: TBranch;
    result: TGroup[];
  };
  isLoading: boolean;
  startDate: Date | null;
  endDate: Date | null;
};

const ItemWiseRawConTable: React.FC<TItemWiseRawConProps> = ({
  data,
  isLoading,
  startDate,
  endDate,
}) => {
  const formattedStartDate = startDate ? formatDate(startDate) : "";
  const formattedEndDate = endDate ? formatDate(endDate) : "";

  // Calculate statistics summary
  const stats = useMemo(() => {
    let totalItemsQty = 0;
    let totalAmountSum = 0;
    let totalRawMaterialQty = 0;
    let totalRawMaterialPrice = 0;
    const uniqueRawMaterials = new Set<string>();
    const totalBranches = data?.result?.length || 0;

    data?.result?.forEach((group) => {
      group?.materials?.forEach((material) => {
        totalItemsQty += Number(material.totalItemQty) || 0;
        totalAmountSum += Number(material.totalAmount) || 0;
        material?.consumptions?.forEach((consumption) => {
          totalRawMaterialQty += Number(consumption.totalQty) || 0;
          totalRawMaterialPrice += Number(consumption.totalPrice) || 0;
          if (consumption.rawMaterialId) {
            uniqueRawMaterials.add(consumption.rawMaterialId);
          } else if (consumption.rawMaterialName) {
            uniqueRawMaterials.add(consumption.rawMaterialName);
          }
        });
      });
    });

    return {
      totalBranches,
      totalItemsQty,
      totalAmountSum,
      totalRawMaterialQty,
      totalRawMaterialPrice,
      uniqueRawMaterialsCount: uniqueRawMaterials.size,
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
          text: `Item Wise Raw Consumption${
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

        // Loop through each group (branch)
        ...data?.result?.map((group) => [
          {
            text: `Branch: ${group?.branch || "N/A"}`,
            style: "branchHeader",
            margin: [0, 15, 0, 8],
          },

          // Table of Items sold at this branch
          {
            table: {
              headerRows: 1,
              widths: ["15%", "40%", "15%", "15%", "15%"],
              body: [
                [
                  { text: "Item Code", style: "tableHeader" },
                  { text: "Item Name", style: "tableHeader" },
                  { text: "Sold QTY", style: "tableHeader", alignment: "right" },
                  { text: "Rate (৳)", style: "tableHeader", alignment: "right" },
                  { text: "Total Sales (৳)", style: "tableHeader", alignment: "right" },
                ],
                ...group?.materials?.map((material) => [
                  { text: material?.itemCode || "N/A", style: "tableCell" },
                  { text: material?.itemName || "N/A", style: "tableCellBold" },
                  { text: material?.totalItemQty || 0, style: "tableCell", alignment: "right" },
                  { text: (Number(material?.itemRate) || 0).toFixed(2), style: "tableCell", alignment: "right" },
                  { text: (Number(material?.totalAmount) || 0).toFixed(2), style: "tableCell", alignment: "right" },
                ]),
              ],
            },
            layout: "lightHorizontalLines",
            margin: [0, 0, 0, 15],
          },

          // Breakdown section for each material's consumption
          {
            text: "Raw Material Consumption Breakdown:",
            style: "sectionTitle",
            margin: [0, 10, 0, 5],
          },
          ...group?.materials?.map((material) => [
            {
              text: `Consumption for: ${material?.itemName} (${material?.itemCode})`,
              style: "materialSectionHeader",
              margin: [0, 8, 0, 4],
            },
            {
              table: {
                headerRows: 1,
                widths: ["20%", "45%", "15%", "20%"],
                body: [
                  [
                    { text: "Material Code", style: "tableHeader" },
                    { text: "Material Name", style: "tableHeader" },
                    { text: "Consumed QTY", style: "tableHeader", alignment: "right" },
                    { text: "Cost Price (৳)", style: "tableHeader", alignment: "right" },
                  ],
                  ...material?.consumptions?.map((consumption) => [
                    { text: consumption?.rawMaterialId || "—", style: "tableCell" },
                    { text: consumption?.rawMaterialName || "—", style: "tableCellBold" },
                    { text: `${consumption?.totalQty || 0} ${consumption?.unit || ""}`, style: "tableCell", alignment: "right" },
                    { text: (Number(consumption?.totalPrice) || 0).toFixed(2), style: "tableCell", alignment: "right" },
                  ]),
                ],
              },
              layout: "lightHorizontalLines",
              margin: [0, 0, 0, 15],
            },
          ]),
        ]),

        // Grand total summary row
        {
          table: {
            widths: ["50%", "25%", "25%"],
            body: [
              [
                { text: "Grand Total Summary", bold: true, fontSize: 11, color: "#0f172a" },
                {
                  text: `Items Sold: ${stats.totalItemsQty}`,
                  bold: true,
                  fontSize: 10,
                  color: "#1e293b",
                  alignment: "right",
                },
                {
                  text: `Sales: ৳${stats.totalAmountSum.toFixed(2)}`,
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
        sectionTitle: {
          fontSize: 10,
          bold: true,
          color: "#475569",
        },
        materialSectionHeader: {
          fontSize: 9,
          bold: true,
          color: "#4f46e5",
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          color: "#475569",
          fillColor: "#f8fafc",
        },
        tableCell: {
          fontSize: 8,
          color: "#334155",
        },
        tableCellBold: {
          fontSize: 8,
          bold: true,
          color: "#0f172a",
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
          Try selecting a different branch or running the search.
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
        {/* Total Items Sold */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50/50 text-indigo-600">
            <Utensils className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Total Items Sold
            </p>
            <p className="text-lg font-bold text-slate-900">
              {stats.totalItemsQty}
            </p>
          </div>
        </div>

        {/* Sales Revenue */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50/50 text-emerald-600">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Sales Revenue
            </p>
            <p className="text-lg font-bold text-slate-900">
              ৳{stats.totalAmountSum.toLocaleString("en-BD", { maximumFractionDigits: 1 })}
            </p>
          </div>
        </div>

        {/* Raw Material Cost */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50/50 text-red-600">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Raw Material Price
            </p>
            <p className="text-lg font-bold text-slate-900">
              ৳{stats.totalRawMaterialPrice.toLocaleString("en-BD", { maximumFractionDigits: 1 })}
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

      {/* Branch Reports */}
      <div className="space-y-8">
        {data.result.map((group, groupIdx) => (
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
            </div>

            {/* Materials Content */}
            <div className="p-6 space-y-6">
              {group?.materials?.map((material, materialIdx) => (
                <div
                  key={materialIdx}
                  className="rounded-xl border border-slate-100/80 bg-slate-50/20 p-4 md:p-5 space-y-4"
                >
                  {/* Parent Item Header */}
                  <div className="flex flex-col gap-3 pb-3 border-b border-slate-100 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-2.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-indigo-50 text-indigo-600 font-bold text-[10px]">
                        ITEM
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {material.itemName}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">
                          Code: {material.itemCode || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-slate-100 border border-slate-200/50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                        Qty Sold: {material.totalItemQty}
                      </span>
                      <span className="rounded-full bg-slate-100 border border-slate-200/50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                        Rate: ৳{Number(material.itemRate).toFixed(2)}
                      </span>
                      <span className="rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                        Total Sales: ৳{Number(material.totalAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Consumed Raw Materials Subsection */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      <span>Raw Material Consumption Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>

                    {material?.consumptions && material.consumptions.length > 0 ? (
                      <div className="overflow-x-auto rounded-lg border border-slate-100 bg-white">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                              <th className="px-4 py-2">Material Code</th>
                              <th className="px-4 py-2">Material Name</th>
                              <th className="px-4 py-2 text-right">Qty Consumed</th>
                              <th className="px-4 py-2 text-right">Cost Rate</th>
                              <th className="px-4 py-2 text-right">Cost Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
                            {material.consumptions.map((consumption, index) => (
                              <tr
                                key={index}
                                className="hover:bg-slate-50/30 transition-colors"
                              >
                                <td className="px-4 py-2.5 font-semibold text-slate-400">
                                  {consumption.rawMaterialId || "—"}
                                </td>
                                <td className="px-4 py-2.5 font-bold text-slate-900">
                                  {consumption.rawMaterialName}
                                </td>
                                <td className="px-4 py-2.5 text-right font-semibold text-slate-900">
                                  {consumption.totalQty || 0} {consumption.unit || ""}
                                </td>
                                <td className="px-4 py-2.5 text-right text-slate-500 font-medium">
                                  ৳{(Number(consumption.rate) || 0).toFixed(2)}
                                </td>
                                <td className="px-4 py-2.5 text-right font-bold text-red-600">
                                  ৳{(Number(consumption.totalPrice) || 0).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-center py-4 text-xs italic text-slate-400 bg-white rounded-lg border border-slate-100">
                        No raw materials consumption defined for this item.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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

export default ItemWiseRawConTable;
