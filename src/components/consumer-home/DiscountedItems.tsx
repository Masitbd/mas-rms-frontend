import React from "react";
import foodImage from "../../assets//images/demodis.png";
import Image from "next/image";
import "./Custom.css";
import config from "@/config";
import { IMenuItemConsumption } from "../menu-item-consumption/TypesAndDefault";
import ProductVariationModal from "../consumer-components/ProductVariationModal";

const DiscountedItems = async () => {
  const posts = await fetch(
    `${config.server_url}/raw-material-consumption/discounted/items`
  ).then((res) => res.json());
  if (!posts?.data?.length) {
    return "";
  }
  return (
    <div className="my-10 lg:my-20">
      <div className="lg:text-4xl text-base font-bold px-4">
        Up to -40% on exclusive deals
      </div>
      <div className=" overflow-y-scroll max-w-[100vw] lg:max-w-fit lg:w-full  scrollbar-hide mt-5">
        {/* item size and width */}
        <div
          className={`lg:grid grid-cols-12 gap-5 flex justify-around min-w-fit lg:w-full lg:px-0 px-5`}
        >
          {posts?.data?.map(
            (
              post: IMenuItemConsumption & { itemCategory: { name: string } }
            ) => (
              <div
                className="lg:w-[25rem] lg:h-[15rem] w-[20rem] h-[10rem] relative col-span-1 lg:col-span-4 gap-5 rounded-xl overflow-hidden  flex  items-end"
                key={post._id}
              >
                {/* Image of the food item */}
                <Image
                  src={post?.images?.files[0].secure_url || foodImage}
                  fill
                  alt="food Image"
                />

                <div className="gradient-image-bg absolute"></div>
                <div className="lg:p-10 p-5 z-50">
                  {/* Details of the item */}
                  <h2 className="text-[#FC8A06] text-lg font-bold">
                    {post?.itemCategory?.name}
                  </h2>
                  <h2 className="text-white text-2xl font-extrabold">
                    {post?.itemName}
                  </h2>
                </div>

                {/* DIscount of the food item */}
                <div className="z-50 absolute bg-[#03081F] w-20 h-16 top-0 right-5 rounded-b-xl text-white font-extrabold flex items-center justify-center">
                  {post?.discount} %
                </div>
                <ProductVariationModal item={post} />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscountedItems;
