import { TDocumentDefinitions } from "pdfmake/interfaces";
import { ToWords } from "to-words";

export const LaserPrintingDocProvider = (bill: any, session: any) => {
  const numberToWord = new ToWords({
    localeCode: "en-BD",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
    },
  });
  // Elegant A5 POS receipt (pdfMake)
  // - A5 portrait page
  // - Safe defaults for missing values
  // - Compact, clean layout for POS use
  // - Right-aligned currency, subtle separators, optional rows auto-hide

  // ===== Helpers =====
  const CURRENCY = "TK"; // change if needed
  const ACCENT = "#4f46e5";

  const safe = (v: any, fallback = "—") =>
    v === undefined || v === null || v === "" ? fallback : v;

  const asNum = (v: any, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const money = (n: any) => `${CURRENCY} ${asNum(n).toFixed(2)}`;

  const fmt = {
    date: (d: any) => {
      try {
        const dt = d ? new Date(d) : new Date();
        return dt.toLocaleDateString();
      } catch {
        return "—";
      }
    },
    time: (d: any) => {
      try {
        const dt = d ? new Date(d) : new Date();
        return dt.toLocaleTimeString();
      } catch {
        return "—";
      }
    },
  };

  const dt = bill?.date ?? Date.now();

  // ===== Items (safe) =====
  const itemRows: any[] =
    Array.isArray(bill?.items) && bill.items.length > 0
      ? bill.items.map((it: any) => {
          const name = safe(it?.item?.itemName, "Item");
          const qty = asNum(it?.qty, 0);
          const rate = asNum(it?.rate, 0);
          const amt = qty * rate;
          return [
            { text: name, noWrap: false },
            { text: qty.toString(), alignment: "right" },
            { text: money(rate), alignment: "right" },
            { text: money(amt), alignment: "right" },
          ];
        })
      : [
          [
            {
              text: "No items",
              colSpan: 4,
              alignment: "center",
              italics: true,
              color: "#666",
            },
            {},
            {},
            {},
          ],
        ];

  // ===== Totals (safe) =====
  const totalBill = asNum(bill?.totalBill, 0);
  const totalDiscount = asNum(bill?.totalDiscount, 0);
  const totalVat = asNum(bill?.totalVat, 0);
  const serviceCharge = asNum(bill?.serviceCharge, 0);
  const netPayable = asNum(bill?.netPayable, 0);

  const vatRateLabel =
    typeof bill?.vat === "number" ? `VAT (${bill.vat}%)` : "VAT";
  const svcRateLabel =
    typeof bill?.serviceChargeRate === "number"
      ? `Service (${bill.serviceChargeRate}%)`
      : "Service";

  // Optional words (if converter available)
  const amountInWords =
    typeof numberToWord?.convert === "function"
      ? numberToWord.convert(netPayable)
      : "";

  // Subtle HR line
  const hr = (top = 8, bottom = 8, color = "#e5e7eb") => ({
    margin: [0, top, 0, bottom],
    canvas: [
      {
        type: "line",
        x1: 0,
        y1: 0,
        x2: 515,
        y2: 0,
        lineWidth: 0.8,
        lineColor: color,
      },
    ],
  });

  // ===== Document =====
  const doc = {
    pageSize: "A5", // 420x595pt portrait
    pageOrientation: "portrait",
    pageMargins: [30, 28, 30, 52], // balanced for A5

    content: [
      // Brand / Header
      {
        stack: [
          {
            text: safe(bill?.branch?.name, "Your Store"),
            style: "header",
            color: "#111827",
          },
          ...(safe(bill?.branch?.address1, "").trim()
            ? [{ text: bill.branch.address1, style: "subHeader" }]
            : []),
          ...(safe(bill?.branch?.address2, "").trim()
            ? [{ text: bill.branch.address2, style: "subHeader" }]
            : []),
          ...(safe(bill?.branch?.phone, "").trim()
            ? [{ text: `Helpline: ${bill.branch.phone}`, style: "subHeader" }]
            : []),
          ...(safe(bill?.branch?.binNo, "").trim()
            ? [{ text: `BIN: ${bill.branch.binNo}`, style: "subHeader" }]
            : []),
        ],
        alignment: "center",
        margin: [0, 0, 0, 8],
      },

      // Banner chip
      {
        table: {
          widths: ["*"],
          body: [
            [
              {
                text: "Customer Copy",
                alignment: "center",
                bold: true,
                fontSize: 10,
                color: "#111827",
                fillColor: "#f5f5f5",
                margin: [0, 3, 0, 3],
              },
            ],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 8],
      },

      // Meta (two columns)
      {
        columns: [
          {
            width: "60%",
            stack: [
              ...(safe(bill?.branch?.vatNo, "").trim()
                ? [
                    {
                      text: [
                        { text: "VAT Reg: ", bold: true },
                        bill!.branch!.vatNo,
                      ],
                      style: "infoText",
                    },
                  ]
                : []),
              {
                text: [
                  { text: "Bill No.: ", bold: true },
                  safe(bill?.billNo, "—"),
                ],
                style: "infoText",
              },
              ...(bill?.tableName?.name
                ? [
                    {
                      text: [
                        { text: "Table: ", bold: true },
                        bill.tableName.name,
                      ],
                      style: "infoText",
                    },
                  ]
                : []),
              ...(bill?.waiter?.name
                ? [
                    {
                      text: [
                        { text: "Waiter: ", bold: true },
                        bill.waiter.name,
                      ],
                      style: "infoText",
                    },
                  ]
                : []),
              ...(bill?.customer?.name
                ? [
                    {
                      text: [
                        { text: "Guest Name: ", bold: true },
                        bill.customer.name,
                      ],
                      style: "infoText",
                    },
                  ]
                : []),
            ],
          },
          {
            width: "40%",
            alignment: "right",
            stack: [
              {
                text: [{ text: "Bill Date: ", bold: true }, fmt.date(dt)],
                style: "infoText",
              },
              {
                text: [{ text: "Bill Time: ", bold: true }, fmt.time(dt)],
                style: "infoText",
              },
              ...(bill?.guest !== undefined && bill?.guest !== null
                ? [
                    {
                      text: [
                        { text: "Guests: ", bold: true },
                        String(bill.guest),
                      ],
                      style: "infoText",
                    },
                  ]
                : []),
            ],
          },
        ],
        margin: [0, 0, 0, 6],
      },

      hr(6, 8, "#e6e6e6"),

      // Items table
      {
        table: {
          headerRows: 1,
          widths: ["*", 40, 70, 80], // A5 has space for tidy columns
          body: [
            [
              { text: "Item", style: "th" },
              { text: "Qty", style: "th", alignment: "right" },
              { text: "Rate", style: "th", alignment: "right" },
              { text: "Amount", style: "th", alignment: "right" },
            ],
            ...itemRows,
          ],
        },
        layout: {
          hLineWidth: (i: number, node: any) =>
            i === 0 || i === node.table.body.length ? 0.8 : 0.4,
          hLineColor: () => "#ededed",
          vLineWidth: () => 0,
          paddingTop: () => 4,
          paddingBottom: () => 4,
        },
        style: "infoText",
        margin: [0, 0, 0, 8],
      },

      // Summary rows
      {
        table: {
          widths: ["*", "auto"],
          body: [
            [
              { text: "Food Amount", style: "rowLabel" },
              { text: money(totalBill), style: "rowValue" },
            ],
            [
              { text: "Total Discount", style: "rowLabel" },
              { text: money(totalDiscount), style: "rowValue" },
            ],
            [
              { text: vatRateLabel, style: "rowLabel" },
              { text: money(totalVat), style: "rowValue" },
            ],
            [
              { text: svcRateLabel, style: "rowLabel" },
              { text: money(serviceCharge), style: "rowValue" },
            ],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 4],
      },

      // Net Payable highlight
      {
        table: {
          widths: ["*", "auto"],
          body: [
            [
              {
                text: "Net Payable",
                bold: true,
                fontSize: 11,
                color: "#111827",
              },
              {
                text: money(netPayable),
                bold: true,
                fontSize: 12,
                color: ACCENT,
                alignment: "right",
              },
            ],
          ],
        },
        layout: {
          fillColor: () => "#f8fafc",
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          paddingTop: () => 6,
          paddingBottom: () => 6,
        },
        margin: [0, 2, 0, 8],
      },

      // Amount in words (optional)
      ...(amountInWords
        ? [
            {
              text: `In Words: ${amountInWords}`,
              fontSize: 8,
              bold: true,
              color: "#111827",
              margin: [0, 0, 0, 8],
            },
          ]
        : []),

      // Remark (optional)
      ...(safe(bill?.remark, "").trim()
        ? [
            {
              text: `Remark: ${bill!.remark}`,
              fontSize: 9,
              bold: true,
              color: "#374151",
              margin: [0, 0, 0, 4],
            },
          ]
        : []),
    ],

    footer: (_currentPage: any, _pageCount: any) => ({
      margin: [30, 6, 30, 14],
      stack: [
        {
          text: "Thank you for coming!",
          bold: true,
          fontSize: 10,
          color: "#111827",
          alignment: "center",
          margin: [0, 0, 0, 4],
        },
        {
          columns: [
            {
              text: `Time: ${fmt.time(Date.now())}`,
              style: "footerText",
              alignment: "left",
            },
            {
              text: safe(session?.data?.user?.name, "User"),
              style: "footerText",
              alignment: "right",
            },
          ],
        },
        {
          text: "Software by MAS IT Solutions · Hotline: 01915682291",
          alignment: "center",
          fontSize: 7,
          color: "#6b7280",
          margin: [0, 2, 0, 0],
        },
      ],
    }),

    styles: {
      header: { fontSize: 18, bold: true, lineHeight: 1.1 },
      subHeader: { fontSize: 9, color: "#4b5563", lineHeight: 1.2 },
      th: { fontSize: 9, bold: true, color: "#111827" },
      infoText: { fontSize: 9, color: "#111827" },
      rowLabel: { fontSize: 9, color: "#4b5563" },
      rowValue: {
        fontSize: 9,
        bold: true,
        color: "#111827",
        alignment: "right",
      },
      footerText: { fontSize: 8, color: "#6b7280" },
    },

    defaultStyle: {
      fontSize: 9,
    },
  };

  return doc;
};
