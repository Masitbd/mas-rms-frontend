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
};

export const rawMaterialSetupFormmodel = Schema.Model({
  id: StringType().isRequired("ID is required."),
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
export const MaterialFakeData = [
  {
    _id: "63bff0e15a1f1a0001a12b34",
    id: "RM001",
    baseUnit: "GRAM",
    materialName: "Aluminum Powder",
    superUnit: "KG",
    rate: 50.25,
    conversion: 1000,
    description: "High purity aluminum powder for manufacturing.",
  },
  {
    _id: "63bff0e15a1f1a0001a12b35",
    id: "RM002",
    baseUnit: "LITER",
    materialName: "Liquid Silicon",
    superUnit: "GALLON",
    rate: 120.75,
    conversion: 3.785,
    description: "Silicon in liquid form used for coatings.",
  },
  {
    _id: "63bff0e15a1f1a0001a12b36",
    id: "RM003",
    baseUnit: "GRAM",
    materialName: "Copper Granules",
    superUnit: "KG",
    rate: 35.1,
    conversion: 1000,
    description: "Copper granules suitable for electronics manufacturing.",
  },
  {
    _id: "63bff0e15a1f1a0001a12b37",
    id: "RM004",
    baseUnit: "GRAM",
    materialName: "Zinc Dust",
    superUnit: "KG",
    rate: 22.5,
    conversion: 1000,
    description: "Zinc dust used as a reducing agent in various applications.",
  },
  {
    _id: "63bff0e15a1f1a0001a12b38",
    id: "RM005",
    baseUnit: "ML",
    materialName: "Synthetic Oil",
    superUnit: "LITER",
    rate: 75.3,
    conversion: 1000,
    description: "Synthetic oil with high viscosity.",
  },
  {
    _id: "63bff0e15a1f1a0001a12b39",
    id: "RM006",
    baseUnit: "GRAM",
    materialName: "Carbon Black",
    superUnit: "KG",
    rate: 40.0,
    conversion: 1000,
    description: "Carbon black powder for pigmentation.",
  },
  {
    _id: "63bff0e15a1f1a0001a12b3a",
    id: "RM007",
    baseUnit: "GRAM",
    materialName: "Nickel Powder",
    superUnit: "KG",
    rate: 60.0,
    conversion: 1000,
    description: "Nickel powder used in metallurgical processes.",
  },
  {
    _id: "63bff0e15a1f1a0001a12b3b",
    id: "RM008",
    baseUnit: "ML",
    materialName: "Acrylic Binder",
    superUnit: "LITER",
    rate: 45.0,
    conversion: 1000,
    description: "Acrylic binder for paint and coating applications.",
  },
  {
    _id: "63bff0e15a1f1a0001a12b3c",
    id: "RM009",
    baseUnit: "GRAM",
    materialName: "Iron Oxide",
    superUnit: "KG",
    rate: 30.0,
    conversion: 1000,
    description: "Iron oxide used as a pigment in industrial paints.",
  },
  {
    _id: "63bff0e15a1f1a0001a12b3d",
    id: "RM010",
    baseUnit: "LITER",
    materialName: "Isopropyl Alcohol",
    superUnit: "GALLON",
    rate: 20.5,
    conversion: 3.785,
    description: "High-purity isopropyl alcohol for industrial cleaning.",
  },
];
