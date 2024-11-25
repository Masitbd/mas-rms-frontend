"use client";
import Loading from "@/app/Loading";
import ConsumptionForm from "@/components/menu-item-consumption/ConsumptionForm";
import {
  defaultMenuItemConsumption,
  IItemConsumption,
  IMenuItemConsumption,
  IMenuItemTableProps,
} from "@/components/menu-item-consumption/TypesAndDefault";
import { IRawMaterial } from "@/components/raw-material-setup/TypesAndDefault";
import { ENUM_MODE } from "@/enums/EnumMode";
import {
  useGetConsumptionQuery,
  useLazyGetSingleConsumptionQuery,
} from "@/redux/api/rawMaterialConsumption/rawMaterialConsumption.api";
import React, { useEffect, useState } from "react";

const NewItemConsumptionSetup = ({
  searchParams,
}: {
  searchParams: { mode: string; id: string };
}) => {
  const [formData, setFormData] = useState<IMenuItemConsumption>(
    defaultMenuItemConsumption as unknown as IMenuItemConsumption
  );
  const [mode, setMode] = useState<ENUM_MODE>(searchParams.mode as ENUM_MODE);
  const [getSingle, { isLoading: getLoaing, isFetching: fetchLoading }] =
    useLazyGetSingleConsumptionQuery();

  useEffect(() => {
    if (
      searchParams.mode === ENUM_MODE.UPDATE ||
      searchParams.mode === ENUM_MODE.VIEW
    ) {
      (async function () {
        const data = await getSingle(searchParams.id).unwrap();
        if (data?.success) {
          setFormData(JSON.parse(JSON.stringify(data?.data)));
        }
      })();
    }
  }, []);

  if (getLoaing || fetchLoading) {
    return <Loading />;
  }
  return (
    <div className="shadow-lg bg-[#003CFF05] p-4 m-2">
      <div className="text-center text-[#194BEE] text-2xl font-bold font-roboto">
        {mode === ENUM_MODE.NEW && <h1>New Item Consumption Setup</h1>}
        {mode === ENUM_MODE.UPDATE && <h1>Edit Item Consumption Setup</h1>}
        {mode === ENUM_MODE.VIEW && <h1>View Item Consumption Setup</h1>}
      </div>
      <div className="mt-5">
        <ConsumptionForm
          formData={formData as unknown as IMenuItemConsumption}
          setFormData={setFormData}
          mode={mode}
          setMode={setMode}
        />
      </div>
    </div>
  );
};

export default NewItemConsumptionSetup;
