"use client";
import { useEffect, useState } from "react";

import ActiveTable from "@/components/order/ActiveTable";
import BillMaster from "@/components/order/BillMaster";
import CashMaster from "@/components/order/CashMaster";
import Items from "@/components/order/Items";

import { ENUM_MODE } from "@/enums/EnumMode";
import { useLazyGetOrderDataForPatchQuery } from "@/redux/api/order/orderSlice";
import Loading from "@/app/Loading";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  resetBill,
  updateBillDetails,
} from "@/redux/features/order/orderSlice";
import DueCollectionTable from "@/components/order/DueCollectionTable";
import { isDueCollectionButtonVisible } from "@/components/order/OrderHelpers";
import { useSession } from "next-auth/react";
import { ENUM_USER } from "@/enums/EnumUser";
export type PageProps = {
  searchParams: { id: string; mode: ENUM_MODE };
};
const NewOrder = (props: PageProps) => {
  const dispatch = useAppDispatch();
  const [
    getOrder,
    { isLoading: orderDataLoading, isError: orderDataFetching },
  ] = useLazyGetOrderDataForPatchQuery();

  const mode = props?.searchParams?.mode ?? ENUM_MODE.NEW;
  const user = useSession();
  const bill = useAppSelector((state) => state.order);

  const [loading, setLoading] = useState(false);

  const [dueVisible, setDueVisible] = useState(false);

  useEffect(() => {
    if (mode == ENUM_MODE.UPDATE) {
      setLoading(true);
      getOrder(props?.searchParams?.id).then((data) => {
        if (data?.isSuccess) {
          dispatch(
            updateBillDetails(JSON.parse(JSON.stringify(data?.data?.data)))
          );

          // changing visibility state of the dew amounts
          if (data?.data?.data?._id && mode == ENUM_MODE.UPDATE) {
            setDueVisible(true);
          }
        }
      });
      setLoading(false);
    }

    if (mode == ENUM_MODE.NEW) {
      dispatch(resetBill());
      dispatch(
        updateBillDetails({
          customer: {
            name: "",
            address: "",
          },
        })
      );
      dispatch(updateBillDetails({ discountCard: "" }));
    }
  }, [mode]);

  if (orderDataLoading || orderDataFetching || loading) {
    return <Loading />;
  }
  return (
    <div className="bg-[#FAFBFF]">
      <div className="grid grid-cols-12 gap-2">
        <div
          className={` ${
            mode == ENUM_MODE.UPDATE ? " col-span-9" : " col-span-12"
          } grid grid-cols-1 gap-2 `}
        >
          <CashMaster mode={mode} key={mode} />
        </div>
        {mode == ENUM_MODE.UPDATE && (
          <div className="col-span-3">
            <ActiveTable key={mode} />
          </div>
        )}

        <div className=" col-span-12">
          <Items />
        </div>

        <div className="col-span-12 h-full">
          <BillMaster mode={mode} />
        </div>
      </div>
      {dueVisible && (
        <div>
          <DueCollectionTable mode={mode} />
        </div>
      )}
    </div>
  );
};

export default NewOrder;
