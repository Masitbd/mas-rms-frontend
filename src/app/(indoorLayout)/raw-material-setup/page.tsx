"use client";
import RawMaterialForm from "@/components/raw-material-setup/RawMaterialForm";
import RawMaterialTable from "@/components/raw-material-setup/RawMaterialTable";
import { rawMaterialDefaultValue } from "@/components/raw-material-setup/TypesAndDefault";
import { ENUM_MODE } from "@/enums/EnumMode";
import React, { useState } from "react";

const RawMaterialSetup = () => {
  const [formData, setFormData] = useState(rawMaterialDefaultValue);
  const [mode, setMode] = useState(ENUM_MODE.NEW);
  return (
    <div className="shadow-lg bg-[#003CFF05] p-4 m-2">
      <div className="text-center text-[#194BEE] text-2xl font-bold font-roboto">
        Raw Materials Setup
      </div>
      <div className="mt-5">
        <RawMaterialForm
          formData={formData}
          setFormData={setFormData}
          mode={mode}
          setMode={setMode}
        />
      </div>

      <div className="mt-5">
        <RawMaterialTable
          formData={formData}
          setFormData={setFormData}
          mode={mode}
          setMode={setMode}
        />
      </div>
    </div>
  );
};

export default RawMaterialSetup;
