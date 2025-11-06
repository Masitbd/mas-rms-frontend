import {
  useGetPrintingModeQuery,
  useUpdatePrintingModeMutation,
} from "@/redux/api/printingMode/printingMode.api";
import { Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button, SelectPicker } from "rsuite";
import Swal from "sweetalert2";
import { Row } from "./SettingRow";

const PrintingCard = () => {
  const [printMode, setPrintMode] = useState("a4");
  const { isLoading, data: printingModeData } =
    useGetPrintingModeQuery(undefined);

  useEffect(() => {
    if (!isLoading && printingModeData?.data?.length) {
      console.log(printingModeData);
      setPrintMode(printingModeData?.data[0]?.cashMemoType);
    }
  }, [isLoading, printingModeData]);

  //   Handling updates
  const [update, { isLoading: updateLoading }] =
    useUpdatePrintingModeMutation();
  const changePrintingMode = async () => {
    const data = {
      cashMemoType: printMode,
    };
    try {
      const result = await update(data).unwrap();
      if (result) {
        Swal.fire({
          title: "Success",
          text: "Printing Mode Updated Successfully",
          timer: 1000,
          icon: "success",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: (error ?? "Something Went Wrong") as string,
        timer: 1000,
        icon: "error",
      });
    }
  };
  return (
    <>
      <Row
        label="Mode"
        hint="Choose POS (thermal) for receipt printers or Standard Printer for A4/Letter"
        control={
          <SelectPicker
            value={printMode}
            onChange={(v) => setPrintMode(v as "pos" | "printer")}
            data={[
              { label: "POS (thermal)", value: "pos" },
              { label: "Standard Printer", value: "a4" },
            ]}
            block
            cleanable={false}
          />
        }
      />
      <div className="mt-4">
        <Button
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => changePrintingMode()}
          appearance="primary"
          color="blue"
          loading={updateLoading}
        >
          <Save size={16} /> Apply Changes
        </Button>
      </div>
    </>
  );
};

export default PrintingCard;
