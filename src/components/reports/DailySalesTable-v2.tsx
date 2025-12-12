// types.ts
export type PaymentRecord = {
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
  date: string; // ISO string
  sCharge?: number; // optional service charge
  totalScharge?: string;
};

export type TimePeriodGroup = {
  timePeriod: string; // "Lunch" | "Dinner" | "Other"
  records: PaymentRecord[];
};

export type PaymentGroup = {
  paymentType: string; // "Paid" | "Due"
  timePeriods: TimePeriodGroup[];
};

export type DayGroup = {
  paymentGroups: PaymentGroup[];
  branchDetails: unknown | null;
  groupDate: string; // e.g. "2025-12-03"
};

export type ApiResult = DayGroup[];

// View model: per day, per time-period, split into Paid & Due
export type MealGroup = {
  timePeriod: string; // Lunch / Dinner / Other
  paid: PaymentRecord[];
  due: PaymentRecord[];
};

export type DayView = {
  groupDate: string;
  meals: MealGroup[];
};

// Pivot: paymentType → timePeriod  ==>  timePeriod → paymentType
export const groupByDayAndMeal = (data: ApiResult): DayView[] => {
  return data.map((day) => {
    const mealMap = new Map<
      string,
      { paid: PaymentRecord[]; due: PaymentRecord[] }
    >();

    for (const pg of day.paymentGroups) {
      const isPaid = pg.paymentType === "Paid";

      for (const tp of pg.timePeriods) {
        const key = tp.timePeriod;
        if (!mealMap.has(key)) {
          mealMap.set(key, { paid: [], due: [] });
        }
        const bucket = mealMap.get(key)!;
        if (isPaid) {
          bucket.paid.push(...tp.records);
        } else {
          bucket.due.push(...tp.records);
        }
      }
    }

    // Turn map into sorted array; you can tweak the order (Lunch/Dinner)
    const meals: MealGroup[] = Array.from(mealMap.entries())
      .map(([timePeriod, { paid, due }]) => ({
        timePeriod,
        paid,
        due,
      }))
      .sort((a, b) => a.timePeriod.localeCompare(b.timePeriod));

    return {
      groupDate: day.groupDate,
      meals,
    };
  });
};

//! --------------------------------------------------------------------
// PaymentRecordsTable.tsx
// PaymentRecordsTable.tsx
import React, { FC, useMemo } from "react";
import { Button, Table } from "rsuite";
import { calculateGrandTotals } from "./DailyslasesTotalcalculator";
import { Printer } from "lucide-react";
import { BranchInfo, printSalesReportPdf } from "./PrintSalesTableData";

const { Column, HeaderCell, Cell } = Table;

interface PaymentRecordsTableProps {
  records: PaymentRecord[];
  loading: boolean;
}

export const PaymentRecordsTable: FC<PaymentRecordsTableProps> = ({
  records,
  loading,
}) => {
  const { totalGuests, totalOrders, totalMoney } = useMemo(() => {
    const totalOrders = records.length;
    const totalGuests = records.reduce((sum, r) => sum + (r.guest ?? 0), 0);
    const totalMoney = records.reduce((sum, r) => sum + (r.metPayable ?? 0), 0);

    return { totalGuests, totalOrders, totalMoney };
  }, [records]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <Table
        data={records}
        autoHeight
        loading={loading}
        bordered={false}
        cellBordered={false}
        rowHeight={35}
        headerHeight={40}
        className="text-xs"
      >
        <Column flexGrow={2}>
          <HeaderCell>Bill No</HeaderCell>
          <Cell dataKey="billNo" />
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>Table</HeaderCell>
          <Cell dataKey="table" />
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>Guest</HeaderCell>
          <Cell dataKey="guest" />
        </Column>

        <Column flexGrow={1} align="right">
          <HeaderCell>Total Bill</HeaderCell>
          <Cell>
            {(rowData: PaymentRecord) =>
              rowData.totalBill.toLocaleString("en-BD", {
                maximumFractionDigits: 0,
              })
            }
          </Cell>
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>Payment Mode</HeaderCell>
          <Cell dataKey="pMode" />
        </Column>

        <Column flexGrow={1} align="right">
          <HeaderCell>P Payment</HeaderCell>
          <Cell>
            {(rowData: PaymentRecord) =>
              rowData.pPayment.toLocaleString("en-BD", {
                maximumFractionDigits: 0,
              })
            }
          </Cell>
        </Column>

        <Column flexGrow={1} align="right">
          <HeaderCell>Total VAT</HeaderCell>
          <Cell>
            {(rowData: PaymentRecord) =>
              rowData.totalVat.toLocaleString("en-BD", {
                maximumFractionDigits: 0,
              })
            }
          </Cell>
        </Column>

        <Column flexGrow={1} align="right">
          <HeaderCell>SCharge</HeaderCell>
          <Cell>
            {(rowData: PaymentRecord) =>
              (rowData.totalScharge ?? 0).toLocaleString("en-BD", {
                maximumFractionDigits: 0,
              })
            }
          </Cell>
        </Column>

        <Column flexGrow={1} align="right">
          <HeaderCell>Discount</HeaderCell>
          <Cell>
            {(rowData: PaymentRecord) =>
              rowData.discount.toLocaleString("en-BD", {
                maximumFractionDigits: 0,
              })
            }
          </Cell>
        </Column>

        <Column flexGrow={1} align="right">
          <HeaderCell>Net Payable</HeaderCell>
          <Cell>
            {(rowData: PaymentRecord) =>
              rowData.metPayable.toLocaleString("en-BD", {
                maximumFractionDigits: 0,
              })
            }
          </Cell>
        </Column>
      </Table>

      {/* Totals footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 bg-gray-50 px-3 py-2 text-[11px] text-gray-700">
        <span>
          <span className="font-semibold">Total Order:</span> {totalOrders}
        </span>
        <span>
          <span className="font-semibold">Total Guest:</span> {totalGuests}
        </span>

        <span>
          <span className="font-semibold">Total Money:</span>{" "}
          {totalMoney.toLocaleString("en-BD", {
            maximumFractionDigits: 0,
          })}
        </span>
      </div>
    </div>
  );
};

// ! Grand total section
const DailySalesGrandTotal = (data: DayGroup[]) => {
  const {
    totalDinner,
    totalDue,
    totalGuest,
    totalLunch,
    totalOrder,
    totalPaid,
    discountAmount,
    paymentModes,
  } = calculateGrandTotals(data as DayGroup[]);

  return (
    <>
      <div className="px-4 rounded-xl border border-gray-200 bg-white shadow-sm py-4 ">
        <span className="text-sm font-semibold uppercase tracking-wide text-gray-800 ">
          Grand Total:
        </span>
        <div className="px-4 grid grid-cols-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800">
            Total Order: {totalOrder}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800">
            Total Guest: {totalGuest}
          </span>
        </div>
        <div className="px-4 grid grid-cols-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800">
            Total Lunch: {totalLunch}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800">
            Total Dinner: {totalDinner}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800">
            Total Amount: {totalLunch + totalDinner}
          </span>
        </div>

        <span className="text-sm font-semibold uppercase tracking-wide text-gray-800 mt-2">
          Payment Details :
        </span>
        <div className="px-4 grid grid-cols-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800">
            Total Amount:
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 col-start-2">
            {totalDinner + totalLunch}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-red-800 row-start-2">
            Total Discount:
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-red-800 col-start-2">
            {discountAmount}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-black row-start-3">
            Net Amount:
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-black col-start-2">
            {totalDue + totalPaid}
          </span>
        </div>

        <span className="text-sm font-semibold uppercase tracking-wide text-gray-800 mt-2">
          Payment Info :
        </span>
        <div className="px-4 grid grid-cols-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800">
            Total Paid:
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 col-start-2">
            {totalPaid}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-red-800 row-start-2">
            Total Due:
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-red-800 col-start-2">
            {totalDue}
          </span>
        </div>

        <span className="text-sm font-semibold uppercase tracking-wide text-gray-800 mt-2">
          Payment Mode :
        </span>
        <div className="px-4 grid grid-cols-3">
          {paymentModes?.length ? (
            paymentModes?.map((pm) => {
              return (
                <>
                  <span className="text-xs font-semibold uppercase tracking-wide text-black">
                    {pm.paymentMode}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-black col-span-2">
                    {pm.amount}
                  </span>
                </>
              );
            })
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

// ! Printing Component

const DailySalesPrintingComponent = (
  data: DayGroup[],
  branchInfo: BranchInfo
) => {
  return (
    <div className="grid grid-cols-4">
      <Button
        appearance="primary"
        size="lg"
        color="blue"
        className="col-start-4 !font-bold"
        startIcon={<Printer />}
        onClick={() => printSalesReportPdf(data, "print", branchInfo)}
      >
        Print{" "}
      </Button>
    </div>
  );
};
// !------------------------------------------------------------------------------------
// DailyPaymentsView.tsx

interface DailyPaymentsViewProps {
  data: ApiResult | null;
  loading: boolean;
}

interface DailyPaymentsViewProps {
  data: ApiResult | null;
  loading: boolean;
  branchInfo: BranchInfo;
}

export const DailyPaymentsView: FC<DailyPaymentsViewProps> = ({
  data,
  loading,
  branchInfo,
}) => {
  const days = useMemo<DayView[]>(
    () => (data ? groupByDayAndMeal(data) : []),
    [data]
  );

  return (
    <div className="space-y-4">
      {days.map((day) => (
        <div
          key={day.groupDate}
          className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 space-y-3"
        >
          {/* Date header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                {day.groupDate}
              </h2>
              <p className="text-xs text-gray-500">
                Lunch &amp; Dinner · Paid &amp; Due
              </p>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-medium text-gray-700">
              {loading ? "Loading…" : `${day.meals.length} time slots`}
            </span>
          </div>

          {/* Meals stacked vertically */}
          <div className="space-y-3">
            {day.meals.map((meal) => (
              <div
                key={meal.timePeriod}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3"
              >
                {/* Meal header (Lunch / Dinner) */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-800">
                    {meal.timePeriod}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {meal.paid.length + meal.due.length} records
                  </span>
                </div>

                {/* Paid block (full width, top) */}
                {meal.paid.length ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-emerald-700">
                        Paid
                      </span>
                      <span className="text-[10px] text-emerald-600">
                        {meal.paid.length} bills
                      </span>
                    </div>
                    <PaymentRecordsTable
                      records={meal.paid}
                      loading={loading}
                    />
                    {!meal.paid.length && !loading && (
                      <p className="text-[10px] text-emerald-600/70 mt-1">
                        No paid bills for this slot.
                      </p>
                    )}
                  </div>
                ) : (
                  <></>
                )}

                {/* Due block (full width, below Paid) */}
                {meal.due.length ? (
                  <div className="space-y-1 pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-amber-700">
                        Due
                      </span>
                      <span className="text-[10px] text-amber-600">
                        {meal.due.length} bills
                      </span>
                    </div>
                    <PaymentRecordsTable records={meal.due} loading={loading} />
                    {!meal.due.length && !loading && (
                      <p className="text-[10px] text-amber-600/70 mt-1">
                        No due bills for this slot.
                      </p>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {data?.length ? DailySalesGrandTotal(data as DayGroup[]) : <></>}
      {data?.length ? (
        DailySalesPrintingComponent(data as DayGroup[], branchInfo)
      ) : (
        <></>
      )}
      {/* Printing */}
      {!days.length && !loading && (
        <p className="text-xs text-gray-500 text-center py-10">
          No data available for the selected dates.
        </p>
      )}
    </div>
  );
};
