"use client";
import { useGetUserOrdersQuery } from "@/redux/api/order/orderSlice";
import React, { useEffect, useState } from "react";
import { Button, Table } from "rsuite";
import EyeRoundIcon from "@rsuite/icons/EyeRound";
import CloseIcon from "@rsuite/icons/Close";
import Link from "next/link";

const Orders = () => {
  const {
    data: orderData,
    isLoading: orderDataLoading,
    isFetching: orderDataFetching,
  } = useGetUserOrdersQuery(undefined);
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const updateIsDesktop = () => {
      setIsDesktop(window.innerWidth > 1020);
    };

    // Update the state on mount
    updateIsDesktop();

    // Add resize event listener
    window.addEventListener("resize", updateIsDesktop);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("resize", updateIsDesktop);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto my-40 lg:p-0 px-2">
      <h2 className="text-4xl font-semibold my-2">Recent Orders</h2>
      <Table
        loading={orderDataLoading || orderDataFetching}
        data={orderData?.data}
        autoHeight
      >
        <Column flexGrow={1}>
          <HeaderCell>Order Id</HeaderCell>
          <Cell dataKey="billNo" />
        </Column>
        {isDesktop && (
          <>
            <Column flexGrow={1.5}>
              <HeaderCell>Date</HeaderCell>
              <Cell>
                {(rowData) => {
                  return (
                    <>{new Date(rowData?.createdAt).toLocaleDateString()}</>
                  );
                }}
              </Cell>
            </Column>
            <Column flexGrow={0.5}>
              <HeaderCell>Items</HeaderCell>
              <Cell>
                {(rowData) => {
                  return <>{rowData?.items?.length}</>;
                }}
              </Cell>
            </Column>
          </>
        )}
        <Column flexGrow={0.5}>
          <HeaderCell>Action</HeaderCell>
          <Cell>
            {(rowData) => {
              return (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    appearance="primary"
                    color="green"
                    title="view"
                    as={Link}
                    href={`/consumer/orders/${rowData?._id}`}
                  >
                    <EyeRoundIcon />
                  </Button>
                  <Button
                    appearance="primary"
                    color="red"
                    title="cancel"
                    as={Link}
                    href={`/consumer/orders/cancellation/${rowData?._id}`}
                  >
                    <CloseIcon />
                  </Button>
                </div>
              );
            }}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default Orders;
