import Image from "next/image";
import React, { Key } from "react";
import { Button, Radio } from "rsuite";
import bkashLogo from "../../assets/images//bkashlogo.png";
import ssl from "../../assets/images/sslCommerz.png";
import cash from "../../assets/images/cash.png";

const Payment = () => {
  const paymentMethod = [
    {
      name: "Bkash",
      image: bkashLogo,
      value: "bkash",
    },
    {
      name: "Cash",
      image: cash,
      value: "cash",
    },
    {
      name: "SSL Commerze",
      image: ssl,
      value: "ssl-commerze",
    },
  ];
  return (
    <div className=" w-full h-full lg:p-6 p-3  rounded-xl border border-[#DCDCDC] bg-white">
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold ">Payment</h2>
      </div>
      <div className="mt-6 font-semibold w-full">
        {paymentMethod.map((pm, index) => {
          return (
            <div
              className="flex items-center bg-[#FAFBFF] rounded-xl border border-[#DCDCDC] px-4 py-2 cursor-pointer my-2"
              key={index}
            >
              <Radio className="mr-3" value={pm.value} />
              <Image src={pm.image} width={40} alt="Bkash" className="mx-2" />
              <h2 className="text-lg">{pm.name}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Payment;
