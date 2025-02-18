"use client";
import IndoorOrderCancellation from "@/components/orderCancellation/IndoorOrderCancellation";
import React from "react";

const Cancellation = () => {
  return (
    <div className="shadow-lg bg-[#003CFF05] p-4 m-2">
      <div className="text-center text-[#194BEE] text-2xl font-bold font-roboto">
        Cancellation Requests
      </div>

      <div className="mt-2.5">
        <IndoorOrderCancellation />
      </div>
    </div>
  );
};

export default Cancellation;
