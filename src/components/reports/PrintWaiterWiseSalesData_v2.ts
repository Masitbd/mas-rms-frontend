import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { WaiterWiseSalesResponse_v2 } from "./WaiterWiseSalesReportType_v2";
import { calculateTotalForWaiterWiseSalesReport } from "./waiterWiseSalesReportHelper_v2";

(pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs;

export function printWaiterWiseSalesReportPdf(
  data: WaiterWiseSalesResponse_v2[] | null | undefined,
  from: string | Date,
  to: string | Date,
  opts?: {
    fileName?: string;
    currency?: string;
    locale?: string;
    action?: "open" | "download" | "print";
  },
) {
  const safeData: WaiterWiseSalesResponse_v2[] = Array.isArray(data) ? data : [];

  const locale = opts?.locale ?? "en-BD";
  const currency = opts?.currency ?? "BDT";

  const formatDateLabel = (v: string | Date) => {
    if (v instanceof Date) return v.toLocaleDateString("en-GB");
    const d = new Date(String(v ?? ""));
    if (!Number.isNaN(d.getTime())) return d.toLocaleDateString("en-GB");
    return String(v ?? "");
  };

  const fromDate = formatDateLabel(from);
  const toDate = formatDateLabel(to);
  const dateRangeText = fromDate && toDate ? `${fromDate} – ${toDate}` : "";

  const resolvedAction: "open" | "download" | "print" = opts?.action ?? "open";

  const money = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number(n ?? 0) || 0);

  const num = (n: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
      Number(n ?? 0) || 0,
    );

  const safeText = (v: any, fallback = "") =>
    (v === null || v === undefined ? fallback : String(v)).trim() || fallback;

  const line = () => ({
    canvas: [
      {
        type: "line",
        x1: 0,
        y1: 0,
        x2: 515,
        y2: 0,
        lineWidth: 0.7,
        lineColor: "#E5E7EB",
      },
    ],
    margin: [0, 8, 0, 8] as [number, number, number, number],
  });

  const content: any[] = [];

  if (!safeData.length) {
    content.push(
      {
        text: "Waiter Wise Sales Report",
        style: "title",
        alignment: "center",
        margin: [0, 0, 0, 2],
      },
      dateRangeText
        ? {
            text: dateRangeText,
            style: "subtitle",
            alignment: "center",
            margin: [0, 0, 0, 10],
          }
        : { text: "", margin: [0, 0, 0, 10] },
      {
        text: "No data found.",
        style: "noData",
        alignment: "center",
        margin: [0, 20, 0, 20],
      },
    );
  } else {
    safeData.forEach((branchBlock, bIdx) => {
      const branchName = safeText(branchBlock?.branchInfo?.name, "No Branch Name");
      const branchAddress = safeText(branchBlock?.branchInfo?.address1, "No Address");
      const branchPhone = safeText(branchBlock?.branchInfo?.phone, "No Phone No.");
      const branchVatNo = safeText((branchBlock as any)?.branchInfo?.vatNo, "");

      content.push(
        {
          text: branchName,
          style: "header",
          alignment: "center",
          margin: [0, 0, 0, 2],
        },
        {
          text: branchAddress,
          alignment: "center",
          margin: [0, 0, 0, 2],
        },
        {
          text: `Phone: ${branchPhone}`,
          alignment: "center",
          margin: [0, 0, 0, 1],
        },
        branchVatNo
          ? {
              text: `VAT Registration No: ${branchVatNo}`,
              alignment: "center",
              margin: [0, 0, 0, 4],
            }
          : { text: "", margin: [0, 0, 0, 4] },
        {
          text: "Waiter Wise Sales Report",
          style: "title",
          alignment: "center",
          margin: [0, 0, 0, 2],
        },
        dateRangeText
          ? {
              text: dateRangeText,
              style: "subtitle",
              alignment: "center",
              margin: [0, 0, 0, 10],
            }
          : { text: "", margin: [0, 0, 0, 10] },
        line(),
      );

      const result = branchBlock?.result ?? [];
      const { totalAmount, totalItem } = calculateTotalForWaiterWiseSalesReport(result);

      const tableBody = [
        [
          { text: "Branch", style: "tableHeader" },
          { text: "Waiter Name", style: "tableHeader" },
          { text: "Total Amount", style: "tableHeader", alignment: "right" },
        ],
        ...result.map((row) => [
          { text: safeText(row.branchName, "-"), style: "small" },
          { text: safeText(row.waiterName, "-"), style: "small" },
          { text: money(row.totalAmount), style: "small", alignment: "right" },
        ]),
      ];

      content.push({
        table: {
          headerRows: 1,
          widths: ["*", "*", 100],
          body: tableBody,
        },
        layout: {
          fillColor: (rowIndex: number) => (rowIndex === 0 ? "#F3F4F6" : null),
          hLineColor: () => "#E5E7EB",
          vLineColor: () => "#E5E7EB",
          paddingLeft: () => 6,
          paddingRight: () => 6,
          paddingTop: () => 4,
          paddingBottom: () => 4,
        },
        margin: [0, 0, 0, 12],
      });

      content.push({
        table: {
          widths: ["*", 100],
          body: [
            [
              {
                text: `Grand Total Waiters: ${num(totalItem)}`,
                style: "small",
                bold: true,
                margin: [0, 6, 0, 6],
              },
              {
                text: `Grand Total Amount: ${money(totalAmount)}`,
                style: "small",
                bold: true,
                alignment: "right",
                margin: [0, 6, 0, 6],
              },
            ],
          ],
        },
        layout: {
          fillColor: () => "#F9FAFB",
          hLineColor: () => "#E5E7EB",
          vLineColor: () => "#E5E7EB",
          paddingLeft: () => 10,
          paddingRight: () => 10,
          paddingTop: () => 6,
          paddingBottom: () => 6,
        },
        margin: [0, 0, 0, 12],
      });

      if (bIdx < safeData.length - 1) content.push({ text: "", pageBreak: "after" });
    });
  }

  const docDefinition: any = {
    pageSize: "A4",
    pageMargins: [20, 20, 20, 20],
    content,
    footer: (currentPage: number, pageCount: number) => ({
      columns: [
        { text: "Waiter Wise Sales Report", style: "muted" },
        {
          text: `Page ${currentPage} of ${pageCount}`,
          style: "muted",
          alignment: "right",
        },
      ],
      margin: [20, 0, 20, 0],
    }),
    styles: {
      header: { fontSize: 18, bold: true },
      title: { fontSize: 16, bold: true },
      subtitle: { fontSize: 10, color: "#555555" },
      muted: { fontSize: 9, color: "#6B7280" },
      small: { fontSize: 8, color: "#111827" },
      tableHeader: { fontSize: 8, bold: true, color: "#111827" },
      noData: { fontSize: 9, italics: true, color: "#6b7280" },
    },
    defaultStyle: { fontSize: 8 },
  };

  const pdf = (pdfMake as any).createPdf(docDefinition);
  const fileName = opts?.fileName ?? `waiter-wise-sales-report_${Date.now()}.pdf`;

  if (resolvedAction === "print") pdf.print();
  else if (resolvedAction === "download") pdf.download(fileName);
  else pdf.open();
}
