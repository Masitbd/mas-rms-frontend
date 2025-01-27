import { useGetDefaultDeliveryAddressQuery } from "@/redux/api/deliveryAddress/deliveryAddress.api";
import React, { useEffect, useState } from "react";
import DeliveryAddressModal from "../consumer-profile/DeliveryAddressModal";
import { ENUM_MODE } from "@/enums/EnumMode";
import { updateBillDetails } from "@/redux/features/order/orderSlice";
import { useAppDispatch } from "@/lib/hooks";
import { DELIVERY_METHOD } from "@/enums/DeliveryMethod";
import { useSession } from "next-auth/react";

const DeliveryAddressConfirmtion = () => {
  const session = useSession();
  const dispatch = useAppDispatch();
  const { data, isLoading, isUninitialized } =
    useGetDefaultDeliveryAddressQuery(undefined);
  const [formData, setFormData] = useState<Record<string, any>>();
  const [mode, setMode] = useState(ENUM_MODE.NEW);
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    if (
      session?.status == "authenticated" &&
      !isLoading &&
      !isUninitialized &&
      !data?.data?._id
    ) {
      setOpen(true);
    } else if (!isLoading && !isUninitialized && data?.data?._id) {
      dispatch(
        updateBillDetails({
          deliveryCharge: 100,
          deliveryMethod: DELIVERY_METHOD.DELIVERY,
          deliveryAddress: data?.data,
        })
      );
    }
  }, [data]);
  if (!data?.data?._id)
    return (
      <div>
        <DeliveryAddressModal
          formData={formData}
          sefFormData={setFormData}
          modalOpen={open}
          setModalOpen={setOpen}
          mode={mode}
          setMode={setMode}
        />
      </div>
    );

  return <></>;
};

export default DeliveryAddressConfirmtion;
