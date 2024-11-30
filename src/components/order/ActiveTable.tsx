import React from "react";
import { InputPicker, Table } from "rsuite";

const ActiveTable = () => {
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  return (
    <div className="border border-[#DCDCDC] p-2 rounded-md h-full">
      <div>
        <InputPicker block searchable placeholder="Select Active Table" />
      </div>
      <div className="mt-2">
        <Table height={470}>
          <Column flexGrow={2}>
            <HeaderCell>Table Name</HeaderCell>
            <Cell dataKey="tableName" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Waiter</HeaderCell>
            <Cell dataKey="waiter" />
          </Column>
        </Table>
      </div>
    </div>
  );
};

export default ActiveTable;
