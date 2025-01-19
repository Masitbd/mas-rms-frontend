/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import React from "react";
import { Loader } from "rsuite";
import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import { formatDate } from "@/utils/formateDate";
import { TBranch } from "./DailySalesSummeryTable";
import ReporetHeader from "@/utils/ReporetHeader";
import { createPrintButton } from "@/utils/PrintButton";

type TItemGroups = {
  itemGroup: string;
  granTotalBill: number;
  grandTotalQty: number;
  grandTotalRate: number;
  items: TRecord[];
  branchName: string;
};

type TRecord = {
  code: string;
  name: number;
  quantity: string;
  totalBill: number;
  rate: number;
};

type TGroup = {
  records: TRecord[];
  itemGroups: TItemGroups[];
  menuGroup: string;
};

type TDailySalesSummery = {
  data: { branchInfo: TBranch; result: TGroup[] };
  startDate: Date | null;
  endDate: Date | null;
  isLoading: boolean;
};

const ItemWiseSalesTable: React.FC<TDailySalesSummery> = ({
  data,
  startDate,
  endDate,
  isLoading,
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
          text: `Item Wise Sales Reports: ${
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

        // Data rows for Menu Groups and Items
        ...data?.result?.map((group) => [
          {
            text: group?.menuGroup || "N/A",
            style: "groupHeader",
            margin: [0, 10, 0, 10],
          },

          // Item Group Header Rows
          ...group?.itemGroups?.map((orderItemGroup) => [
            {
              text: orderItemGroup?.itemGroup || "N/A",
              style: "itemGroupHeader",
              margin: [0, 10, 0, 10],
            },

            {
              text: orderItemGroup?.branchName || "N/A",
              style: "itemGroupHeader2",
              margin: [0, 10, 0, 10],
            },


            // Items table rows
            {
              table: {
                headerRows: 1,
                widths: ["*", "*", "*", "*", "*"], // Adjust column widths
                body: [
                  [
                    { text: "Code", bold: true, alignment: "center" },
                    { text: "Item Name", bold: true, alignment: "center" },
                    { text: "Rate", bold: true, alignment: "center" },
                    { text: "Qty", bold: true, alignment: "center" },
                    { text: "Amount", bold: true, alignment: "center" },
                  ],
                  // Map over the items for this group
                  ...orderItemGroup?.items?.map((record) =>
                    [
                      record.code || "N/A",
                      record.name || "N/A",
                      record.rate || 0,
                      record.quantity || 0,
                      record.totalBill || 0,
                    ].map((text) => ({ text, alignment: "center" }))
                  ),
                ],
              },
            },

            // Grand Total Row for this Item Group
            {
              table: {
                widths: ["*", "*", "*", "*", "*"],
                body: [
                  [
                    {
                      text: `${orderItemGroup.itemGroup}`,
                      bold: true,
                      alignment: "center",
                    },
                    { text: "", bold: true, alignment: "right" },
                    orderItemGroup?.grandTotalRate || 0,
                    orderItemGroup?.grandTotalQty || 0,
                    orderItemGroup?.granTotalBill || 0,
                  ].map((text) => ({ text, alignment: "center" })),
                ],
              },
              margin: [0, 10, 0, 20],
            },
          ]),
        ]),

        // Grand Total Summary (Optional)
        {
          table: {
            widths: [80, "*", 60, 60, 60],
            body: [
              [
                { text: "Grand Total", bold: true, alignment: "center" },
                data?.result?.reduce(
                  (acc, group) =>
                    acc +
                    group?.itemGroups?.reduce(
                      (groupAcc, itemGroup) =>
                        groupAcc + itemGroup?.grandTotalQty,
                      0
                    ),
                  0
                ),
                "",
                "",
                data?.result?.reduce(
                  (acc, group) =>
                    acc +
                    group?.itemGroups?.reduce(
                      (groupAcc, itemGroup) =>
                        groupAcc + itemGroup?.granTotalBill,
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
        groupHeader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        itemGroupHeader: {
          fontSize: 14,
          bold: true,
          color: "violet",
          margin: [0, 10, 0, 5],
        },

        itemGroupHeader2: {
          fontSize: 14,
          bold: true,
          color: "blue",
          margin: [0, 10, 0, 5],
        },

      },
    };

    pdfMake.createPdf(documentDefinition).print();
  };

  return (
    <div className="p-5">
      <ReporetHeader
        data={data}
        name="Item Wise Sales Reports"
        startDate={startDate}
        endDate={endDate}
      />

      {createPrintButton(generatePDF)}

      <div className="w-full">
        <div className="grid grid-cols-5 bg-gray-100 font-semibold text-center p-2">
          <div>Code</div>
          <div>Item Name</div>
          <div>QTY </div>
          <div>Rate </div>
          <div>Amount</div>
        </div>
        {isLoading ? (
          <Loader />
        ) : data?.result?.length > 0 ? (
          data?.result?.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-8">
              {/* Group Date Row */}
              <div className="text-lg font-semibold p-2 mb-2 bg-slate-200 mt-2 rounded-md">
                {group.menuGroup}
              </div>
              <div className="text-lg font-semibold p-2 mb-2 bg-slate-200 mt-2 rounded-md">
                {group.menuGroup}
              </div>

              {/* Payment Types */}
              {group?.itemGroups?.map((orderItemGroup, paymentIndex) => (
                <div key={paymentIndex} className="mb-4">
                  {/* Payment Type Header */}
                  <div className="text-lg font-bold p-2 border-b text-teal-700">
                    {orderItemGroup?.branchName}
                  </div>
                  <div className="text-lg font-bold p-2 border-b text-violet-700">
                    {orderItemGroup.itemGroup}
                  </div>

                  {/* Time Periods */}

                  {orderItemGroup?.items?.map((record, recordIndex) => (
                    <div
                      key={recordIndex}
                      className="grid grid-cols-5 text-center p-2 border-b"
                    >
                      <div>{record.code || "N/A"}</div>
                      <div>{record.name}</div>
                      <div>{record.rate || 0}</div>
                      <div>{record.quantity}</div>
                      <div>{record.totalBill || 0}</div>
                    </div>
                  ))}

                  <div className="grid grid-cols-5 font-bold mt-3">
                    <div className="col-span-2 text-end text-violet-600">
                      {orderItemGroup.itemGroup}
                    </div>
                    <div className="text-center">
                      {orderItemGroup.grandTotalRate}
                    </div>
                    <div className="text-center">
                      {orderItemGroup.grandTotalQty}
                    </div>
                    <div className="text-center">
                      {orderItemGroup.granTotalBill}
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
    </div>
  );
};

export default ItemWiseSalesTable;
