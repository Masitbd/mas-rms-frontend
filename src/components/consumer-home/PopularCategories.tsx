import Image from "next/image";
import React from "react";
import foodImage from "../../assets/images/hero-food1.jpg";
import config from "@/config";
import { TImage } from "../menu-item-consumption/TypesAndDefault";

const PopularCategories = async () => {
  const posts = await fetch(
    `${config.server_url}/item-categories?isPopular=true`
  ).then((res) => res.json());

  return (
    <div className="my-10 lg:my-20 mx-auto">
      <div className="lg:text-4xl text-base font-bold px-4">
        Our Popular Categories
      </div>
      <div className=" overflow-y-scroll w-full  scrollbar-hide mt-5">
        {/* item size and width */}
        <div
          className={`grid grid-cols-12 lg:gap-2 gap-0.5  
             lg:w-full lg:px-0 px-0.5 place-items-center gap-y-2 md:gap-y-5`}
        >
          {posts?.data?.map(
            (post: { name: string; image: TImage }, index: number) => {
              return (
                <>
                  {" "}
                  <div
                    className="lg:w-[12rem] w-[11rem] lg:h-[14rem] h-[12] col-span-6 lg:col-span-2 rounded-xl overflow-hidden border-[#dcdcdc] border "
                    key={index}
                  >
                    <div className="relative h-[10rem] w-full">
                      {/* Image of the food item */}
                      <Image
                        src={
                          post?.image
                            ? post?.image?.files[0]?.secure_url
                            : foodImage
                        }
                        fill
                        alt="Category Image"
                      />
                    </div>
                    <div className="bg-[#f5f5f5] h-full w-full px-2 ">
                      <h3 className="font-extrabold text-lg">
                        {post?.name?.length > 18
                          ? post?.name.slice(0, 14) + " ..."
                          : post?.name}
                      </h3>
                      {/* <p className="text-[#FC8A06] font-bold">
                        {post?.id} items
                      </p> */}
                    </div>
                  </div>
                </>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularCategories;
