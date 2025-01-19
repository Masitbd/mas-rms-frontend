"use client";
import DeliveryAddress from "@/components/checkout/DeliveryAddress";
import OrderDetails from "@/components/checkout/OrderDetails";
import Payment from "@/components/checkout/Payment";
import PersonalDetails from "@/components/checkout/PersonalDetails";
import React from "react";

const Checkout = () => {
  return (
    <div className="bg-[#FAFBFF] max-w-7xl mx-auto lg:mt-24 mt-40 grid grid-cols-12 gap-4 mb-20 w-[95%] lg:w-full">
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
        <div>
          <DeliveryAddress />
        </div>
        <div>
          <PersonalDetails />
        </div>
        <div>
          <Payment />
        </div>
      </div>
      <div className="col-span-12 lg:col-span-6">
        <OrderDetails />
      </div>
    </div>
  );
};

export default Checkout;
