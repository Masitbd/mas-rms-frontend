import React from "react";
import { Table } from "rsuite";
type PaymentMode = {
  _id: string;
  total: number;
};
const DailySalesSummeryPaymentMode = ({ data }: { data: PaymentMode[] }) => {
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  return (
    <div className="rounded-xl border border-gray-200 bg-white  my-4 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="space-y-0.5 ">
          <p className=" font-bold text-slate-800 ">Payment Mode:</p>
        </div>
      </div>
      <Table data={data} autoHeight>
        <Column flexGrow={1} align="left">
          <HeaderCell>Method</HeaderCell>
          <Cell dataKey="_id" className="uppercase" />
        </Column>
        <Column flexGrow={1} align="left">
          <HeaderCell>Amount</HeaderCell>
          <Cell dataKey="total" />
        </Column>
      </Table>
    </div>
  );
};

export default DailySalesSummeryPaymentMode;
