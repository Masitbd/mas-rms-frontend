type PaymentRecord = {
  guest: number;
  totalBill: number;
  metPayable: number;
  paid: number;
  due: number;
  discount: number;
  pMode: string; // payment mode (cash, card, bkash, etc.)
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
  groupDate: string;
};

type ApiResult = DayGroup[];

type PaymentModeTotal = {
  paymentMode: string;
  amount: number;
};

type Totals = {
  totalOrder: number;
  totalPaid: number;
  totalDue: number;
  totalLunch: number;
  totalDinner: number;
  totalGuest: number;
  discountAmount: number;
  paymentModes: PaymentModeTotal[];
};

export function calculateGrandTotals(
  data: ApiResult | null | undefined
): Totals {
  const totals: Totals = {
    totalOrder: 0,
    totalPaid: 0,
    totalDue: 0,
    totalLunch: 0,
    totalDinner: 0,
    totalGuest: 0,
    discountAmount: 0,
    paymentModes: [],
  };

  if (!Array.isArray(data)) {
    return totals;
  }

  // map to accumulate paymentMode totals
  const paymentModeMap = new Map<string, number>();

  for (const day of data) {
    const paymentGroups = day.paymentGroups ?? [];

    for (const pg of paymentGroups) {
      const timePeriods = pg.timePeriods ?? [];

      for (const tp of timePeriods) {
        const label = (tp.timePeriod || "").toLowerCase();
        const isLunch = label === "lunch";
        const isDinner = label === "dinner";

        const records = tp.records ?? [];

        for (const rec of records) {
          const guest = rec.guest ?? 0;
          const paid = rec.paid ?? 0;
          const due = rec.due ?? 0;
          const discount = rec.discount ?? 0;
          const metPayable = rec.metPayable ?? rec.totalBill ?? 0;

          totals.totalOrder += 1;
          totals.totalGuest += guest;
          totals.totalPaid += paid;
          totals.totalDue += due;
          totals.discountAmount += discount;

          if (isLunch) totals.totalLunch += metPayable;
          if (isDinner) totals.totalDinner += metPayable;

          // payment mode totals (based on actual paid amount)
          const modeKey =
            (rec.pMode && rec.pMode.toString().trim()) || "Unknown";

          if (!paymentModeMap.has(modeKey)) {
            paymentModeMap.set(modeKey, 0);
          }
          paymentModeMap.set(
            modeKey,
            (paymentModeMap.get(modeKey) ?? 0) + paid
          );
        }
      }
    }
  }

  totals.paymentModes = Array.from(paymentModeMap.entries()).map(
    ([paymentMode, amount]) => ({ paymentMode, amount })
  );

  return totals;
}
