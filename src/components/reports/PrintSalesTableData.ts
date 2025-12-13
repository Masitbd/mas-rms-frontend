import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import { calculateGrandTotals } from "./DailyslasesTotalcalculator";

// === Types (adapt if you already have them) ===
type PaymentRecord = {
  billNo: string;
  table: string;
  guest: number;
  pMode: string;
  totalBill: number;
  totalVat: number;
  discount: number;
  pPayment: number;
  metPayable: number;
  due: number;
  paid: number;
  date: string;
  sCharge?: number;
};

export type BranchInfo = {
  name: string;
  address1: string;
  phone: string;
  vatNo: string;
};

type TimePeriodGroup = {
  timePeriod: string; // "Lunch" | "Dinner" | "Other" | etc.
  records: PaymentRecord[];
};

type PaymentGroup = {
  paymentType: string; // "Paid" | "Due" | ...
  timePeriods: TimePeriodGroup[];
};

type DayGroup = {
  paymentGroups: PaymentGroup[];
  branchDetails: unknown | null;
  groupDate: string; // e.g. "2025-12-03"
};

export type ApiResult = DayGroup[];

type MealGroup = {
  timePeriod: string;
  paid: PaymentRecord[];
  due: PaymentRecord[];
};

type DayView = {
  groupDate: string;
  meals: MealGroup[];
};

// === Grouping helpers ===

// day -> timePeriod -> { paid, due }
function groupByDayAndMeal(data: ApiResult): DayView[] {
  if (!Array.isArray(data)) return [];

  return data.map((day) => {
    const mealMap = new Map<
      string,
      { paid: PaymentRecord[]; due: PaymentRecord[] }
    >();

    const paymentGroups = day.paymentGroups ?? [];
    for (const pg of paymentGroups) {
      const isPaid = (pg?.paymentType ?? "").toLowerCase() === "paid";
      const timePeriods = pg.timePeriods ?? [];

      for (const tp of timePeriods) {
        const key = tp?.timePeriod || "Dinner";
        if (!mealMap.has(key)) {
          mealMap.set(key, { paid: [], due: [] });
        }
        const bucket = mealMap.get(key)!;
        const records = tp.records ?? [];
        if (isPaid) {
          bucket.paid.push(...records);
        } else {
          bucket.due.push(...records);
        }
      }
    }

    const meals: MealGroup[] = Array.from(mealMap.entries())
      .map(([timePeriod, { paid, due }]) => ({
        timePeriod,
        paid,
        due,
      }))
      // Lunch first, then Dinner, then others
      .sort((a, b) => {
        const order = (t: string) => {
          const x = t.toLowerCase();
          if (x === "lunch") return 0;
          if (x === "dinner") return 1;
          return 2;
        };
        return order(a.timePeriod) - order(b.timePeriod);
      });

    return {
      groupDate: day.groupDate,
      meals,
    };
  });
}

// overall tota
function calculateTotals(data: ApiResult) {
  const totals = {
    totalOrder: 0,
    totalPaid: 0,
    totalDue: 0,
    totalLunch: 0,
    totalDinner: 0,
    totalGuest: 0,
    discountAmount: 0,
  };

  if (!Array.isArray(data)) return totals;

  for (const day of data) {
    const paymentGroups = day.paymentGroups ?? [];
    for (const pg of paymentGroups) {
      const timePeriods = pg.timePeriods ?? [];
      for (const tp of timePeriods) {
        const label = (tp?.timePeriod ?? "").toLowerCase();
        const isLunch = label === "lunch";
        const isDinner = label === "dinner";
        const records = tp.records ?? [];

        for (const rec of records) {
          totals.totalOrder += 1;
          totals.totalGuest += rec.guest ?? 0;
          totals.totalPaid += rec.paid ?? 0;
          totals.totalDue += rec.due ?? 0;
          totals.discountAmount += rec.discount ?? 0;

          const amount = rec.metPayable ?? rec.totalBill ?? 0;
          if (isLunch) totals.totalLunch += amount;
          if (isDinner) totals.totalDinner += amount;
        }
      }
    }
  }

  return totals;
}

// === pdfMake helpers ===

function createPaymentTableNode(title: string, records?: PaymentRecord[]) {
  const safeRecords = Array.isArray(records) ? records : [];

  if (!safeRecords.length) {
    return {
      text: `No ${title.toLowerCase()} bills for this slot.`,
      style: "noData",
      margin: [0, 2, 0, 8],
    };
  }

  let totalGuests = 0;
  let totalMoney = 0;
  const totalOrders = safeRecords.length;

  const rows = safeRecords.map((rec) => {
    const guest = rec.guest ?? 0;
    const money = rec.metPayable ?? rec.totalBill ?? 0;
    totalGuests += guest;
    totalMoney += money;

    return [
      rec.billNo || "",
      rec.table || "",
      guest.toString(),
      (rec.totalBill ?? 0).toString(),
      rec.pMode || "",
      (rec.pPayment ?? 0).toString(),
      (rec.totalVat ?? 0).toString(),
      (rec.sCharge ?? 0).toString(),
      (rec.discount ?? 0).toString(),
      money.toString(),
    ];
  });

  const headerRow = [
    { text: "Bill No", style: "tableHeader" },
    { text: "Table", style: "tableHeader" },
    { text: "Guest", style: "tableHeader" },
    { text: "Total Bill", style: "tableHeader" },
    { text: "P Mode", style: "tableHeader" },
    { text: "P Payment", style: "tableHeader" },
    { text: "Total VAT", style: "tableHeader" },
    { text: "SCharge", style: "tableHeader" },
    { text: "Discount", style: "tableHeader" },
    { text: "Net Payable", style: "tableHeader" },
  ];

  const totalsRow = [
    { text: "Totals", colSpan: 2, style: "tableTotalLabel" },
    {},
    { text: totalGuests.toString(), style: "tableTotalValue" },
    { text: "-", style: "tableTotalValue" },
    { text: `Orders: ${totalOrders}`, style: "tableTotalValue" },
    { text: "-", style: "tableTotalValue" },
    { text: "-", style: "tableTotalValue" },
    { text: "-", style: "tableTotalValue" },
    { text: "-", style: "tableTotalValue" },
    { text: totalMoney.toString(), style: "tableTotalValue" },
  ];

  return {
    margin: [0, 2, 0, 10],
    table: {
      headerRows: 1,
      widths: [
        "auto",
        "auto",
        "auto",
        "auto",
        "*",
        "auto",
        "auto",
        "auto",
        "auto",
        "auto",
      ],
      body: [headerRow, ...rows, totalsRow],
    },
    layout: "lightHorizontalLines",
  };
}

/**
 * Generate a sales report PDF using pdfMake.
 * - Page is portrait (vertical)
 * - Header is centered
 * - Overall summary is at the END of the document
 *
 * @param data ApiResult from backend
 * @param action "open" | "download" | "print" (default: "open")
 */

export function printSalesReportPdf(
  data: ApiResult | null | undefined,
  action: "open" | "download" | "print" = "open",
  branchInfo: { name: string; address1: string; phone: string; vatNo: string }
) {
  const safeData: ApiResult = Array.isArray(data) ? data : [];
  const days = groupByDayAndMeal(safeData);
  const totals = calculateGrandTotals(safeData);

  const dateLabels = safeData.map((d) => d.groupDate).filter(Boolean);
  const dateRangeText =
    dateLabels.length === 0
      ? "No dates"
      : dateLabels.length === 1
      ? dateLabels[0]
      : `${dateLabels[dateLabels.length - 1]} – ${dateLabels[0]}`;

  const hasData = days.length > 0;

  const content: any[] = [];

  // === HEADER (centered) ===
  content.push(
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
      text: "Daily Sales Report",
      style: "title",
      alignment: "center",
      margin: [0, 0, 0, 2],
    },
    {
      text: dateRangeText,
      style: "subtitle",
      alignment: "center",
      margin: [0, 0, 0, 10],
    }
  );

  // === DETAIL SECTION (day -> meal -> paid/due) ===
  if (!hasData) {
    content.push({
      text: "No transaction data available for the selected period.",
      style: "noData",
      margin: [0, 20, 0, 20],
      alignment: "center",
    });
  } else {
    for (const day of days) {
      content.push({
        text: day.groupDate,
        style: "dayHeader",
        margin: [0, 8, 0, 4],
      });

      if (!day.meals.length) {
        content.push({
          text: "No meals/time slots for this day.",
          style: "noData",
          margin: [0, 2, 0, 6],
        });
        continue;
      }

      for (const meal of day.meals) {
        content.push(
          { text: meal.timePeriod, style: "mealHeader", margin: [0, 4, 0, 2] },
          { text: "Paid", style: "paymentTypeHeader" },
          createPaymentTableNode("Paid", meal.paid),
          { text: "Due", style: "paymentTypeHeader", margin: [0, 4, 0, 0] },
          createPaymentTableNode("Due", meal.due)
        );
      }
    }
  }

  // === OVERALL SUMMARY AT THE END ===
  content.push(
    { text: "Overall Summary", style: "sectionHeader", margin: [0, 10, 0, 4] },
    {
      table: {
        widths: ["*", "*", "*"],
        body: [
          [
            {
              stack: [
                {
                  text: `Total Orders: ${totals.totalOrder}`,
                  style: "summaryItem",
                },
                {
                  text: `Total Guests: ${totals.totalGuest}`,
                  style: "summaryItem",
                },
                {
                  text: `Total Discount: ${totals.discountAmount}`,
                  style: "summaryItem",
                },
                {
                  text: `Total Paid: ${totals.totalPaid}`,
                  style: "summaryItem",
                },
              ],
              border: [false, false, false, false],
            },
            {
              stack: [
                { text: `Total Due: ${totals.totalDue}`, style: "summaryItem" },
                {
                  text: `Lunch Amount: ${totals.totalLunch}`,
                  style: "summaryItem",
                },
                {
                  text: `Dinner Amount: ${totals.totalDinner}`,
                  style: "summaryItem",
                },
              ],
              border: [false, false, false, false],
            },
            totals.paymentModes?.length
              ? {
                  stack: [
                    ...totals?.paymentModes?.map((pm) => {
                      return {
                        text: `${pm.paymentMode.toUpperCase()}: ${pm.amount}`,
                        style: "summaryItem",
                      };
                    }),
                  ],
                  border: [false, false, false, false],
                }
              : {},
          ],
        ],
      },
      layout: "noBorders",
      margin: [0, 0, 0, 0],
    }
  );

  const docDefinition: any = {
    pageSize: "A4",
    // portrait is default; no pageOrientation needed
    pageMargins: [20, 20, 20, 20],
    content,
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
      subHeader: {
        fontSize: 13,
        italics: true,
      },
      title: {
        fontSize: 16,
        bold: true,
      },
      subtitle: {
        fontSize: 10,
        color: "#555555",
      },
      sectionHeader: {
        fontSize: 11,
        bold: true,
        color: "#111827",
      },
      summaryItem: {
        fontSize: 9,
        margin: [0, 1, 0, 1],
      },
      dayHeader: {
        fontSize: 11,
        bold: true,
        color: "#1f2937",
      },
      mealHeader: {
        fontSize: 10,
        bold: true,
        color: "#374151",
      },
      paymentTypeHeader: {
        fontSize: 9,
        bold: true,
        margin: [0, 2, 0, 2],
        color: "#111827",
      },
      tableHeader: {
        bold: true,
        fontSize: 8,
        color: "#111827",
      },
      tableTotalLabel: {
        bold: true,
        fontSize: 8,
        color: "#111827",
      },
      tableTotalValue: {
        bold: true,
        fontSize: 8,
        color: "#111827",
      },
      noData: {
        fontSize: 9,
        italics: true,
        color: "#6b7280",
      },
    },
    defaultStyle: {
      fontSize: 8,
    },
  };

  const pdf = pdfMake.createPdf(docDefinition);

  if (action === "download") {
    pdf.download("daily-sales-report.pdf");
  } else if (action === "print") {
    pdf.print();
  } else {
    pdf.open();
  }
}
