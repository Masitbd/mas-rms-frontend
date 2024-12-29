"use client";

import Image from "next/image";
import React from "react";
import { Loader } from "rsuite";

type TItemGroups = {
  itemGroup: string;
  granTotalBill: number;
  grandTotalQty: number;
  grandTotalRate: number;
  items: TRecord[];
};

type TRecord = {
  code: string;
  name: number;
  cookingTime: number;

  rate: number;
};

type TGroup = {
  records: TRecord[];
  itemGroups: TItemGroups[];
  menuGroup: string;
};

type TDailySalesSummery = {
  data: TGroup[];

  isLoading: boolean;
};

const MenuGroupItemTable: React.FC<TDailySalesSummery> = ({
  data,

  isLoading,
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
        <div className="grid grid-cols-4 bg-gray-100 font-semibold text-center p-2">
          <div>Code</div>
          <div>Item Name</div>
          <div>QTY </div>
          <div>Cooking Time </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : data?.length > 0 ? (
          data?.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-8">
              {/* Group Date Row */}
              <div className="text-lg font-semibold p-2 mb-2 bg-slate-200 mt-2 rounded-md">
                {group.menuGroup}
              </div>

              {/* Payment Types */}
              {group?.itemGroups?.map((orderItemGroup, paymentIndex) => (
                <div key={paymentIndex} className="mb-4">
                  {/* Payment Type Header */}
                  <div className="text-lg font-bold p-2 border-b text-violet-700">
                    {orderItemGroup.itemGroup}
                  </div>

                  {/* Time Periods */}

                  {orderItemGroup?.items?.map((record, recordIndex) => (
                    <div
                      key={recordIndex}
                      className="grid grid-cols-4 text-center p-2 border-b"
                    >
                      <div>{record.code || "N/A"}</div>
                      <div>{record.name}</div>
                      <div>{record.rate || 0}</div>
                      <div>{record.cookingTime}</div>
                    </div>
                  ))}

                  <div className="grid grid-cols-4 font-bold mt-3">
                    <div className="col-span-2 text-end text-violet-600">
                      {orderItemGroup.itemGroup}
                    </div>
                    <div className="text-center ">
                      {orderItemGroup?.items?.length}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-center mt-10 text-xl text-red-500">
            No Data Found
          </p>
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

export default MenuGroupItemTable;
