import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { IOrder, resetBill } from "@/redux/features/order/orderSlice";
import React from "react";
import { Button, Divider } from "rsuite";
import { IMenuItemConsumption } from "../menu-item-consumption/TypesAndDefault";
import { usePostOrderMutation } from "@/redux/api/order/orderSlice";
import Swal from "sweetalert2";
import { ORDER_PLATFORM } from "@/enums/EnumPlatform";
import { useRouter } from "next/navigation";

const OrderDetails = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const order = useAppSelector((state) => state.order);
  const [post, { isLoading: postLoading }] = usePostOrderMutation();

  const handlePostOrder = async () => {
    const orderData: IOrder = {
      items: order?.items?.map((item) => ({
        ...item,
        item: item?.item?._id as unknown as IMenuItemConsumption,
      })),
      guest: order.guest,
      sCharge: order.sCharge,
      vat: order.vat,
      percentDiscount: order.percentDiscount,
      discountAmount: order.discountAmount,
      totalBill: order.totalBill,
      totalVat: order.totalVat,
      serviceCharge: order.serviceCharge,
      totalDiscount: order.totalDiscount,
      netPayable: order.netPayable,
      pPaymentMode: order?.paymentMode,
      paid: order?.paid ?? 0,
      pPayment: order?.pPayment ?? 0,
      due: order?.due ?? 0,
      cashBack: order?.cashBack ?? 0,
      cashReceived: order?.cashReceived ?? 0,
      paymentMode: order?.paymentMode ?? "cash",
      remark: order?.remark,
      serviceChargeRate: order?.serviceChargeRate ?? 0,
      discountCard: order?.discountCard,
      customer: order?.customer,
      platform: ORDER_PLATFORM.ONLINE,
      deliveryAddress: order?.deliveryAddress,
      deliveryCharge: order?.deliveryCharge,
      deliveryMethod: order?.deliveryMethod,
    } as IOrder;

    // Post order data
    try {
      const result = await post(orderData).unwrap();
      if (result?.success) {
        Swal.fire("Success", "Order Placed Successfully", "success");
        dispatch(resetBill());
        router.push(`/consumer/orders/${result?.data?._id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className=" w-full lg:p-6 p-3  rounded-xl border border-[#DCDCDC] bg-white">
        <div className="flex flex-row justify-between">
          <h2 className="text-2xl font-bold ">Your Order</h2>
        </div>
        <div className="mt-6 font-semibold w-full">
          {order.items?.map((item, index) => {
            return (
              <>
                <div className="flex justify-between f">
                  <h2>
                    {item?.qty} X {item?.item?.itemName}
                  </h2>
                  <h3>{item?.qty * item?.rate}</h3>
                </div>
              </>
            );
          })}

          <Divider />
          <div className="flex justify-between f">
            <h2>Subtotal </h2>
            <h3>{order?.totalBill}</h3>
          </div>
          <div className="flex justify-between f">
            <h2>Vat </h2>
            <h3>{order?.totalVat}</h3>
          </div>
          <div className="flex justify-between f">
            <h2>Delivery </h2>
            <h3>{order?.deliveryCharge}</h3>
          </div>
          <div className="flex justify-between f">
            <h2>Service Charge </h2>
            <h3>{order?.serviceCharge}</h3>
          </div>
          <div className="flex justify-between f">
            <h2>Total Discount </h2>
            <h3 className="text-red-600">{order?.totalDiscount}</h3>
          </div>
        </div>
        <div className="mt-4 ">
          <div className="flex justify-between text-2xl font-bold">
            <div>
              <h2>Total </h2>
              <div className="text-sm font-light">(Incl. fees and tax)</div>
            </div>
            <h3 className="text-[#FC8A06]">{order.netPayable}</h3>
          </div>
        </div>
      </div>
      <Button
        className="w-full !font-extrabold my-5"
        size="lg"
        appearance="primary"
        color="orange"
        disabled={!order?.paymentMode}
        onClick={() => handlePostOrder()}
        loading={postLoading}
      >
        Place Order
      </Button>
    </>
  );
};

export default OrderDetails;
