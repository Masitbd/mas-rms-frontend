/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Loader } from "rsuite";
import { TMenuItemConsumptionProps } from "./MenuItemConsumptionTable";
import React from "react";

type TGroup = {
  date: string;
  totalBills: number;
  totalVat: number;
  totalSCharge: number;
  totalDiscount: number;
  totalGuests: number;
  totalDue: number;
};

export type TReportsTable = {
  data: TGroup[];
  isLoading: boolean;
  startDate: Date | null;
  endDate: Date | null;
};

const DueSalesTable: React.FC<TReportsTable> = ({ data, isLoading }) => {
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
        <div className="grid grid-cols-7     bg-gray-100 font-semibold text-center p-2">
          <div>Bill Date </div>
          <div>Total Guest </div>
          <div>Total Bill </div>
          <div>Vat </div>
          <div>S.Charge </div>
          <div>Discount </div>
          <div>Due </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          data?.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="grid grid-cols-7 border-b text-neutral-800 font-semibold bg-gray-50 mb-3 text-center p-2"
            >
              <div>{group.date || "N/A"}</div>
              <div>{group.totalGuests}</div>
              <div>{group.totalBills || 0}</div>
              <div>{group.totalVat || 0}</div>
              <div>{group.totalSCharge || 0}</div>
              <div>{group?.totalDiscount}</div>
              <div>{group?.totalDue}</div>
            </div>
          ))
        )}
      </div>
      <div className="border mx-auto mt-10">
        <div className="grid grid-cols-7 text-center text-lg border-t font-bold text-red-600 py-3">
          <p className="col-span-2">GrandTotal:</p>
          <p>
            {data?.reduce(
              (acc: any, item: { totalBills: number }) => acc + item.totalBills,
              0
            )}
          </p>
          <p>
            {data?.reduce(
              (acc: any, item: { totalVat: number }) => acc + item.totalVat,
              0
            )}
          </p>
          <p></p>
          <p>
            {data?.reduce(
              (acc: any, item: { totalSCharge: number }) =>
                acc + item.totalSCharge,
              0
            )}
          </p>
          <p>
            {data?.reduce(
              (acc: any, item: { totalDue: number }) => acc + item.totalDue,
              0
            )}
          </p>
        </div>
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

export default DueSalesTable;
