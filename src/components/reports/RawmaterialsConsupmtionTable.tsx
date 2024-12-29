/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Loader } from "rsuite";

type TRecord = {
  rawMaterialName: string;
  totalQty: number;
  rate: number;
  unit: string;
  totalPrice: number;
};

type TRawmaterialsConsupmtionTable = {
  data: TRecord[];
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
  return (
    <div className="p-5">
      {/* <div className="text-center mb-10 flex flex-col items-center justify-center">
          <div className="text-xl font-bold flex items-center justify-center gap-5 mb-4">
            <Image
              src={comapnyInfo?.data?.photoUrl}
              alt="Header"
              width={50}
              height={50}
            />{" "}
            <p>{comapnyInfo?.data?.name}</p>
          </div>
          <p>{comapnyInfo?.data?.address}</p>
          <p>HelpLine:{comapnyInfo?.data?.phone} (24 Hours Open)</p>
          <p className="italic text-red-600 text-center mb-5 font-semibold">
            Investigation Income Statement : Between{" "}
            {startDate ? formatDateString(startDate) : "N/A"} to{" "}
            {endDate ? formatDateString(endDate) : "N/A"}
          </p>
        </div> */}

      <div className="w-full">
        <div className="grid grid-cols-4 bg-gray-100 font-semibold text-center p-2">
          <div>Item Name</div>
          <div>QTY </div>
          <div>Rate/Unit </div>
          <div>Amount </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : data?.length > 0 ? (
          data?.map((record, recordIndex) => (
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
            {data.reduce((acc: number, item: any) => acc + item.totalQty, 0)}
          </p>

          <p>{data.reduce((acc: number, item: any) => acc + item.rate, 0)}</p>
          <p>
            {data.reduce((acc: number, item: any) => acc + item.totalPrice, 0)}
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
