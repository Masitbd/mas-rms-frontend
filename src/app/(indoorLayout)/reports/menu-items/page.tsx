"use client";

import React, { FC, useState, useEffect } from "react";
import MenuGroupItemTable from "@/components/reports/MenuGroupTable";
import { ReportTemplate } from "@/components/reports/ReportTemplate";
import { useGetBranchQuery } from "@/redux/api/branch/branch.api";
import { useLazyGetMenuItemsReportsQuery } from "@/redux/api/report/report.api";
import { formatDate } from "@/utils/formateDate";
import { useSession } from "next-auth/react";

const MenuItemsPage: FC = () => {
  const session = useSession();
  const userBranch = session?.data?.user?.branch;

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [branch, setBranch] = useState<string | null>(null);

  // Fetch branches for selection
  const { data: branchData } = useGetBranchQuery(undefined);

  // Lazy query to fetch menu items report
  const [
    getReport,
    { isLoading: reportLoading, isFetching: reportFetching, data: reportData },
  ] = useLazyGetMenuItemsReportsQuery();

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
      if (startDate) query.startDate = formatDate(startDate);
      if (endDate) query.endDate = formatDate(endDate);
      query.branch = branch;
      getReport(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (startDate) query.startDate = formatDate(startDate);
    if (endDate) query.endDate = formatDate(endDate);
    if (branch) query.branch = branch;

    await getReport(query);
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    if (!userBranch) {
      setBranch(null);
    }
  };

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
      header="Menu group Item"
      subHeader="Track menu group items by branch and date range"
      dataComponent={
        <MenuGroupItemTable
          isLoading={reportFetching || reportLoading}
          data={reportData?.data}
          startDate={startDate}
          endDate={endDate}
        />
      }
      isData={isDataPresent}
    />
  );
};

export default MenuItemsPage;
