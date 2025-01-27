"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Input, Button, InputGroup } from "rsuite";
import leftHeroBg from "../../assets/images/leftHeroBG.png";
import heroFood1 from "../../assets/images/hero-food1.jpg";
import { useLazyGetDoesDeliverQuery } from "@/redux/api/branch/branch.api";

const HeroSection = () => {
  const initialStatus = {
    error: false,
    initialized: false,
    message: "",
  };
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState(initialStatus);
  const [get, { isLoading, data, isSuccess, isUninitialized }] =
    useLazyGetDoesDeliverQuery();
  const buttonHandler = async () => {
    if (location.length) {
      try {
        const result = await get(location).unwrap();
        if (result?.success) {
          setStatus({
            ...status,
            initialized: true,
            error: false,
            message: result?.message ?? "No Deliveries available in this area.",
          });
        }
      } catch (error) {
        console.log("e", error);
        setStatus({
          ...status,
          initialized: true,
          error: true,
          message: (error ?? "Failed to fetch data.") as string,
        });
      }
    }
  };

  return (
    <div className="mx-auto lg:bg-white lg:w-[100%] w-[95%] lg:p-0 p-5 rounded-lg shadow-md overflow-hidden grid grid-cols-12 min-h-[283px] lg:min-h-[600px] border-[#A1A1A1] my-5  bg-[#03081F]">
      <div className="lg:pl-14 lg:col-span-6  lg:text-start lg:bg-white col-span-12 flex flex-col justify-center items-center text-center">
        <p className="lg:text-gray-500 text-white">
          Order food, takeaway and groceries.
        </p>
        <h1 className="text-3xl lg:text-6xl font-bold lg:text-gray-900 lg:mt-2 mt-0 text-white">
          Feast Your Senses,
          <br />
          <span className="text-orange-500">Fast and Fresh</span>
        </h1>
        <p className="lg:mt-4 mt-2 text-sm lg:text-gray-600 text-white">
          Enter your area name to see what we deliver
        </p>
        <div className="lg:mt-4 lg:pr-14  flex items-center justify-center gap-2 mt-1">
          <InputGroup
            className="!rounded-full lg:bg-transparent bg-white"
            color="orange"
          >
            <Input
              className="!rounded-full"
              size="lg"
              placeholder="e.g. Mirpur"
              type="text"
              onChange={(v) => {
                setLocation(v.toLowerCase() as unknown as string);
                setStatus({ ...initialStatus });
              }}
            />
            <InputGroup.Addon className="!rounded-full !p-0">
              <Button
                appearance="primary"
                color="orange"
                size="lg"
                className="!rounded-full lg:w-44 lg:h-14 !font-bold"
                onClick={() => buttonHandler()}
                loading={isLoading}
              >
                Search
              </Button>
            </InputGroup.Addon>
          </InputGroup>
        </div>
        {status.initialized && status.error ? (
          <p className="mt-2 text-sm text-red-600">
            Sorry, we don’t deliver to your area.
          </p>
        ) : (
          <p className="text-sm text-green-600">{data?.data}</p>
        )}
      </div>
      <div className="relative mt-10 col-span-6 ml-14 invisible lg:visible">
        {/* Pizza eating image */}
        <Image
          src={leftHeroBg} // Replace with the correct image path
          alt="Woman eating pizza"
          fill
          className="z-10"
        />
        <Image
          src={heroFood1}
          width={500}
          className="z-20 absolute rounded-3xl bottom-14 -left-16 opacity-90"
          alt="Food Image"
        />
        {/* Notifications */}
        <div className="bg-white p-2 rounded shadow text-sm z-50 absolute left-28 w-80 top-20 h-20">
          <p className="font-bold text-orange-500 text-lg">Order</p>
          <p>We’ve Received your order!</p>
          <p className="text-gray-500 text-xs">
            Awaiting Restaurant acceptance
          </p>
        </div>
        <div className="bg-white p-2 rounded shadow text-sm mt-2 z-50 absolute left-60 w-80 top-52 h-20">
          <p className="font-bold text-green-500 text-lg">Order Accepted! ✅</p>
          <p>Your order will be delivered shortly</p>
        </div>
        <div className="bg-white p-2 rounded shadow text-sm mt-2 z-50 top-[22rem] absolute left-44 w-80 h-20">
          <p className="font-bold text-blue-500 text-lg">
            Your rider’s nearby 🎉
          </p>
          <p>They’re almost there – get ready!</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
