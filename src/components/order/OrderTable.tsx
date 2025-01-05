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
import { NavLink } from "../layout/Navlink";
import { useGetWaiterListQuery } from "@/redux/api/waiter/waiter.api";
import { useGetTableListQuery } from "@/redux/api/table/table.api";
import useQueryBuilder, { QueryBuilder } from "@/helpers/QueryBUilder";
import SearchIcon from "@rsuite/icons/Search";
import CloseIcon from "@rsuite/icons/Close";
import { ISelectPicker, sortOption, statusOption } from "./TypesAndDefaultes";
import { TTableData } from "../Table/Table";
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
    <>
      <div className="my-5 grid grid-cols-12 gap-2">
        <Button
          appearance="primary"
          color="blue"
          as={NavLink}
          href={`/order/new?mode=new`}
          style={{ backgroundColor: "#194BEE" }}
          size="lg"
        >
          Add New
        </Button>
        <InputGroup className="col-span-3">
          <Input
            placeholder="search"
            onChange={(v) => addField("searchTerm", v)}
            value={query?.searchTerm ?? ""}
          />
          <InputGroup.Addon style={{ backgroundColor: "white" }}>
            <CloseIcon
              className="text-xs cursor-pointer hover:text-xl "
              color="red"
              onClick={() => deleteField("searchTerm")}
            />
          </InputGroup.Addon>
          <InputGroup.Addon>
            <SearchIcon />
          </InputGroup.Addon>
        </InputGroup>
        <SelectPicker
          placeholder={"waiter"}
          size="lg"
          data={waiterData?.data?.map((wd: TTableData) => ({
            label: wd?.name,
            value: wd?._id,
          }))}
          onChange={(v) => addField("waiter", v)}
          className="col-span-2"
          cleanable
          onClean={() => deleteField("waiter")}
        />
        <SelectPicker
          placeholder={"table"}
          size="lg"
          data={tableData?.data?.map((wd: TTableData) => ({
            label: wd?.name,
            value: wd?._id,
          }))}
          className="col-span-2"
          cleanable
          onChange={(v) => addField("tableName", v)}
          onClean={() => deleteField("tableName")}
        />
        <SelectPicker
          placeholder={"status"}
          size="lg"
          className="col-span-2"
          data={statusOption.map((so: ISelectPicker) => ({
            label: so.label,
            value: so.value,
          }))}
          cleanable
          onChange={(v) => addField("status", v)}
          onClean={() => deleteField("status")}
        />
        <SelectPicker
          placeholder={"Sort By"}
          size="lg"
          className="col-span-2"
          data={sortOption.map((so: ISelectPicker) => ({
            label: so.label,
            value: so.value,
          }))}
          cleanable
          onChange={(v) => addField("sort", v)}
          onClean={() => deleteField("sort")}
        />
      </div>
      <div className="grid grid-cols-12 gap-2">
        <div className="xl:col-span-9 col-span-10">
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
              <Cell align="center">
                {(rowdata) => {
                  return (
                    <>
                      <div className="grid grid-cols-2 items-center justify-items-center gap-5">
                        <Button
                          appearance="primary"
                          color="blue"
                          onClick={() => editHandler(rowdata as IOrder)}
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          appearance="primary"
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
        <div className="xl:col-span-3 col-span-2">
          <ActiveTableList />
        </div>
      </div>
    </>
  );
};

export default OrderTable;
