/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Loader } from "rsuite";
import { TMenuItemConsumptionProps } from "./MenuItemConsumptionTable";
import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import { formatDate } from "@/utils/formateDate";
import { TBranch } from "./DailySalesSummeryTable";
import { createPrintButton } from "@/utils/PrintButton";
import ReporetHeader from "@/utils/ReporetHeader";

type TGroup = {
  date: string;
  totalBills: number;
  totalVat: number;
  totalSCharge: number;
  totalDiscount: number;
  totalGuests: number;
  totalDue: number;
  branchName: string;
};

export type TReportsTable = {
  data: {
    branchInfo: TBranch;
    result: TGroup[];
  };
  isLoading: boolean;
  startDate: Date | null;
  endDate: Date | null;
};

const DueSalesTable: React.FC<TReportsTable> = ({
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
          text: `Sales Due Reports : ${
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
            widths: ["*", "*", "*", "*", "*", "*", "*", "*"],
            body: [
              [
                { text: "Branch", bold: true, alignment: "center" },
                { text: "Bill Date", bold: true, alignment: "center" },
                { text: "Total Guest", bold: true, alignment: "center" },
                { text: "Total Bill", bold: true, alignment: "center" },
                { text: "Vat", bold: true, alignment: "center" },
                { text: "S.Charge", bold: true, alignment: "center" },
                { text: "Discount", bold: true, alignment: "center" },
                { text: "Due", bold: true, alignment: "center" },
              ],
              // Define the data rows
              ...data?.result?.map((group) =>
                [
                  group.branchName || "N/A",
                  group.date || "N/A",
                  group.totalGuests || 0,
                  group.totalBills || 0,
                  group.totalVat || 0,
                  group.totalSCharge || 0,
                  group.totalDiscount || 0,
                  group.totalDue || 0,
                ].map((text) => ({ text, alignment: "center" }))
              ),
            ],
          },
        },

        // Total Summary
        {
          table: {
            widths: ["*", "*", "*", "*", "*", "*", "*"],
            body: [
              [
                { text: "Total Sales Amount", bold: true, alignment: "center" },
                data?.result?.reduce((acc, item) => acc + item.totalGuests, 0),
                data?.result?.reduce((acc, item) => acc + item.totalBills, 0),
                data?.result
                  ?.reduce((acc, item) => acc + item.totalVat, 0)
                  .toFixed(2),
                data?.result
                  ?.reduce((acc, item) => acc + item.totalSCharge, 0)
                  .toFixed(2),
                data?.result
                  ?.reduce((acc, item) => acc + item.totalDiscount, 0)
                  .toFixed(2),
                data?.result
                  ?.reduce((acc, item) => acc + item.totalDue, 0)
                  .toFixed(2),
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
      <ReporetHeader
        data={data}
        name="Sales Due Reports  "
        startDate={startDate}
        endDate={endDate}
      />

      {createPrintButton(generatePDF)}

      <div className="w-full">
        <div className="grid grid-cols-8     bg-gray-100 font-semibold text-center p-2">
          <div>Branch </div>
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
        ) : data?.result?.length > 0 ? (
          data?.result?.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="grid grid-cols-8 border-b text-neutral-800 font-semibold bg-gray-50 mb-3 text-center p-2"
            >
              <div>{group.branchName || "N/A"}</div>
              <div>{group.date || "N/A"}</div>
              <div>{group.totalGuests}</div>
              <div>{group.totalBills || 0}</div>
              <div>{group.totalVat || 0}</div>
              <div>{group.totalSCharge || 0}</div>
              <div>{group?.totalDiscount}</div>
              <div>{group?.totalDue}</div>
            </div>
          ))
        ) : (
          <p className="text-center mt-10 text-xl text-red-500">
            No Data Found
          </p>
        )}
      </div>
      <div className="border mx-auto mt-10">
        <div className="grid grid-cols-7 text-center text-lg border-t font-bold text-red-600 py-3">
          <p>GrandTotal:</p>
          <p>
            {data?.result?.reduce(
              (acc: any, item: { totalGuests: number }) =>
                acc + item.totalGuests,
              0
            )}
          </p>
          <p>
            {data?.result?.reduce(
              (acc: any, item: { totalBills: number }) => acc + item.totalBills,
              0
            )}
          </p>
          <p>
            {data?.result?.reduce(
              (acc: any, item: { totalVat: number }) => acc + item.totalVat,
              0
            )}
          </p>

          <p>
            {data?.result?.reduce(
              (acc: any, item: { totalSCharge: number }) =>
                acc + item.totalSCharge,
              0
            )}
          </p>
          <p>
            {data?.result?.reduce(
              (acc: any, item: { totalDiscount: number }) =>
                acc + item.totalDiscount,
              0
            )}
          </p>
          <p>
            {data?.result?.reduce(
              (acc: any, item: { totalDue: number }) => acc + item.totalDue,
              0
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DueSalesTable;
