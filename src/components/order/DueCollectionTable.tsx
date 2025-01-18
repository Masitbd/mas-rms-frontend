/* eslint-disable react/no-children-prop */
import { ENUM_MODE } from "@/enums/EnumMode";
import { useAppSelector } from "@/lib/hooks";
import React from "react";
import { Table } from "rsuite";
import { IProfile } from "../users/Types&Defaults";
import { useGetDueCollectionHistoryQuery } from "@/redux/api/order/orderSlice";
export type IDueCollection = {
  orderId: string;
  amount: number;
  postedBy: IProfile;
  remark?: string;
  method: string;
  _id?: string;
  createdAt?: Date;
};

const DueCollectionTable = (props: { mode: ENUM_MODE }) => {
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  const bill = useAppSelector((state) => state.order);
  const {
    data: dueCollectionList,
    isLoading: dueCollectionLoading,
    isFetching,
  } = useGetDueCollectionHistoryQuery(
    { id: bill?._id as string },
    { skip: !bill?._id }
  );

  return (
    <div className="mb-10">
      <h3 className="text-[#003CFF] font-roboto text-xl font-semibold mt-5">
        Payment History
      </h3>
      <Table
        autoHeight
        data={dueCollectionList?.data}
        loading={dueCollectionLoading || isFetching}
      >
        <Column flexGrow={2}>
          <HeaderCell children="Date" />
          <Cell>
            {(rowData: IDueCollection) => {
              return new Date(
                rowData?.createdAt?.toString() as string
              )?.toLocaleDateString();
            }}
          </Cell>
        </Column>

        <Column flexGrow={1}>
          <HeaderCell children="Collection Amount" />
          <Cell>
            {(rowData: IDueCollection) => {
              return rowData.amount;
            }}
          </Cell>
        </Column>
        <Column flexGrow={1}>
          <HeaderCell children="Method" />
          <Cell>
            {(rowData: IDueCollection) => {
              return rowData.method;
            }}
          </Cell>
        </Column>

        <Column flexGrow={2}>
          <HeaderCell children="Collected By" />
          <Cell>
            {(rowData: IDueCollection) => {
              return rowData?.postedBy?.name;
            }}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default DueCollectionTable;
