import Image from "next/image";
import React from "react";
import ReviewManBg from "../../assets/images/reviewSectionManBg.png";
import ReviewMan from "../../assets/images/ReviewMan.png";
import { Avatar, Carousel, Rate } from "rsuite";
import reviewMan from "../../assets/images//ReviewMan.png";
import "./Custom.css";

const Reviews = async () => {
  const posts = await fetch(`https://jsonplaceholder.typicode.com/posts`).then(
    (res) => res.json()
  );

  return (
    <div className="my-32">
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-6  min-h-[30rem]  flex-col justify-end lg:flex  hidden ">
          <Image
            src={ReviewMan}
            height={500}
            width={600}
            className="z-50 absolute left-[12rem]"
            alt="text"
          />
          <div className="h-[23rem] relative w-[70%]">
            <Image src={ReviewManBg} fill className="z-10" alt="Text" />
          </div>
        </div>
        <div className="lg:col-span-6  col-span-12 flex flex-col justify-end px-2 lg:px-0 lg:text-left text-center">
          <h3 className="text-lg text-[#FC8A06] font-semibold ">
            What They Say
          </h3>
          <h1 className="text-5xl font-extrabold">
            What Our Customers Say About Us
          </h1>

          {/* Moovable  */}
          <div className="mt-5 text-left">
            <Carousel className=" !bg-white !h-[18rem]" autoplay shape="bar">
              {posts.slice(0, 5).map((post: any, index: number) => (
                <div
                  className="flex flex-col justify-end !bg-white"
                  key={index}
                >
                  <p className="text-xl text-[#333333]">
                    “
                    {post?.body?.length > 200
                      ? post?.body.slice(0, 200) + "..."
                      : post?.body}
                    ”.
                  </p>

                  <div className="mt-14">
                    <div className="flex items-center ">
                      <Avatar
                        src={reviewMan as unknown as string}
                        className="!rounded-full"
                      />
                      <div className="mx-4">
                        <p> Nafisa Hossain Apon</p>
                        <p className="text-sm text-[#828282]">
                          Food Enthusiast
                        </p>
                      </div>
                    </div>
                    <div className="mt-5">
                      <Rate
                        value={Number(post.id)}
                        size="md"
                        color="yellow"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
