import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { BranchDueGroup } from "./DueSalesStatementView_v2";

(pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs;

export function printDueSalesStatementPdf(
  groups: BranchDueGroup[],
  startDate: Date | null,
  endDate: Date | null,
  opts?: {
    action?: "open" | "download" | "print";
  }
) {
  const locale = "en-BD";
  const currency = "BDT";

  const formatDateLabel = (v: Date | null) => {
    if (!v) return "";
    return v.toLocaleDateString("en-GB");
  };

  const fromDate = formatDateLabel(startDate);
  const toDate = formatDateLabel(endDate);
  const dateRangeText = fromDate && toDate ? `${fromDate} – ${toDate}` : "";

  const resolvedAction = opts?.action ?? "print";

  const money = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number(n ?? 0) || 0);

  const num = (n: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
      Number(n ?? 0) || 0
    );

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

  groups.forEach((group, index) => {
    // HEADER
    content.push(
      {
        text: group.branchName,
        style: "header",
        alignment: "center",
        margin: [0, 0, 0, 2],
      },
      {
        text: "Due Sales Statement Report",
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
      line()
    );

    // TABLE
    const tableBody = [
      [
        { text: "Bill No", style: "tableHeader" },
        { text: "Date", style: "tableHeader" },
        { text: "Customer", style: "tableHeader" },
        { text: "Total Bill", style: "tableHeader", alignment: "right" },
        { text: "Paid", style: "tableHeader", alignment: "right" },
        { text: "Due", style: "tableHeader", alignment: "right" },
        { text: "Net Payable", style: "tableHeader", alignment: "right" },
      ],
      ...group.records.map((record) => [
        { text: record.billNo, style: "small" },
        { text: new Date(record.date).toLocaleDateString("en-GB"), style: "small" },
        { text: record.customerName || record.customerPhone || "N/A", style: "small" },
        { text: num(record.totalBill), style: "small", alignment: "right" },
        { text: num(record.paidAmount), style: "small", alignment: "right" },
        { text: num(record.dueAmount), style: "small", alignment: "right" },
        { text: num(record.netPayable), style: "small", alignment: "right" },
      ]),
    ];

    content.push({
      table: {
        headerRows: 1,
        widths: [70, 60, "*", 60, 60, 60, 60],
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

    // TOTALS
    content.push({
      table: {
        widths: ["*", 100],
        body: [
          [
            { text: "Total Due Amount:", style: "small", bold: true, alignment: "right" },
            { text: money(group.totalDue), style: "small", bold: true, alignment: "right" },
          ],
        ],
      },
      layout: "noBorders",
      margin: [0, 0, 0, 12],
    });

    if (index < groups.length - 1) {
      content.push({ text: "", pageBreak: "after" });
    }
  });

  const docDefinition: any = {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 40],
    content,
    styles: {
      header: { fontSize: 18, bold: true },
      title: { fontSize: 14, bold: true },
      subtitle: { fontSize: 10, color: "#555555" },
      tableHeader: { fontSize: 9, bold: true, color: "#111827" },
      small: { fontSize: 8, color: "#111827" },
    },
    defaultStyle: { fontSize: 9 },
  };

  const pdf = (pdfMake as any).createPdf(docDefinition);
  if (resolvedAction === "print") pdf.print();
  else if (resolvedAction === "download") pdf.download(`due-sales-statement.pdf`);
  else pdf.open();
}
