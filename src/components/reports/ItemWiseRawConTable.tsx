/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Loader } from "rsuite";

import React, { ReactNode } from "react";
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
  itemCode?: string;
  itemName?: string;
  totalItemQty?: number;
  totalAmount?: number;
};

type TMaterials = {
  itemCode: string;
  itemName: string;
  itemRate: number;

  totalItemQty: number;
  totalAmount: number;
  consumptions: TConsumption[];
};

type TGroup = {
  branch: string;
  materials: TMaterials[];
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

        // Loop through each group (branch) and add its details
        ...data?.result?.map((group) => [
          // Branch info
          {
            text: `Branch: ${group?.branch}`,
            style: "subheader",
            alignment: "left",
            margin: [0, 10, 0, 5],
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
                // Data rows for items in the current branch
                ...group?.materials?.map((material) =>
                  [
                    material?.itemCode || "N/A",
                    material?.itemName || "N/A",
                    material?.totalItemQty || 0,
                    material?.itemRate || "N/A",
                    material?.totalItemQty * material?.itemRate || 0,
                  ].map((text) => ({ text, alignment: "center" }))
                ),
              ],
            },
          },

          // Materials section (materials & consumptions)
          ...group?.materials?.map((material) => [
            {
              text: `Material: ${material?.itemName}`,
              style: "subheader",
              alignment: "left",
              margin: [0, 10, 0, 5],
            },
            {
              table: {
                widths: ["*", "*", "*", "*"],
                body: [
                  [
                    {
                      text: "Consumption Qty",
                      bold: true,
                      alignment: "center",
                    },
                    {
                      text: "Consumption Price",
                      bold: true,
                      alignment: "center",
                    },
                    { text: "Total Qty", bold: true, alignment: "center" },
                    { text: "Total Price", bold: true, alignment: "center" },
                  ],
                  ...material?.consumptions?.map((consumption) =>
                    [
                      consumption?.totalQty || "N/A",
                      consumption?.totalPrice || "N/A",
                      consumption?.totalQty || "N/A",
                      consumption?.totalPrice || "N/A",
                    ].map((text) => ({ text, alignment: "center" }))
                  ),
                ],
              },
            },
          ]),
        ]),

        {
          table: {
            widths: [80, "*", 60, 60, 60],
            body: [
              [
                { text: "Grand Total", bold: true, alignment: "center" },

                data?.result?.reduce(
                  (acc: any, group: any) =>
                    acc +
                    group?.materials?.reduce(
                      (materialAcc: any, item: { totalItemQty: any }) =>
                        materialAcc + item.totalItemQty,
                      0
                    ),
                  0
                ),
                "",
                "",
                data?.result?.reduce(
                  (acc: any, group: any) =>
                    acc +
                    group?.materials?.reduce(
                      (materialAcc: any, item: { totalAmount: any }) =>
                        materialAcc + item.totalAmount,
                      0
                    ),
                  0
                ),
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
              <div className="text-lg font-semibold p-2 mb-2 bg-slate-200 mt-2 rounded-md">
                {group.branch}
              </div>

              {group?.materials?.map((items, index) => (
                <div key={index + 1}>
                  <div className="grid grid-cols-5 text-center py-3 gap-4 border-b font-semibold text-blue-500">
                    <div>{items.itemCode}</div>
                    <div>{items.itemName}</div>
                    <div>{items.totalItemQty}</div>
                    <div>{items.itemRate}</div>
                    <div>{items.totalAmount}</div>
                  </div>
                  {items?.consumptions?.length > 0 && (
                    <div className=" ">
                      {items?.consumptions?.map(
                        (consumption, consumptionIndex) => (
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
                            <div className="">
                              {consumption.totalQty || "N/A"}
                            </div>
                            <div className="">
                              {consumption.rate || "N/A"} {""} / {""}
                              {consumption.unit || "N/A"}
                            </div>
                            <div className="">
                              {consumption.totalPrice || "N/A"}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Time Periods */}
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
            {
              data?.result?.reduce(
                (acc: any, item: any) =>
                  (acc + item.totalItemQty, 0) as unknown as TGroup
              ) as unknown as ReactNode
            }
          </p>
          <p></p>
          <p>
            {
              data?.result?.reduce(
                (acc: any, item: any) => acc + item.totalAmount,
                0
              ) as unknown as ReactNode
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItemWiseRawConTable;
