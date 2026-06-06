/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import React, { FC, useState, useEffect } from "react";
import { ReportTemplate } from "@/components/reports/ReportTemplate";
import { MenuItemsCostingTableV2 } from "@/components/reports/MenuItemsCostingTable-v2";
import { useGetBranchQuery } from "@/redux/api/branch/branch.api";
import { useLazyGetMenuItemsConsumpitonCostingReportsQuery } from "@/redux/api/report/report.api";
import { formatDate } from "@/utils/formateDate";
import { useSession } from "next-auth/react";

const MenuItemConsumptionCostingPage: FC = () => {
  const session = useSession();
  const userBranch = session?.data?.user?.branch;

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [branch, setBranch] = useState<string | null>(null);

  // Fetch branches for selection
  const { data: branchData } = useGetBranchQuery(undefined);

  // Lazy query to fetch costing report
  const [
    getReport,
    { isLoading: reportLoading, isFetching: reportFetching, data: reportData },
  ] = useLazyGetMenuItemsConsumpitonCostingReportsQuery();

  // Set default branch from session
  useEffect(() => {
    if (userBranch) {
      setBranch(userBranch);
    }
  }, [userBranch]);

  // Automatically trigger fetch if branch is pre-selected by session
  useEffect(() => {
    if (branch) {
      const query: { startDate?: string; endDate?: string; branch?: string } =
        {};
      startDate && (query.startDate = formatDate(startDate));
      endDate && (query.endDate = formatDate(endDate));
      query.branch = branch;
      getReport(query);
    }
  }, [branch]);

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

    if (branch) {
      await getReport(query);
    }
  };

  const handleClear = () => {
    // If the user has a session branch, don't clear the branch
    setStartDate(null);
    setEndDate(null);
    if (!userBranch) {
      setBranch(null);
    }
  };

  // Check if we have active data displayed
  const isDataPresent = !!reportData?.data;

  return (
    <ReportTemplate
      startDate={startDate}
      endDate={endDate}
      selectedBranch={branch}
      hideBranchSelect={!!userBranch}
      branches={
        branchData?.data?.map((d: { name: string; _id: string }) => ({
          label: d?.name,
          value: d?._id,
        })) || []
      }
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      onBranchChange={setBranch}
      onTodayRange={handleTodayRange}
      onLast7DaysRange={handleLast7DaysRange}
      onThisMonthRange={handleThisMonthRange}
      onSearch={handleSearch}
      onClear={handleClear}
      header="Menu Item Costing Report"
      subHeader="Analyze recipe costing, margins, and food cost percentages"
      dataComponent={
        <MenuItemsCostingTableV2
          isLoading={reportFetching || reportLoading}
          data={reportData?.data}
        />
      }
      isData={isDataPresent}
    />
  );
};

export default MenuItemConsumptionCostingPage;
