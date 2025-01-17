/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Loader } from "rsuite";
import pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts";
import { formatDate } from "@/utils/formateDate";
import { TBranch } from "./DailySalesSummeryTable";
import ReporetHeader from "@/utils/ReporetHeader";
import { createPrintButton } from "@/utils/PrintButton";

type TRecord = {
  rawMaterialName: string;
  totalQty: number;
  rate: number;
  unit: string;
  totalPrice: number;
  branch: string;
  itemName: string;
  itemCode: string;
  materials: TRecord[];
};

type TRawmaterialsConsupmtionTable = {
  data: {
    branchInfo: TBranch;
    result: TRecord[];
  };
  isLoading: boolean;
  startDate: Date | null;
  endDate: Date | null;
};

const RawmaterialsConsupmtionTable: React.FC<TRawmaterialsConsupmtionTable> = ({
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
          style: "headerStyle",
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
          style: "subheaderStyle",
          alignment: "center",
          margin: [0, 0, 0, 8],
        },

        {
          text: `Raw Materials Consumption: ${
            formattedStartDate === formattedEndDate
              ? formattedStartDate
              : `from ${formattedStartDate} to ${formattedEndDate}`
          }`,
          style: "subheaderStyle",
          alignment: "center",
          color: "red",
          italic: true,
          margin: [10, 0, 0, 20],
        },

        // Table Header
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*"], // Adjusted column widths
            body: [
              [
                { text: "Code", style: "tableHeader" },
                { text: "Item Name", style: "tableHeader" },
                { text: "QTY", style: "tableHeader" },
                { text: "Rate/Unit", style: "tableHeader" },
                { text: "Total Amount", style: "tableHeader" },
              ],
              // Material Rows
              ...data?.result
                ?.map((group) =>
                  group?.materials?.map((item) => [
                    item?.itemCode || "N/A",
                    item?.itemName || "N/A",
                    item?.totalQty || 0,
                    item?.rate ? `${item.rate} / ${item.unit || "N/A"}` : "N/A",
                    item?.totalPrice || 0,
                  ])
                )
                .flat(), // Flatten the array for table body
            ],
          },
          margin: [0, 10, 0, 10],
        },

        // Grand Total Section
        {
          table: {
            widths: ["*", "*", "*", "*", "*"],
            body: [
              [
                { text: "Grand Total", bold: true, alignment: "center" },
                "", // Empty cell for Item Name column
                data.result?.reduce(
                  (acc: number, group: any) =>
                    acc +
                    group?.materials?.reduce(
                      (subAcc: number, item: any) =>
                        subAcc + (item?.totalQty || 0),
                      0
                    ),
                  0
                ),
                "", // Empty cell for Rate/Unit column
                data.result?.reduce(
                  (acc: number, group: any) =>
                    acc +
                    group?.materials?.reduce(
                      (subAcc: number, item: any) =>
                        subAcc + (item?.totalPrice || 0),
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
        headerStyle: {
          fontSize: 14,
          color: "black",
          bold: true,
        },
        subheaderStyle: {
          fontSize: 12,
          color: "black",
          italic: true,
          alignment: "center",
        },
        tableHeader: {
          fontSize: 12,
          color: "black",
          bold: true,
          alignment: "center",
          fillColor: "#f0f0f0",
        },
        dataStyle: {
          fontSize: 12,
          color: "black",
        },
        grandTotalStyle: {
          fontSize: 14,
          color: "red",
          bold: true,
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
          name="Raw Materials Consumption"
          startDate={startDate}
          endDate={endDate}
        />
      )}
      {createPrintButton(generatePDF)}

      <div className="w-full">
        <div className="grid grid-cols-5 bg-gray-100 font-semibold text-center p-2">
          <div>Code</div>
          <div>Item Name</div>
          <div>QTY</div>
          <div>Rate/Unit</div>
          <div>Total Amount</div>
        </div>
        {isLoading ? (
          <Loader />
        ) : data?.result?.length > 0 ? (
          data?.result?.map((group, groupIndex) => (
            <div key={groupIndex}>
              <div className="text-lg font-bold p-2 border-b text-teal-700">
                {group?.branch}
              </div>

              {/* Materials */}
              {group?.materials?.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 text-center py-3 gap-4 border-b font-semibold text-blue-500"
                >
                  <div>{item?.itemCode || "N/A"}</div>
                  <div>{item?.itemName || "N/A"}</div>
                  <div>{item?.totalQty || 0}</div>
                  <div>
                    {item?.rate
                      ? `${item.rate} / ${item.unit || "N/A"}`
                      : "N/A"}
                  </div>
                  <div>{item?.totalPrice || 0}</div>
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
      <div className="grid grid-cols-5 text-center font-semibold text-lg p-2 ">
        <p className="text-violet-700 col-span-2">Grand Total</p>
        <p>
          {data.result?.reduce(
            (acc: number, item: any) => acc + item.totalQty,
            0
          )}
        </p>

        <p>
          {data.result?.reduce(
            (acc: number, item: any) => acc + item?.rate || 0,
            0
          )}
        </p>
        <p>
          {data.result?.reduce(
            (acc: number, item: any) => acc + item.totalPrice,
            0
          )}
        </p>
      </div>
    </div>
  );
};

export default RawmaterialsConsupmtionTable;
