/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Loader } from "rsuite";

import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import { formatDate } from "@/utils/formateDate";
import { TBranch } from "./DailySalesSummeryTable";
import ReporetHeader from "@/utils/ReporetHeader";
import { createPrintButton } from "@/utils/PrintButton";

type TGroup = {
  totalAmount: number;
  waiterName: string;
  branchName: string;
};

type TReportsTable = {
  data: {
    branchInfo: TBranch;
    result: TGroup[];
  };
  isLoading: boolean;
  startDate: Date | null;
  endDate: Date | null;
};

const WaiterWiseSalesTable: React.FC<TReportsTable> = ({
  data,
  isLoading,
  startDate,
  endDate,
}) => {
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  const generatePDF = () => {
    const documentDefinition: any = {
      pageOrientation: "portrait",
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
          text: `Waiter Wise Sales Reports: ${
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

        // Table Header
        {
          table: {
            headerRows: 1,
            widths: ["*", "*"],
            body: [
              // Define the header row
              [
                { text: "Name", bold: true, alignment: "center" },
                { text: "Total Amount", bold: true, alignment: "center" },
              ],
              // Define the data rows
              ...data?.result?.map((paymentGroup) =>
                [
                  paymentGroup?.waiterName || "N/A",
                  paymentGroup?.totalAmount || 0,
                ].map((text) => ({ text, alignment: "center" }))
              ),
            ],
          },
          // Use predefined border styles
        },

        // Total Summary
        {
          table: {
            widths: ["*", "*"],
            body: [
              [
                { text: "Grand Total", bold: true, alignment: "center" },
                //
                data?.result?.reduce(
                  (acc: any, item: { totalAmount: any }) =>
                    acc + item.totalAmount,
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
        tableHeader: {
          bold: true,
          fillColor: "#eeeeee",
          alignment: "center",
        },
      },
    };

    pdfMake.createPdf(documentDefinition).print();
  };

  return (
    <div className="p-5">
      {data?.result?.length > 0 && (
        <ReporetHeader
          data={data}
          name="Waiter Wise Sales Reports "
          startDate={startDate}
          endDate={endDate}
        />
      )}
      {createPrintButton(generatePDF)}

      <div className="w-full">
        <div className="grid grid-cols-3 bg-gray-100 font-semibold text-center p-2">
          <div>Branch</div>
          <div>Name</div>
          <div>Total Amount</div>
        </div>
        {isLoading ? (
          <Loader />
        ) : data?.result?.length > 0 ? (
          data?.result?.map((group, groupIndex) => (
            <div
              className="grid grid-cols-3 border-b text-neutral-800 font-semibold bg-gray-50 mb-3 text-center p-2"
              key={groupIndex}
            >
              <div>{group.branchName}</div>
              <div>{group.waiterName}</div>
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

export default WaiterWiseSalesTable;
