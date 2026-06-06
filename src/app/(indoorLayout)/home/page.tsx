"use client";

import React, { useMemo } from "react";
import { useGetDashboardStaticsDataQuery } from "@/redux/api/report/report.api";
import { Loader } from "rsuite";
import {
  Receipt,
  Coins,
  AlertCircle,
  TrendingUp,
  Calendar,
  MapPin,
  Sparkles,
  Building2,
  Wallet,
  ArrowUpRight,
} from "lucide-react";

interface TBranchStat {
  branchName: string;
  totalBills: number;
  totalAmount: number;
  totalDue: number;
  todayPaid: number;
  lastMonthTotalPaid: number;
}

const DashHomPage = () => {
  const { data, isLoading } = useGetDashboardStaticsDataQuery(undefined);

  // Aggregated Stats across all branches
  const aggregatedStats = useMemo(() => {
    let totalBills = 0;
    let totalPaid = 0;
    let totalDue = 0;
    let todayPaid = 0;
    let lastMonthPaid = 0;
    const branchesCount = data?.data?.branchWiseData?.length || 0;

    data?.data?.branchWiseData?.forEach((item: TBranchStat) => {
      totalBills += Number(item.totalBills) || 0;
      totalPaid += Number(item.totalAmount) || 0;
      totalDue += Number(item.totalDue) || 0;
      todayPaid += Number(item.todayPaid) || 0;
      lastMonthPaid += Number(item.lastMonthTotalPaid) || 0;
    });

    return {
      branchesCount,
      totalBills,
      totalPaid,
      totalDue,
      todayPaid,
      lastMonthPaid,
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50/50">
        <div className="text-center space-y-3">
          <Loader size="md" content="Initializing executive dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-8">
      {/* Executive Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-lg">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl" />
        
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Live Analytics</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Restaurant Group Dashboard
            </h1>
            <p className="max-w-xl text-sm text-slate-300">
              Real-time branch operations, billing statistics, and collection summaries.
            </p>
          </div>
          
          <div className="flex items-center gap-4 border-t border-white/10 pt-4 md:border-0 md:pt-0">
            <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-sm border border-white/10 text-center min-w-32">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Branches</p>
              <p className="mt-1 text-2xl font-black text-indigo-300">{aggregatedStats.branchesCount}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-sm border border-white/10 text-center min-w-36">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Group Bills</p>
              <p className="mt-1 text-2xl font-black text-indigo-300">{aggregatedStats.totalBills}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Group Aggregated Overview */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-slate-500" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Executive Group Summary
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Aggregated Revenue */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Total Paid Collections</p>
                <p className="mt-2 text-2xl font-black text-slate-900">
                  ৳{aggregatedStats.totalPaid.toLocaleString("en-BD")}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Coins className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Aggregated Due */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Total Outstanding Due</p>
                <p className="mt-2 text-2xl font-black text-slate-900">
                  ৳{aggregatedStats.totalDue.toLocaleString("en-BD")}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Aggregated Today */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Today&apos;s Group Collections</p>
                <p className="mt-2 text-2xl font-black text-slate-900">
                  ৳{aggregatedStats.todayPaid.toLocaleString("en-BD")}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Aggregated 30 Days */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Last 30 Days Collections</p>
                <p className="mt-2 text-2xl font-black text-slate-900">
                  ৳{aggregatedStats.lastMonthPaid.toLocaleString("en-BD")}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Branch Breakdown Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-slate-500" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Branchwise Breakdown
          </h2>
        </div>

        <div className="space-y-8">
          {data?.data?.branchWiseData?.map((item: TBranchStat) => (
            <div
              key={item.branchName}
              className="rounded-3xl border border-slate-100 bg-white/40 p-6 shadow-sm backdrop-blur-md space-y-6"
            >
              {/* Branch Title Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {item.branchName}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">Branch operational statistics</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Active</span>
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {/* Total Bills */}
                <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-indigo-500/20 hover:shadow-md transition-all duration-300">
                  <div className="absolute -right-4 -bottom-4 h-12 w-12 rounded-full bg-indigo-50/50 group-hover:scale-150 transition-transform duration-500" />
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors duration-300 group-hover:bg-indigo-600 group-hover:text-white">
                      <Receipt className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Bills</p>
                      <p className="mt-1 text-lg font-black text-slate-900">{item.totalBills}</p>
                    </div>
                  </div>
                </div>

                {/* Total Paid */}
                <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-emerald-500/20 hover:shadow-md transition-all duration-300">
                  <div className="absolute -right-4 -bottom-4 h-12 w-12 rounded-full bg-emerald-50/50 group-hover:scale-150 transition-transform duration-500" />
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                      <Coins className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Paid</p>
                      <p className="mt-1 text-lg font-black text-slate-900">
                        ৳{Number(item.totalAmount || 0).toLocaleString("en-BD")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total Due */}
                <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-rose-500/20 hover:shadow-md transition-all duration-300">
                  <div className="absolute -right-4 -bottom-4 h-12 w-12 rounded-full bg-rose-50/50 group-hover:scale-150 transition-transform duration-500" />
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 transition-colors duration-300 group-hover:bg-rose-600 group-hover:text-white">
                      <AlertCircle className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Due</p>
                      <p className="mt-1 text-lg font-black text-rose-600">
                        ৳{Number(item.totalDue || 0).toLocaleString("en-BD")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Today Paid */}
                <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-blue-500/20 hover:shadow-md transition-all duration-300">
                  <div className="absolute -right-4 -bottom-4 h-12 w-12 rounded-full bg-blue-50/50 group-hover:scale-150 transition-transform duration-500" />
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                      <TrendingUp className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Today Paid</p>
                      <p className="mt-1 text-lg font-black text-slate-900">
                        ৳{Number(item.todayPaid || 0).toLocaleString("en-BD")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Last 30 days total paid */}
                <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-violet-500/20 hover:shadow-md transition-all duration-300 sm:col-span-2 md:col-span-1">
                  <div className="absolute -right-4 -bottom-4 h-12 w-12 rounded-full bg-violet-50/50 group-hover:scale-150 transition-transform duration-500" />
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600 transition-colors duration-300 group-hover:bg-violet-600 group-hover:text-white">
                      <Calendar className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Last 30 Days Paid</p>
                      <p className="mt-1 text-lg font-black text-slate-900">
                        ৳{Number(item.lastMonthTotalPaid || 0).toLocaleString("en-BD")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashHomPage;
