/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import { ReportTemplate } from "@/components/reports/ReportTemplate";
import { useGetBranchQuery } from "@/redux/api/branch/branch.api";
import { useLazyGetDueStatementReportsQuery } from "@/redux/api/report/report.api";
import { formatDate } from "@/utils/formateDate";
import { FC, useState } from "react";
import { DueSalesStatementView_v2 } from "@/components/reports/DueSalesStatementView_v2";

const DueSalesStatementPage: FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [branch, setBranch] = useState<string | null>(null);

  const {
    data: branchData,
  } = useGetBranchQuery(undefined);

  const [
    getReport,
    { isLoading: reportLoading, isFetching: reportFetching, data: reportData },
  ] = useLazyGetDueStatementReportsQuery();

  const handleTodayRange = () => {
    const today = new Date();
    setStartDate(today);
    setEndDate(today);
  };

  const handleLast7DaysRange = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    setStartDate(start);
    setEndDate(end);
  };

  const handleThisMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setStartDate(start);
    setEndDate(end);
  };

  const handleSearch = async () => {
    const query: { startDate?: string; endDate?: string; branch?: string } = {};
    startDate && (query.startDate = formatDate(startDate));
    endDate && (query.endDate = formatDate(endDate));
    branch && (query.branch = branch);

    if (startDate || endDate || branch) {
      await getReport(query);
    }
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setBranch(null);
  };

  return (
    <ReportTemplate
      startDate={startDate}
      endDate={endDate}
      selectedBranch={branch}
      branches={branchData?.data?.map((d: { name: string; _id: string }) => {
        return {
          label: d?.name,
          value: d?._id,
        };
      })}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      onBranchChange={setBranch}
      onTodayRange={handleTodayRange}
      onLast7DaysRange={handleLast7DaysRange}
      onThisMonthRange={handleThisMonthRange}
      onSearch={handleSearch}
      onClear={handleClear}
      header="Due Sales Statement Report"
      subHeader="Track due sales by date range and branch"
      dataComponent={
        <DueSalesStatementView_v2
          loading={reportFetching || reportLoading}
          data={reportData?.data ?? []}
          startDate={startDate}
          endDate={endDate}
        />
      }
      isData={!!reportData?.data}
    />
  );
};

export default DueSalesStatementPage;
