import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { BranchGroup } from "./MenuItemConsumptionView_v2";

(pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs;

export function printMenuItemConsumptionReportPdf(
  groups: BranchGroup[],
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
        text: "Menu Item Consumption Report",
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
        { text: "Item Code", style: "tableHeader" },
        { text: "Item Name", style: "tableHeader" },
        { text: "Quantity", style: "tableHeader", alignment: "right" },
        { text: "Revenue", style: "tableHeader", alignment: "right" },
      ],
      ...group.records.map((record) => [
        { text: record.itemCode, style: "small" },
        { text: record.itemName, style: "small" },
        { text: num(record.totalQuantity), style: "small", alignment: "right" },
        { text: num(record.totalRevenue), style: "small", alignment: "right" },
      ]),
    ];

    content.push({
      table: {
        headerRows: 1,
        widths: [80, "*", 80, 100],
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
            { text: "Total Quantity:", style: "small", bold: true, alignment: "right" },
            { text: num(group.totalQuantity), style: "small", bold: true, alignment: "right" },
          ],
          [
            { text: "Total Revenue:", style: "small", bold: true, alignment: "right" },
            { text: money(group.totalRevenue), style: "small", bold: true, alignment: "right" },
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
      tableHeader: { fontSize: 10, bold: true, color: "#111827" },
      small: { fontSize: 9, color: "#111827" },
    },
    defaultStyle: { fontSize: 9 },
  };

  const pdf = (pdfMake as any).createPdf(docDefinition);
  if (resolvedAction === "print") pdf.print();
  else if (resolvedAction === "download") pdf.download(`consumption-report.pdf`);
  else pdf.open();
}
