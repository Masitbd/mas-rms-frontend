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
  Clock,
} from "lucide-react";

type TItemGroups = {
  itemGroup: string;
  granTotalBill: number;
  grandTotalQty: number;
  grandTotalRate: number;
  items: TRecord[];
};

type TRecord = {
  code: string;
  name: string | number;
  cookingTime: number;
  rate: number;
};

type TGroup = {
  records: TRecord[];
  menuGroups: { menuGroup: string; itemGroups: TItemGroups[] }[];
  itemGroups: TItemGroups[];
  branch: string;
};

type TDailySalesSummery = {
  data: {
    branchInfo: TBranch;
    result: TGroup[];
  };
  isLoading: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
};

const MenuGroupItemTable: React.FC<TDailySalesSummery> = ({
  data,
  isLoading,
  startDate,
  endDate,
}) => {
  const formattedStartDate = startDate ? formatDate(startDate) : "";
  const formattedEndDate = endDate ? formatDate(endDate) : "";

  // Calculate statistics summary
  const stats = useMemo(() => {
    let totalItemsCount = 0;
    let totalPriceSum = 0;
    const menuGroupsSet = new Set<string>();
    const itemGroupsSet = new Set<string>();
    const totalBranches = data?.result?.length || 0;

    data?.result?.forEach((group) => {
      group?.menuGroups?.forEach((mGroup) => {
        if (mGroup.menuGroup) {
          menuGroupsSet.add(mGroup.menuGroup);
        }
        mGroup?.itemGroups?.forEach((iGroup) => {
          if (iGroup.itemGroup) {
            itemGroupsSet.add(iGroup.itemGroup);
          }
          iGroup?.items?.forEach((item) => {
            totalItemsCount += 1;
            totalPriceSum += Number(item.rate) || 0;
          });
        });
      });
    });

    const averageRate = totalItemsCount > 0 ? totalPriceSum / totalItemsCount : 0;

    return {
      totalBranches,
      totalItemsCount,
      totalMenuGroupsCount: menuGroupsSet.size,
      totalItemGroupsCount: itemGroupsSet.size,
      averageRate,
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
        // Title
        {
          text: `${data?.branchInfo?.name || "Mas Restaurant"}`,
          style: "header",
          alignment: "center",
          margin: [0, 0, 0, 5],
        },
        {
          text: `${data?.branchInfo?.address1 || "Address not available"}`,
          alignment: "center",
          style: "subheader",
          margin: [0, 0, 0, 3],
        },
        {
          text: `Phone: ${data?.branchInfo?.phone || "Phone not available"}`,
          alignment: "center",
          style: "subheader",
          margin: [0, 0, 0, 3],
        },
        {
          text: `VAT Registration No: ${data?.branchInfo?.vatNo || "N/A"}`,
          style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
        {
          text: `Menu Group Item${
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

        // Data rows for Menu Groups and Items
        ...data?.result?.map((group) => [
          {
            text: `Branch: ${group?.branch || "N/A"}`,
            style: "branchHeader",
            margin: [0, 15, 0, 8],
          },

          // Loop through Menu Groups
          ...group?.menuGroups?.map((menuGroup) => [
            {
              text: `Menu Group: ${menuGroup?.menuGroup || "N/A"}`,
              style: "menuGroupHeader",
              margin: [0, 8, 0, 6],
            },

            // Loop through Item Groups
            ...menuGroup?.itemGroups?.map((orderItemGroup) => [
              {
                text: `Item Group: ${orderItemGroup?.itemGroup || "N/A"}`,
                style: "itemGroupHeader",
                margin: [0, 5, 0, 5],
              },

              // Items table rows
              {
                table: {
                  headerRows: 1,
                  widths: ["20%", "45%", "15%", "20%"],
                  body: [
                    [
                      { text: "Code", style: "tableHeader", alignment: "left" },
                      { text: "Item Name", style: "tableHeader", alignment: "left" },
                      { text: "Rate (৳)", style: "tableHeader", alignment: "right" },
                      { text: "Cooking Time (min)", style: "tableHeader", alignment: "center" },
                    ],
                    // Map over the items for this group
                    ...orderItemGroup?.items?.map((record) => [
                      { text: record.code || "N/A", style: "tableCell" },
                      { text: record.name || "N/A", style: "tableCellBold" },
                      { text: (Number(record.rate) || 0).toFixed(2), style: "tableCell", alignment: "right" },
                      { text: record.cookingTime || "N/A", style: "tableCell", alignment: "center" },
                    ]),
                  ],
                },
                layout: "lightHorizontalLines",
              },

              // Grand Total Row for this Item Group
              {
                table: {
                  widths: ["65%", "15%", "20%"],
                  body: [
                    [
                      {
                        text: `Total items in ${orderItemGroup.itemGroup}:`,
                        bold: true,
                        alignment: "right",
                        style: "subtotalText",
                      },
                      {
                        text: orderItemGroup?.items?.length || 0,
                        bold: true,
                        alignment: "center",
                        style: "subtotalValue",
                      },
                      { text: "", border: [false, false, false, false] },
                    ],
                  ],
                },
                margin: [0, 2, 0, 15],
              },
            ]),
          ]),
        ]),
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          color: "#1e293b", // slate-800
        },
        subheader: {
          fontSize: 9,
          color: "#64748b", // slate-500
        },
        reportTitle: {
          fontSize: 12,
          bold: true,
          color: "#2563eb", // blue-600
        },
        branchHeader: {
          fontSize: 12,
          bold: true,
          color: "#0f172a", // slate-900
        },
        menuGroupHeader: {
          fontSize: 10,
          bold: true,
          color: "#4f46e5", // indigo-600
        },
        itemGroupHeader: {
          fontSize: 9,
          bold: true,
          color: "#7c3aed", // violet-600
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          color: "#475569", // slate-600
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
          color: "#7c3aed",
        },
      },
    };

    pdfMake.createPdf(documentDefinition).print();
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader size="md" content="Loading menu items..." />
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
          No Menu Items Found
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
        {/* Total Menu Items */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50/50 text-indigo-600">
            <Utensils className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Total Menu Items
            </p>
            <p className="text-lg font-bold text-slate-900">
              {stats.totalItemsCount}
            </p>
          </div>
        </div>

        {/* Total Menu Groups */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50/50 text-purple-600">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Menu Groups
            </p>
            <p className="text-lg font-bold text-slate-900">
              {stats.totalMenuGroupsCount}
            </p>
          </div>
        </div>

        {/* Avg Rate */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50/50 text-blue-600">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Average Item Rate
            </p>
            <p className="text-lg font-bold text-slate-900">
              ৳{stats.averageRate.toFixed(2)}
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

            {/* Menu Groups Content */}
            <div className="p-6 space-y-6">
              {group?.menuGroups?.map((mGroup, mGroupIdx) => (
                <div
                  key={mGroupIdx}
                  className="rounded-xl border border-slate-100/80 bg-slate-50/30 p-4 md:p-5 space-y-4"
                >
                  {/* Menu Group Title */}
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-indigo-50 text-indigo-600 font-semibold text-xs">
                      G
                    </span>
                    <h4 className="font-bold text-indigo-900 text-sm md:text-md">
                      {mGroup.menuGroup}
                    </h4>
                  </div>

                  {/* Item Groups Under This Menu Group */}
                  <div className="space-y-6">
                    {mGroup?.itemGroups?.map((orderItemGroup, itemGroupIdx) => (
                      <div key={itemGroupIdx} className="space-y-2">
                        {/* Item Group Title */}
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-violet-700 text-xs md:text-sm">
                            {orderItemGroup.itemGroup}
                          </h5>
                          <span className="rounded-full bg-violet-50/60 border border-violet-100/50 px-2 py-0.5 text-[10px] font-medium text-violet-600">
                            {orderItemGroup?.items?.length} items
                          </span>
                        </div>

                        {/* Items Table */}
                        <div className="overflow-x-auto rounded-lg border border-slate-100 bg-white">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                                <th className="px-4 py-2">Code</th>
                                <th className="px-4 py-2">Item Name</th>
                                <th className="px-4 py-2 text-right">Rate</th>
                                <th className="px-4 py-2 text-center">Cooking Time</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
                              {orderItemGroup?.items?.map((record, recordIdx) => (
                                <tr
                                  key={recordIdx}
                                  className="hover:bg-slate-50/40 transition-colors"
                                >
                                  <td className="px-4 py-2.5 font-semibold text-slate-400">
                                    {record.code || "—"}
                                  </td>
                                  <td className="px-4 py-2.5 font-bold text-slate-900">
                                    {record.name}
                                  </td>
                                  <td className="px-4 py-2.5 text-right font-bold text-blue-600">
                                    ৳{(Number(record.rate) || 0).toLocaleString("en-BD", {
                                      minimumFractionDigits: 2,
                                    })}
                                  </td>
                                  <td className="px-4 py-2.5 text-center text-slate-500 font-medium">
                                    {record.cookingTime ? (
                                      <span className="inline-flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        <span>{record.cookingTime} mins</span>
                                      </span>
                                    ) : (
                                      "—"
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
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
          <span>Print Menu Items Report</span>
        </Button>
      </div>
    </div>
  );
};

export default MenuGroupItemTable;
