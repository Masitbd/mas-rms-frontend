/* eslint-disable react/no-children-prop */

"use client";

import { useAppSelector } from "@/lib/hooks";
import { useSingleKitchenOrderListQuery } from "@/redux/api/order/orderSlice";

import { Button, InputPicker, Modal, Table } from "rsuite";
import { KitchenOrderData } from "./TypesAndDefaultes";

import ModalBody from "rsuite/esm/Modal/ModalBody";
import KitchenOrderDetails from "./KitchenOrderDetails";
import KitchenOrders from "./KitchenOrders";

const ActiveTable = () => {
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  const bill = useAppSelector((state) => state?.order);
  const { data: kitchenList } = useSingleKitchenOrderListQuery(
    bill?._id as string,
    {
      skip: !bill?._id as unknown as boolean,
    }
  );

  return (
    <div className="border border-[#DCDCDC] p-2 rounded-md h-full">
      <div className="text-center">
        {/* <InputPicker block searchable placeholder="Select Active Table" /> */}
        Active Kitchen Orders
      </div>
      <div className="mt-2">
        <Table
          height={200}
          data={
            kitchenList?.data
              ? Object?.keys(kitchenList?.data)?.map((v: string) => {
                  return {
                    kitchenOrderNo: kitchenList?.data[v]?.kitchenOrderNo,
                    billNo: kitchenList?.data[v]?.billNo,
                    items: kitchenList?.data[v]?.items,
                    status: kitchenList?.data[v]?.status,
                    remark: kitchenList?.data[v]?.remark,
                    tableName: kitchenList?.data[v]?.tableName,
                    waiterName: kitchenList?.data[v]?.waiterName,
                  } as KitchenOrderData;
                })
              : []
          }
        >
          <Column flexGrow={2}>
            <HeaderCell>NO.</HeaderCell>
            <Cell dataKey="kitchenOrderNo" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>...</HeaderCell>
            <Cell>
              {(rowData) => {
                return (
                  <>
                    <KitchenOrders order={rowData as KitchenOrderData} />
                  </>
                );
              }}
            </Cell>
          </Column>
        </Table>
      </div>
    </div>
  );
};

export default ActiveTable;
