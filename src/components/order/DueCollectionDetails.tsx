import { IOrder } from "@/redux/features/order/orderSlice";
import React from "react";

const DueCollectionDetails = (props: { order: IOrder }) => {
  return (
    <>
      <div>
        <label className="font-semibold">Bill No: </label>
        <span>{props.order?.billNo}</span>
      </div>
      <div>
        <label className="font-semibold">Bill Date: </label>
        <span>{new Date(props?.order?.date)?.toLocaleDateString()}</span>
      </div>
      <div>
        <label className="font-semibold">Total Amount: </label>
        <span>{props.order?.totalBill}</span>
      </div>
      <div>
        <label className="font-semibold">Net Amount: </label>
        <span>{props.order?.netPayable}</span>
      </div>

      <div>
        <label className="font-semibold">Paid: </label>
        <span className="text-green-600">{props.order?.paid}</span>
      </div>
      <div>
        <label className="font-semibold">Due: </label>
        <span className="font-semibold text-red-600">{props.order?.due}</span>
      </div>
    </>
  );
};

export default DueCollectionDetails;
