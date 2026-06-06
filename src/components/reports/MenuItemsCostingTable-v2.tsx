/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useMemo } from "react";
import { Loader, Button } from "rsuite";
import { TMenuItemConsumptionProps } from "./MenuItemConsumptionTable";
import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import ReporetHeader from "@/utils/ReporetHeader";
import { createPrintButton } from "@/utils/PrintButton";
import { 
  Utensils, 
  Clock, 
  Coins, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Printer,
  Sparkles,
  Layers,
  ArrowRight
} from "lucide-react";

export const MenuItemsCostingTableV2: React.FC<TMenuItemConsumptionProps> = ({
  data,
  isLoading,
}) => {
  // State to track expanded recipe rows
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Calculate statistics summary
  const stats = useMemo(() => {
    let totalItems = 0;
    let totalCostingSum = 0;
    let totalRateSum = 0;

    data?.result?.forEach((group) => {
      group?.itemGroups?.forEach((itemGroup) => {
        itemGroup?.items?.forEach((item) => {
          totalItems++;
          totalCostingSum += item.totalCosting || 0;
          totalRateSum += item.rate || 0;
        });
      });
    });

    const averageCost = totalItems > 0 ? totalCostingSum / totalItems : 0;
    const averageFoodCostPct = totalRateSum > 0 ? (totalCostingSum / totalRateSum) * 100 : 0;

    return {
      totalItems,
      totalCostingSum,
      averageCost,
      averageFoodCostPct,
    };
  }, [data]);

  const generatePDF = () => {
    const documentDefinition: any = {
      pageOrientation: "landscape",
      defaultStyle: {
        fontSize: 10,
      },
      pageMargins: [20, 20, 20, 20],
      content: [
        // Header Section
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
          text: "Menu Item Consumption Costing Report",
          style: "subheader",
          alignment: "center",
          color: "#2563eb", // blue-600
          bold: true,
          margin: [0, 0, 0, 15],
        },

        // Data Section
        ...data?.result?.map((group) => {
          const groupContent = [
            // Menu Group Header
            {
              text: `Menu Group: ${group.menuGroup}`,
              style: "groupHeader",
              margin: [0, 10, 0, 5],
            },

            // Item Groups
            ...group?.itemGroups?.map((itemGroup) => [
              // Item Group Header
              {
                text: `${itemGroup.branch || ""} - ${itemGroup.itemGroup}`,
                style: "itemGroupHeader",
                margin: [0, 5, 0, 5],
              },

              // Items
              {
                table: {
                  headerRows: 1,
                  widths: ["10%", "30%", "15%", "15%", "15%", "15%"],
                  body: [
                    // Table Headers
                    [
                      { text: "Code", style: "tableHeader" },
                      { text: "Item Name", style: "tableHeader" },
                      { text: "Rate (Selling)", style: "tableHeader", alignment: "right" },
                      { text: "Total Cost", style: "tableHeader", alignment: "right" },
                      { text: "Margin", style: "tableHeader", alignment: "right" },
                      { text: "Food Cost %", style: "tableHeader", alignment: "right" },
                    ],
                    // Items Rows
                    ...itemGroup?.items?.map((item) => {
                      const profit = (item.rate || 0) - (item.totalCosting || 0);
                      const fcPct = item.rate > 0 ? ((item.totalCosting || 0) / item.rate) * 100 : 0;
                      return [
                        item.code || "N/A",
                        item.name || "Unnamed",
                        { text: (item.rate || 0).toFixed(2), alignment: "right" },
                        { text: (item.totalCosting || 0).toFixed(2), alignment: "right" },
                        { text: profit.toFixed(2), alignment: "right" },
                        { text: `${fcPct.toFixed(1)}%`, alignment: "right" },
                      ];
                    }),
                  ],
                },
                margin: [0, 0, 0, 10],
              },

              // Consumptions (nested)
              ...itemGroup?.items?.map((item) => {
                if (!item.consumptions?.length) return null;
                return [
                  {
                    text: `Recipe Breakdown for ${item.name}`,
                    style: "consumptionHeader",
                    margin: [5, 2, 0, 2],
                  },
                  {
                    table: {
                      widths: ["40%", "20%", "20%", "20%"],
                      body: [
                        // Table Headers
                        [
                          { text: "Material Name", style: "subTableHeader" },
                          { text: "Qty / Unit", style: "subTableHeader", alignment: "right" },
                          { text: "Unit Cost", style: "subTableHeader", alignment: "right" },
                          { text: "Total Price", style: "subTableHeader", alignment: "right" },
                        ],
                        // Consumption Rows
                        ...item.consumptions.map((consumption) => [
                          consumption.materialName || "N/A",
                          { text: `${consumption.qty || 0} ${consumption.baseUnit || ""}`, alignment: "right" },
                          { text: `@ ${(consumption.rate || 0).toFixed(2)}`, alignment: "right" },
                          { text: (consumption.price || 0).toFixed(2), alignment: "right" },
                        ]),
                      ],
                    },
                    margin: [15, 0, 0, 8],
                  },
                ];
              }),
            ]),

            // Menu Group Total
            {
              text: `${group.menuGroup} Total Cost: ${group.menuGroupTotalConsumption || 0}`,
              style: "groupTotal",
              alignment: "right",
              margin: [0, 5, 0, 15],
            },
          ];

          return groupContent;
        }),

        // Grand Total Section
        {
          table: {
            widths: ["*", "*"],
            body: [
              ...data?.result?.map((item) => [
                {
                  text: item.menuGroup,
                  style: "menuGroupStyle",
                  alignment: "left",
                },
                {
                  text: `${(item.menuGroupTotalConsumption || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}`,
                  alignment: "right",
                  style: "consumptionStyle",
                },
              ]),
              [
                {
                  text: "Grand Total Costing:",
                  style: "grandTotalLabel",
                  alignment: "left",
                },
                {
                  text: `${data?.result?.reduce(
                    (acc, item) => acc + (item.menuGroupTotalConsumption || 0),
                    0
                  ).toLocaleString("en-BD", { minimumFractionDigits: 2 })}`,
                  alignment: "right",
                  style: "grandTotalValue",
                },
              ],
            ],
          },
          margin: [0, 15, 0, 10],
        },
      ],
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
        itemGroupHeader: {
          fontSize: 11,
          bold: true,
          color: "#4b5563",
        },
        tableHeader: {
          bold: true,
          fillColor: "#f3f4f6",
          fontSize: 9,
          margin: [2, 4, 2, 4],
        },
        subTableHeader: {
          bold: true,
          fillColor: "#f9fafb",
          fontSize: 8,
          margin: [1, 2, 1, 2],
        },
        consumptionHeader: {
          italics: true,
          fontSize: 9,
          color: "#374151",
        },
        groupTotal: {
          bold: true,
          color: "#b91c1c",
          fontSize: 10,
        },
        menuGroupStyle: {
          bold: true,
          fontSize: 10,
          color: "#4f46e5",
        },
        consumptionStyle: {
          fontSize: 10,
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
        <Loader size="md" content="Loading menu item costing data..." />
      </div>
    );
  }

  if (!data || !data.result || data.result.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <BookOpen className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-slate-900">No Costing Data Found</h3>
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
              <h2 className="text-sm font-bold text-slate-900">{data.branchInfo.name}</h2>
              <p className="text-xs text-slate-500">
                {data.branchInfo.address1} {data.branchInfo.phone ? `· ${data.branchInfo.phone}` : ""}
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

      {/* Analytics summary dashboard */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {/* Total Costed Items */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-700">
            <Utensils className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Items</p>
            <p className="text-lg font-bold text-slate-900">{stats.totalItems}</p>
          </div>
        </div>

        {/* Total Costing Sum */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50/50 text-red-600">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Ingredient Cost</p>
            <p className="text-lg font-bold text-slate-900">
              ৳{stats.totalCostingSum.toLocaleString("en-BD", { maximumFractionDigits: 1 })}
            </p>
          </div>
        </div>

        {/* Average Item Ingredient Cost */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50/50 text-amber-600">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Avg Cost / Item</p>
            <p className="text-lg font-bold text-slate-900">
              ৳{stats.averageCost.toLocaleString("en-BD", { maximumFractionDigits: 1 })}
            </p>
          </div>
        </div>

        {/* Average Food Cost Percentage */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50/50 text-emerald-600">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Food Cost %</p>
            <p className="text-lg font-bold text-slate-900">
              {stats.averageFoodCostPct.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Menu Groups */}
      <div className="space-y-6">
        {data.result.map((group, groupIdx) => (
          <div 
            key={groupIdx} 
            className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
          >
            {/* Menu Group Header */}
            <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/40 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <h3 className="font-bold text-slate-800 text-sm md:text-base">
                  {group.menuGroup}
                </h3>
              </div>
              <span className="rounded-full bg-blue-50/50 border border-blue-100/50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                Total Cost: ৳{group.menuGroupTotalConsumption.toLocaleString("en-BD", { maximumFractionDigits: 0 })}
              </span>
            </div>

            <div className="p-4 md:p-6 space-y-6">
              {group.itemGroups?.map((itemGroup, itemGroupIdx) => {
                const uniqueGroupId = `${groupIdx}-${itemGroupIdx}-${itemGroup.itemGroup}`;

                return (
                  <div key={itemGroupIdx} className="space-y-3">
                    {/* Item Group Title */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {itemGroup.itemGroup}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-full">
                        {itemGroup.items?.length || 0} Items
                      </span>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                            <th className="px-4 py-3">Code</th>
                            <th className="px-4 py-3">Item Name</th>
                            <th className="px-4 py-3 hidden md:table-cell">Cooking Time</th>
                            <th className="px-4 py-3 text-right">Selling Rate</th>
                            <th className="px-4 py-3 text-right">Recipe Cost (COGS)</th>
                            <th className="px-4 py-3 text-right">Profit / Food Cost %</th>
                            <th className="px-4 py-3 text-center">Recipe</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
                          {itemGroup.items?.map((item) => {
                            const isExpanded = !!expandedItems[item.code + "-" + item.name];
                            const profit = (item.rate || 0) - (item.totalCosting || 0);
                            const foodCostPct = item.rate > 0 ? ((item.totalCosting || 0) / item.rate) * 100 : 0;

                            // Style based on food cost threshold (Food cost < 35% is great, > 50% is warning)
                            let badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-100";
                            if (foodCostPct > 50) {
                              badgeStyle = "bg-red-50 text-red-700 border-red-100";
                            } else if (foodCostPct > 35) {
                              badgeStyle = "bg-amber-50 text-amber-700 border-amber-100";
                            }

                            return (
                              <React.Fragment key={item.code + "-" + item.name}>
                                <tr 
                                  onClick={() => toggleExpand(item.code + "-" + item.name)}
                                  className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                                >
                                  <td className="px-4 py-3 font-semibold text-slate-400 group-hover:text-slate-600">
                                    {item.code || "—"}
                                  </td>
                                  <td className="px-4 py-3 font-bold text-slate-900">
                                    {item.name}
                                  </td>
                                  <td className="px-4 py-3 hidden md:table-cell text-slate-500">
                                    {item.cookingTime ? (
                                      <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{item.cookingTime}</span>
                                      </div>
                                    ) : (
                                      "—"
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-right font-semibold text-slate-950">
                                    ৳{(item.rate || 0).toLocaleString("en-BD", { minimumFractionDigits: 1 })}
                                  </td>
                                  <td className="px-4 py-3 text-right font-semibold text-red-600">
                                    ৳{(item.totalCosting || 0).toLocaleString("en-BD", { minimumFractionDigits: 1 })}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <div className="flex flex-col items-end gap-0.5">
                                      <span className="font-semibold text-emerald-600">
                                        +৳{profit.toLocaleString("en-BD", { maximumFractionDigits: 0 })}
                                      </span>
                                      <span className={`inline-flex items-center rounded-full border px-1.5 py-0.2 text-[10px] font-bold ${badgeStyle}`}>
                                        {foodCostPct.toFixed(1)}%
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {item.consumptions?.length > 0 ? (
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleExpand(item.code + "-" + item.name);
                                        }}
                                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-100 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all"
                                      >
                                        {isExpanded ? (
                                          <ChevronUp className="w-4 h-4" />
                                        ) : (
                                          <ChevronDown className="w-4 h-4" />
                                        )}
                                      </button>
                                    ) : (
                                      <span className="text-[10px] text-slate-400 italic">No recipe</span>
                                    )}
                                  </td>
                                </tr>

                                {/* Expanded recipe row */}
                                {isExpanded && item.consumptions?.length > 0 && (
                                  <tr>
                                    <td colSpan={7} className="bg-slate-50/50 p-4 border-t border-slate-50">
                                      <div className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-inner space-y-3 mx-2 md:mx-6">
                                        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                                          <BookOpen className="w-4 h-4 text-blue-600" />
                                          <span className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                                            Recipe Ingredients Breakdown
                                          </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Ingredients Used</p>
                                            <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                                              {item.consumptions.map((consumption, index) => (
                                                <div key={index} className="flex justify-between items-center p-2.5 text-[11px] bg-slate-50/20 hover:bg-slate-50/70 transition-colors">
                                                  <span className="font-semibold text-slate-800">{consumption.materialName}</span>
                                                  <div className="flex items-center gap-4 text-slate-600">
                                                    <span>{consumption.qty || 0} {consumption.baseUnit || "pcs"}</span>
                                                    <span className="text-slate-400">@ ৳{(consumption.rate || 0).toFixed(1)}</span>
                                                    <span className="font-bold text-slate-900">৳{(consumption.price || 0).toFixed(1)}</span>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>

                                          <div className="flex flex-col justify-between rounded-lg border border-slate-100 bg-slate-50/20 p-4">
                                            <div>
                                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Cost Analysis Summary</p>
                                              <div className="space-y-2 text-xs">
                                                <div className="flex justify-between text-slate-600">
                                                  <span>Selling Price:</span>
                                                  <span className="font-semibold text-slate-900">৳{(item.rate || 0).toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-slate-600">
                                                  <span>Recipe Cost (COGS):</span>
                                                  <span className="font-semibold text-red-600">৳{(item.totalCosting || 0).toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between border-t border-dashed border-slate-200 pt-2 text-slate-700 font-bold">
                                                  <span>Net Margin:</span>
                                                  <span className="text-emerald-600">৳{profit.toFixed(2)}</span>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                              <span className="text-[10px] text-slate-400 font-medium">Food Cost Index</span>
                                              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${badgeStyle}`}>
                                                {foodCostPct.toFixed(1)}% FC
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Grand Total Statement Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 className="text-sm font-bold text-slate-800 border-b border-slate-150 pb-3 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Costing Group Summary</span>
        </h4>
        <div className="divide-y divide-slate-100">
          {data.result.map((item) => (
            <div key={item.menuGroup} className="flex justify-between py-3 text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                {item.menuGroup} Group Total Costing
              </span>
              <span className="font-bold text-slate-900">
                ৳{(item.menuGroupTotalConsumption || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}

          <div className="flex justify-between pt-4 border-t border-slate-200 text-sm font-bold">
            <span className="text-red-600 uppercase tracking-wide">Grand Total Recipe Cost (COGS):</span>
            <span className="text-red-600">
              ৳{data.result.reduce((acc, item) => acc + (item.menuGroupTotalConsumption || 0), 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Actions and Print bar */}
      <div className="flex justify-end pt-2">
        <Button
          appearance="primary"
          color="blue"
          size="lg"
          className="flex items-center gap-2 rounded-xl px-6 py-2.5 font-semibold text-white shadow-sm"
          onClick={generatePDF}
        >
          <Printer className="w-5 h-5" />
          <span>Print Costing Report</span>
        </Button>
      </div>
    </div>
  );
};

export default MenuItemsCostingTableV2;
