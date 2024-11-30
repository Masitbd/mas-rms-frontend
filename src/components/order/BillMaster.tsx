import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { resetBill } from "@/redux/features/order/orderSlice";
import { useRouter } from "next/navigation";
import React from "react";
import { Button, Input, InputPicker } from "rsuite";

const BillMaster = () => {
  const dispatch = useAppDispatch();
  const bill = useAppSelector((state) => state.order);
  const router = useRouter();
  const cancelHandler = () => {
    dispatch(resetBill());
    router.push("/order");
  };
  return (
    <div>
      <h3 className="text-[#003CFF] font-roboto text-xl font-semibold">
        Bill Master
      </h3>
      <div className="border border-[#DCDCDC] p-2 rounded-md">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-3 grid grid-cols-1 gap-2">
            <div className="grid grid-cols-3">
              <label htmlFor="">Total Bill</label>
              <Input
                size="sm"
                className="col-span-2"
                value={bill?.totalBill}
                disabled
              />
            </div>
            <div className="grid grid-cols-3">
              <label htmlFor="">Total Vat</label>
              <Input
                size="sm"
                className="col-span-2"
                value={bill?.totalVat}
                disabled
              />
            </div>
            <div className="grid grid-cols-3">
              <label htmlFor="">Service Charge</label>
              <Input
                size="sm"
                className="col-span-2"
                value={bill?.serviceCharge}
                disabled
              />
            </div>

            <div className="grid grid-cols-3">
              <label htmlFor="">Total Discount</label>
              <Input
                size="sm"
                className="col-span-2"
                value={bill.totalDiscount}
                disabled
              />
            </div>
            <div className="grid grid-cols-3">
              <label htmlFor="">Net Payable</label>
              <Input
                size="sm"
                className="col-span-2"
                value={bill?.netPayable}
                disabled
              />
            </div>
          </div>

          <div className="col-span-3 grid grid-cols-1 gap-2">
            <div className="grid grid-cols-3">
              <label htmlFor="">Payment Mode</label>
              <InputPicker size="sm" className="col-span-2" />
            </div>
            <div className="grid grid-cols-3">
              <label htmlFor="">Remark</label>
              <Input size="sm" className="col-span-2" />
            </div>
            <div className="grid grid-cols-3">
              <label htmlFor="">P. Payment Mode</label>
              <InputPicker size="sm" className="col-span-2" />
            </div>

            <div className="grid grid-cols-3">
              <label htmlFor="">Paid</label>
              <Input size="sm" className="col-span-2" />
            </div>
            <div className="grid grid-cols-3">
              <label htmlFor="">P. Payment</label>
              <Input size="sm" className="col-span-2" />
            </div>
            <div className="grid grid-cols-3">
              <label htmlFor="">Due</label>
              <Input size="sm" className="col-span-2" />
            </div>
          </div>

          <div className="col-span-3">
            <div className="grid grid-cols-3 mb-2">
              <label htmlFor="">Total Bill</label>
              <div className="col-span-2 ">
                <Input size="sm" className="col-span-2 w" />
              </div>
            </div>
            <div className="grid grid-cols-3">
              <label htmlFor="">Total Vat</label>
              <div className="col-span-2 ">
                <Input size="sm" className="col-span-2 w" />
              </div>
            </div>
          </div>

          <div className="col-span-3 grid grid-cols-2 gap-2">
            <Button
              size="lg"
              appearance="primary"
              style={{ backgroundColor: "#003CFF" }}
            >
              Save
            </Button>
            <Button
              size="lg"
              appearance="primary"
              style={{ backgroundColor: "#003CFF" }}
            >
              Save & Print
            </Button>
            <Button
              size="lg"
              appearance="primary"
              style={{ backgroundColor: "#003CFF" }}
            >
              Save & Exit
            </Button>
            <Button
              color="red"
              size="lg"
              appearance="primary"
              onClick={() => cancelHandler()}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillMaster;
