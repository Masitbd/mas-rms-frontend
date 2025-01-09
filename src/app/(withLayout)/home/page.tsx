"use client";

import { useGetDashboardStaticsDataQuery } from "@/redux/api/report/report.api";

const DashHomPage = () => {
  const { data, isLoading } = useGetDashboardStaticsDataQuery(undefined);

  return (
    <div>
      <div>
        {data?.data?.branchWiseData?.map((item: any, index: number) => (
          <div key={index}>
            <h1 className="my-16 text-2xl text-blue-600 font-bold text-center ">
              {item.branchName}
            </h1>
            <div className="grid grid-cols-5 gap-5 text-center">
              <div className="bg-[#6200ff45] p-5 rounded-lg w-52 text-slate-800 text-xl">
                <p>Total Bills</p>
                <p className="font-semibold my-3 text-blue-600 text-xl">
                  {item.totalBills}
                </p>
              </div>
              <div className="bg-[#d5d7d845] p-5 rounded-lg w-52 text-slate-800 text-xl">
                <p>Total Paid</p>
                <p className="font-semibold my-3 text-blue-600 text-xl">
                  {item.totalAmount}
                </p>
              </div>

              <div className="bg-[#efaa8c45] p-5 rounded-lg w-52 text-slate-800 text-xl">
                <p>Total Due</p>
                <p className="font-semibold my-3 text-red-600 text-xl">
                  {item.totalDue}
                </p>
              </div>
              <div className="bg-[#23f52745] p-5 rounded-lg w-52 text-neutral-800 text-xl">
                <p>Today Paid</p>
                <p className="font-semibold my-3 text-blue-600 text-xl">
                  {item.todayPaid}
                </p>
              </div>

              <div className="bg-[#f5f52745] p-5 rounded-lg w-52 text-neutral-800 text-xl">
                <p>Last 30 dasy total paid</p>
                <p className="font-semibold my-3 text-red-600 text-xl">
                  {item.lastMonthTotalPaid}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashHomPage;
