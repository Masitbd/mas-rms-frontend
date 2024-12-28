import { ENUM_MODE } from "@/enums/EnumMode";
import React, { SetStateAction } from "react";
import { Schema } from "rsuite";

const { StringType, NumberType } = Schema.Types;
export interface RawMaterialFormValues {
  id: string;
  baseUnit: string;
  materialName: string;
  superUnit: string;
  rate?: number;
  conversion: number;
  description?: string;
}

export const rawMaterialDefaultValue: RawMaterialFormValues = {
  id: "",
  baseUnit: "GRAM",
  materialName: "",
  superUnit: "KG",
  conversion: 1000,
  rate: 0,
  description: "",
};

export const rawMaterialSetupFormmodel = Schema.Model({
  baseUnit: StringType().isRequired("Base Unit is required."),
  materialName: StringType().isRequired("Material Name is required."),
  superUnit: StringType().isRequired("Super Unit is required."),
  rate: NumberType().isRequired("Rate/Base Unit is required."),
  conversion: NumberType().isRequired("Conversion is required."),
  description: StringType(), // Optional field
});

export type IRawMaterial = {
  _id: string;
  id: string;
  baseUnit: string;
  materialName: string;
  superUnit: string;
  rate?: number;
  conversion: number;
  description?: string;
};

export interface IMaterialFormProps {
  mode: string;
  setMode: React.Dispatch<SetStateAction<ENUM_MODE>>;
  formData: RawMaterialFormValues;
  setFormData: React.Dispatch<SetStateAction<RawMaterialFormValues>>;
}

export type IMaterialTableProps = IMaterialFormProps;
