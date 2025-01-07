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
          text: `Raw Materials Consumption: ${
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
            widths: ["*", "*", "*", "*"],
            body: [
              // Define the header row
              [
                { text: "Item Name", bold: true, alignment: "center" },
                { text: "QTY", bold: true, alignment: "center" },
                { text: "Rate/Unit", bold: true, alignment: "center" },
                { text: "Amount", bold: true, alignment: "center" },
              ],
              // Define the data rows
              ...data?.result?.map((item) =>
                [
                  {
                    text: item.rawMaterialName || "N/A",
                    alignment: "center",
                    style: "dataStyle",
                  },
                  {
                    text: item.totalQty?.toString() || "0",
                    alignment: "center",
                    style: "dataStyle",
                  },
                  {
                    text: `${item.rate?.toFixed(2) || "0.00"} ${
                      item.unit || ""
                    }`,
                    alignment: "center",
                    style: "dataStyle",
                  },
                  {
                    text: item.totalPrice?.toFixed(2) || "0.00",
                    alignment: "center",
                    style: "dataStyle",
                  },
                ].map((text) => ({ text, alignment: "center" }))
              ),
            ],
          },
          // Use predefined border styles
        },

        {
          table: {
            widths: ["*", "*", "*", "*"],
            body: [
              [
                { text: "Grand Total", bold: true, alignment: "center" },
                data.result?.reduce(
                  (acc: number, item: any) => acc + item.totalQty,
                  0
                ),
                data.result?.reduce(
                  (acc: number, item: any) => acc + item.rate,
                  0
                ),
                data.result?.reduce(
                  (acc: number, item: any) => acc + item.totalPrice,
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
        <div className="grid grid-cols-4 bg-gray-100 font-semibold text-center p-2">
          <div>Item Name</div>
          <div>QTY </div>
          <div>Rate/Unit </div>
          <div>Amount </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : data?.result?.length > 0 ? (
          data?.result?.map((record, recordIndex) => (
            <div
              key={recordIndex}
              className="grid grid-cols-4 text-center p-2 border-b"
            >
              <div>{record.rawMaterialName || "N/A"}</div>
              <div>{record.totalQty}</div>
              <div className="flex gap-4 justify-center">
                <p>{record.rate?.toFixed(2) || 0}</p>
                <p>{record.unit}</p>
              </div>
              <div>{record.totalPrice}</div>
            </div>
          ))
        ) : (
          <p className="text-center mt-10 text-xl text-red-500">
            No Data Found
          </p>
        )}

        <div className="grid grid-cols-4 text-center font-semibold text-lg p-2 ">
          <p className="text-violet-700">Grand Total</p>
          <p>
            {data.result?.reduce(
              (acc: number, item: any) => acc + item.totalQty,
              0
            )}
          </p>

          <p>
            {data.result?.reduce(
              (acc: number, item: any) => acc + item.rate,
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

      {/* <button
          onClick={generatePDF}
          className="bg-blue-600 px-3 py-2 rounded-md text-white font-semibold mt-4"
        >
          Print
        </button> */}
    </div>
  );
};

export default RawmaterialsConsupmtionTable;
