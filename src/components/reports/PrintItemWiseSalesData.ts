import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ItemWiseSalesResponse } from "./ItemWiseSalesReportType";
import {
  calculateTotalForItemWiseSalesReport,
  groupItemsByCategory,
  SalesItem,
} from "./itemWiseSalesReportHelper";

(pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs;

export function printItemWiseSalesReportPdf(
  data: ItemWiseSalesResponse[] | null | undefined,
  from: string | Date,
  to: string | Date,
  opts?: {
    fileName?: string;
    currency?: string; // e.g. "BDT"
    locale?: string; // e.g. "en-BD"
    // keep your old behavior
    openInsteadOfDownload?: boolean;
    // optional "reference-style" action
    action?: "open" | "download" | "print";
  },
) {
  const safeData: ItemWiseSalesResponse[] = Array.isArray(data) ? data : [];

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

  const resolvedAction: "open" | "download" | "print" =
    opts?.action ?? (opts?.openInsteadOfDownload ? "open" : "download");

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

  const asNumber = (v: any) => Number(v ?? 0) || 0;

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
    // --- HEADER (like your reference) ---
    content.push(
      {
        text: "Item Wise Sales Report",
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

    const docDefinition: any = {
      pageSize: "A4",
      pageMargins: [20, 20, 20, 20],
      content,
      styles: {
        header: { fontSize: 18, bold: true },
        title: { fontSize: 16, bold: true },
        subtitle: { fontSize: 10, color: "#555555" },

        h1: { fontSize: 12, bold: true, color: "#111827" },
        h2: { fontSize: 10, bold: true, color: "#111827" },

        muted: { fontSize: 9, color: "#6B7280" },
        small: { fontSize: 9, color: "#111827" },

        tableHeader: { fontSize: 8, bold: true, color: "#111827" },
        noData: { fontSize: 9, italics: true, color: "#6b7280" },
      },
      defaultStyle: { fontSize: 8 },
    };

    const pdf = (pdfMake as any).createPdf(docDefinition);
    if (resolvedAction === "print") pdf.print();
    else if (resolvedAction === "download")
      pdf.download(
        opts?.fileName ?? `item-wise-sales-report_${Date.now()}.pdf`,
      );
    else pdf.open();
    return;
  }

  // --- BODY (per branch, each branch starts with header like reference) ---
  safeData.forEach((branchBlock, bIdx) => {
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
    const branchVatNo = safeText((branchBlock as any)?.branchInfo?.vatNo, "");

    // === HEADER (centered like your Daily Sales reference) ===
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
        text: "Item Wise Sales Report",
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

    const reportRows = branchBlock?.result ?? [];

    // Menu groups
    reportRows.forEach((menuGroupBlock) => {
      const menuGroup = safeText(menuGroupBlock?.menuGroup, "Menu Group");

      const grouped = groupItemsByCategory(menuGroupBlock?.items ?? []);
      const categories = grouped?.categories ?? [];
      const grandTotalQty = asNumber(grouped?.grandTotalQty);
      const grandTotalAmount = asNumber(grouped?.grandTotalAmount);

      content.push({
        text: menuGroup.toUpperCase(),
        style: "h2",
        margin: [0, 6, 0, 6],
      });

      // Categories
      categories.forEach((cat: any) => {
        const categoryName = safeText(cat?.category?.name, "No Category");
        const items: SalesItem[] = (cat?.items ?? []) as any;

        const totalItem = items.length;
        const totalQty = items.reduce(
          (sum, it: any) => sum + asNumber(it?.qty),
          0,
        );
        const totalAmount = items.reduce(
          (sum, it: any) => sum + asNumber(it?.qty) * asNumber(it?.rate),
          0,
        );

        content.push({
          columns: [
            { text: categoryName.toUpperCase(), style: "small", bold: true },
            {
              text: `${num(totalItem)} records`,
              style: "muted",
              alignment: "right",
            },
          ],
          margin: [0, 4, 0, 4],
        });

        const tableBody = [
          [
            { text: "Item Code", style: "tableHeader" },
            { text: "Item Name", style: "tableHeader" },
            { text: "Qty", style: "tableHeader", alignment: "right" },
            { text: "Rate", style: "tableHeader", alignment: "right" },
            { text: "Amount", style: "tableHeader", alignment: "right" },
          ],
          ...items.map((it: any) => {
            const qty = asNumber(it?.qty);
            const rate = asNumber(it?.rate);
            const amount = qty * rate;

            return [
              { text: safeText(it?.itemCode, "-"), style: "small" },
              { text: safeText(it?.itemName, "-"), style: "small" },
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

      content.push(line());
    });

    // Branch grand totals
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

    if (bIdx < safeData.length - 1)
      content.push({ text: "", pageBreak: "after" });
  });

  const docDefinition: any = {
    pageSize: "A4",
    pageMargins: [20, 20, 20, 20],
    content,
    footer: (currentPage: number, pageCount: number) => ({
      columns: [
        { text: "Item Wise Sales Report", style: "muted" },
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

      h1: { fontSize: 12, bold: true, color: "#111827" },
      h2: { fontSize: 10, bold: true, color: "#111827" },

      muted: { fontSize: 9, color: "#6B7280" },
      small: { fontSize: 8, color: "#111827" },

      tableHeader: { fontSize: 8, bold: true, color: "#111827" },
      noData: { fontSize: 9, italics: true, color: "#6b7280" },
    },
    defaultStyle: { fontSize: 8 },
  };

  const pdf = (pdfMake as any).createPdf(docDefinition);
  const fileName = opts?.fileName ?? `item-wise-sales-report_${Date.now()}.pdf`;

  if (resolvedAction === "print") pdf.print();
  else if (resolvedAction === "download") pdf.download(fileName);
  else pdf.open();
}
