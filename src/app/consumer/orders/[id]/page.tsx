"use client";
import {
  useGetSIngleOrderWithDetailsQuery,
  useLazyGetSIngleOrderWithDetailsQuery,
} from "@/redux/api/order/orderSlice";
import React from "react";
import { Divider, Tag } from "rsuite";

const SingleOrder = ({ params }: { params: { id: string } }) => {
  const { isLoading, isFetching, data } = useGetSIngleOrderWithDetailsQuery(
    params?.id,
    { skip: !params?.id }
  );

  return (
    <div className="max-w-7xl mx-auto my-32">
      <div className=" w-full lg:p-6 p-3  rounded-xl border border-[#DCDCDC] bg-white">
        <div className="flex flex-row justify-between">
          <h2 className="text-2xl font-bold ">Order Details</h2>
        </div>
        <div className="mt-6 font-semibold w-full">
          {data?.data?.items?.map((item: any) => {
            return (
              <>
                <div className="flex justify-between f">
                  <h2>
                    {item?.qty} X {item?.item?.itemName}
                  </h2>
                  <h3>{item?.qty * item?.rate}</h3>
                </div>
              </>
            );
          })}

          <Divider />
          <div className="flex justify-between f">
            <h2>Subtotal </h2>
            <h3>{data?.data?.totalBill}</h3>
          </div>
          <div className="flex justify-between f">
            <h2>Vat </h2>
            <h3>{data?.data?.totalVat}</h3>
          </div>
          <div className="flex justify-between f">
            <h2>Delivery </h2>
            <h3>{data?.data?.deliveryCharge}</h3>
          </div>
          <div className="flex justify-between f">
            <h2>Service Charge </h2>
            <h3>{data?.data?.serviceCharge}</h3>
          </div>
          <div className="flex justify-between f">
            <h2>Total Discount </h2>
            <h3 className="text-red-600">{data?.data?.totalDiscount}</h3>
          </div>
        </div>
        <div className="mt-4 ">
          <div className="flex justify-between text-2xl font-bold">
            <div>
              <h2>Total </h2>
              <div className="text-sm font-light">(Incl. fees and tax)</div>
            </div>
            <h3 className="text-[#FC8A06]">{data?.data.netPayable}</h3>
          </div>
        </div>

        <div className="flex w-full justify-between">
          <h2 className="text-2xl font-bold my-5">Order Status</h2>
          <Tag
            color={`${data?.data?.status == "notPosted" ? "red" : "green"}`}
            size="sm"
            className="!h-6"
          >
            {data?.data?.status == "notPosted" ? "Pending" : "Delivered"}
          </Tag>
        </div>
      </div>
    </div>
  );
};

export default SingleOrder;
