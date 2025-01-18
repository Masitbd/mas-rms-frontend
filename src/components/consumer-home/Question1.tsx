import React from "react";
import image1 from "../../assets/images/Q1Image1.png";
import image2 from "../../assets/images/Q1Image2.png";
import image3 from "../../assets/images/Q1Image3.png";
import Image from "next/image";

const Question1 = () => {
  const contents = [
    {
      title: "Place an Order !",
      value: "Place order through our website",
      image: image1,
    },
    {
      title: "Track Progress",
      value: "Your can track your order status with delivery time ",
      image: image2,
    },

    {
      title: "Get your Order!",
      value: "Receive your order at a lighting fast speed!",
      image: image3,
    },
  ];
  return (
    <div
      className="flex justify-around items-center lg:flex-row flex-col  h-full py-5 lg:py-0"
      id="q1"
    >
      {contents.map((c, index) => {
        return (
          <div
            className="h-[15rem] w-[12rem] bg-[#D9D9D9] flex items-center justify-center flex-col text-center rounded-xl p-1 my-4 lg:my-0"
            key={index}
          >
            <h1 className="font-extrabold  text-[#03081F]">{c.title}</h1>
            <Image src={c.image} width={120} alt="q" />
            <p className="font-semibold">{c.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Question1;
