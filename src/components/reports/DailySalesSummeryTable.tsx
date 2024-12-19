"use client";

import React from "react";

type TDailyStatementSummary = {
  _id: {
    date: string; // ISO date format
  };
  totalBill: number;
  totalVat: number;
  totalGuest: number;
  totalDiscount: number;
  tSChargse: number;
  metPayable: number;
  totalDue: number;
  totalPaid: number;
};

type TPaymentModeSummary = {
  _id: string; // e.g., "cash", "bank"
  total: number;
}[];

type TTotal = {
  _id: null | string;
  grandTotalGuest: number;
  grandTotalPaid: number;
  grandTotalVat: number;
  grandTotalBill: number;
  grandTotalDiscount: number;
  grandTotalScharge: number;
  grandTotalPayable: number;
  grandTotalDue: number;
};

type TGroup = {
  dateWiseSummary: TDailyStatementSummary[];
  total: TTotal;
  paymentModeSummary: TPaymentModeSummary;
};

type TDailySalesSummery = {
  data: TGroup[];
  startDate: Date | null;
  endDate: Date | null;
}

const DailySalesSummeryTable: React.FC<TDailySalesSummery> = ({
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
        <div className="grid grid-cols-8 bg-gray-100 font-semibold text-center p-2">
          <div>Bill Date</div>

          <div>Guest </div>

          <div>Total Bill</div>
          <div>Total Vat</div>
          <div>T S Charge</div>

          <div>Net Payable</div>
          <div>Due</div>
          <div>Paid</div>
        </div>

        {/* Payment Types */}
        {data?.[0]?.dateWiseSummary?.map((paymentGroup, paymentIndex) => (
          <div
            key={paymentIndex}
            className="grid grid-cols-8 text-center p-2 border-b"
          >
            <div className="text-green-600 font-semibold">
              {paymentGroup._id.date}
            </div>

            <div>{paymentGroup.totalGuest || 0}</div>

            <div>{paymentGroup.totalBill || 0}</div>
            <div>{paymentGroup.totalVat?.toFixed(2)}</div>

            <div>{paymentGroup.tSChargse || 0}</div>

            <div>{paymentGroup.metPayable?.toFixed(2) || 0}</div>
            <div>{paymentGroup.totalDue || 0}</div>
            <div>{paymentGroup.totalPaid || 0}</div>
          </div>
        ))}

        <div className="grid grid-cols-8 border-b font-bold text-center">
          <div>Total Sales Amount</div>
          <div>{data?.[0]?.total?.grandTotalGuest}</div>
          <div>{data?.[0]?.total?.grandTotalBill}</div>
          <div>{data?.[0]?.total?.grandTotalVat?.toFixed(2)}</div>
          <div>{data?.[0]?.total?.grandTotalScharge?.toFixed(2)}</div>
          <div>{data?.[0]?.total?.grandTotalPayable}</div>
          <div>{data?.[0]?.total?.grandTotalDue}</div>
          <div>{data?.[0]?.total?.grandTotalPaid}</div>
        </div>
      </div>

      {/* <button
        onClick={generatePDF}
        className="bg-blue-600 px-3 py-2 rounded-md text-white font-semibold mt-4"
      >
        Print
      </button> */}

      <div className="mt-10 w-full max-w-3xl mx-auto border">
        <h1 className="text-lg font-bold p-2  border bg-gray-200 text-red-700">
          Payment Mode
        </h1>
        {data?.[0]?.paymentModeSummary?.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-2 text-center p-2 border-b"
          >
            <div>{item._id}</div>
            <div>{item.total}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailySalesSummeryTable;
