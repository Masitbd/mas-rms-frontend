/* eslint-disable react/no-children-prop */
"use client";

import { NavLink } from "@/components/layout/Navlink";
import OrderTable from "@/components/order/OrderTable";

import React from "react";
import { Button } from "rsuite";

const Order = () => {
  return (
    <div className="shadow-lg bg-[#003CFF05] p-4 m-2">
      <div className="text-center text-[#194BEE] text-2xl font-bold font-roboto">
        Orders
      </div>

      <div className="mt-2.5">
        <OrderTable />
      </div>
    </div>
  );
};

export default Order;
