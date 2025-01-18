import React from "react";
import { Divider } from "rsuite";

const StatSection = () => {
  const data = [
    {
      label: "100+",
      value: "Registered Riders",
    },
    {
      label: "5000+",
      value: "Orders Delivered",
    },
    {
      label: "690 + ",
      value: "Reviews",
    },
    {
      label: "100+",
      value: "Food Items",
    },
  ];
  return (
    <div className="my-10 ">
      <div className="lg:h-[10rem] h-full bg-[#FC8A06] rounded-xl py-7 px-4 grid grid-cols-12 gap-5 lg:w-full w-[80%] lg:mx-1 mx-auto">
        {data.map((D, index) => {
          return (
            <div
              className="flex flex-row lg:col-span-3 justify-center col-span-12"
              key={D.label}
            >
              <div>
                <div className="text-center text-white text-6xl  ">
                  {D.label}
                </div>
                <div className="text-2xl font-extrabold text-white text-center">
                  {D.value}
                </div>
              </div>
              {index + 1 !== data.length && (
                <Divider
                  vertical
                  className="h-full w-full text-8xl font-extrabold invisible lg:visible"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatSection;
