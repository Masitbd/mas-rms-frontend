// pdfMake function only (call it from your button onClick)
// Example: onClick={() => printItemWiseSalesReportPdf(data)}

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ItemWiseSalesResponse } from "./ItemWiseSalesReportType";
import {
  calculateTotalForItemWiseSalesReport,
  groupItemsByCategory,
  SalesItem,
} from "./itemWiseSalesReportHelper";

(pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs;

/**
 * Generates and downloads a PDF for Item Wise Sales Report.
 * @param data ItemWiseSalesResponse[]
 * @param opts optional settings (fileName, currency, locale, openInsteadOfDownload)
 */
export function printItemWiseSalesReportPdf(
  data: ItemWiseSalesResponse[],
  from: string,
  to: string,
  opts?: {
    fileName?: string;
    currency?: string; // e.g. "BDT"
    locale?: string; // e.g. "en-BD"
    openInsteadOfDownload?: boolean;
  },
) {
  const fromDate = new Date(from?.toString() ?? Date()).toLocaleDateString(
    "en-GB",
  );

  const toDate = new Date(to?.toString() ?? Date()).toLocaleDateString("en-GB");
  const locale = opts?.locale ?? "en-BD";
  const currency = opts?.currency ?? "BDT";

  const money = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number(n || 0));

  const num = (n: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
      Number(n || 0),
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

  const safeText = (v: any, fallback = "") =>
    (v === null || v === undefined ? fallback : String(v)).trim() || fallback;

  const asNumber = (v: any) => Number(v ?? 0) || 0;

  const content: any[] = [];

  // Title
  content.push(
    { text: "Item Wise Sales Report", style: "title", alignment: "center" },
    {
      text: ` ${fromDate} - ${toDate}`,
      style: "muted",
      margin: [0, 0, 0, 10],
      alignment: "center",
    },
  );

  if (!Array.isArray(data) || data.length === 0) {
    content.push({ text: "No data found.", style: "muted" });

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [24, 24, 24, 40],
      content,
      styles: {
        title: { fontSize: 16, bold: true, color: "#111827" },
        h1: { fontSize: 12, bold: true, color: "#111827" },
        h2: { fontSize: 10, bold: true, color: "#111827" },
        muted: { fontSize: 9, color: "#6B7280" },
        small: { fontSize: 9, color: "#111827" },
        tableHeader: { fontSize: 9, bold: true, color: "#111827" },
      },
      defaultStyle: { fontSize: 9 },
    };

    const fileName =
      opts?.fileName ?? `item-wise-sales-report_${Date.now()}.pdf`;

    const pdf = (pdfMake as any).createPdf(docDefinition);
    if (opts?.openInsteadOfDownload) pdf.open();
    else pdf.download(fileName);
    return;
  }

  // Body
  data.forEach((branchBlock, bIdx) => {
    const branchName = safeText(
      branchBlock?.branchInfo?.name,
      "No Branch Name",
    );
    const branchAddress = safeText(
      branchBlock?.branchInfo?.address1,
      "No Address",
    );
    const branchPhone = safeText(
      branchBlock?.branchInfo?.phone,
      "No Phone No.",
    );

    // Branch header
    content.push(
      {
        text: branchName,
        style: "h1",
        margin: [0, 8, 0, 2],
        alignment: "center",
      },
      { text: branchAddress, style: "muted", alignment: "center" },
      { text: branchPhone, style: "muted", alignment: "center" },
      line(),
    );

    const reportRows = branchBlock?.result ?? [];

    // Menu groups
    reportRows.forEach((menuGroupBlock, mgIdx) => {
      const menuGroup = safeText(menuGroupBlock?.menuGroup, "Menu Group");

      const grouped = groupItemsByCategory(menuGroupBlock?.items ?? []);
      const categories = grouped?.categories ?? [];
      const grandTotalQty = asNumber(grouped?.grandTotalQty);
      const grandTotalAmount = asNumber(grouped?.grandTotalAmount);

      // Menu group header
      content.push({
        text: menuGroup.toUpperCase(),
        style: "h2",
        margin: [0, 6, 0, 6],
      });

      // Category sections
      categories.forEach((cat) => {
        const categoryName = safeText(cat?.category?.name, "No Category");
        const items: SalesItem[] = (cat?.items ?? []) as any;

        const totalItem = items.length;
        const totalQty = items.reduce((sum, it) => sum + asNumber(it?.qty), 0);
        const totalAmount = items.reduce(
          (sum, it) => sum + asNumber(it?.qty) * asNumber(it?.rate),
          0,
        );

        content.push({
          columns: [
            {
              text: categoryName.toUpperCase(),
              style: "small",
              bold: true,
            },
            {
              text: `${num(totalItem)} records`,
              style: "muted",
              alignment: "right",
            },
          ],
          margin: [0, 4, 0, 4],
        });

        // Items table
        const tableBody = [
          [
            { text: "Item Code", style: "tableHeader" },
            { text: "Item Name", style: "tableHeader" },
            { text: "Qty", style: "tableHeader", alignment: "right" },
            { text: "Rate", style: "tableHeader", alignment: "right" },
            { text: "Amount", style: "tableHeader", alignment: "right" },
          ],
          ...items.map((it) => {
            const qty = asNumber(it?.qty);
            const rate = asNumber(it?.rate);
            const amount = qty * rate;

            return [
              { text: safeText((it as any)?.itemCode, "-"), style: "small" },
              { text: safeText((it as any)?.itemName, "-"), style: "small" },
              { text: num(qty), style: "small", alignment: "right" },
              { text: num(rate), style: "small", alignment: "right" },
              { text: num(amount), style: "small", alignment: "right" },
            ];
          }),
        ];

        content.push({
          table: {
            headerRows: 1,
            widths: ["*", "*", 50, 60, 80],
            body: tableBody,
          },
          layout: {
            fillColor: (rowIndex: number) =>
              rowIndex === 0 ? "#F3F4F6" : null,
            hLineColor: () => "#E5E7EB",
            vLineColor: () => "#E5E7EB",
            paddingLeft: () => 6,
            paddingRight: () => 6,
            paddingTop: () => 4,
            paddingBottom: () => 4,
          },
          margin: [0, 0, 0, 4],
        });

        // Category totals
        content.push({
          columns: [
            { text: `Total Item: ${num(totalItem)}`, style: "muted" },
            { text: `Total Quantity: ${num(totalQty)}`, style: "muted" },
            {
              text: `Total Amount: ${money(totalAmount)}`,
              style: "muted",
              alignment: "right",
            },
          ],
          margin: [0, 2, 0, 8],
        });
      });

      // Menu group totals
      content.push({
        columns: [
          { text: `${menuGroup} Total:`, style: "small", bold: true },
          {
            text: `Total Quantity: ${num(grandTotalQty)}`,
            style: "muted",
            alignment: "right",
          },
          {
            text: `Total Amount: ${money(grandTotalAmount)}`,
            style: "muted",
            alignment: "right",
          },
        ],
        margin: [0, 6, 0, 6],
      });

      // Divider after menu group
      content.push(line());
    });

    // Branch grand totals (based on your helper)
    const { totalAmount, totalItem, totalQuantity } =
      calculateTotalForItemWiseSalesReport(reportRows ?? []);

    content.push({
      table: {
        widths: ["*", "*", "*"],
        body: [
          [
            {
              text: `Grand Total Items: ${num(totalItem)}`,
              style: "small",
              bold: true,
              margin: [0, 6, 0, 6],
            },
            {
              text: `Grand Total Qty: ${num(totalQuantity)}`,
              style: "small",
              bold: true,
              alignment: "center",
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

    // Page break between branches (except last)
    if (bIdx < data.length - 1) content.push({ text: "", pageBreak: "after" });
  });

  const docDefinition = {
    pageSize: "A4",
    pageOrientation: "portrait",
    pageMargins: [24, 24, 24, 40],
    footer: (currentPage: number, pageCount: number) => ({
      columns: [
        { text: "Item Wise Sales Report", style: "muted" },
        {
          text: `Page ${currentPage} of ${pageCount}`,
          style: "muted",
          alignment: "right",
        },
      ],
      margin: [24, 0, 24, 0],
    }),
    content,
    styles: {
      title: { fontSize: 16, bold: true, color: "#111827" },
      h1: { fontSize: 12, bold: true, color: "#111827" },
      h2: { fontSize: 10, bold: true, color: "#111827" },
      muted: { fontSize: 9, color: "#6B7280" },
      small: { fontSize: 9, color: "#111827" },
      tableHeader: { fontSize: 9, bold: true, color: "#111827" },
    },
    defaultStyle: { fontSize: 9 },
  };

  const fileName = opts?.fileName ?? `item-wise-sales-report_${Date.now()}.pdf`;

  const pdf = (pdfMake as any).createPdf(docDefinition);

  // download by default; you can choose open() to print from browser UI
  if (opts?.openInsteadOfDownload) pdf.open();
  else pdf.download(fileName);
}
