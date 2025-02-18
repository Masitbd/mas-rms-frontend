"use client";
import { NavLink } from "@/components/layout/Navlink";
import RawMaterialConsumptionTable from "@/components/menu-item-consumption/MenuItemConsumptionTable";
import React from "react";
import { Button } from "rsuite";

const Consumption = () => {
  return (
    <div className="shadow-lg bg-[#003CFF05] p-4 m-2">
      <div className="text-center text-[#194BEE] text-2xl font-bold font-roboto">
        Raw Material Consumption
      </div>

      <div className="mt-2.5">
        <RawMaterialConsumptionTable />
      </div>
    </div>
  );
};

export default Consumption;
