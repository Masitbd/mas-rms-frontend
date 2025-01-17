import { ENUM_MODE } from "@/enums/EnumMode";

export const paymentMethod = [
  { label: "Cash", value: "cash" },
  { label: "Bkash", value: "bkash" },
  { label: "Nagad", value: "nagad" },
  { label: "Rocket", value: "rocket" },
  { label: "Bank", value: "bank" },
  { label: "Card", value: "card" },
];

export type ICashMasterProps = {
  mode: ENUM_MODE;
};

export type KitchenOrderData = {
  items?: {
    itemCode?: string;
    itemName?: string;
    qty?: number;
    rate?: number;
  }[];
  billNo?: string;
  kitchenOrderNo?: string;
  status: string;
  remark?: string;
  tableName?: string;
  waiterName?: string;
};

export const statusOption = [
  { label: "Posted", value: "posted" },
  { label: "Not Posted", value: "notPosted" },
  { label: "Void", value: "void" },
];
export const sortOption = [
  { label: "Price", value: "totalBill" },
  { label: "Bill No", value: "billNo" },
];
export type ISelectPicker = { label: string; value: string };
