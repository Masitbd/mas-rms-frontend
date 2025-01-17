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
};

type TRecord = {
  code: string;
  name: number;
  cookingTime: number;

  rate: number;
};

type TGroup = {
  records: TRecord[];
  menuGroups: { menuGroup: string; itemGroups: TItemGroups[] }[];
  itemGroups: TItemGroups[];

  branch: string;
};

type TDailySalesSummery = {
  data: {
    branchInfo: TBranch;
    result: TGroup[];
  };

  isLoading: boolean;
};

const MenuGroupItemTable: React.FC<TDailySalesSummery> = ({
  data,

  isLoading,
}) => {
  // console.log(data, "menu greoup");

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
          text: `${data?.branchInfo?.name || "Branch Name"}`,
          style: "header",
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
        {
          text: `${data?.branchInfo?.address1 || "Address not available"}`,
          alignment: "center",
          margin: [0, 0, 0, 4],
        },
        {
          text: `Phone: ${data?.branchInfo?.phone || "Phone not available"}`,
          alignment: "center",
          margin: [0, 0, 0, 4],
        },
        {
          text: `VAT Registration No: ${data?.branchInfo?.vatNo || "N/A"}`,
          style: "subheader",
          alignment: "center",
          margin: [0, 0, 0, 8],
        },

        {
          text: "Menu Group Item",
          style: "subheader",
          alignment: "center",
          color: "red",
          italic: true,
          margin: [10, 0, 0, 20],
        },

        // Data rows for Menu Groups and Items
        ...data?.result?.map((group) => [
          {
            text: group?.branch || "N/A",
            style: "groupHeader",
            margin: [0, 10, 0, 10],
          },

          // Loop through Menu Groups
          ...group?.menuGroups?.map((menuGroup) => [
            {
              text: menuGroup?.menuGroup || "N/A",
              style: "itemGroupHeader",
              margin: [0, 10, 0, 10],
            },

            // Loop through Item Groups
            ...menuGroup?.itemGroups?.map((orderItemGroup) => [
              {
                text: orderItemGroup?.itemGroup || "N/A",
                style: "itemGroupHeader",
                margin: [0, 10, 0, 10],
              },

              // Items table rows
              {
                table: {
                  headerRows: 1,
                  widths: ["*", "*", "*", "*"],
                  body: [
                    [
                      { text: "Code", bold: true, alignment: "center" },
                      { text: "Item Name", bold: true, alignment: "center" },
                      { text: "Rate", bold: true, alignment: "center" },
                      { text: "Cooking Time", bold: true, alignment: "center" },
                    ],
                    // Map over the items for this group
                    ...orderItemGroup?.items?.map((record) =>
                      [
                        record.code || "N/A",
                        record.name || "N/A",
                        record.rate || 0,
                        record.cookingTime || "N/A",
                      ].map((text) => ({ text, alignment: "center" }))
                    ),
                  ],
                },
              },

              // Grand Total Row for this Item Group
              {
                table: {
                  widths: ["*", "*", "*", "*"],
                  body: [
                    [
                      {
                        text: `${orderItemGroup.itemGroup}`,
                        bold: true,
                        alignment: "center",
                      },
                      { text: "", bold: true, alignment: "right" },
                      orderItemGroup?.items?.length || 0,
                      { text: "", bold: true, alignment: "right" },
                    ].map((text) => ({ text, alignment: "center" })),
                  ],
                },
                margin: [0, 10, 0, 20],
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
      },
    };

    pdfMake.createPdf(documentDefinition).print();
  };

  return (
    <div className="p-5">
      {data?.result?.length > 0 && (
        <ReporetHeader data={data} name="Menu group Item" />
      )}
      {createPrintButton(generatePDF)}
      <div className="w-full">
        <div className="grid grid-cols-4 bg-gray-100 font-semibold text-center p-2">
          <div>Code</div>
          <div>Item Name</div>
          <div>Rate </div>
          <div>Cooking Time </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : data?.result?.length > 0 ? (
          data?.result?.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-8">
              {/* Group Date Row */}
              <div className="text-lg font-semibold p-2 mb-2 bg-blue-50 text-blue-500 mt-2 rounded-md">
                {group.branch}
              </div>

              {/* Menu Groups */}
              {group?.menuGroups?.map((mGroup, mGroupIndex) => (
                <div
                  key={mGroupIndex}
                  className="text-lg font-semibold p-2 mb-2 bg-slate-200 mt-2 rounded-md"
                >
                  {mGroup.menuGroup}
                </div>
              ))}

              {/* Payment Types */}
              {group?.menuGroups?.map((mGroup, mGroupIndex) =>
                mGroup?.itemGroups?.map((orderItemGroup, paymentIndex) => (
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
                ))
              )}
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

export default MenuGroupItemTable;
