/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Loader } from "rsuite";
import { TMenuItemConsumptionProps } from "./MenuItemConsumptionTable";
import React from "react";

export type TConsumption = {
  rawMaterialName: string;
  rawMaterialId: string;
  rate: number;
  unit: string;
  totalQty: number;
  totalPrice: number;
};

type TGroup = {
  itemCode: string;
  itemName: string;
  itemRate: number;
  totalItemQty: number;
  totalAmount: number;
  consumptions: TConsumption[];
};

type TItemWiseRawConProps = {
  data: TGroup[];
  isLoading: boolean;
  startDate: Date | null;
  endDate: Date | null;
};

const ItemWiseRawConTable: React.FC<TItemWiseRawConProps> = ({
  data,
  isLoading,
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
        <div className="grid grid-cols-5 bg-gray-100 font-semibold text-center p-2">
          <div>Code</div>
          <div>Item Name</div>
          <div>QTY</div>
          <div>Rate/Unit </div>
          <div>Total Amount </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : data?.length > 0 ? (
          data?.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-8">
              <div className="grid grid-cols-5 text-center py-3 gap-4 border-b font-semibold text-blue-500">
                <div>{group.itemCode}</div>
                <div>{group.itemName}</div>
                <div>{group.totalItemQty}</div>
                <div>{group.itemRate}</div>
                <div>{group.totalAmount}</div>
              </div>

              {/* Time Periods */}

              {group?.consumptions?.length > 0 && (
                <div className=" ">
                  {group?.consumptions?.map((consumption, consumptionIndex) => (
                    <div
                      key={consumptionIndex}
                      className="grid grid-cols-5 text-sm  border-b text-center py-1"
                    >
                      <div className="">
                        {consumption.rawMaterialId || "N/A"}
                      </div>
                      <div className="">
                        {consumption.rawMaterialName || "N/A"}
                      </div>
                      <div className="">{consumption.totalQty || "N/A"}</div>
                      <div className="">
                        {consumption.rate || "N/A"} {""} / {""}
                        {consumption.unit || "N/A"}
                      </div>
                      <div className="">{consumption.totalPrice || "N/A"}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center mt-10 text-xl text-red-500">
            No Data Found
          </p>
        )}
      </div>
      <div className="border mx-auto mt-10">
        <div className="grid grid-cols-5 text-center text-lg border-t font-bold text-red-600">
          <p className="col-span-2">GrandTotal:</p>
          <p>
            {data?.reduce(
              (acc: any, item: { totalItemQty: any }) =>
                acc + item.totalItemQty,
              0
            )}
          </p>
          <p></p>
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

export default ItemWiseRawConTable;
