export type BranchSalesResponse = ItemWiseSalesResponse[];

export interface ItemWiseSalesResponse {
  branchInfo: BranchInfo;
  result: MenuGroupResult[];
}

export interface BranchInfo {
  _id: string;
  bid: string;
  name: string;
  phone: string;
  vatNo: string;
  binNo: string;
  email: string;
  isActive: boolean;
  address1: string;
  address2: string;
  availability: "both" | "delivery" | "pickup" | string;
  deliveryLocations: unknown[];
  division: string;
  city: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface MenuGroupResult {
  _id: string; // menuGroup id
  menuGroup: string; // menuGroup name
  items: SalesItem[];
}

export interface SalesItem {
  _id: string; // item id
  rate: number;
  qty: number;
  itemCategory: ItemCategory;
  itemName: string;
  itemCode: string;
}

export interface ItemCategory {
  _id: string;
  uid: string;
  name: string;
  menuGroup: string; // menuGroup id
}
