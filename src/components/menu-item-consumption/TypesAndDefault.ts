import { ENUM_MODE } from "@/enums/EnumMode";
import { Dispatch, SetStateAction } from "react";
import {
  IRawMaterial,
  RawMaterialFormValues,
} from "../raw-material-setup/TypesAndDefault";
import { Schema } from "rsuite";
import { TuseDeleteConsumptionImagesMutation } from "@/redux/api/rawMaterialConsumption/rawMaterialConsumption.api";

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
  isVat: boolean;
  isWaiterTips: boolean;
  itemName: string;
  itemCode: string;
  description: string;
  consumptions: IItemConsumption[];
  discount?: number;
  waiterTip?: number;
  images?: TImage;
  code?: string;
  name?: string;
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
  rate: NumberType("Rate must be a number").isRequired("Rate is required."),
  itemGroup: StringType().isRequired("Item Group is required."),
  itemCategory: StringType().isRequired("Item Category is required."),
  itemName: StringType().isRequired("Item Name is required."),
  itemCode: StringType().isRequired("Item Code is required."),
  description: StringType(),
  isDiscount: BooleanType(),
  isVat: BooleanType(),
  isWaiterTips: BooleanType(),
});

export type Image = {
  url: string;
  file?: File;
};

export type ImageUploaderProps = {
  existingImages?: TFIle[];
  onUpdate?: (images: Image[]) => void;
  setImages: Dispatch<SetStateAction<Image[]>>;
  images: Image[];
  delFn: TuseDeleteConsumptionImagesMutation[0];
  id: string;
  mode: string;
};

export type TFIle = {
  secure_url: string;
  public_id: string;
};

export type TImage = {
  _id?: string;
  files: TFIle[];
};
