/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Loader } from "rsuite";
import { TMenuItemConsumptionProps } from "./MenuItemConsumptionTable";
import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import { formatDate } from "@/utils/formateDate";
import ReporetHeader from "@/utils/ReporetHeader";
import { createPrintButton } from "@/utils/PrintButton";

const MenuItemsCostingTable: React.FC<TMenuItemConsumptionProps> = ({
  data,
  isLoading,
}) => {
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
          text: "Menu Item Consumption Costing",
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
              text: group.menuGroup,
              style: "groupHeader",
              margin: [0, 10, 0, 5],
            },

            // Item Groups
            ...group?.itemGroups?.map((itemGroup) => [
              // Item Group Header
              {
                text: itemGroup.itemGroup,
                style: "itemGroupHeader",
                margin: [0, 5, 0, 5],
              },

              // Items
              {
                table: {
                  headerRows: 1,
                  widths: ["*", "*", "*", "*"],
                  body: [
                    // Table Headers
                    [
                      { text: "Code", style: "tableHeader" },
                      { text: "Item Name", style: "tableHeader" },
                      { text: "Rate", style: "tableHeader" },
                      { text: "Cooking Time", style: "tableHeader" },
                    ],
                    // Items Rows
                    ...itemGroup?.items?.map((item) => [
                      item.code || "N/A",
                      item.name,
                      item.rate || 0,
                      item.cookingTime || "N/A",
                    ]),
                  ],
                },

                margin: [0, 0, 0, 10],
              },

              // Consumptions
              ...itemGroup?.items?.map((item) => {
                if (!item.consumptions?.length) return null;
                return [
                  {
                    text: `Consumptions for ${item.name}`,
                    style: "consumptionHeader",
                    margin: [0, 5, 0, 5],
                  },
                  {
                    table: {
                      widths: ["*", "*", "*"],
                      body: [
                        // Table Headers
                        [
                          { text: "Material Name", style: "tableHeader" },
                          { text: "Rate", style: "tableHeader" },
                          { text: "Base Unit", style: "tableHeader" },
                        ],
                        // Consumption Rows
                        ...item.consumptions.map((consumption) => [
                          consumption.materialName || "N/A",
                          consumption.rate || 0,
                          consumption.baseUnit || "N/A",
                        ]),
                      ],
                    },
                  },
                ];
              }),
            ]),

            // Menu Group Total Consumption
            {
              text: `${group.menuGroup}: ${group.menuGroupTotalConsumption}`,
              style: "groupTotal",
              alignment: "center",

              margin: [0, 10, 0, 0],
            },
          ];

          return groupContent;
        }),

        // Grand Total Section
        {
          table: {
            widths: ["*", "*"],
            body: [
              ...data?.result?.map((item) => [
                {
                  text: item.menuGroup,
                  alignment: "center",
                  style: "menuGroupStyle",
                },
                {
                  text: item.menuGroupTotalConsumption,
                  alignment: "center",
                  style: "consumptionStyle",
                },
              ]),
              [
                {
                  text: "Grand Total:",
                  alignment: "center",
                  style: "grandTotalLabel",
                },
                {
                  text: `${data?.result?.reduce(
                    (acc, item) => acc + item.menuGroupTotalConsumption,
                    0
                  )}`,
                  alignment: "center",
                  style: "grandTotalValue",
                },
              ],
            ],
          },
          layout: "noBorders",
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
          color: "green",
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
        <ReporetHeader data={data} name="Menu Item Costing" />
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
              <div className="text-lg font-semibold p-2 mb-2 bg-slate-200 mt-2 rounded-md">
                {group.menuGroup}
              </div>

              {/* Payment Types */}
              {group?.itemGroups?.map((orderItemGroup, paymentIndex) => (
                <div key={paymentIndex} className="mb-4">
                  {/* Payment Type Header */}
                  <div className="text-lg font-bold p-2 border-b text-violet-700">
                    {orderItemGroup.itemGroup}
                  </div>

                  {/* Time Periods */}

                  {orderItemGroup?.items?.map((record, recordIndex) => (
                    <div key={recordIndex} className="border-b p-2">
                      {/* Item Details */}
                      <div className="grid grid-cols-4 border-b text-neutral-800 font-semibold bg-gray-50 mb-3 text-center p-2">
                        <div>{record.code || "N/A"}</div>
                        <div>{record.name}</div>
                        <div>{record.rate || 0}</div>
                        <div>{record?.cookingTime}</div>
                      </div>

                      {/* Consumption Details */}
                      {record.consumptions?.length > 0 && (
                        <div className=" ">
                          {record.consumptions.map(
                            (consumption, consumptionIndex) => (
                              <div
                                key={consumptionIndex}
                                className="grid grid-cols-4 text-sm  border-b text-center py-1"
                              >
                                <div className="col-span-2">
                                  {consumption.materialName || "N/A"}
                                </div>

                                <div className="flex gap-5 justify-center text-left">
                                  <p className="flex-1">
                                    {consumption.qty || 0}
                                  </p>
                                  <p className="flex-1">
                                    {consumption.baseUnit || "N/A"}
                                  </p>
                                  <p className="flex-1">
                                    @ {consumption.rate || "N/A"}
                                  </p>
                                  <p className="flex-1 font-semibold">
                                    {consumption.price || "N/A"}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                          <div className="grid grid-cols-4 pe-5 text-lg border-b text-gray-800 font-bold  text-end bg-white py-2">
                            <p className="col-span-3 ">
                              TK {record?.totalCosting}
                            </p>
                          </div>
                          <div className="grid grid-cols-4 text-red-600 font-semibold  text-center bg-white py-2">
                            <p className="col-span-2 ">{record?.name}</p>
                            <p>{record.consumptions?.length}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="grid grid-cols-4 font-bold text-violet-600 mt-3">
                    <div className="col-span-2 text-end ">
                      {group.menuGroup}
                    </div>
                    <div className="text-center ">
                      {group?.menuGroupTotalConsumption}
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
      <div className="border w-[500px] mx-auto mt-10">
        {data?.result?.map((item: any) => (
          <div
            key={item.menuGroup}
            className="grid grid-cols-2 justify-items-center  text-purple-700 font-semibold mx-auto py-2"
          >
            <p>{item.menuGroup}</p>
            <p>{item.menuGroupTotalConsumption}</p>
          </div>
        ))}

        <div className="grid grid-cols-2 text-center text-lg border-t font-bold text-red-600">
          <p className="">GrandTotal:</p>
          <p>
            {data?.result?.reduce(
              (acc: any, item: { menuGroupTotalConsumption: any }) =>
                acc + item.menuGroupTotalConsumption,
              0
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenuItemsCostingTable;
