import { Schema } from "rsuite";

const { StringType } = Schema.Types;

export const deliveryLocationModel = Schema.Model({
  name: StringType().isRequired("Full Name is required."),
  phone: StringType().isRequired("Phone number is required."),
  landMark: StringType(), // Optional field
  division: StringType().isRequired("Division is required."),
  city: StringType().isRequired("City is required."),
  zone: StringType().isRequired("Zone is required."),
  address: StringType().isRequired("Address is required."),
});
export const divisionData = [
  "Barishal",
  "Chattogram",
  "Dhaka",
  "Khulna",
  "Mymensingh",
  "Rajshahi",
  "Rangpur",
  "Sylhet",
];

export const initialFormData = {
  isDefault: false,
  name: "",
  city: "",
  landMark: "",
  division: "",
  zone: "",
  address: "",
  phone: "",
};

export interface TDeliveryAddress {
  name: string;
  phone: string;
  landMark: string;
  division: string;
  city: string;
  zone: string;
  address: string;
  userId: string;
  isDefault: boolean;
}
