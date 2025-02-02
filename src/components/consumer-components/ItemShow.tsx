"use client";

import Image from "next/image";
import burgerImg from "@/assets/images/burger.png";

import {
  IMenuItemConsumption,
  TImage,
} from "../menu-item-consumption/TypesAndDefault";
import { useEffect, useRef, useState } from "react";
import ProductVariationModal from "./ProductVariationModal";
import Loading from "@/app/Loading";

// Define the structure of an item
export interface IMenuItem {
  itemName: string;
  itemCode: string;
  rate: number;
  description: string;
  images: TImage;
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

const ItemShow = ({
  items,
  isLoading,
  isFetching,
}: {
  items: IMenuData;
  isLoading: boolean;
  isFetching: boolean;
}) => {
  return (
    <div className="mt-20 md:px-10">
      {(isFetching || isLoading) && <Loading />}
      {!isLoading && !isFetching && items?.data?.length ? (
        items?.data?.map((group, index: number) => (
          <div key={index} className="my-10 mb-20">
            <p className="text-[#FC8A06] text-2xl font-bold">
              {group?.itemCategoryName}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group?.items?.map((item) => (
                <div
                  key={item?.itemName}
                  className="bg-[#FDFDFD] shadow-lg border-[1px] border-gray-100 w-full md:w-[410px] h-full md:h-[200px] mt-10 rounded-lg flex items-center justify-between gap-5 "
                >
                  {/* text */}
                  <div className="flex flex-col gap-3 justify-between px-2">
                    <p className="text-lg font-bold">{item?.itemName}</p>
                    <p className="text-gray-900 text-sm">
                      {" "}
                      {item?.description || "No Description Provided"}
                    </p>
                    <p className="font-bold"> BDT {item?.rate}</p>
                  </div>

                  {/* iamge */}

                  <div className="w-[180px] md:w-[200px] relative lg:h-[150px] h-[130px]">
                    <Image
                      src={item?.images?.files[0].secure_url || burgerImg}
                      alt="image"
                      className="rounded-xl "
                      fill
                    />
                    {/* <button >
                    <div className="w-[60px] h-[53px] flex items-center justify-center rounded-tl-3xl absolute right-0 bottom-0 bg-white bg-opacity-90 ">
                      <div className="w-7 h-7 rounded-full text-lg text-center font-bold  bg-black text-white ">
                        +
                      </div>
                    </div>
                  </button> */}

                    <ProductVariationModal
                      item={item as IMenuItemConsumption}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className=" flex items-center justify-center text-4xl font-semibold">
          No Item Found In this Category
        </div>
      )}
    </div>
  );
};

export default ItemShow;
