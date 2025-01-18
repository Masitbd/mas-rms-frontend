import React from "react";
import { Button, Input } from "rsuite";

const ConsumerFooter = () => {
  return (
    <div className="bg-[#D9D9D9]">
      <div className="max-w-7xl mx-auto grid grid-cols-12  gap-2 lg:gap-10 min-h-80 py-10 px-2">
        <div className="col-span-12 lg:col-span-6  grid grid-cols-12 gap-5 ">
          <div className="col-span-12 lg:col-span-6 flex items-center justify-center flex-col">
            <div>
              <h3 className="text-5xl font-extrabold">RMS</h3>
              <p>Company # 490039-445, Registered with House of companies.</p>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 text-lg font-bold ">
            <h2 className="text-lg font-bold my-5">
              Get Exclusive Deals in you inbox
            </h2>
            <div className="w-full">
              <Input
                className="!rounded-full my-2 max-w-80"
                size="lg"
                placeholder="Enter your email"
                type="email"
              />
              <Button appearance="primary" color="orange" size="lg">
                Subscribe
              </Button>
              <p className="text-gray-500 text-sm mt-2">
                We&apos;ll never share your email address.
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3 mt-5 px-2">
          <div className=" grid grid-cols-1 gap-2">
            <h2 className="text-lg font-bold">Legal Pages</h2>
            <div>Terms And Conditions</div>
            <div>Privacy</div>
            <div>Cookies</div>
            <div>Modern Slavery Statement</div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-3 mt-5  px-2">
          <div className=" grid grid-cols-1 gap-2">
            <h2 className="text-lg font-bold">Get Help</h2>
            <div>Refund Policy</div>
            <div>Register to deliver</div>
            <div>Delivery Policy</div>
            <div>Cancellation policy</div>
          </div>
        </div>
      </div>
      <div className="bg-[#03081F]">
        <div className="max-w-7xl text-white min-h-16 mx-auto flex items-center px-2">
          RMS Copyright 2024, All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default ConsumerFooter;
