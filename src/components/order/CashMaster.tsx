/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useDate } from "@/lib/TimerHook";
import { useGetTableListQuery } from "@/redux/api/table/table.api";
import { updateBillDetails } from "@/redux/features/order/orderSlice";
import React from "react";
import { Button, Form, Input, InputPicker, Tag } from "rsuite";

const CashMaster = () => {
  const { time, date } = useDate();
  const state = useAppSelector((state) => state.order);
  const dispatch = useAppDispatch();
  const handleFormChange = (event: Record<string, any>) => {
    dispatch(updateBillDetails(event));
  };
  const {
    data: tableData,
    isLoading: tableDataLoading,
    isFetching: tableDataFetching,
  } = useGetTableListQuery(undefined);

  return (
    <div className="border border-[#DCDCDC] p-2 rounded-md">
      <Form
        className="grid grid-cols-10 gap-x-5"
        fluid
        onChange={handleFormChange}
        formValue={state}
      >
        <Form.Group controlId="billNo">
          <Form.ControlLabel children={"Bill No"} />
          <Form.Control name="billNo" size="sm" disabled />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel children={"Date"} />
          <Form.Control name="billNo" value={date} size="sm" disabled />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel children={"Table Name"} />
          <Form.Control
            name="tableName"
            accepter={InputPicker}
            size="sm"
            data={tableData?.data?.map((td) => ({
              label: td?.name,
              value: td?._id,
            }))}
          />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel children={"Waiter"} />
          <Form.Control name="waiter" accepter={InputPicker} size="sm" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel children={"Guest"} />
          <Form.Control name="guest" type="number" size="sm" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel children={"S.Charge"} />
          <Form.Control name="serviceCharge" type="number" size="sm" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel children={"Vat(%)"} />
          <Form.Control name="vat" size="sm" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel children={"Discount(%)"} />
          <Form.Control name="percentDiscount" size="sm" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel children={"Discount(Amt)"} />
          <Form.Control name="cashDiscount" size="sm" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel children={"Time"} />
          <Form.Control name="time" size="sm" value={time} disabled />
        </Form.Group>
      </Form>

      <div className="grid grid-cols-10 gap-5">
        <div className="col-span-9 grid grid-cols-1 gap-2">
          <div className="grid grid-cols-12 gap">
            <h3 className="col-span-2">Discount Card</h3>
            <Input size="sm" className="col-span-10" />
          </div>
          <div className="grid grid-cols-12">
            <h3 className="col-span-2">Guest Name</h3>
            <Input size="sm" className="col-span-10" />
          </div>
          <div className="grid grid-cols-12">
            <h3 className="col-span-2">Address</h3>
            <Input size="sm" className="col-span-10" />
          </div>
        </div>
        <div className=" flex flex-col justify-around">
          <Tag
            style={{
              color: "#6388FD",
              fontFamily: "roboto",
              fontSize: "1 rem",
              fontWeight: "bold",
            }}
            size="lg"
            className="text-center"
          >
            Posted
          </Tag>
          <Tag
            style={{
              color: "#D70000",
              fontFamily: "roboto",
              fontSize: "1 rem",
              fontWeight: "bold",
            }}
            size="lg"
            className="text-center"
          >
            Active
          </Tag>
        </div>
      </div>
    </div>
  );
};

export default CashMaster;
