// reportDateWiseSummaryPdf.ts
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { BranchInfo } from "./PrintSalesTableData";

(pdfMake as any).vfs = pdfFonts.vfs;

const safeNum = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0);

type PaymentSummaryItem = { _id: string; total: number };

const formatAmount = (v: any) =>
  safeNum(v).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export function buildPaymentSummaryPdfTable(summary: PaymentSummaryItem[]) {
  const rows = Array.isArray(summary) ? summary : [];

  const total = rows.reduce((sum, r) => sum + safeNum(r?.total), 0);

  const body: any[] = [
    [
      { text: "Method", style: "th", alignment: "left" },
      { text: "Amount", style: "th", alignment: "right" },
    ],
    ...rows.map((r) => [
      { text: String(r?._id ?? "-"), style: "td", alignment: "left" },
      { text: formatAmount(r?.total), style: "td", alignment: "right" },
    ]),
    [
      { text: "Total", style: "totalLabel", alignment: "left" },
      { text: formatAmount(total), style: "totalAmount", alignment: "right" },
    ],
  ];

  return {
    margin: [0, 6, 12, 0],
    table: {
      headerRows: 1,
      widths: ["*", 120],
      body,
    },
    layout: {
      hLineWidth: (i: number, node: any) =>
        i === 0 || i === 1 || i === node.table.body.length ? 1 : 0.5,
      vLineWidth: () => 0,
      hLineColor: (i: number) => (i <= 1 ? "#E5E7EB" : "#EEF2F7"),
      paddingLeft: () => 8,
      paddingRight: () => 8,
      paddingTop: () => 5,
      paddingBottom: () => 5,
      fillColor: (rowIndex: number, node: any) => {
        if (rowIndex === 0) return "#F8FAFC"; // header
        if (rowIndex === node.table.body.length - 1) return "#F3F4F6"; // total row
        return rowIndex % 2 === 0 ? "#FFFFFF" : "#FCFCFD";
      },
    },
  };
}

/**
 * Add these styles once in your docDefinition.styles:
 *
 * styles: {
 *   th: { bold: true, fontSize: 9, color: "#334155" },
 *   td: { fontSize: 9, color: "#0F172A" },
 *   totalLabel: { bold: true, fontSize: 9, color: "#111827" },
 *   totalAmount: { bold: true, fontSize: 9, color: "#059669" },
 * }
 */

export interface DateWiseSummaryItem {
  _id: { branch: string; date: string };
  branchName?: string;
  totalBill?: number;
  totalVat?: number;
  totalGuest?: number;
  totalDiscount?: number;
  totalPayable?: number;
  totalDue?: number;
  totalPaid?: number;
  // optional flag if you already append total row in UI
  __isTotal?: boolean;
}

type PdfAction = "open" | "download" | "print";

const formatMoney = (v: any) =>
  safeNum(v).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDate = (iso: any) => {
  if (!iso) return "-";
  const d = new Date(String(iso));
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const sortByDateAsc = (arr: DateWiseSummaryItem[]) =>
  [...arr].sort(
    (a, b) =>
      new Date(a?._id?.date || 0).getTime() -
      new Date(b?._id?.date || 0).getTime()
  );

const calcTotals = (rows: DateWiseSummaryItem[]) => {
  return rows.reduce(
    (acc, r) => {
      acc.totalGuest += safeNum(r.totalGuest);
      acc.totalBill += safeNum(r.totalBill);
      acc.totalVat += safeNum(r.totalVat);
      acc.totalDiscount += safeNum(r.totalDiscount);
      acc.totalPayable += safeNum(r.totalPayable);
      acc.totalDue += safeNum(r.totalDue);
      acc.totalPaid += safeNum(r.totalPaid);
      return acc;
    },
    {
      totalGuest: 0,
      totalBill: 0,
      totalVat: 0,
      totalDiscount: 0,
      totalPayable: 0,
      totalDue: 0,
      totalPaid: 0,
    }
  );
};

export function printDateWiseSummaryPdfForUsers(
  data: DateWiseSummaryItem[],
  branchInfo: BranchInfo,
  summery: { _id: string; total: number }[],
  opts?: {
    title?: string;
    branchName?: string; // optional override
    fileName?: string;
    action?: PdfAction;
  }
) {
  const action: PdfAction = opts?.action ?? "open";
  const title = opts?.title ?? "Date-wise Summary";
  const fileName = opts?.fileName ?? "date-wise-summary.pdf";

  const input = Array.isArray(data) ? data : [];
  const rowsOnly = input.filter((r) => r && !r.__isTotal); // if your UI already adds a total row
  const rows = sortByDateAsc(rowsOnly);

  // If empty -> print a small message PDF (still valid)
  if (rows.length === 0) {
    const emptyDoc: any = {
      pageSize: "A4",
      pageOrientation: "portrait",
      pageMargins: [28, 24, 28, 24],
      defaultStyle: { fontSize: 9, color: "#111827" },
      content: [
        {
          text: title,
          alignment: "center",
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 8],
        },
        {
          text: "No data available for the selected filters.",
          alignment: "center",
          color: "#6B7280",
          margin: [0, 8, 0, 0],
        },
      ],
    };

    const pdf = pdfMake.createPdf(emptyDoc);
    if (action === "download") return pdf.download(fileName);
    if (action === "print") return pdf.print();
    return pdf.open();
  }

  const branchFromData = rows.find((r) => r.branchName)?.branchName;
  const branchName = opts?.branchName ?? branchFromData ?? "—";

  const firstDate = rows[0]?._id?.date;
  const lastDate = rows[rows.length - 1]?._id?.date;
  const dateRange = `${formatDate(firstDate)}  —  ${formatDate(lastDate)}`;

  const totals = calcTotals(rows);

  // Table body
  const headerRow = [
    { text: "Bill Date", style: "th", alignment: "left" },
    { text: "Guest", style: "th", alignment: "right" },
    { text: "Total Bill", style: "th", alignment: "right" },
    { text: "Total VAT", style: "th", alignment: "right" },
    { text: "T Discount", style: "th", alignment: "right" },
    { text: "Net Payable", style: "th", alignment: "right" },
    { text: "Due", style: "th", alignment: "right" },
    { text: "Paid", style: "th", alignment: "right" },
  ];

  const body: any[] = [headerRow];

  rows.forEach((r) => {
    body.push([
      { text: formatDate(r?._id?.date), style: "td", alignment: "left" },
      { text: String(safeNum(r.totalGuest)), style: "td", alignment: "right" },
      { text: formatMoney(r.totalBill), style: "td", alignment: "right" },
      { text: formatMoney(r.totalVat), style: "td", alignment: "right" },
      { text: formatMoney(r.totalDiscount), style: "td", alignment: "right" },
      {
        text: formatMoney(r.totalPayable),
        style: "tdStrong",
        alignment: "right",
      },
      { text: formatMoney(r.totalDue), style: "tdDue", alignment: "right" },
      { text: formatMoney(r.totalPaid), style: "tdPaid", alignment: "right" },
    ]);
  });

  // Total row
  body.push([
    { text: "Total", style: "totalLabel", alignment: "left" },
    { text: String(totals.totalGuest), style: "totalCell", alignment: "right" },
    {
      text: formatMoney(totals.totalBill),
      style: "totalCell",
      alignment: "right",
    },
    {
      text: formatMoney(totals.totalVat),
      style: "totalCell",
      alignment: "right",
    },
    {
      text: formatMoney(totals.totalDiscount),
      style: "totalCell",
      alignment: "right",
    },
    {
      text: formatMoney(totals.totalPayable),
      style: "totalCellStrong",
      alignment: "right",
    },
    {
      text: formatMoney(totals.totalDue),
      style: "totalCellDue",
      alignment: "right",
    },
    {
      text: formatMoney(totals.totalPaid),
      style: "totalCellPaid",
      alignment: "right",
    },
  ]);

  const docDefinition: any = {
    pageSize: "A4",
    pageOrientation: "portrait",
    pageMargins: [28, 22, 28, 24],
    defaultStyle: { fontSize: 9, color: "#111827" },

    content: [
      // Header (compact, modern)
      {
        margin: [0, 0, 0, 10],
        table: {
          widths: ["*"],
          body: [
            [
              {
                stack: [
                  {
                    text: `${branchInfo?.name}`,
                    style: "header",
                    alignment: "center",
                    margin: [0, 0, 0, 2],
                  },
                  {
                    text: `${branchInfo?.address1}`,
                    alignment: "center",
                    margin: [0, 0, 0, 2],
                  },
                  {
                    text: `Phone: ${branchInfo?.phone}`,
                    alignment: "center",
                    margin: [0, 0, 0, 1],
                  },
                  {
                    text: `VAT Registration No: ${branchInfo?.vatNo}`,
                    alignment: "center",
                    margin: [0, 0, 0, 4],
                  },
                  {
                    text: "Daily Sales Summery",
                    style: "title",
                    alignment: "center",
                    margin: [0, 0, 0, 2],
                  },
                  {
                    text: dateRange,
                    style: "subtitle",
                    alignment: "center",
                    margin: [0, 0, 0, 10],
                  },
                ],
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          paddingLeft: () => 0,
          paddingRight: () => 0,
          paddingTop: () => 0,
          paddingBottom: () => 0,
        },
      },

      // Table
      {
        table: {
          headerRows: 1,
          widths: [64, 34, 58, 52, 56, 62, 48, 56],
          body,
        },
        layout: {
          hLineWidth: (i: number, node: any) =>
            i === 0 || i === 1 ? 1 : i === node.table.body.length ? 1 : 0.5,
          vLineWidth: () => 0,
          hLineColor: (i: number) =>
            i === 0 || i === 1 ? "#E5E7EB" : "#EEF2F7",
          paddingLeft: () => 6,
          paddingRight: () => 6,
          paddingTop: () => 4,
          paddingBottom: () => 4,
          fillColor: (rowIndex: number, node: any) => {
            if (rowIndex === 0) return "#F8FAFC"; // header
            if (rowIndex === node.table.body.length - 1) return "#F3F4F6"; // total
            return rowIndex % 2 === 0 ? "#FFFFFF" : "#FCFCFD";
          },
        },
      },
      {
        text: "Payment Method",
      },
      buildPaymentSummaryPdfTable(summery),
    ],

    styles: {
      th: { bold: true, fontSize: 8, color: "#334155", margin: [0, 2, 0, 2] },

      td: { fontSize: 9, color: "#0F172A" },
      tdStrong: { fontSize: 9, color: "#0F172A", bold: true },
      tdDue: { fontSize: 9, color: "#DC2626" },
      tdPaid: { fontSize: 9, color: "#059669" },

      totalLabel: { fontSize: 9, bold: true, color: "#111827" },
      totalCell: { fontSize: 9, bold: true, color: "#111827" },
      totalCellStrong: { fontSize: 9, bold: true, color: "#0F172A" },
      totalCellDue: { fontSize: 9, bold: true, color: "#B91C1C" },
      totalCellPaid: { fontSize: 9, bold: true, color: "#047857" },
      title: {
        fontSize: 16,
        bold: true,
      },
      subtitle: {
        fontSize: 10,
        color: "#555555",
      },
      header: {
        fontSize: 18,
        bold: true,
      },
      subHeader: {
        fontSize: 13,
        italics: true,
      },
    },
  };

  const pdf = pdfMake.createPdf(docDefinition);

  if (action === "download") return pdf.download(fileName);
  if (action === "print") return pdf.print();
  return pdf.open();
}
