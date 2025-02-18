"use client";
import React from "react";
import SingleOrder from "../../[id]/page";
import Cancellation from "@/components/orderCancellation/Cancellation";
import CancellationStatus from "@/components/orderCancellation/CancellationStatus";

const OrderCancellation = ({ params }: { params: { id: string } }) => {
  return (
    <div className="max-w-7xl mx-auto">
      <div>
        <SingleOrder params={{ id: params?.id }} />
      </div>
      <div className="-mt-28 mb-5">
        <Cancellation params={{ id: params?.id }} />
      </div>
    </div>
  );
};

export default OrderCancellation;
