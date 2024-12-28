"use client";
import { useEffect, useState } from "react";

import ActiveTable from "@/components/order/ActiveTable";
import BillMaster from "@/components/order/BillMaster";
import CashMaster from "@/components/order/CashMaster";
import Items from "@/components/order/Items";

import { ENUM_MODE } from "@/enums/EnumMode";
import { useLazyGetOrderDataForPatchQuery } from "@/redux/api/order/orderSlice";
import Loading from "@/app/Loading";
import { useAppDispatch } from "@/lib/hooks";
import { updateBillDetails } from "@/redux/features/order/orderSlice";
import { PageProps } from "../../../../../.next/types/app/api/auth/[...nextauth]/route";

const NewOrder = (props: PageProps) => {
  const dispatch = useAppDispatch();
  const [
    getOrder,
    { isLoading: orderDataLoading, isError: orderDataFetching },
  ] = useLazyGetOrderDataForPatchQuery();

  const mode = props?.searchParams?.mode ?? ENUM_MODE.NEW;

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (mode == ENUM_MODE.UPDATE) {
      setLoading(true);
      getOrder(props?.searchParams?.id).then((data) => {
        if (data?.isSuccess) {
          dispatch(
            updateBillDetails(JSON.parse(JSON.stringify(data?.data?.data)))
          );
        }
      });
      setLoading(false);
    }
  }, [mode]);

  if (orderDataLoading || orderDataFetching || loading) {
    return <Loading />;
  }
  return (
    <div className="bg-[#FAFBFF]">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-9 grid grid-cols-1 gap-2 ">
          <CashMaster mode={mode} />
        </div>
        <div className="col-span-3">
          <ActiveTable />
        </div>

        <div className=" col-span-12">
          <Items />
        </div>

        <div className="col-span-12 h-full">
          <BillMaster mode={mode} />
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
