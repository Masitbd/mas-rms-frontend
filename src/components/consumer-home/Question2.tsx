import React from "react";
import bkash from "../../assets/images/bkashlogo.png";
import sslCom from "../../assets/images/sslCommerz.png";
import Image from "next/image";

const Question2 = () => {
  const paymentMethods = [
    { name: "Bkash", image: bkash },
    { name: "SSL Commerz", image: sslCom },
  ];
  return (
    <div
      className="flex items-center lg:justify-evenly h-full lg:flex-row flex-col justify-around "
      id="q2"
    >
      {paymentMethods.map((p, index) => {
        return (
          <div
            className="h-[8rem] w-[8rem] border border-[#D9D9D9] flex items-center justify-center flex-col text-center rounded-xl p-1 lg:bg-transparent bg-white lg:my-0 my-4"
            key={index}
          >
            <Image src={p.image} width={60} alt="2" />
            <p className="font-semibold">{p.name}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Question2;
