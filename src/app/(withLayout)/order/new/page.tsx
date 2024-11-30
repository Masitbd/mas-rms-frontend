"use client";
import React from "react";

import ActiveTable from "@/components/order/ActiveTable";
import BillMaster from "@/components/order/BillMaster";
import CashMaster from "@/components/order/CashMaster";
import Items from "@/components/order/Items";

const NewOrder = () => {
  return (
    <div className="bg-[#FAFBFF]">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-9 grid grid-cols-1 gap-2 h-[60vh]">
          <CashMaster />

          <div className="w-full">
            <Items />
          </div>
        </div>
        <div className="col-span-3 h-[60vh]">
          <ActiveTable />
        </div>
        <div className="col-span-12 h-[30vh]">
          <BillMaster />
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
