import React from "react";
import foodImage from "../../assets//images/demodis.png";
import Image from "next/image";
import "./Custom.css";

const DiscountedItems = async () => {
  const posts = await fetch(`https://jsonplaceholder.typicode.com/posts`).then(
    (res) => res.json()
  );
  const widthClass = `w-[${parseInt((12 * 350) / 16)}rem]`;
  function generateDynamicWidth(value) {
    return `w-[${value}rem]`;
  }
  return (
    <div className="my-10 lg:my-20">
      <div className="lg:text-4xl text-base font-bold px-4">
        Up to -40% on exclusive deals
      </div>
      <div className=" overflow-y-scroll w-[98vw] lg:w-full  scrollbar-hide mt-5">
        {/* item size and width */}
        <div
          className={`grid grid-cols-12 gap-5  ${generateDynamicWidth(
            parseInt((12 * 350) / 16)
          )} lg:w-full lg:px-0 px-5`}
        >
          {posts.slice(0, 5).map((post, index) => (
            <div
              className="lg:w-[25rem] lg:h-[15rem] w-[20rem] h-[10rem] relative col-span-1 lg:col-span-4 gap-5 rounded-xl overflow-hidden  flex  items-end"
              key={post}
            >
              {/* Image of the food item */}
              <Image src={foodImage} fill />

              <div className="gradient-image-bg absolute"></div>
              <div className="lg:p-10 p-5 z-50">
                {/* Details of the item */}
                <h2 className="text-[#FC8A06] text-lg font-bold">
                  Item Category
                </h2>
                <h2 className="text-white text-2xl font-extrabold">
                  Item Name
                </h2>
              </div>

              {/* DIscount of the food item */}
              <div className="z-50 absolute bg-[#03081F] w-20 h-16 top-0 right-5 rounded-b-xl text-white font-extrabold flex items-center justify-center">
                -20%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscountedItems;
