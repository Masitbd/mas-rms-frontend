"use client";
import React, { useState } from "react";
import { Button, Tabs } from "rsuite";
import Question1 from "./Question1";
import Question2 from "./Question2";
import Question4 from "./Question4";
import Question5 from "./Question5";
import Question3 from "./Question3";
import { useSession } from "next-auth/react";

const KnowMoreAboutUs = () => {
  const session = useSession();
  console.log(session);
  const [activeKey, setActiveKey] = useState("1");
  const buttonProvider = (key: string, title: string) => {
    return (
      <>
        <Button
          className={`!px-14 !py-4 !text-lg !font-bold ${
            activeKey == key
              ? "!bg-[#FC8A06] !text-white"
              : "!bg-white !text-black"
          } !rounded-full w-full`}
          onClick={() => setActiveKey(key)}
          key={1}
          href={"#q" + key}
        >
          <div className=" text-wrap">{title}</div>
        </Button>
      </>
    );
  };

  const buttonKeyLabelList = [
    { key: "1", title: "How does ordering  work?" },
    { key: "2", title: "What payment methods are accepted?" },
    ,
    { key: "3", title: "Can I track my order in real-time?" },
    ,
    {
      key: "4",
      title: "Are there any special discounts or promotions available? ",
    },
    ,
    { key: "5", title: "Is Restautant available in my area?" },
    ,
  ];

  const questionComponents = [
    {
      key: "1",
      component: <Question1 />,
    },
    {
      key: "2",
      component: <Question2 />,
    },
    {
      key: "3",
      component: <Question3 />,
    },
    {
      key: "4",
      component: <Question4 />,
    },
    {
      key: "5",
      component: <Question5 />,
    },
  ];

  return (
    <div className="lg:h-[52rem] h-full lg:bg-[#D9D9D9] bg-white rounded-md lg:px-20 lg:py-28 px-2">
      <div>
        <h2 className="lg:text-4xl text-2xl font-bold text-center lg:text-left">
          Know More About Us!
        </h2>
      </div>
      <div className="lg:h-[32rem] h-full bg-white rounded-md lg:mt-16 grid grid-cols-12 gap-2 px-2">
        {/* Buttons */}
        <div className="lg:col-span-5  col-span-12 flex flex-col items-center  justify-center ">
          {buttonKeyLabelList.map((d) =>
            buttonProvider(d?.key as string, d?.title as string)
          )}
        </div>
        <div className="lg:col-span-7 col-span-12 lg:bg-white bg-[#03081F] rounded-xl ">
          {questionComponents.find((c) => c?.key === activeKey)?.component || (
            <div>No component found for key: {activeKey}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowMoreAboutUs;
