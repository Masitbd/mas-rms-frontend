/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { Loader, Button } from "rsuite";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { formatDate } from "@/utils/formateDate";
import {
  Printer,
  BookOpen,
  DollarSign,
  Utensils,
  ClipboardList,
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  X,
} from "lucide-react";

// Register pdfMake fonts
try {
  (pdfMake as any).vfs =
    (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).vfs;
} catch (e) {
  console.error("Failed to register pdfMake vfs", e);
}

export type TKitchenOrderItem = {
  itemCode: string;
  itemName: string;
  qty: number;
  rate: number;
  unitCostPrice: number;
  totalCostPrice: number;
};

export type TKitchenOrder = {
  _id: string;
  kitchenOrderNo: string;
  billNo: string;
  status: string;
  remark: string | null;
  tableName: string | null;
  waiterName: string | null;
  createdAt: string;
  branchName: string;
  items: TKitchenOrderItem[];
  totalOrderCostPrice: number;
};

type TKitchenOrderCostTableProps = {
  data: any; // Can be TKitchenOrder[] or nested in { success: boolean, data: TKitchenOrder[] }
  isLoading: boolean;
  startDate: Date | null;
  endDate: Date | null;
};

export const KitchenOrderCostTable: React.FC<TKitchenOrderCostTableProps> = ({
  data,
  isLoading,
  startDate,
  endDate,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>(
    {},
  );

  const formattedStartDate = startDate ? formatDate(startDate) : "";
  const formattedEndDate = endDate ? formatDate(endDate) : "";

  // Normalize data to safely get an array of orders
  const orders: TKitchenOrder[] = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.result && Array.isArray(data.result)) return data.result;
    return [];
  }, [data]);

  // Filter orders based on search query and status
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        (order.kitchenOrderNo || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (order.billNo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.tableName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (order.waiterName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (order.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Calculate statistics based on filtered data
  const stats = useMemo(() => {
    let totalCost = 0;
    let totalItemsQty = 0;

    filteredOrders.forEach((order) => {
      totalCost += Number(order.totalOrderCostPrice) || 0;
      order.items?.forEach((item) => {
        totalItemsQty += Number(item.qty) || 0;
      });
    });

    const averageOrderCost =
      filteredOrders.length > 0 ? totalCost / filteredOrders.length : 0;

    return {
      totalOrders: filteredOrders.length,
      totalCost,
      totalItemsQty,
      averageOrderCost,
    };
  }, [filteredOrders]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const toggleExpandAll = () => {
    const allExpanded =
      filteredOrders.length ===
      Object.keys(expandedOrders).filter((k) => expandedOrders[k]).length;
    if (allExpanded) {
      setExpandedOrders({});
    } else {
      const newExpanded: Record<string, boolean> = {};
      filteredOrders.forEach((o) => {
        newExpanded[o._id] = true;
      });
      setExpandedOrders(newExpanded);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const generatePDF = () => {
    const branchName = orders[0]?.branchName || "Mas Restaurant";
    const dateRangeStr = formattedStartDate
      ? ` (${
          formattedStartDate === formattedEndDate
            ? formattedStartDate
            : `from ${formattedStartDate} to ${formattedEndDate}`
        })`
      : "";

    const documentDefinition: any = {
      pageOrientation: "portrait",
      defaultStyle: {
        fontSize: 9,
        color: "#334155",
      },
      pageMargins: [30, 30, 30, 30],
      content: [
        // Report Header
        {
          text: branchName,
          style: "header",
          alignment: "center",
          margin: [0, 0, 0, 4],
        },
        {
          text: "Kitchen Order Cost Report",
          style: "reportTitle",
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
        {
          text: `Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}${dateRangeStr}`,
          alignment: "center",
          style: "subheader",
          margin: [0, 0, 0, 15],
        },

        // Metrics Summary Row
        {
          table: {
            widths: ["25%", "25%", "25%", "25%"],
            body: [
              [
                {
                  text: "Total Orders",
                  style: "summaryTitle",
                  alignment: "center",
                },
                {
                  text: "Total Items Qty",
                  style: "summaryTitle",
                  alignment: "center",
                },
                {
                  text: "Average Order Cost",
                  style: "summaryTitle",
                  alignment: "center",
                },
                {
                  text: "Total Cost",
                  style: "summaryTitle",
                  alignment: "center",
                },
              ],
              [
                {
                  text: stats.totalOrders.toString(),
                  style: "summaryValue",
                  alignment: "center",
                },
                {
                  text: stats.totalItemsQty.toString(),
                  style: "summaryValue",
                  alignment: "center",
                },
                {
                  text: `৳${stats.averageOrderCost.toFixed(2)}`,
                  style: "summaryValue",
                  alignment: "center",
                },
                {
                  text: `৳${stats.totalCost.toFixed(2)}`,
                  style: "summaryValueCost",
                  alignment: "center",
                },
              ],
            ],
          },
          layout: {
            fillColor: (rowIndex: number) =>
              rowIndex === 0 ? "#f8fafc" : null,
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => "#cbd5e1",
            vLineColor: () => "#cbd5e1",
          },
          margin: [0, 0, 0, 20],
        },

        // Main Orders Table
        {
          table: {
            headerRows: 1,
            widths: ["15%", "15%", "15%", "15%", "15%", "10%", "15%"],
            body: [
              [
                { text: "Order Date", style: "tableHeader" },
                { text: "Bill No.", style: "tableHeader" },
                { text: "KOT No.", style: "tableHeader" },
                { text: "Table", style: "tableHeader" },
                { text: "Waiter", style: "tableHeader" },
                { text: "Status", style: "tableHeader", alignment: "center" },
                {
                  text: "Total Cost Price (৳)",
                  style: "tableHeader",
                  alignment: "right",
                },
              ],
              ...filteredOrders.map((order) => [
                {
                  text: order.createdAt
                    ? new Date(order.createdAt).toLocaleString("en-US", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })
                    : "N/A",
                  style: "tableCell",
                },
                { text: order.billNo || "—", style: "tableCell" },
                { text: order.kitchenOrderNo || "—", style: "tableCellBold" },
                { text: order.tableName || "—", style: "tableCell" },
                { text: order.waiterName || "—", style: "tableCell" },
                {
                  text: (order.status || "active").toUpperCase(),
                  style: "tableCell",
                  alignment: "center",
                },
                {
                  text: (Number(order.totalOrderCostPrice) || 0).toFixed(2),
                  style: "tableCellCost",
                  alignment: "right",
                },
              ]),
              // Grand Total Row
              [
                {
                  text: "Grand Total",
                  style: "tableTotalCell",
                  bold: true,
                  colSpan: 6,
                },
                "",
                "",
                "",
                "",
                "",
                {
                  text: `৳${stats.totalCost.toFixed(2)}`,
                  style: "tableTotalCellCost",
                  alignment: "right",
                },
              ],
            ],
          },
          layout: "lightHorizontalLines",
        },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          color: "#0f172a",
        },
        reportTitle: {
          fontSize: 12,
          bold: true,
          color: "#2563eb",
        },
        subheader: {
          fontSize: 9,
          color: "#64748b",
        },
        summaryTitle: {
          fontSize: 9,
          bold: true,
          color: "#475569",
        },
        summaryValue: {
          fontSize: 12,
          bold: true,
          color: "#0f172a",
          margin: [0, 5, 0, 5],
        },
        summaryValueCost: {
          fontSize: 12,
          bold: true,
          color: "#16a34a",
          margin: [0, 5, 0, 5],
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          color: "#475569",
          fillColor: "#f8fafc",
          margin: [0, 4, 0, 4],
        },
        tableCell: {
          fontSize: 8,
          color: "#334155",
          margin: [0, 4, 0, 4],
        },
        tableCellBold: {
          fontSize: 8,
          bold: true,
          color: "#0f172a",
          margin: [0, 4, 0, 4],
        },
        tableCellCost: {
          fontSize: 8,
          bold: true,
          color: "#0f172a",
          margin: [0, 4, 0, 4],
        },
        tableTotalCell: {
          fontSize: 9,
          bold: true,
          color: "#0f172a",
          fillColor: "#f8fafc",
          margin: [0, 6, 0, 6],
        },
        tableTotalCellCost: {
          fontSize: 9,
          bold: true,
          color: "#16a34a",
          fillColor: "#f8fafc",
          margin: [0, 6, 0, 6],
        },
      },
    };

    pdfMake.createPdf(documentDefinition).print();
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader size="md" content="Loading kitchen order costs..." />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <BookOpen className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-slate-900">
          No Kitchen Orders Found
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Try selecting a different date range or branch.
        </p>
      </div>
    );
  }

  const isAllExpanded =
    filteredOrders.length > 0 &&
    filteredOrders.length ===
      Object.keys(expandedOrders).filter((k) => expandedOrders[k]).length;

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-50/50 rounded-2xl">
      {/* Search and Filters panel */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-8 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="Search by KOT, Bill, Table or Waiter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="completed">Completed</option>
          </select>

          <Button
            onClick={toggleExpandAll}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold border border-slate-200 hover:bg-slate-50 transition-colors bg-white text-slate-700 hover:text-slate-800"
          >
            {isAllExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 text-slate-500" />
                <span>Collapse All</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 text-slate-500" />
                <span>Expand All</span>
              </>
            )}
          </Button>

          <Button
            appearance="primary"
            onClick={generatePDF}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm px-4 py-2 text-sm"
          >
            <Printer className="h-4 w-4" />
            <span>Print Report</span>
          </Button>
        </div>
      </div>

      {/* KPI dashboard */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total Orders */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Orders</p>
            <p className="text-lg font-bold text-slate-900">
              {stats.totalOrders}
            </p>
          </div>
        </div>

        {/* Total Items Ordered */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Utensils className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">
              Total Items Qty
            </p>
            <p className="text-lg font-bold text-slate-900">
              {stats.totalItemsQty}
            </p>
          </div>
        </div>

        {/* Average Order Cost */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">
              Avg Order Cost
            </p>
            <p className="text-lg font-bold text-slate-900">
              ৳
              {stats.averageOrderCost.toLocaleString("en-BD", {
                maximumFractionDigits: 1,
              })}
            </p>
          </div>
        </div>

        {/* Total Cost */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">
              Total Cost Price
            </p>
            <p className="text-lg font-bold text-slate-900">
              ৳
              {stats.totalCost.toLocaleString("en-BD", {
                maximumFractionDigits: 1,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No orders match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-500">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-700 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Order Date</th>
                  <th className="px-6 py-4">Bill No.</th>
                  <th className="px-6 py-4">KOT No.</th>
                  <th className="px-6 py-4">Table</th>
                  <th className="px-6 py-4">Waiter</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Total Cost (৳)</th>
                  <th className="px-6 py-4 text-center">Items</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 border-t border-slate-50">
                {filteredOrders.map((order) => {
                  const isExpanded = !!expandedOrders[order._id];
                  return (
                    <React.Fragment key={order._id}>
                      {/* Parent Row */}
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleString(
                                    "en-US",
                                    {
                                      dateStyle: "short",
                                      timeStyle: "short",
                                    },
                                  )
                                : "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {order.billNo || "—"}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {order.kitchenOrderNo || "—"}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {order.tableName ? (
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                              {order.tableName}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {order.waiterName || "—"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${
                              order.status === "active"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                          >
                            {order.status || "active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">
                          ৳
                          {(
                            Number(order.totalOrderCostPrice) || 0
                          ).toLocaleString("en-BD", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => toggleExpand(order._id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 focus:outline-none"
                          >
                            <span>{order.items?.length || 0} items</span>
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Child Row */}
                      {isExpanded && (
                        <tr>
                          <td
                            colSpan={8}
                            className="bg-slate-50/40 p-0 border-t border-slate-100"
                          >
                            <div className="px-8 py-4 border-b border-slate-100/50">
                              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-inner">
                                <table className="w-full text-left text-xs border-collapse">
                                  <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-semibold">
                                    <tr>
                                      <th className="px-4 py-2.5">Item Code</th>
                                      <th className="px-4 py-2.5">Item Name</th>
                                      <th className="px-4 py-2.5 text-center">
                                        QTY
                                      </th>
                                      <th className="px-4 py-2.5 text-right">
                                        Rate (৳)
                                      </th>
                                      <th className="px-4 py-2.5 text-right">
                                        Unit Cost Price (৳)
                                      </th>
                                      <th className="px-4 py-2.5 text-right">
                                        Total Cost Price (৳)
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 text-slate-600">
                                    {order.items && order.items.length > 0 ? (
                                      order.items.map((item, itemIdx) => (
                                        <tr
                                          key={itemIdx}
                                          className="hover:bg-slate-50/20"
                                        >
                                          <td className="px-4 py-2">
                                            {item.itemCode || "—"}
                                          </td>
                                          <td className="px-4 py-2 font-semibold text-slate-800">
                                            {item.itemName}
                                          </td>
                                          <td className="px-4 py-2 text-center font-semibold">
                                            {item.qty}
                                          </td>
                                          <td className="px-4 py-2 text-right">
                                            ৳
                                            {(Number(item.rate) || 0).toFixed(
                                              2,
                                            )}
                                          </td>
                                          <td className="px-4 py-2 text-right">
                                            ৳
                                            {(
                                              Number(item.unitCostPrice) || 0
                                            ).toFixed(2)}
                                          </td>
                                          <td className="px-4 py-2 text-right font-bold text-slate-850">
                                            ৳
                                            {(
                                              Number(item.totalCostPrice) || 0
                                            ).toFixed(2)}
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td
                                          colSpan={6}
                                          className="px-4 py-3 text-center text-slate-400"
                                        >
                                          No items found inside this order.
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                              {order.remark && (
                                <div className="mt-3 rounded-lg bg-orange-50/50 border border-orange-100 p-3 text-xs text-orange-700">
                                  <span className="font-bold">Remark:</span>{" "}
                                  {order.remark}
                                </div>
                              )}
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
        )}
      </div>
    </div>
  );
};
