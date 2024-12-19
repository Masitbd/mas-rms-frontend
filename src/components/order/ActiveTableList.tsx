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
  console.log(tableData);

  const DummyData = [
    {
      billNo: "R2412036",
      orderId: "675efef14d6bb82c000e254a",
      table: {
        _id: "674a991f41dc716d6e81af03",
        tid: "788",
        name: "Sample Table",
        details: "Reserved for group",
        createdAt: "2024-12-01T12:30:00.000Z",
        updatedAt: "2024-12-01T12:35:00.000Z",
      },
      waiter: {
        _id: "674a9b9aafe8820917dc529g",
        uid: "002",
        name: "John Doe",
        remarks: "Special request for fast service",
        createdAt: "2024-12-01T12:20:00.000Z",
        updatedAt: "2024-12-01T12:25:00.000Z",
      },
    },
    {
      billNo: "R2412037",
      orderId: "675efef14d6bb82c000e254b",
      table: {
        _id: "674a991f41dc716d6e81af04",
        tid: "789",
        name: "Corner Booth",
        details: "Near the window",
        createdAt: "2024-12-01T13:00:00.000Z",
        updatedAt: "2024-12-01T13:05:00.000Z",
      },
      waiter: {
        _id: "674a9b9aafe8820917dc529h",
        uid: "003",
        name: "Jane Smith",
        remarks: "Vegetarian customer",
        createdAt: "2024-12-01T12:50:00.000Z",
        updatedAt: "2024-12-01T12:55:00.000Z",
      },
    },
    {
      billNo: "R2412038",
      orderId: "675efef14d6bb82c000e254c",
      table: {
        _id: "674a991f41dc716d6e81af05",
        tid: "790",
        name: "VIP Table",
        details: "Reserved for special guests",
        createdAt: "2024-12-01T14:00:00.000Z",
        updatedAt: "2024-12-01T14:10:00.000Z",
      },
      waiter: {
        _id: "674a9b9aafe8820917dc529i",
        uid: "004",
        name: "Robert Johnson",
        remarks: "Request for wine pairing suggestions",
        createdAt: "2024-12-01T13:45:00.000Z",
        updatedAt: "2024-12-01T13:50:00.000Z",
      },
    },
    {
      billNo: "R2412039",
      orderId: "675efef14d6bb82c000e254d",
      table: {
        _id: "674a991f41dc716d6e81af06",
        tid: "791",
        name: "Family Table",
        details: "High chair needed",
        createdAt: "2024-12-01T15:00:00.000Z",
        updatedAt: "2024-12-01T15:05:00.000Z",
      },
      waiter: {
        _id: "674a9b9aafe8820917dc529j",
        uid: "005",
        name: "Emily Davis",
        remarks: "Birthday celebration setup",
        createdAt: "2024-12-01T14:45:00.000Z",
        updatedAt: "2024-12-01T14:50:00.000Z",
      },
    },
    {
      billNo: "R2412040",
      orderId: "675efef14d6bb82c000e254e",
      table: {
        _id: "674a991f41dc716d6e81af07",
        tid: "792",
        name: "Outdoor Patio",
        details: "Requires umbrella",
        createdAt: "2024-12-01T16:00:00.000Z",
        updatedAt: "2024-12-01T16:10:00.000Z",
      },
      waiter: {
        _id: "674a9b9aafe8820917dc529k",
        uid: "006",
        name: "Michael Brown",
        remarks: "Customer prefers iced drinks",
        createdAt: "2024-12-01T15:30:00.000Z",
        updatedAt: "2024-12-01T15:35:00.000Z",
      },
    },
  ];

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
          Object.keys(tableData?.data).map((data) => {
            const t = tableData?.data[data];

            return (
              <>
                <Link href={`/order/new?mode=update&id=${t?.orderId}`}>
                  <div className="relative border border-[#DCDCDC] p-2 rounded-md bg-white group overflow-hidden cursor-pointer">
                    <div className="relative w-full h-[100px]">
                      <Image
                        src={TableImage}
                        height={200}
                        width={200}
                        className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
                      />
                      {/* Text overlay */}
                      <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 text-white transition-opacity duration-300 ease-in-out group-hover:bg-opacity-70 p-2">
                        <h3 className="font-roboto text-sm font-semibold">
                          Table ID: {t.table.tid}
                        </h3>
                        <h3 className="font-roboto text-sm font-semibold">
                          Bill No.: {t.billNo}
                        </h3>
                        <h3 className="font-roboto text-sm font-semibold">
                          Waiter: {t.waiter.name}
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
