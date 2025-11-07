import { ToWords } from "to-words";

export const PosPrinterDocProvider = (bill: any, session: any) => {
  // POS Receipt (modern, safe) — pdfMake
  // Width ~227pt ≈ 80mm. Height is estimated from items so it fits on one page.
  const numberToWord = new ToWords({
    localeCode: "en-BD",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
    },
  });

  const CURRENCY = "TK";
  const ACCENT = "#4f46e5";

  const safe = (v: any, fb = "—") =>
    v === undefined || v === null || v === "" ? fb : v;
  const asNum = (v: any, fb = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fb;
  };
  const money = (n: any) => `${CURRENCY} ${asNum(n).toFixed(2)}`;
  const fmt = {
    date: (d: any) => {
      try {
        return new Date(d ?? Date.now()).toLocaleDateString();
      } catch {
        return "—";
      }
    },
    time: (d: any) => {
      try {
        return new Date(d ?? Date.now()).toLocaleTimeString();
      } catch {
        return "—";
      }
    },
  };

  // Build items (safe)
  const items = Array.isArray(bill?.items) ? bill.items : [];
  const itemRows: any[] = items.length
    ? items.map((it: any) => {
        const name = safe(it?.item?.itemName, "Item");
        const qty = asNum(it?.qty, 0);
        const rate = asNum(it?.rate, 0);
        const amt = qty * rate;
        return [
          { text: name, noWrap: false },
          { text: String(qty), alignment: "right" },
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

  // Totals (safe)
  const totalBill = asNum(bill?.totalBill, 0);
  const totalDiscount = asNum(bill?.totalDiscount, 0);
  const totalVat = asNum(bill?.totalVat, 0);
  const serviceCharge = asNum(bill?.serviceCharge, 0);
  const netPayable = asNum(bill?.netPayable, 0);

  const vatLabel = typeof bill?.vat === "number" ? `VAT (${bill.vat}%)` : "VAT";
  const svcLabel =
    typeof bill?.serviceChargeRate === "number"
      ? `Service (${bill.serviceChargeRate}%)`
      : "Service";

  const words =
    typeof numberToWord?.convert === "function"
      ? numberToWord.convert(netPayable)
      : "";

  // Subtle divider
  const hr = (top = 4, bottom = 4, width = 0.6, color = "#e5e7eb") => ({
    margin: [0, top, 0, bottom],
    canvas: [
      {
        type: "line",
        x1: 0,
        y1: 0,
        x2: 227 - 10 /* minus side padding */,
        y2: 0,
        lineWidth: width,
        lineColor: color,
      },
    ],
  });

  // Estimate page height by rows (so we avoid invalid "auto")
  const BASE = 340; // base content height (header/meta/summary)
  const PER_ROW = 18; // each item row height
  const EST_HEIGHT = Math.max(
    BASE + PER_ROW * Math.max(itemRows.length, 1),
    520
  ); // min height
  const PAGE_HEIGHT = EST_HEIGHT;

  // Document
  const doc = {
    pageSize: { width: 227, height: "auto" }, // ~80mm wide
    pageMargins: [8, 8, 8, 10],

    content: [
      // Store header
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
          ...(safe(bill?.branch?.address2, "").trim
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
        margin: [0, 0, 0, 4],
      },

      // Badge
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
                margin: [0, 2, 0, 2],
              },
            ],
          ],
        },
        layout: "noBorders",
        margin: [0, 2, 0, 4],
      },

      // Meta
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
                        bill.branch.vatNo,
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
              ...(safe(
                bill?.deliveryAddress?.name ?? bill?.deliveryAddress,
                ""
              ).trim()
                ? [
                    {
                      text: [
                        { text: "Delivery Address: ", bold: true },
                        safe(
                          bill?.deliveryAddress?.name ?? bill?.deliveryAddress,
                          "—"
                        ),
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
                text: [
                  { text: "Bill Date: ", bold: true },
                  fmt.date(bill?.date),
                ],
                style: "infoText",
              },
              {
                text: [
                  { text: "Bill Time: ", bold: true },
                  fmt.time(bill?.date),
                ],
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
        margin: [0, 0, 0, 2],
      },

      hr(3, 3, 0.6),

      // Items
      {
        table: {
          headerRows: 1,
          widths: ["*", "auto", "auto", "auto"],
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
          paddingTop: () => 3,
          paddingBottom: () => 3,
        },
        style: "infoText",
        margin: [0, 0, 0, 4],
      },

      hr(2, 2, 0.6),

      // Summary
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
              { text: vatLabel, style: "rowLabel" },
              { text: money(totalVat), style: "rowValue" },
            ],
            [
              { text: svcLabel, style: "rowLabel" },
              { text: money(serviceCharge), style: "rowValue" },
            ],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 2],
      },

      // Net payable highlight
      {
        table: {
          widths: ["*", "auto"],
          body: [
            [
              {
                text: "Net Payable",
                bold: true,
                fontSize: 10,
                color: "#111827",
              },
              {
                text: money(netPayable),
                bold: true,
                fontSize: 11,
                color: "black",
                alignment: "right",
              },
            ],
          ],
        },
        layout: {
          fillColor: () => "#f8fafc",
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          paddingTop: () => 4,
          paddingBottom: () => 4,
        },
        margin: [0, 2, 0, 4],
      },

      // In words (optional)
      ...(words
        ? [
            {
              text: `In Words: ${words}`,
              fontSize: 7,
              bold: true,
              alignment: "left",
              margin: [0, 0, 0, 3],
            },
          ]
        : []),

      // Footer info (time + user)
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
        margin: [0, 2, 0, 2],
      },

      // Thank you chip
      {
        table: {
          widths: ["*"],
          body: [
            [
              {
                text: "Thank you for coming!",
                border: [false, false, false, false],
                fillColor: "#f3f4f6",
                alignment: "center",
                fontSize: 9,
                bold: true,
                margin: [0, 3, 0, 3],
              },
            ],
          ],
        },
        layout: "noBorders",
        margin: [0, 2],
      },

      {
        text: "Software by MAS IT Solutions · Hotline: 01915682291",
        fontSize: 7,
        bold: true,
        alignment: "center",
        color: "#6b7280",
        margin: [0, 2, 0, 0],
      },
    ],

    styles: {
      infoText: { fontSize: 8, color: "#111827", margin: [0, 1, 0, 1] },
      header: {
        bold: true,
        alignment: "center",
        fontSize: 16,
        lineHeight: 1.1,
      },
      subHeader: {
        alignment: "center",
        fontSize: 8,
        color: "#4b5563",
        lineHeight: 1.2,
      },
      th: { fontSize: 8, bold: true, color: "#111827" },
      rowLabel: { fontSize: 8, color: "#4b5563" },
      rowValue: {
        fontSize: 8,
        bold: true,
        color: "#111827",
        alignment: "right",
      },
      footerText: { fontSize: 7, color: "#6b7280" },
    },

    defaultStyle: { fontSize: 8 },
  };

  return doc;
};
