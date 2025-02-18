"use client";
import IndoorCancellationDetails from "@/components/orderCancellation/IndoorCancelltionDetails";
import React from "react";

const CancellationSingle = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <IndoorCancellationDetails id={params?.id} />
    </div>
  );
};

export default CancellationSingle;
