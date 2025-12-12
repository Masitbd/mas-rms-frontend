import { FC } from "react";
import { BranchOption, BranchSelect } from "./BrunchSelector";
import { DateField } from "./DateRangeHeader";
import { QuickRangeButtons } from "./QuickRangeButton";
import { Button } from "rsuite";
import { BarChart3, RotateCcw, Search } from "lucide-react";

export interface DailySalesFilterProps {
  header: string;
  subHeader?: string;
  startDate: Date | null;
  endDate: Date | null;
  selectedBranch: string | null;
  branches: BranchOption[];

  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onBranchChange: (branch: string | null) => void;

  onTodayRange: () => void;
  onLast7DaysRange: () => void;
  onThisMonthRange: () => void;

  onSearch: () => void;
  onClear: () => void; // clear button callback
  isData?: boolean;
  dataComponent?: React.ReactNode;
}

export const ReportTemplate: FC<DailySalesFilterProps> = ({
  startDate,
  endDate,
  selectedBranch,
  branches,
  onStartDateChange,
  onEndDateChange,
  onBranchChange,
  onTodayRange,
  onLast7DaysRange,
  onThisMonthRange,
  onSearch,
  onClear,
  header,
  subHeader,
  isData,
  dataComponent,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Title pill */}
      <header className="mb-4 flex items-center justify-between bg-white shadow-sm rounded-2xl px-2 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900 md:text-base">
              {header}
            </h1>
            <p className="text-xs text-slate-500">{subHeader ?? " "}</p>
          </div>
        </div>

        {/* Optional right-side chip – remove if you don’t need it */}
        <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 md:inline-flex">
          Analytics
        </span>
      </header>

      {/* Filter card */}
      <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Date range */}
          <div className="flex-1">
            <p className="mb-2 text-sm font-semibold text-slate-900">
              Date range
            </p>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <DateField
                label="Start date"
                value={startDate}
                onChange={onStartDateChange}
                placeholder="Start date"
              />
              <span className="hidden text-sm text-slate-400 md:inline">–</span>
              <DateField
                label="End date"
                value={endDate}
                onChange={onEndDateChange}
                placeholder="End date"
              />
            </div>
            <QuickRangeButtons
              onToday={onTodayRange}
              onLast7Days={onLast7DaysRange}
              onThisMonth={onThisMonthRange}
            />
          </div>

          {/* Branch */}
          <div className="flex flex-col gap-3 md:w-72">
            <p className="text-sm font-semibold text-slate-900">Branch</p>
            <BranchSelect
              label="Branch"
              data={branches}
              value={selectedBranch}
              onChange={onBranchChange}
              placeholder="Search branches..."
            />
          </div>

          {/* Actions */}
          <div className="mt-2 flex items-center gap-2 md:mt-12 pt-1  md:self-start">
            <Button
              appearance="primary"
              className="flex items-center justify-center gap-2 rounded-xl px-5"
              onClick={onSearch}
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Button>

            {/* <Button
              appearance="subtle"
              className="flex items-center justify-center gap-2 rounded-xl px-4"
              onClick={onClear}
            >
              <RotateCcw className="h-4 w-4" />
              <span>Clear</span>
            </Button> */}
          </div>
        </div>
      </div>

      {/* Empty-state card (optional, can be removed or reused elsewhere) */}
      <div className="mt-4  rounded-2xl bg-white  shadow-sm">
        {isData ? (
          dataComponent
        ) : (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-900">
                No data yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Pick a date range and branch, then run your report.
              </p>
              <Button
                appearance="primary"
                className="mt-4 inline-flex items-center gap-2 rounded-xl px-6"
                onClick={onSearch}
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
