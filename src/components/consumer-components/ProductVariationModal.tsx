"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  ButtonToolbar,
  Input,
  Modal,
  Placeholder,
  Radio,
  RadioGroup,
} from "rsuite";
import burgerImg from "@/assets/images/burger.png";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Message, PickerHandle, toaster } from "rsuite";
import {
  addItem,
  decrementQty,
  incrementQty,
  removeItem,
  setItemDiscount,
} from "@/redux/features/order/orderSlice";
import { IMenuItemConsumption } from "../menu-item-consumption/TypesAndDefault";

const ProductVariationModal = ({ item }) => {
  const [open, setOpen] = useState(false);
  const [overflow, setOverflow] = useState(true);

  const handleClose = () => setOpen(false);

  // cart stae

  const itemCodeRef = useRef<PickerHandle>();
  const itemNameRef = useRef<PickerHandle>();
  const qtyRef = useRef<HTMLInputElement>(null);
  const [pItem, setItem] = useState<IMenuItemConsumption>();
  const [qty, setQty] = useState(1);

  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.order);

  const handleOpen = () => {
    const existingItem = state?.items?.find((i) => i.item.code === item.code);
    setQty(existingItem ? existingItem.qty : 1); // Set qty from state if exists
    setOpen(true);
  };

  const handleAdd = async () => {
    const doesExists =
      state?.items?.length &&
      state.items.find((i) => i?.item?.code == item?.code);

    if (qty < 1) {
      toaster.push(
        <Message type="error">!Quantity should be greater than 0</Message>
      );
      return;
    }

    if (doesExists) {
      toaster.push(<Message type="error">!Oops Already exists</Message>);
      return;
    }
    const data = {
      qty: qty,
      rate: item?.rate,
      item: item,
      discount: item?.discount ?? 0,
      isDiscount: item?.isDiscount,
      isVat: item?.isVat,
    };
    dispatch(addItem(data));
    setItemDiscount(null as unknown as IMenuItemConsumption);
    setQty(1);
    if (itemCodeRef && itemCodeRef.current !== undefined) {
      if (itemCodeRef.current.open) {
        itemCodeRef.current.open();
      }
      if (itemCodeRef.current.target) {
        itemCodeRef.current.target.focus();
      }
    }

    await handleClose();
  };

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

  const selectHandler = (param: IMenuItemConsumption) => {
    setItem(param);
  };

  useEffect(() => {
    if (item) {
      qtyRef?.current?.focus(); // Focus the qty field after item state updates
    }
  }, [item]);

  return (
    <div>
      <ButtonToolbar>
        <button onClick={handleOpen}>
          <div className="w-[60px] h-[53px] flex items-center justify-center rounded-tl-3xl absolute right-0 bottom-0 bg-white bg-opacity-90 ">
            <div className="w-7 h-7 rounded-full text-lg text-center font-bold  bg-black text-white ">
              +
            </div>
          </div>
        </button>
      </ButtonToolbar>

      <Modal
        style={{ marginTop: "80px", marginBottom: "40px" }}
        overflow={overflow}
        open={open}
        onClose={handleClose}
      >
        <Modal.Header>
          {/* <Modal.Title>Modal Title</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          <div className="w-full h-full max-h-72">
            <Image
              src={item?.images || burgerImg}
              alt="Image"
              className="h-52"
            />
          </div>
          <div className="my-8">
            <h1 className="font-bold text-xl">{item?.name}</h1>

            <p className="my-3 font-semibold">TK {item?.rate || 0}</p>
            <p className="text-sm font-light pb-4 border-b-[1px]">
              {item?.details || "lorem"}
            </p>
          </div>

          <div className="bg-[#FFF3E6] p-5">
            <div className="flex justify-between">
              <p className="font-semibold ml-2">Variation</p>
              <p className="bg-[#FC8A06] text-white  py-1 px-3 rounded-full text-sm  ">
                Required
              </p>
            </div>

            <div className="mt-4">
              <RadioGroup>
                <div className="flex items-center justify-between me-2">
                  <Radio className="flex-shrink-0" value="1:1">
                    1:1 Single
                  </Radio>
                  <p>TK {item?.rate || 0} </p>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="my-5">
            <div className="flex justify-between">
              <p className="font-semibold"> Ads Ons For {item?.name} </p>
              <p className="bg-[#DCDCDC] py-1 px-3 rounded-full text-sm">
                optional
              </p>
            </div>
          </div>

          <div>
            <p className="text-lg font-bold">Special Instruction</p>
            <p>Write your special instructions below</p>

            <Input
              className="bg-[#EDEDED]"
              color="#EDEDED"
              as="textarea"
              rows={3}
              placeholder="Eg: Extra Spicy"
            />
          </div>

          <div className="my-7 flex justify-between items-center gap-5">
            <div className="flex items-center  justify-between px-3 rounded-full border-[1px] border-[#D7D7D7] w-28  h-9">
              <button
                className="text-2xl"
                onClick={() => handleIncrementQty(item._id)}
              >
                +
              </button>
              <p>{qty}</p>
              <button
                className="text-2xl"
                onClick={() => handleDecrementQty(item._id)}
              >
                -
              </button>
            </div>
            <button
              className="bg-[#FC8A06] text-white py-2 w-full text-center rounded-md"
              onClick={() => handleAdd()}
            >
              Add to Cart
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductVariationModal;
