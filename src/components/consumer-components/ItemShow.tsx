"use client";

import Image from "next/image";
import burgerImg from "@/assets/images/burger.png";

import { IMenuItemConsumption } from "../menu-item-consumption/TypesAndDefault";
import { useEffect, useRef, useState } from "react";
import ProductVariationModal from "./ProductVariationModal";

// Define the structure of an item
export interface IMenuItem {
  name: string;
  code: string;
  rate: number;
  details: string;
  images: string;
}

// Define the structure of a menu category
interface IMenuCategory {
  items: IMenuItem[];
  itemCategoryName: string;
}

// Define the overall structure containing an array of categories
interface IMenuData {
  data: IMenuCategory[];
}

const ItemShow = ({ items }: { items: IMenuData }) => {
  return (
    <div className="mt-20 md:px-10">
      {items?.data?.map((group, index: number) => (
        <div key={index} className="my-10 mb-20">
          <p className="text-[#FC8A06] text-2xl font-bold">
            {group?.itemCategoryName}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group?.items?.map((item) => (
              <div
                key={item.name}
                className="bg-[#FDFDFD] shadow-lg border-[1px] border-gray-100 w-full md:w-[410px] h-full md:h-[200px] mt-10 rounded-lg flex items-center justify-between gap-5 px-3 "
              >
                {/* text */}
                <div className="flex flex-col gap-3 justify-between">
                  <p className="text-lg font-bold">{item?.name}</p>
                  <p className="text-gray-900 text-sm">
                    {" "}
                    {item?.details ||
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
                  </p>
                  <p className="font-bold"> BDT {item?.rate}</p>
                </div>

                {/* iamge */}

                <div className="w-[420px] md:w-[330px] relative">
                  <Image
                    width={180}
                    src={item?.images || burgerImg}
                    alt="image"
                    className="rounded-xl"
                  />
                  {/* <button >
                    <div className="w-[60px] h-[53px] flex items-center justify-center rounded-tl-3xl absolute right-0 bottom-0 bg-white bg-opacity-90 ">
                      <div className="w-7 h-7 rounded-full text-lg text-center font-bold  bg-black text-white ">
                        +
                      </div>
                    </div>
                  </button> */}

                  <ProductVariationModal item={item} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemShow;
