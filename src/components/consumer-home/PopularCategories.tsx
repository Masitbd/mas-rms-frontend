import Image from "next/image";
import React from "react";
import foodImage from "../../assets/images/hero-food1.jpg";

const PopularCategories = async () => {
  const posts = await fetch(`https://jsonplaceholder.typicode.com/posts`).then(
    (res) => res.json()
  );

  return (
    <div className="my-10 lg:my-20">
      <div className="lg:text-4xl text-base font-bold px-4">
        Our Popular Categories
      </div>
      <div className=" overflow-y-scroll w-[98vw] lg:w-full  scrollbar-hide mt-5">
        {/* item size and width */}
        <div
          className={`grid grid-cols-12 gap-2  w-[84rem]
           lg:w-full lg:px-0 px-5`}
        >
          {posts.slice(0, 6).map((post, index) => (
            <div
              className="w-[12rem] h-[14rem] col-span-2 rounded-xl overflow-hidden border-[#dcdcdc] border"
              key={index}
            >
              <div className="relative h-[10rem] w-full">
                {/* Image of the food item */}
                <Image src={foodImage} fill />
              </div>
              <div className="bg-[#f5f5f5] h-full w-full px-2 ">
                <h3 className="font-extrabold text-lg">
                  {" "}
                  {post?.title?.length > 18
                    ? post?.title.slice(0, 14) + " ..."
                    : post?.title}
                </h3>
                <p className="text-[#FC8A06] font-bold">{post?.id} items</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCategories;