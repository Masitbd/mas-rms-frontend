/* eslint-disable react/no-children-prop */
import React, { useState } from "react";
import {
  Button,
  Input,
  InputGroup,
  Pagination,
  SelectPicker,
  Table,
} from "rsuite";
import EditIcon from "@rsuite/icons/Edit";
import ViewIcon from "@rsuite/icons/EyeClose";
import { useRouter } from "next/navigation";
import { useGetOrdersQuery } from "@/redux/api/order/orderSlice";
import ActiveTableList from "./ActiveTableList";
import { useGetWaiterListQuery } from "@/redux/api/waiter/waiter.api";
import { useGetTableListQuery } from "@/redux/api/table/table.api";
import useQueryBuilder from "@/helpers/QueryBUilder";
import { IOrder } from "@/redux/features/order/orderSlice";

const OrderTable = () => {
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  const [limit, setLimit] = useState(10);
  const { addField, deleteField, query } = useQueryBuilder();
  const [activePage, setActivePage] = useState(1);
  const {
    data: orderData,
    isLoading: orderDataLoading,
    isFetching: orderDataFetching,
  } = useGetOrdersQuery({ limit, page: activePage, ...query });
  const { data: waiterData } = useGetWaiterListQuery(undefined);
  const { data: tableData } = useGetTableListQuery(undefined);

  const router = useRouter();
  const editHandler = async (payload: IOrder) => {
    if (payload?._id) {
      router.push(`/order/new?mode=update&id=${payload?._id}`);
    }
  };

  const viewHandler = async (payload: IOrder) => {
    if (payload?._id) {
      router.push(`/order/new?mode=view&id=${payload?._id}`);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-9">
          <Table
            autoHeight
            cellBordered
            bordered
            loading={orderDataLoading || orderDataFetching}
            data={orderData?.data?.result}
          >
            <Column flexGrow={1}>
              <HeaderCell children="Order No." flexGrow={1} />
              <Cell dataKey="billNo" />
            </Column>
            <Column flexGrow={3}>
              <HeaderCell children="Customer Name" flexGrow={1} />
              <Cell dataKey="customer.name" />
            </Column>
            <Column flexGrow={1}>
              <HeaderCell children="Price" flexGrow={1} />
              <Cell dataKey="netPayable" />
            </Column>
            <Column flexGrow={1}>
              <HeaderCell children="Status" flexGrow={1} />
              <Cell dataKey="status" />
            </Column>
            <Column flexGrow={2} align="center">
              <HeaderCell children="... " flexGrow={1} />
              <Cell>
                {(rowdata) => {
                  return (
                    <>
                      <div className="grid grid-cols-6 items-center justify-items-center gap-5">
                        <Button
                          appearance="ghost"
                          color="blue"
                          onClick={() => editHandler(rowdata)}
                        >
                          <EditIcon />
                        </Button>

                        <Button
                          appearance="ghost"
                          color="green"
                          onClick={() => viewHandler(rowdata as IOrder)}
                        >
                          <ViewIcon />
                        </Button>
                      </div>
                    </>
                  );
                }}
              </Cell>
            </Column>
          </Table>
          <div className="my-5">
            <Pagination
              layout={["total", "-", "limit", "|", "pager", "skip"]}
              size={"md"}
              prev={true}
              next={true}
              first={true}
              last={true}
              ellipsis={true}
              boundaryLinks={true}
              total={orderData?.data?.meta?.total}
              limit={limit}
              limitOptions={[10, 20, 50]}
              maxButtons={5}
              activePage={activePage}
              onChangePage={setActivePage}
              onChangeLimit={setLimit}
            />
          </div>
        </div>
        <div className="col-span-3 ">
          <ActiveTableList />
        </div>
      </div>
      <div className="col-span-3 ">
        <ActiveTableList />
      </div>
    </div>
  );
};

export default OrderTable;
