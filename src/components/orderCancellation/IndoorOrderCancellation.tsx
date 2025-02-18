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
import { useGetAllCancellationQuery } from "@/redux/api/order/orderSlice";
import { useRouter } from "next/navigation";
import useQueryBuilder from "@/helpers/QueryBUilder";
import { ISelectPicker, sortOption } from "../order/TypesAndDefaultes";
import CancellationStatus from "./CancellationStatus";
import { cancellationStatusProvider } from "./CancellationHelper";

const IndoorOrderCancellation = () => {
  const [limit, setLimit] = useState(10);
  const [activePage, setActivePage] = useState(1);
  const { addField, deleteField, query } = useQueryBuilder();
  const {
    data: CancellationData,
    isLoading,
    isFetching,
  } = useGetAllCancellationQuery({ limit, page: activePage, ...query });
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  const router = useRouter();

  return (
    <div>
      <div>
        <div className="my-5 grid grid-cols-12 gap-2">
          {/* <InputGroup className="col-span-3">
            <Input
              placeholder="search"
              onChange={(v) => addField("searchTerm", v)}
              value={query?.searchTerm ?? ""}
            />
          </InputGroup> */}

          <SelectPicker
            placeholder={"status"}
            size="lg"
            className="col-span-2"
            data={cancellationStatusProvider.map((so: ISelectPicker) => ({
              label: so.label,
              value: so.value,
            }))}
            cleanable
            onChange={(v) => addField("status", v)}
            onClean={() => deleteField("status")}
          />
          {/* <SelectPicker
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
          /> */}
        </div>
      </div>
      <Table
        autoHeight
        cellBordered
        bordered
        loading={isLoading || isFetching}
        data={CancellationData?.data?.result}
      >
        <Column flexGrow={1}>
          <HeaderCell children="Order No." flexGrow={1} />
          <Cell dataKey="orderId.billNo" />
        </Column>
        <Column flexGrow={3}>
          <HeaderCell children="Refund Reason" flexGrow={1} />
          <Cell dataKey="reason" />
        </Column>
        <Column flexGrow={1}>
          <HeaderCell children="Price" flexGrow={1} />
          <Cell dataKey="orderId.totalBill" />
        </Column>
        <Column flexGrow={1}>
          <HeaderCell children="Platform" flexGrow={1} />
          <Cell dataKey="orderId.platform" className="capitalize" />
        </Column>
        <Column flexGrow={1}>
          <HeaderCell children="Status" flexGrow={1} />
          <Cell dataKey="status" className="capitalize" />
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
                      onClick={() =>
                        router.push(`/cancellation/${rowdata?.orderId?._id}`)
                      }
                    >
                      <EditIcon />
                    </Button>
                  </div>
                </>
              );
            }}
          </Cell>
        </Column>
      </Table>
      <div>
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
            total={CancellationData?.data?.meta?.total}
            limit={limit}
            limitOptions={[5, 10, 20, 50]}
            maxButtons={5}
            activePage={activePage}
            onChangePage={setActivePage}
            onChangeLimit={setLimit}
          />
        </div>
      </div>
    </div>
  );
};

export default IndoorOrderCancellation;
