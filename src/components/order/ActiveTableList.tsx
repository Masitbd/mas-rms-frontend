import { useGetActiveTableListDetailsQuery } from "@/redux/api/order/orderSlice";
import Image from "next/image";
import React from "react";
import TableImage from "../../assets/Table.jpg";
import Link from "next/link";
import Loading from "@/app/Loading";
import { Loader } from "rsuite";

const ActiveTableList = () => {
  const {
    data: tableData,
    isLoading: tableDataLoading,
    isFetching: tableDataFetching,
  } = useGetActiveTableListDetailsQuery(undefined);

  return (
    <div className="border border-[#DCDCDC] p-2 rounded-md">
      <h2 className="font-roboto text-center font-semibold text-xl w-full">
        Active Tables
      </h2>
      <div className="flex justify-center items-center">
        {tableDataFetching || tableDataFetching ? <Loader size="md" /> : ""}
      </div>
      <div className="grid grid-cols-2 gap-2 my-5">
        {tableData?.data &&
          tableData?.data?.map((data: any) => {
            const t = data;

            return (
              <>
                <Link href={`/order/new?mode=update&id=${t?._id}`}>
                  <div className="relative border border-[#DCDCDC] p-2 rounded-md bg-white group overflow-hidden cursor-pointer">
                    <div className="relative w-full h-[100px]">
                      <Image
                        src={TableImage}
                        height={200}
                        width={200}
                        className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
                        alt="Image"
                      />
                      {/* Text overlay */}
                      <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 text-white transition-opacity duration-300 ease-in-out group-hover:bg-opacity-70 p-2">
                        <h3 className="font-roboto text-sm font-semibold">
                          Table ID: {t?.tableName?.tid}
                        </h3>
                        <h3 className="font-roboto text-sm font-semibold">
                          Bill No.: {t?.billNo}
                        </h3>
                        <h3 className="font-roboto text-sm font-semibold">
                          Waiter: {t?.waiter?.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              </>
            );
          })}
      </div>
    </div>
  );
};

export default ActiveTableList;
