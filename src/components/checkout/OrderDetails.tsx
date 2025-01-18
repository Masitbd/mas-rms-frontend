import React from "react";
import { Button, Divider } from "rsuite";

const OrderDetails = () => {
  return (
    <>
      <div className=" w-full lg:p-6 p-3  rounded-xl border border-[#DCDCDC] bg-white">
        <div className="flex flex-row justify-between">
          <h2 className="text-2xl font-bold ">Your Order</h2>
        </div>
        <div className="mt-6 font-semibold w-full">
          <div className="flex justify-between f">
            <h2>1 X Kacchi </h2>
            <h3>254</h3>
          </div>
          <div className="flex justify-between f">
            <h2>1 X Chawmin </h2>
            <h3>280</h3>
          </div>
          <Divider />
          <div className="flex justify-between f">
            <h2>Subtotal </h2>
            <h3>280</h3>
          </div>
          <div className="flex justify-between f">
            <h2>Vat </h2>
            <h3>120</h3>
          </div>
          <div className="flex justify-between f">
            <h2>Delivery </h2>
            <h3>50</h3>
          </div>
          <div className="flex justify-between f">
            <h2>Service Charge </h2>
            <h3>10</h3>
          </div>
        </div>
        <div className="mt-4 ">
          <div className="flex justify-between text-2xl font-bold">
            <div>
              <h2>Total </h2>
              <div className="text-sm font-light">(Incl. fees and tax)</div>
            </div>
            <h3 className="text-[#FC8A06]">10</h3>
          </div>
        </div>
      </div>
      <Button
        className="w-full !font-extrabold my-5"
        size="lg"
        appearance="primary"
        color="orange"
      >
        Place Order
      </Button>
    </>
  );
};

export default OrderDetails;
