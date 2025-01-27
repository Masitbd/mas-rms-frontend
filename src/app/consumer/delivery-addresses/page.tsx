"use client";
import DeliveryAddress from "@/components/consumer-profile/DeliveryAddress";
import { useGetDefaultDeliveryAddressQuery } from "@/redux/api/deliveryAddress/deliveryAddress.api";
import React from "react";

const DeliveryAddresses = (data: { searchParams: { error: string } }) => {
  const { data: ddData } = useGetDefaultDeliveryAddressQuery(undefined);
  return (
    <div className="max-w-7xl mx-auto my-32">
      {!ddData?.data?._id && data.searchParams.error && (
        <div className="text-red-500 text-lg font-semibold">
          {data.searchParams.error}
        </div>
      )}
      <DeliveryAddress />
    </div>
  );
};

export default DeliveryAddresses;
