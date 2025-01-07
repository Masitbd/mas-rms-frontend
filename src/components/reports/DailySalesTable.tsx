/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { formatDate } from "@/utils/formateDate";
import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import React from "react";
import { TBranch } from "./DailySalesSummeryTable";
import ReporetHeader from "@/utils/ReporetHeader";

type TPaymentGroup = {
  paymentType: string;
  timePeriods: {
    timePeriod: string;
    records: TRecord[];
  }[];
};

type TRecord = {
  billNo: string;
  guest: number;
  pMode: string;
  totalBill: number;
  totalVat: number;
  discount: number;
  pPayment: number;
  metPayable: number;
  due?: number;
  paid: number;
  date: string;
  tSChargse: number;
  table: string;
};

type TGroup = {
  records: TRecord[];
  paymentGroups: TPaymentGroup[];
  groupDate: string;
};

type TDailySalesSummery = {
  data: {
    branchInfo: TBranch;
    result: TGroup[];
  };
  startDate: Date | null;
  endDate: Date | null;
};

const DailySalesTable: React.FC<TDailySalesSummery> = ({
  data,
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
          text: `Daily Sales Report: ${
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

        ...data?.result?.map((group) => [
          {
            text: `Group Date: ${group.groupDate}`,
            style: "subheader",
            margin: [0, 10, 0, 5],
          },
          ...group.paymentGroups.map((paymentGroup) => [
            {
              text: `Payment Type: ${paymentGroup.paymentType}`,
              style: "subheader",
              margin: [0, 10, 0, 5],
              color: paymentGroup?.paymentType === "Due" ? "red" : "green",
            },
            ...paymentGroup.timePeriods.map((timePeriod) => [
              {
                text: `Time Period: ${timePeriod.timePeriod}`,
                style: "subheader",
                margin: [0, 10, 0, 5],
                background: "#eeeeee",
              },
              {
                table: {
                  headerRows: 1,
                  widths: ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
                  body: [
                    [
                      { text: "Bill No", bold: true, alignment: "center" },
                      { text: "Table", bold: true, alignment: "center" },
                      { text: "Guest", bold: true, alignment: "center" },
                      { text: "Payment Mode", bold: true, alignment: "center" },
                      { text: "Total Bill", bold: true, alignment: "center" },
                      { text: "Total VAT", bold: true, alignment: "center" },
                      {
                        text: "Service Charges",
                        bold: true,
                        alignment: "center",
                      },
                      { text: "Discount", bold: true, alignment: "center" },
                      {
                        text: "Partial Payment",
                        bold: true,
                        alignment: "center",
                      },
                      { text: "Net Payable", bold: true, alignment: "center" },
                    ],
                    ...timePeriod.records.map((record) => [
                      { text: record.billNo || "N/A", alignment: "center" },
                      { text: record.table || "N/A", alignment: "center" },
                      { text: record.guest || 0, alignment: "center" },
                      { text: record.pMode || "N/A", alignment: "center" },
                      { text: record.totalBill || 0, alignment: "center" },
                      {
                        text: record.totalVat?.toFixed(2) || "0.00",
                        alignment: "center",
                      },
                      { text: record.tSChargse || 0, alignment: "center" },
                      { text: record.discount || 0, alignment: "center" },
                      { text: record.pPayment || 0, alignment: "center" },
                      {
                        text: record.metPayable?.toFixed(2) || "0.00",
                        alignment: "center",
                      },
                    ]),
                  ],
                },
                margin: [0, 5, 0, 5],
              },
            ]),
          ]),
        ]),
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
        name="Daily Sales Report "
        startDate={startDate}
        endDate={endDate}
      />

      <div className="flex justify-end">
        <button
          onClick={generatePDF}
          className="bg-blue-600 w-28 px-3 py-2 rounded-md text-white font-semibold my-4 "
        >
          Print
        </button>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-10 bg-gray-100 font-semibold text-center p-2">
          <div>Bill No</div>
          <div>Table</div>
          <div>Guest </div>
          <div>Payment Mode </div>
          <div>Total Bill</div>
          <div>Total Vat</div>
          <div>T S Charge</div>
          <div>Discount</div>
          <div>P Payment</div>
          <div>Net Payable</div>
        </div>
        {data?.result?.length > 0 ? (
          data.result?.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-8">
              {/* Group Date Row */}
              <div className="text-lg font-semibold p-2 mb-2">
                {group.groupDate}
              </div>

              {/* Payment Types */}
              {group.paymentGroups.map((paymentGroup, paymentIndex) => (
                <div key={paymentIndex} className="mb-4">
                  {/* Payment Type Header */}
                  <div
                    className={`text-md font-medium p-2 ${
                      paymentGroup?.paymentType === "Due"
                        ? "text-red-600"
                        : "text-green-600"
                    } `}
                  >
                    {paymentGroup.paymentType}
                  </div>

                  {/* Time Periods */}
                  {paymentGroup.timePeriods.map((timePeriod, timeIndex) => (
                    <div key={timeIndex} className="mb-4">
                      {/* Time Period Header */}
                      <div className="text-lg font-semibold p-2 bg-gray-300 ">
                        {timePeriod.timePeriod}
                      </div>

                      {/* Records Table */}
                      <div className="w-full border-t">
                        {/* Table Header */}

                        {/* Records Rows */}
                        {timePeriod.records.map((record, recordIndex) => (
                          <div
                            key={recordIndex}
                            className="grid grid-cols-10 text-center p-2 border-b"
                          >
                            <div>{record.billNo || "N/A"}</div>
                            <div>{record.table}</div>
                            <div>{record.guest || 0}</div>
                            <div>{record.pMode}</div>
                            <div>{record.totalBill || 0}</div>
                            <div>{record.totalVat.toFixed(2)}</div>

                            <div>{record.tSChargse || 0}</div>
                            <div>{record.discount || 0}</div>
                            <div>{record.pPayment || 0}</div>
                            <div>{record.metPayable.toFixed(2) || 0}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-center mt-10 text-xl">No Data Found</p>
        )}
      </div>
    </div>
  );
};

export default DailySalesTable;
