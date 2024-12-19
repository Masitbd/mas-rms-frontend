/* eslint-disable react/no-children-prop */
import React, { useState } from "react";
import { Modal, Button, Table } from "rsuite";
import { KitchenOrderData } from "./TypesAndDefaultes";
import { useAppSelector } from "@/lib/hooks";

// KitchenOrderDetails Component
const KitchenOrderDetails = ({
  kitchenItem,
  onClose,
}: {
  kitchenItem: KitchenOrderData;
  onClose: () => void;
}) => {
  const { Cell, Column, HeaderCell } = Table;
  const bill = useAppSelector((state) => state?.order);
  return (
    <Modal open={true} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>Kitchen Order Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <h2 className="font-roboto text-xl font-semibold ">Bill Details</h2>
          <div className="grid grid-cols-3 gap-2">
            <div>Bill No:</div>
            <div>{kitchenItem?.billNo}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>Guest:</div>
            <div>{bill?.guest}</div>
          </div>
        </div>
        <h2 className="font-roboto text-xl font-semibold ">Item Details</h2>
        <Table data={kitchenItem?.items ?? []} bordered cellBordered autoHeight>
          <Column flexGrow={1}>
            <HeaderCell children={"Item Code "} />
            <Cell dataKey="itemCode" />
          </Column>
          <Column flexGrow={3}>
            <HeaderCell children={"Item Name "} />
            <Cell dataKey="itemName" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell children={"Qty "} />
            <Cell dataKey="qty" />
          </Column>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} appearance="primary" color="red">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default KitchenOrderDetails;
