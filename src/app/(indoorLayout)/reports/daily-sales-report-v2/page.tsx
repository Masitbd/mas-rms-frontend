/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import { BranchOption } from "@/components/reports/BrunchSelector";
import { DailyPaymentsView } from "@/components/reports/DailySalesTable-v2";
import { ReportTemplate } from "@/components/reports/ReportTemplate";
import {
  useGetBranchQuery,
  useLazyGetDeliverableZoneQuery,
} from "@/redux/api/branch/branch.api";
import { useLazyGetDailySalesSatementReportQuery } from "@/redux/api/report/report.api";
import { formatDate } from "@/utils/formateDate";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { FC, useState } from "react";

const DailySalesPageExample: FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [branch, setBranch] = useState<string | null>(null);

  const {
    data: branchData,
    isLoading: branchDataLoading,
    isFetching: branchDataFetching,
  } = useGetBranchQuery(undefined);

  const [
    getReport,
    { isLoading: reportLoading, isFetching: reportFetching, data: reportData },
  ] = useLazyGetDailySalesSatementReportQuery();
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
    // your API call / data fetch here
    const query: { startDate?: string; endDate?: string; branch?: string } = {};
    startDate && (query.startDate = formatDate(startDate));
    endDate && (query.endDate = formatDate(endDate));
    branch && (query.branch = branch);

    if (startDate || endDate || branch) {
      await getReport(query);
    }
  };

  // requirement #3 – clear button receives a callback (dummy example)
  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setBranch(null);
    console.log("CLEAR CLICKED");
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
      header=" Daily Sales Report"
      subHeader="Track sales by date range and branch"
      dataComponent={
        <DailyPaymentsView
          loading={reportFetching || reportLoading}
          data={reportData?.data?.result ?? []}
          branchInfo={reportData?.data?.branchInfo}
        />
      }
      isData={true}
    />
  );
};

export default DailySalesPageExample;
