"use client";

import Image from "next/image";
import basketImg from "@/assets/images/Basket.png";
import downImg from "@/assets/images/DownButton.png";
import forwardImg from "@/assets/images/RightButton .png";
import deliImg from "@/assets/images/Delivery Scooter.png";
import storImg from "@/assets/images/New Store.png";
import rightImg from "@/assets/images/Forward Button .png";
import TrashIcon from "@rsuite/icons/Trash";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import {
  decrementQty,
  incrementQty,
  removeItem,
} from "@/redux/features/order/orderSlice";
import Link from "next/link";

const MyCart = () => {
  const state = useAppSelector((state) => state.order);

  const [qty, setQty] = useState(1);
  const dispatch = useAppDispatch();
  const handleRemove = (id: string) => {
    console.log(id);
    dispatch(removeItem(id));
  };

  const handleIncrementQty = (id: string) => {
    setQty((e) => e + 1);
    dispatch(incrementQty(id));
  };
  const handleDecrementQty = (id: string) => {
    setQty((e) => e - 1);
    dispatch(decrementQty(id));
  };

  return (
    <div className="bg-[#F9F9F9] border-[1px] h-full max-h-[1150px] mt-10 overflow-y-auto w-full lg:w-[260px] flex flex-col">
      <div className="flex bg-[#028643] py-6 justify-center items-center md:px-3 md:gap-6">
        <Image width={30} height={30} src={basketImg} alt="basket" />
        <p className="text-white font-bold md:text-xl">My Basket</p>
      </div>

      {/* Basket Items */}
      <div className="flex-1 overflow-y-auto">
        {state?.items?.map((p) => (
          <div
            key={p._id}
            className="p-3 border flex justify-between items-center"
          >
            <div>
              <p className="text-[#028643] font-semibold">TK {p?.item?.rate}</p>
              <p className="font-semibold text-[14px]">{p?.item?.name}</p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <button
                className="text-xl mb-1"
                onClick={() => handleRemove(p._id)}
              >
                <TrashIcon />
              </button>
              <div className="flex items-center justify-between px-3 rounded-full border-[1px] border-[#D7D7D7] w-20 h-9">
                <button
                  className="text-xl"
                  onClick={() =>
                    p?.item?.code && handleIncrementQty(p?.item?.code)
                  }
                >
                  +
                </button>
                <p>{p?.qty}</p>
                <button
                  className="text-xl"
                  onClick={() =>
                    p?.item?.code && handleDecrementQty(p?.item?.code)
                  }
                >
                  -
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Calculation Section */}
      <div className="flex flex-col bg-white border-t-[1px] ">
        <div className="px-3 pb-5 mt-3">
          <div className="flex justify-between mb-2">
            <p className="font-semibold">Sub Total :</p>
            <p>TK {state?.totalBill}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="font-semibold">Discount :</p>
            <p>TK {state?.discount || 0}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p className="font-semibold">Delivery Fees :</p>
            <p>TK {0}</p>
          </div>
        </div>

        <div className="px-3">
          <div className="bg-[#FC8A06CC] text-white my-5 h-14 w-full px-3 flex justify-between items-center">
            <p>Total to pay</p>
            <p className="text-xl">TK {state?.netPayable}</p>
          </div>
          <div className="h-14 w-full px-3 rounded-full flex justify-between items-center border-[1px] border-[#CFCFCF]">
            <p className="text-sm">Choose your free item..</p>
            <Image src={downImg} alt="down" />
          </div>
          <div className="h-14 w-full my-5 px-3 rounded-full flex justify-between items-center border-[1px] border-[#CFCFCF]">
            <p className="text-sm">Apply Coupon Code here</p>
            <Image src={forwardImg} alt="down" />
          </div>

          {/* delivery */}

          <div className="pt-5 border-t-[1px] flex flex-col md:flex-row gap-5 justify-between items-center ">
            <div className="bg-[#EEEEEE] border-[1px] py-2 w-1/2  h-[110px] flex flex-col justify-center items-center text-center">
              <Image src={deliImg} alt="cart" />

              <p className="font-bold my-1">Delivery</p>
              <p className="text-start">Start at 17:50 </p>
            </div>
            <div className=" border-l-[2px] border-[#EEEEEE] py-2 w-1/2  h-[110px] flex flex-col justify-center items-center text-center">
              <Image src={storImg} alt="cart" />
              <p className="font-bold my-1">Collection</p>
              <p className="text-start">Start at 17:50 </p>
            </div>
          </div>

          {/* chekcout */}

          <Link
            className="w-full h-14 px-3 py-1 mt-5 mb-2 rounded-lg bg-[#028643] text-white text-2xl flex justify-between items-center"
            href="/checkout"
          >
            <Image src={rightImg} alt="img" />
            Checkout!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyCart;
