/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Loader } from "rsuite";
import { TMenuItemConsumptionProps } from "./MenuItemConsumptionTable";
import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import { formatDate } from "@/utils/formateDate";
import { TBranch } from "./DailySalesSummeryTable";
import ReporetHeader from "@/utils/ReporetHeader";
import { createPrintButton } from "@/utils/PrintButton";

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

const WaiterSalesDetailsTable: React.FC<TReportsTable> = ({
  startDate,
  endDate,
  data,
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
        // Header Section
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
          alignment: "center",
          margin: [0, 0, 0, 8],
        },
        {
          text: "Waiter Wise Sales Reports Details",
          style: "subheader",
          alignment: "center",
          color: "red",
          italic: true,
          margin: [10, 0, 0, 20],
        },

        // Data Section
        ...data?.result?.map((group) => {
          const groupContent = [
            // Menu Group Header
            {
              text: group.branchName,
              style: "groupHeader2",
              margin: [0, 10, 0, 5],
            },
            {
              text: group.waiterName,
              style: "groupHeader",
              margin: [0, 10, 0, 5],
            },

            // Item Groups
            ...group?.categories?.map((itemGroup) => [
              {
                text: itemGroup.categoryName,
                style: "groupHeader3",
                margin: [0, 10, 0, 5],
              },
              {
                table: {
                  headerRows: 1,
                  widths: ["*", "*", "*", "*", "*"],
                  body: [
                    // Table Headers
                    [
                      { text: "Code", style: "tableHeader" },
                      { text: "Item Name", style: "tableHeader" },
                      { text: "QTY", style: "tableHeader" },
                      { text: "Rate", style: "tableHeader" },
                      { text: "Amount", style: "tableHeader" },
                    ],
                    // Items Rows
                    ...itemGroup?.items?.map((item) => [
                      item.itemCode || "N/A",
                      item.itemName,
                      item.totalQty || 0,
                      item.rate || 0,
                      item.totalAmount || 0,
                    ]),
                  ],
                },

                margin: [0, 0, 0, 10],
              },
            ]),
          ];

          return groupContent;
        }),

        // Grand Total Section
        {
          table: {
            widths: ["*", "*", "*", "*", "*"],
            body: [
              [
                {
                  text: "",
                  alignment: "center",
                  style: "grandTotalLabel",
                },
                {
                  text: "",
                  alignment: "center",
                  style: "grandTotalLabel",
                },
                {
                  text: "",
                  alignment: "center",
                  style: "grandTotalLabel",
                },
                {
                  text: "Grand Total:",
                  alignment: "center",
                  style: "grandTotalLabel",
                },
                {
                  text: `${data?.result?.reduce(
                    (grandTotal: number, waiter: { categories: any[] }) =>
                      grandTotal +
                      waiter.categories.reduce(
                        (categoryTotal: number, category: { items: any[] }) =>
                          categoryTotal +
                          category.items.reduce(
                            (
                              itemTotal: number,
                              item: { totalAmount: number }
                            ) => itemTotal + item.totalAmount,
                            0
                          ),
                        0
                      ),
                    0
                  )}`,
                  alignment: "center",
                  style: "grandTotalValue",
                },
              ],
            ],
          },
          layout: "lightHorizontalLines",
          margin: [0, 10, 0, 10],
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
        },
        groupHeader2: {
          fontSize: 16,
          bold: true,
          color: "teal",
        },
        groupHeader3: {
          fontSize: 16,
          bold: true,
          color: "blue",
        },
        itemGroupHeader: {
          fontSize: 14,
          bold: true,
        },
        tableHeader: {
          bold: true,
          fillColor: "#eeeeee",
        },
        consumptionHeader: {
          italics: true,
          margin: [0, 5, 0, 5],
        },
        groupTotal: {
          bold: true,
          color: "red",
        },
        grandTotalHeader: {
          fontSize: 16,
          bold: true,
        },
        grandTotalValue: {
          fontSize: 16,
          color: "red",
          bold: true,
        },
        menuGroupStyle: {
          color: "purple",
          bold: true,
          fontSize: 12,
        },
        consumptionStyle: {
          color: "black",
          fontSize: 12,
        },
        grandTotalLabel: {
          color: "red",
          bold: true,
          fontSize: 14,
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
          name="Waiter Wise Sales Reports Details"
          endDate={endDate}
          startDate={startDate}
        />
      )}
      {createPrintButton(generatePDF)}

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
        ) : data?.result?.length > 0 ? (
          data?.result?.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-8">
              <div>
                <p className="text-teal-700 font-bold my-2">
                  {group?.branchName}
                </p>
                <p className="p-1 bg-gray-100 rounded">{group?.waiterName}</p>
                {/* Payment Types */}
                {group?.categories?.map((orderItemGroup, paymentIndex) => (
                  <div key={paymentIndex} className="mb-4">
                    {/* Payment Type Header */}
                    <p className="text-violet-700 font-bold my-2">
                      {orderItemGroup?.categoryName}
                    </p>
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
            {data?.result?.reduce(
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
    </div>
  );
};

export default WaiterSalesDetailsTable;
