/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/no-children-prop */
import React, { Ref, useEffect, useRef, useState } from "react";
import TrashIcon from "@rsuite/icons/Trash";

import {
  Button,
  Checkbox,
  Input,
  InputPicker,
  Message,
  PickerHandle,
  Radio,
  SelectPicker,
  Table,
  Tag,
  toaster,
} from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import { useGetConsumptionQuery } from "@/redux/api/rawMaterialConsumption/rawMaterialConsumption.api";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  addItem,
  changeQty,
  decrementQty,
  incrementQty,
  removeItem,
  setItemDiscount,
  toggleDiscount,
  toggleVat,
} from "@/redux/features/order/orderSlice";
import PlusRoundIcon from "@rsuite/icons/PlusRound";
import MinusRoundIcon from "@rsuite/icons/MinusRound";

import {
  IItemConsumption,
  IMenuItemConsumption,
} from "../menu-item-consumption/TypesAndDefault";
const Items = () => {
  const itemCodeRef = useRef<PickerHandle>();
  const itemNameRef = useRef<PickerHandle>();
  const qtyRef = useRef<HTMLInputElement>(null);
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  const [searchTerm, setSearchTerm] = useState("");
  const [item, setItem] = useState<IMenuItemConsumption>();
  const [qty, setQty] = useState(1);
  const {
    data: consumptionData,
    isLoading: consumptionDataLoading,
    isFetching: consumptionDataFeatching,
  } = useGetConsumptionQuery({
    searchTerm: searchTerm,
  });

  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.order);

  const handleAdd = () => {
    const doesExists =
      state?.items?.length &&
      state.items.find((i) => i?.item?._id == item?._id);

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
    setItem(null as unknown as IMenuItemConsumption);
    setQty(1);
    if (itemCodeRef && itemCodeRef.current !== undefined) {
      itemCodeRef?.current?.open && itemCodeRef?.current?.open();
      itemCodeRef?.current?.target?.focus();
    }
  };

  const handleRemove = (id: string) => {
    console.log(id);
    dispatch(removeItem(id));
  };

  const handleIncrementQty = (id: string) => {
    dispatch(incrementQty(id));
  };

  const handleDecrementQty = (id: string) => {
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
    <div className="border border-[#DCDCDC] p-2 rounded-md">
      <div className="grid 2xl:grid-cols-12 gap-2 xl:grid-cols-10 lg:grid-cols-8 grid-cols-6">
        <div className="lg:max-2xl:col-span-2 col-span-1 ">
          <h2>Item Code</h2>
          <SelectPicker
            size="sm"
            caretAs={SearchIcon}
            searchable
            data={consumptionData?.data?.map((cd: IMenuItemConsumption) => ({
              label: cd?.itemCode,
              value: cd?._id,
              children: cd,
            }))}
            onSelect={(v, v1, v2) =>
              selectHandler(v1?.children as unknown as IMenuItemConsumption)
            }
            value={item?._id}
            disabledItemValues={
              state?.items?.map((i) => i?.item?._id) as string[]
            }
            onSearch={(v) => setSearchTerm(v)}
            loading={consumptionDataFeatching || consumptionDataFeatching}
            ref={itemCodeRef as Ref<PickerHandle>}
            block
          />
        </div>
        <div className="2xl:col-span-8  xl:col-span-5 lg:col-span-3 col-span-2">
          <h2>Item Name</h2>
          <SelectPicker
            size="sm"
            caretAs={SearchIcon}
            searchable
            block
            placeholder={"Item name"}
            data={consumptionData?.data?.map((cd: IMenuItemConsumption) => ({
              label: cd?.itemName,
              value: cd?._id,
              children: cd,
            }))}
            onSelect={(v, v1, v2) =>
              selectHandler(v1?.children as unknown as IMenuItemConsumption)
            }
            value={item?._id}
            disabledItemValues={
              state?.items?.map((i) => i?.item?._id) as string[]
            }
            onSearch={(v) => setSearchTerm(v)}
            loading={consumptionDataFeatching || consumptionDataFeatching}
            ref={itemNameRef as Ref<PickerHandle>}
          />
        </div>
        <div>
          <h2>Qty</h2>
          <Input
            size="sm"
            type="number"
            onChange={(v) => setQty(Number(v))}
            value={qty}
            onPressEnter={() => handleAdd()}
            ref={qtyRef}
          />
        </div>
        <div>
          <h2>Rate</h2>
          <Input size="sm" type="number" value={item?.rate} disabled />
        </div>
        <div className="">
          <br />
          <Button
            size="sm"
            appearance="primary"
            color="green"
            className="whitespace-pre"
            onClick={() => handleAdd()}
          >
            Add
          </Button>
        </div>
      </div>

      <div className="my-2">
        <Table bordered cellBordered height={230} data={state?.items}>
          <Column flexGrow={1}>
            <HeaderCell children="Item code" />
            <Cell dataKey="item.itemCode" />
          </Column>
          <Column flexGrow={3}>
            <HeaderCell children="Item Name" />
            <Cell dataKey="item.itemName" />
          </Column>
          <Column flexGrow={1.2}>
            <HeaderCell children="Qty" />
            <Cell>
              {(rowData) => {
                return (
                  <>
                    {
                      <div className="grid grid-cols-4 gap-2">
                        <Button
                          size="xs"
                          appearance="ghost"
                          color="blue"
                          onClick={() =>
                            handleIncrementQty(rowData?.item?.itemCode)
                          }
                          className="cos"
                        >
                          <PlusRoundIcon />
                        </Button>
                        <Input
                          value={rowData?.qty}
                          size="sm"
                          type="number"
                          onChange={(v) =>
                            dispatch(
                              changeQty({ ...rowData?.item, qty: Number(v) })
                            )
                          }
                          className="col-span-2 [&::-webkit-inner-spin-button]:appearance-none text-center"
                        />
                        <Button
                          size="xs"
                          appearance="ghost"
                          color="orange"
                          onClick={() =>
                            handleDecrementQty(rowData?.item?.itemCode)
                          }
                        >
                          <MinusRoundIcon />
                        </Button>
                      </div>
                    }
                  </>
                );
              }}
            </Cell>
          </Column>
          <Column flexGrow={0.7}>
            <HeaderCell children="Disc(%)" />
            <Cell>
              {(rowData) => {
                return (
                  <>
                    <Input
                      size="sm"
                      name="discount"
                      type="number"
                      className="[&::-webkit-inner-spin-button]:appearance-none"
                      onChange={(v) =>
                        dispatch(
                          setItemDiscount({
                            item: rowData?.item,
                            discount: Number(v),
                          })
                        )
                      }
                      value={rowData?.discount}
                      disabled
                    />
                  </>
                );
              }}
            </Cell>
          </Column>
          <Column flexGrow={0.7}>
            <HeaderCell children="Rate" />
            <Cell dataKey="rate" />
          </Column>
          <Column flexGrow={0.7}>
            <HeaderCell children="No Disc" />
            <Cell>
              {(rowData) => {
                return (
                  <Checkbox
                    checked={!rowData?.isDiscount}
                    onChange={() =>
                      dispatch(toggleDiscount(rowData?.item?.itemCode))
                    }
                  />
                );
              }}
            </Cell>
          </Column>
          <Column flexGrow={0.8}>
            <HeaderCell children="No Vat" />
            <Cell>
              {(rowData) => {
                return (
                  <Checkbox
                    checked={!rowData?.isVat}
                    onChange={() =>
                      dispatch(toggleVat(rowData?.item?.itemCode))
                    }
                  />
                );
              }}
            </Cell>
          </Column>

          <Column flexGrow={0.5}>
            <HeaderCell children="..." />
            <Cell>
              {(rowData) => {
                return (
                  <Button
                    appearance="primary"
                    color="red"
                    size="sm"
                    onClick={() => handleRemove(rowData?.item?.itemCode)}
                  >
                    <TrashIcon />
                  </Button>
                );
              }}
            </Cell>
          </Column>
        </Table>
      </div>
    </div>
  );
};

export default Items;
