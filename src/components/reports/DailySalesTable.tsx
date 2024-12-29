"use client";

import Image from "next/image";
import React from "react";

type TPaymentGroup = {
  paymentType: string;
  timePeriods: {
    timePeriod: string;
    records: TRecord[];
  }[];
};

type TRecord = {
  billNo: string;
  guest: number;
  pMode: string;
  totalBill: number;
  totalVat: number;
  discount: number;
  pPayment: number;
  metPayable: number;
  due?: number;
  paid: number;
  date: string;
  tSChargse: number;
  table: string;
};

type TGroup = {
  records: TRecord[];
  paymentGroups: TPaymentGroup[];
  groupDate: string;
};

type TDailySalesSummery = {
  data: TGroup[];
  startDate: Date | null;
  endDate: Date | null;
};

const DailySalesTable: React.FC<TDailySalesSummery> = ({
  data,
  startDate,
  endDate,
}) => {
  return (
    <div className="p-5">
      {/* <div className="text-center mb-10 flex flex-col items-center justify-center">
        <div className="text-xl font-bold flex items-center justify-center gap-5 mb-4">
          <Image
            src={comapnyInfo?.data?.photoUrl}
            alt="Header"
            width={50}
            height={50}
          />{" "}
          <p>{comapnyInfo?.data?.name}</p>
        </div>
        <p>{comapnyInfo?.data?.address}</p>
        <p>HelpLine:{comapnyInfo?.data?.phone} (24 Hours Open)</p>
        <p className="italic text-red-600 text-center mb-5 font-semibold">
          Investigation Income Statement : Between{" "}
          {startDate ? formatDateString(startDate) : "N/A"} to{" "}
          {endDate ? formatDateString(endDate) : "N/A"}
        </p>
      </div> */}

      <div className="w-full">
        <div className="grid grid-cols-10 bg-gray-100 font-semibold text-center p-2">
          <div>Bill No</div>
          <div>Table</div>
          <div>Guest </div>
          <div>Payment Mode </div>
          <div>Total Bill</div>
          <div>Total Vat</div>
          <div>T S Charge</div>
          <div>Discount</div>
          <div>P Payment</div>
          <div>Net Payable</div>
        </div>
        {data?.length > 0 ? (
          data.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-8">
              {/* Group Date Row */}
              <div className="text-lg font-semibold p-2 mb-2">
                {group.groupDate}
              </div>

              {/* Payment Types */}
              {group.paymentGroups.map((paymentGroup, paymentIndex) => (
                <div key={paymentIndex} className="mb-4">
                  {/* Payment Type Header */}
                  <div
                    className={`text-md font-medium p-2 ${
                      paymentGroup?.paymentType === "Due"
                        ? "text-red-600"
                        : "text-green-600"
                    } `}
                  >
                    {paymentGroup.paymentType}
                  </div>

                  {/* Time Periods */}
                  {paymentGroup.timePeriods.map((timePeriod, timeIndex) => (
                    <div key={timeIndex} className="mb-4">
                      {/* Time Period Header */}
                      <div className="text-lg font-semibold p-2 bg-gray-300 ">
                        {timePeriod.timePeriod}
                      </div>

                      {/* Records Table */}
                      <div className="w-full border-t">
                        {/* Table Header */}

                        {/* Records Rows */}
                        {timePeriod.records.map((record, recordIndex) => (
                          <div
                            key={recordIndex}
                            className="grid grid-cols-10 text-center p-2 border-b"
                          >
                            <div>{record.billNo || "N/A"}</div>
                            <div>{record.table}</div>
                            <div>{record.guest || 0}</div>
                            <div>{record.pMode}</div>
                            <div>{record.totalBill || 0}</div>
                            <div>{record.totalVat.toFixed(2)}</div>

                            <div>{record.tSChargse || 0}</div>
                            <div>{record.discount || 0}</div>
                            <div>{record.pPayment || 0}</div>
                            <div>{record.metPayable.toFixed(2) || 0}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-center mt-10 text-xl">No Data Found</p>
        )}
      </div>

      {/* <button
        onClick={generatePDF}
        className="bg-blue-600 px-3 py-2 rounded-md text-white font-semibold mt-4"
      >
        Print
      </button> */}
    </div>
  );
};

export default DailySalesTable;
