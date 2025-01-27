import Image from "next/image";
import React from "react";
import foodImage from "../../assets/images/hero-food1.jpg";
import config from "@/config";
import { TImage } from "../menu-item-consumption/TypesAndDefault";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";
import Link from "next/link";

const PopularCategories = async () => {
  const posts = await fetch(
    `${config.server_url}/item-categories?isPopular=true`
  ).then((res) => res.json());
  if (!posts?.data?.length) {
    return "";
  }

  return (
    <div className="my-10 lg:my-20 mx-auto">
      <div className="lg:text-4xl text-base font-bold px-4">
        Our Popular Categories
      </div>
      <div className=" overflow-y-scroll max-w-[100vw] lg:max-w-fit  scrollbar-hide mt-5">
        {/* item size and width */}
        <div
          className={`lg:grid flex justify-around  grid-cols-12 lg:gap-2 gap-0.5  
             lg:px-0 px-0.5 place-items-center gap-y-2 md:gap-y-5 !lg:w-full  min-w-fit`}
          id={"home-discount-item"}
        >
          {posts?.data?.map(
            (
              post: { name: string; image: TImage; _id: string },
              index: number
            ) => {
              return (
                <>
                  <Link
                    className="lg:w-[12rem] w-[11rem] lg:h-[14rem] h-[12] col-span-6 lg:col-span-2 rounded-xl overflow-hidden border-[#dcdcdc] border "
                    key={index}
                    href={`/consumer/category?categoryId=${post?._id}`}
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
                  </Link>
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
