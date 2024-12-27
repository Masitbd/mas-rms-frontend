/* eslint-disable react/no-children-prop */
import React, { Dispatch, SetStateAction, useState } from "react";
import { Button, Pagination, Table } from "rsuite";
import { ConsumptionListProps, IItemConsumption } from "./TypesAndDefault";
import { IRawMaterial } from "../raw-material-setup/TypesAndDefault";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import ConsumptionList from "./ConsumptionList";
import { ENUM_MODE } from "@/enums/EnumMode";

const ConsumptionListTable = (
  props: {
    data: IItemConsumption<IRawMaterial>[];
  } & ConsumptionListProps
) => {
  const { formData, isOpen, mode, setFormData, setMode, setOpen } = props;
  const [consumptionListMode, setConsumptionListMode] = useState(ENUM_MODE.NEW);
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  const [updatableData, setUpdatableData] =
    useState<IItemConsumption<IRawMaterial>>();

  const itemRemover = (id: string) => {
    const updatedData = props.data.filter((item) => item.item.id !== id);
    props.setFormData({ ...props.formData, consumptions: updatedData });
  };

  const updateHandler = (value: IItemConsumption<IRawMaterial>) => {
    setUpdatableData(value);
    setOpen(true);
    setConsumptionListMode(ENUM_MODE.UPDATE);
  };

  console.log(props?.formData);
  return (
    <div>
      <Table data={props?.formData?.consumptions} autoHeight>
        <Column flexGrow={1}>
          <HeaderCell children="Material Id" />
          <Cell dataKey="item.id" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell children="Material Name" />
          <Cell dataKey="item.materialName" />
        </Column>
        <Column flexGrow={1}>
          <HeaderCell children="Quantity" />
          <Cell dataKey="qty" />
        </Column>
        <Column flexGrow={1}>
          <HeaderCell children="Unit" />
          <Cell dataKey="item.baseUnit" />
        </Column>
        <Column flexGrow={1}>
          <HeaderCell children="Rate" />
          <Cell dataKey="item.rate" />
        </Column>
        <Column flexGrow={1}>
          <HeaderCell children="Amount" />
          <Cell>
            {(rowData: IItemConsumption<IRawMaterial>) => {
              if (rowData?.qty && rowData?.item?.rate) {
                const total = rowData.qty * rowData.item.rate;
                return total;
              }
              return 0;
            }}
          </Cell>
        </Column>
        {mode !== ENUM_MODE.VIEW && (
          <Column flexGrow={2}>
            <HeaderCell children="..." />
            <Cell>
              {(rowData: IItemConsumption<IRawMaterial>) => {
                return (
                  <>
                    <div className="grid grid-cols-6 gap-4">
                      <Button
                        appearance="ghost"
                        color="blue"
                        onClick={() => updateHandler(rowData)}
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        appearance="ghost"
                        color="red"
                        onClick={() => itemRemover(rowData?.item?.id)}
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  </>
                );
              }}
            </Cell>
          </Column>
        )}
      </Table>

      <div>
        <ConsumptionList
          formData={formData}
          setFormData={setFormData}
          mode={consumptionListMode}
          setMode={setConsumptionListMode}
          isOpen={isOpen}
          setOpen={setOpen}
          updatableData={updatableData}
          setUpdatableData={
            setUpdatableData as Dispatch<
              SetStateAction<{ item: IRawMaterial; qty: number }>
            >
          }
        />
      </div>
    </div>
  );
};

export default ConsumptionListTable;
