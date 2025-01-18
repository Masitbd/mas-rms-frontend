/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Loader } from "rsuite";

import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import { formatDate } from "@/utils/formateDate";
import ReporetHeader from "@/utils/ReporetHeader";
import { createPrintButton } from "@/utils/PrintButton";
import { TBranch } from "./DailySalesSummeryTable";

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
  data: {
    branchInfo: TBranch;
    result: TGroup[];
  };
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
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  const generatePDF = () => {
    const documentDefinition: any = {
      pageOrientation: "landscape",
      defaultStyle: {
        fontSize: 12,
      },
      pageMargins: [20, 20, 20, 20],
      content: [
        // Title
        {
          text: `${data?.branchInfo?.name}`,
          style: "header",
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
        {
          text: `${data?.branchInfo?.address1}`,
          alignment: "center",
          margin: [0, 0, 0, 4],
        },
        {
          text: `Phone: ${data?.branchInfo?.phone}`,
          alignment: "center",
          margin: [0, 0, 0, 4],
        },
        {
          text: `VAT Registration No: ${data?.branchInfo?.vatNo}`,
          style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 8],
        },

        {
          text: `Item Wise Raw Consumption: ${
            formattedStartDate === formattedEndDate
              ? formattedStartDate
              : `from ${formattedStartDate} to ${formattedEndDate}`
          }`,
          style: "subheader",
          alignment: "center",
          color: "red",
          italic: true,
          margin: [10, 0, 0, 20],
        },

        // Table Header for Item Details
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*"], // Adjust column widths
            body: [
              [
                { text: "Code", bold: true, alignment: "center" },
                { text: "Item Name", bold: true, alignment: "center" },
                { text: "QTY", bold: true, alignment: "center" },
                { text: "Rate/Unit", bold: true, alignment: "center" },
                { text: "Total Amount", bold: true, alignment: "center" },
              ],
              // Data rows for items
              ...data?.result?.map((group) =>
                [
                  group?.itemCode || "N/A",
                  group?.itemName || "N/A",
                  group?.totalItemQty || 0,
                  group?.itemRate || "N/A",
                  group?.totalAmount || 0,
                ].map((text) => ({ text, alignment: "center" }))
              ),
            ],
          },
        },

        // Consumptions (if any) under each item
        ...data?.result?.map((group) =>
          group?.consumptions?.length > 0
            ? [
                {
                  table: {
                    headerRows: 1,
                    widths: ["*", "*", "*", "*", "*"], // Adjust column widths
                    body: [
                      ...group?.consumptions?.map((consumption) =>
                        [
                          consumption.rawMaterialId || "N/A",
                          consumption.rawMaterialName || "N/A",
                          consumption.totalQty || "N/A",
                          `${consumption.rate || "N/A"} / ${
                            consumption.unit || "N/A"
                          }`,
                          consumption.totalPrice || "N/A",
                        ].map((text) => ({ text, alignment: "center" }))
                      ),
                    ],
                  },
                },
              ]
            : []
        ),

        // Grand Total Summary
        {
          table: {
            widths: [80, "*", 60, 60, 60],
            body: [
              [
                { text: "Grand Total", bold: true, alignment: "center" },
                data?.result?.reduce((acc, item) => acc + item.totalItemQty, 0),
                "",
                "",
                data?.result?.reduce((acc, item) => acc + item.totalAmount, 0),
              ].map((text) => ({ text, alignment: "center" })),
            ],
          },
          margin: [0, 10, 0, 0],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          italics: true,
        },
      },
    };

    pdfMake.createPdf(documentDefinition).print();
  };

  return (
    <div className="p-5">
      <ReporetHeader
        data={data}
        name="Item Wise Raw Consumption"
        startDate={startDate}
        endDate={endDate}
      />

      {createPrintButton(generatePDF)}

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
        ) : data?.result?.length > 0 ? (
          data?.result?.map((group, groupIndex) => (
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
            {data?.result?.reduce(
              (acc: any, item: { totalItemQty: any }) =>
                acc + item.totalItemQty,
              0
            )}
          </p>
          <p></p>
          <p>
            {data?.result?.reduce(
              (acc: any, item: { totalAmount: any }) => acc + item.totalAmount,
              0
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItemWiseRawConTable;
