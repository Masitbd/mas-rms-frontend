/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Loader } from "rsuite";

import React from "react";

type TGroup = {
  totalAmount: number;
  name: string;
};

type TReportsTable = {
  data: TGroup[];
  isLoading: boolean;
  startDate: Date | null;
  endDate: Date | null;
};

const WaiterWiseSalesTable: React.FC<TReportsTable> = ({ data, isLoading }) => {
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
        <div className="grid grid-cols-2 bg-gray-100 font-semibold text-center p-2">
          <div>Name</div>
          <div>Total Amount</div>
        </div>
        {isLoading ? (
          <Loader />
        ) : data?.length > 0 ? (
          data?.map((group, groupIndex) => (
            <div
              className="grid grid-cols-2 border-b text-neutral-800 font-semibold bg-gray-50 mb-3 text-center p-2"
              key={groupIndex}
            >
              <div>{group.name}</div>
              <div>{group.totalAmount}</div>
            </div>
          ))
        ) : (
          <p className="text-center mt-10 text-xl text-red-500">
            No Data Found
          </p>
        )}
      </div>
      <div className="border w-[500px] mx-auto mt-10">
        <div className="grid grid-cols-2 text-center text-lg border-t font-bold text-red-600">
          <p className="">GrandTotal:</p>
          <p>
            {data?.reduce(
              (acc: any, item: { totalAmount: any }) => acc + item.totalAmount,
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

export default WaiterWiseSalesTable;
