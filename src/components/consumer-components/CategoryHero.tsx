"use client";

import categoryImg from "@/assets/images/category.png";
import motorImg from "@/assets/images/Motocross.png";
import Image from "next/image";
import PageIcon from "@rsuite/icons/Page";
import StarIcon from "@rsuite/icons/Star";
import TimeRoundIcon from "@rsuite/icons/TimeRound";

const CategoryHero = () => {
  return (
    <div className=" mt-36">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between md:gap-10 mt-10">
        {/* for text */}
        <div className="mb-10 font-semibold">
          <p className="text-[#03081F]">I&rsquo;m lovin it</p>
          <p className="text-[#03081F] text-[54px] font-bold">Kabab Platter</p>

          <div className="flex flex-col md:flex-row text-white  md:items-center gap-5  ">
            <div className="h-8 w-[210px]  bg-black rounded-full flex items-center gap-3 justify-center text-sm font-light   ">
              <PageIcon color="white" />
              <p>Minimum Order: 200 BDT</p>
            </div>

            <div className="h-8 w-[210px]  bg-black rounded-full flex items-center gap-3 justify-center text-sm font-light   ">
              <Image width={20} src={motorImg} alt="motor" />
              <p>Delivery in 20-25 Minutes</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="w-full md:w-[492px]">
            <Image
              width={492}
              src={categoryImg}
              alt="category img"
              className="rounded"
            />
          </div>
          <div className="h-[96px] text-center w-[86px] bg-gray-50 absolute bottom-0 md:-left-10 rounded-lg  ">
            <h2 className="text-5xl text-slate-900 text-center">3.4</h2>
            <StarIcon color="#FDCC0D" />
            <StarIcon color="#FDCC0D" />
            <StarIcon color="#FDCC0D" />
            <StarIcon color="#FDCC0D" />
            <p className="text-gray-400 text-sm">1360 revies</p>
          </div>
        </div>
      </div>
      <div className="w-[240px] h-12 ms-6 mt-3 rounded-e-lg bg-[#FC8A06] text-white    flex items-center justify-center gap-3 font-semibold ">
        <TimeRoundIcon color="white" />
        <p>Open until 11.00 AM</p>
      </div>
    </div>
  );
};

export default CategoryHero;
