import Image from "next/image";
import React from "react";
import foodImage from "../../assets/images/hero-food1.jpg";
import config from "@/config";
import { TImage } from "../menu-item-consumption/TypesAndDefault";

const ALlCategories = async () => {
  const posts = await fetch(`${config.server_url}/item-categories`).then(
    (res) => res.json()
  );
  const categorywidth = "w-[" + posts?.data?.length * 12 + "rem]";

  return (
    <div className="my-10 lg:my-20">
      <div className="lg:text-4xl text-base font-bold px-4">Our Categories</div>
      <div className=" overflow-y-scroll w-[98vw] lg:w-full  scrollbar-hide mt-5">
        {/* item size and width */}
        <div
          className={`lg:grid flex flex-row justify-around grid-cols-12 gap-2  ${categorywidth}
           lg:w-full lg:px-0 px-5`}
        >
          {posts?.data
            ?.slice(0, 18)
            .map((post: { name: string; image: TImage }, index: number) => (
              <div
                className="lg:w-[12rem] w-[12rem] h-[14rem] lg:col-span-2 col-span-2 rounded-xl overflow-hidden border-[#FC8A06] border"
                key={index}
              >
                <div className="relative h-[10rem] w-full">
                  {/* Image of the food item */}
                  <Image
                    src={post?.image?.files[0]?.secure_url ?? foodImage}
                    fill
                  />
                </div>
                <div className="bg-[#FC8A06] h-full w-full px-2 ">
                  <h3 className="font-extrabold text-lg text-white  text-center">
                    {post?.name?.length > 18
                      ? post?.name.slice(0, 30) + " ..."
                      : post?.name}
                  </h3>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ALlCategories;
