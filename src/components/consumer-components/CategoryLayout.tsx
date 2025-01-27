"use client";

import { Input, InputGroup } from "rsuite";
import { Navbar as ResuiteNavber, Nav, Button, Avatar } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";

import headerImg from "@/assets/images/Group 8.png";
import headerImg2 from "@/assets/images/Group 8 (1).png";
import Image from "next/image";
import {
  useGetItemsByCategoryQuery,
  useGetItemsCategoryQuery,
} from "@/redux/api/items/items.api";
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import ItemShow from "./ItemShow";
import Link from "next/link";
import MyCart from "./MyCart";

const styles = {
  width: 300,
};

const CategoryLayout = ({ categoryId }: { categoryId: string }) => {
  const [activeKey, setActiveKey] = useState<string>("");

  const [id, setId] = useState("");

  const queryPrams: Record<string, any> = {};

  if (id) queryPrams.id = id;

  const handleItemClick = (itemId: string) => {
    setId(itemId);
    setActiveKey(itemId);
  };

  const { data: categorys, isLoading } = useGetItemsCategoryQuery(undefined);
  const {
    data: items,
    isLoading: itemLoading,
    isFetching: itemFetching,
  } = useGetItemsByCategoryQuery(queryPrams);

  useEffect(() => {
    if (!id && categoryId) {
      setId(categoryId);
    }
  }, [categoryId]);
  return (
    <div className="w-[98vw]  lg:max-w-7xl mx-auto mt-20 mb-10 ">
      {/* nav */}

      <div className="bg-[#FC8A06] w-full max-w-7xl mx-auto h-16  px-2  md:px-8 flex items-center justify-center gap-5">
        <div className="flex-1">
          <InputGroup inside className="w-full max-w-md">
            <Input placeholder="Search for menu" />
            <InputGroup.Button>
              <SearchIcon />
            </InputGroup.Button>
          </InputGroup>
        </div>

        <Link
          onClick={() => setId("")}
          href="/consumer/category"
          className="text-white font-bold"
        >
          Offer
        </Link>
        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <Nav
            appearance="pills"
            activeKey={activeKey}
            className="mx-auto w-auto flex-nowrap"
          >
            {categorys?.data?.map((item: { _id: string; name: string }) => (
              <Nav.Item
                key={item._id}
                onClick={() => handleItemClick(item._id)}
                eventKey={item._id}
                className={`whitespace-nowrap ${
                  activeKey === item._id ? "bg-[#FC8A06]" : ""
                }`}
              >
                {isLoading ? "Loading.." : item.name}
              </Nav.Item>
            ))}
          </Nav>
        </div>
      </div>

      {/* layout */}

      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 ">
        <div className="col-span-3 md:col-span-3 w-full">
          {/* iamge */}
          <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center gap-8 mt-10 md:px-10">
            <div className="relative">
              <Image src={headerImg} alt="img" />
              <div className="absolute bottom-0 w-full flex justify-between items-center  text-white   ">
                <p className="ps-5 font-bold">Free ice Cream Offer</p>

                <div className="w-[70px] h-[63px] flex items-center justify-center rounded-tl-3xl bg-white bg-opacity-90 ">
                  <div className="w-8 h-8 rounded-full text-xl text-center font-bold  bg-black ">
                    +
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image src={headerImg2} alt="img" />
              <div className="absolute bottom-0 w-full flex justify-between items-center  text-white   ">
                <p className="ps-5 font-bold">First Order Discount</p>

                <div className="w-[70px] h-[63px] flex items-center justify-center rounded-tl-3xl bg-white bg-opacity-90 ">
                  <div className="w-8 h-8 rounded-full text-xl text-center font-bold  bg-black ">
                    +
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ItemShow
            items={items}
            isLoading={itemLoading}
            isFetching={itemFetching}
          />
        </div>

        {/* cart here */}

        <div className="hidden lg:block">
          <MyCart />
        </div>
      </div>
    </div>
  );
};

export default CategoryLayout;
