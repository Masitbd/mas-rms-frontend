/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useDate } from "@/lib/TimerHook";
import { useLazyGetCustomerByDiscountCodeQuery } from "@/redux/api/customer/customer.api";

import { useGetTableListQuery } from "@/redux/api/table/table.api";
import { useGetWaiterListQuery } from "@/redux/api/waiter/waiter.api";
import CheckRoundIcon from "@rsuite/icons/CheckRound";
import WarningRoundIcon from "@rsuite/icons/WarningRound";
import SearchPeopleIcon from "@rsuite/icons/SearchPeople";

import {
  IUnregisteredCustomerInfo,
  updateBillDetails,
  updateCustomerInfo,
} from "@/redux/features/order/orderSlice";
import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputGroup,
  InputPicker,
  Loader,
  Message,
  Tag,
  toaster,
} from "rsuite";
import { ICashMasterProps } from "./TypesAndDefaultes";
import { ENUM_MODE } from "@/enums/EnumMode";
import { useGetActiveTableListQuery } from "@/redux/api/order/orderSlice";
import { TTableData } from "../Table/Table";

const CashMaster = (props: ICashMasterProps) => {
  // Data source
  const {
    data: tableData,
    isLoading: tableDataLoading,
    isFetching: tableDataFetching,
  } = useGetTableListQuery(undefined);

  const {
    data: waiterData,
    isLoading: waiterLoading,
    isFetching: waiterFetching,
  } = useGetWaiterListQuery(undefined);

  const [
    getCustomer,
    {
      isLoading: singleCustomerLoading,
      isFetching: singelCustomerFetching,
      isSuccess: customerInfoSuccess,
      isError: CustomerInfoError,
    },
  ] = useLazyGetCustomerByDiscountCodeQuery();

  const { data: activeTableListData, isLoading: activeTableDataLoading } =
    useGetActiveTableListQuery(undefined);

  const { time, date } = useDate();
  const state = useAppSelector((state) => state.order);
  const dispatch = useAppDispatch();

  // Handler functions
  const handleFormChange = (event: Record<string, any>) => {
    dispatch(updateBillDetails(event));
  };

  const handleCustomerInfoChange = (
    data: Partial<IUnregisteredCustomerInfo>
  ) => {
    const customerData = Object.assign(state.customer, data);
    dispatch(updateBillDetails({ customer: customerData }));
  };

  const addonIconProvider = () => {
    if (singleCustomerLoading || singelCustomerFetching) {
      return <Loader size="xs" />;
    }
    if (customerInfoSuccess) {
      return <CheckRoundIcon color="green" />;
    }

    if (CustomerInfoError) {
      return <WarningRoundIcon color="red" />;
    } else {
      return <SearchPeopleIcon color="gray" />;
    }
  };

  useEffect(() => {
    if (state.discountCard && props?.mode == ENUM_MODE.NEW) {
      const timeoutId = setTimeout(async () => {
        try {
          const data = await getCustomer(state.discountCard as string).unwrap();
          if (data?.success) {
            dispatch(updateBillDetails({ customer: data?.data }));
            toaster.push(
              <Message type="success">
                {data?.message ?? "Info Retrieved successfully"}
              </Message>
            );
          }
        } catch (error) {
          toaster.push(
            <Message type="error">
              {(error as string) ?? ("Failed" as string)}
            </Message>
          );
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [state.discountCard]);

  useEffect(() => {
    if (state.discountCard && props?.mode == ENUM_MODE.NEW) {
      const timeoutId = setTimeout(async () => {
        try {
          const data = await getCustomer(state.discountCard as string).unwrap();
          if (data?.success) {
            dispatch(updateBillDetails({ customer: data?.data }));
            toaster.push(
              <Message type="success">
                {data?.message ?? "Info Retrieved successfully"}
              </Message>
            );
          }
        } catch (error) {
          toaster.push(
            <Message type="error">
              {(error as string) ?? ("Failed" as string)}
            </Message>
          );
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [state.discountCard]);

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
            data={tableData?.data?.map((td: TTableData) => ({
              label: td?.name,
              value: td?._id,
            }))}
            disabledItemValues={activeTableListData?.data}
          />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel children={"Waiter"} />
          <Form.Control
            name="waiter"
            accepter={InputPicker}
            size="sm"
            data={waiterData?.data?.map((td: TTableData) => ({
              label: td?.name,
              value: td?._id,
            }))}
          />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel children={"Guest"} />
          <Form.Control name="guest" type="number" size="sm" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel children={"S.Charge(%)"} />
          <Form.Control name="serviceChargeRate" type="number" size="sm" />
          <Form.ControlLabel children={"S.Charge(%)"} />
          <Form.Control name="serviceChargeRate" type="number" size="sm" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel children={"Vat(%)"} />
          <Form.Control name="vat" size="sm" type="number" />
          <Form.Control name="vat" size="sm" type="number" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel children={"Discount(%)"} />
          <Form.Control name="percentDiscount" size="sm" type="number" />
          <Form.Control name="percentDiscount" size="sm" type="number" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel children={"Discount(Amt)"} />
          <Form.Control name="discountAmount" size="sm" type="number" />
          <Form.Control name="discountAmount" size="sm" type="number" />
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
            <InputGroup className="w-full col-span-10">
              <Input
                size="sm"
                className="col-span-10"
                onChange={(v) =>
                  dispatch(updateBillDetails({ discountCard: v }))
                }
                value={state?.discountCard}
              />
              <InputGroup.Addon>{addonIconProvider()}</InputGroup.Addon>
            </InputGroup>
            <InputGroup className="w-full col-span-10">
              <Input
                size="sm"
                className="col-span-10"
                onChange={(v) =>
                  dispatch(updateBillDetails({ discountCard: v }))
                }
                value={state?.discountCard}
              />
              <InputGroup.Addon>{addonIconProvider()}</InputGroup.Addon>
            </InputGroup>
          </div>
          <div className="grid grid-cols-12">
            <h3 className="col-span-2">Guest Name</h3>
            <Input
              size="sm"
              className="col-span-10"
              value={state?.customer?.name}
              onChange={(v) => dispatch(updateCustomerInfo({ name: v }))}
            />
            <Input
              size="sm"
              className="col-span-10"
              value={state?.customer?.name}
              onChange={(v) => dispatch(updateCustomerInfo({ name: v }))}
            />
          </div>
          <div className="grid grid-cols-12">
            <h3 className="col-span-2">Address</h3>
            <Input
              size="sm"
              className="col-span-10"
              value={state?.customer?.address}
              onChange={(v) => dispatch(updateCustomerInfo({ address: v }))}
            />
            <Input
              size="sm"
              className="col-span-10"
              value={state?.customer?.address}
              onChange={(v) => dispatch(updateCustomerInfo({ address: v }))}
            />
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
