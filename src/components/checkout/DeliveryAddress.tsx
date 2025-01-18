"use client";
import React from "react";
import LocationIcon from "@rsuite/icons/Location";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Textarea } from "../customers/TextArea";
import { Button, Input } from "rsuite";

const DeliveryAddress = () => {
  return (
    <div className=" w-full h-full lg:p-6 p-3  rounded-xl border border-[#DCDCDC] bg-white">
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold ">Delivery Address</h2>
        <h5 className="font-semibold">
          <Button size="sm" appearance="subtle" className="!font-semibold">
            Change
          </Button>
        </h5>
      </div>
      <div className="mt-6 font-semibold">
        <FontAwesomeIcon icon={faLocationDot} /> 1205 Mirpur,
        <br /> Dhaka
      </div>
      <div className="mt-4">
        <Input
          as={Textarea}
          placeholder="Notes To Rider -e.g Building, Landmark"
        />
      </div>
    </div>
  );
};

export default DeliveryAddress;
