import { ENUM_MODE } from "@/enums/EnumMode";
import { SetStateAction } from "react";
import {
  IRawMaterial,
  RawMaterialFormValues,
} from "../raw-material-setup/TypesAndDefault";
import { Schema } from "rsuite";

export interface IMenuItemTableProps {
  mode: string;
  setMode: React.Dispatch<SetStateAction<ENUM_MODE>>;
  formData: IMenuItemConsumption;
  setFormData: React.Dispatch<SetStateAction<IMenuItemConsumption>>;
}
export type IItemConsumption<T = IRawMaterial | string> = T extends IRawMaterial
  ? { item: IRawMaterial; qty: number }
  : { item: string; qty: number };

export interface IMenuItemConsumption {
  _id?: string;
  id: string;
  rate: number;
  itemGroup: string;
  cookingTime: number;
  itemCategory: string;
  isDiscount: boolean;
  discount: number;
  isVat: boolean;
  isWaiterTips: boolean;
  itemName: string;
  itemCode: string;
  description: string;
  consumptions: IItemConsumption[];
  discount?: number;
  waiterTip?: number;
}

export const defaultMenuItemConsumption = {
  id: "",
  isDiscount: true,
  isVat: true,
  isWaiterTips: true,
  consumptions: [],
};

export type MenuItemFormProps = IMenuItemTableProps;

export type ConsumptionListProps = IMenuItemTableProps & {
  isOpen: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  updatableData?: IItemConsumption<IRawMaterial>;
  setUpdatableData?: React.Dispatch<
    SetStateAction<IItemConsumption<IRawMaterial>>
  >;
};

const { StringType, NumberType, BooleanType } = Schema.Types;

export const formModel = Schema.Model({
  id: StringType().isRequired("ID is required."),
  rate: NumberType("Rate must be a number").isRequired("Rate is required."),
  itemGroup: StringType().isRequired("Item Group is required."),
  cookingTime: NumberType().isRequired("Cooking Time is required."),
  itemCategory: StringType().isRequired("Item Category is required."),
  itemName: StringType().isRequired("Item Name is required."),
  itemCode: StringType().isRequired("Item Code is required."),
  description: StringType(),
  isDiscount: BooleanType(),
  isVat: BooleanType(),
  isWaiterTips: BooleanType(),
});
