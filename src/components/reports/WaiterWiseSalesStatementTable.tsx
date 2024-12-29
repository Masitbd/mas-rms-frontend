/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Loader } from "rsuite";
import { TMenuItemConsumptionProps } from "./MenuItemConsumptionTable";
import React from "react";

type TCategory = {
  categoryName: string;
  items: TItem[];
};

type TItem = {
  itemName: string;
  itemCode: string;
  rate: number;
  totalQty: number;
  totalAmount: number;
};

type TGroup = {
  categories: TCategory[];
  items: TItem[];
  waiterName: string;
};

type TReportsTable = {
  data: TGroup[];

  isLoading: boolean;
  startDate: Date | null;
  endDate: Date | null;
};

const WaiterSalesDetailsTable: React.FC<TReportsTable> = ({
  startDate,
  endDate,
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
        <div className="grid grid-cols-5 bg-gray-100 font-semibold text-center p-2">
          <div>Code</div>
          <div>Item Name</div>
          <div>QTY</div>
          <div>Rate </div>
          <div>Amount</div>
        </div>
        {isLoading ? (
          <Loader />
        ) : data?.length > 0 ? (
          data?.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-8">
              <div>
                {group?.waiterName}
                {/* Payment Types */}
                {group?.categories?.map((orderItemGroup, paymentIndex) => (
                  <div key={paymentIndex} className="mb-4">
                    {/* Payment Type Header */}

                    {/* Time Periods */}

                    {orderItemGroup?.items?.map((record, recordIndex) => (
                      <div key={recordIndex} className="border-b p-2">
                        {/* Item Details */}
                        <div className="grid grid-cols-5 border-b text-neutral-800 font-semibold bg-gray-50 mb-3 text-center p-2">
                          <div>{record.itemCode || "N/A"}</div>
                          <div>{record.itemName}</div>
                          <div>{record?.totalQty}</div>
                          <div>{record.rate || 0}</div>
                          <div>{record.totalAmount || 0}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-10 text-xl text-red-500">
            No Data Found
          </p>
        )}
      </div>
      <div className="border mx-auto mt-10">
        <div className="grid grid-cols-5  text-lg border-t font-bold text-center text-red-600">
          <p className=" col-span-4">GrandTotal:</p>
          <p className="">
            {data?.reduce(
              (grandTotal: number, waiter: { categories: any[] }) =>
                grandTotal +
                waiter.categories.reduce(
                  (categoryTotal: number, category: { items: any[] }) =>
                    categoryTotal +
                    category.items.reduce(
                      (itemTotal: number, item: { totalAmount: number }) =>
                        itemTotal + item.totalAmount,
                      0
                    ),
                  0
                ),
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

export default WaiterSalesDetailsTable;
