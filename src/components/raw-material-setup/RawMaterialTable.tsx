/* eslint-disable react/no-children-prop */
"use client";
import React from "react";
import { Button, Table } from "rsuite";
import { IMaterialTableProps, IRawMaterial } from "./TypesAndDefault";
import TrashIcon from "@rsuite/icons/Trash";
import EditIcon from "@rsuite/icons/Edit";
import {
  useDeleteRawMaterialMutation,
  useGetRawMaterialQuery,
  useLazyGetRawMaterialQuery,
  useLazyGetSingleRawMaterialQuery,
} from "@/redux/api/raw-material-setup/rawMaterial.api";
import { ENUM_MODE } from "@/enums/EnumMode";
import Swal from "sweetalert2";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RawMaterialTable = (props: IMaterialTableProps) => {
  const { setFormData, setMode } = props;
  const { Cell, Column, HeaderCell } = Table;
  const {
    data: rawmaterial,
    isLoading: rawMaterialLoading,
    isFetching: rawMaterialFeatching,
  } = useGetRawMaterialQuery(undefined);
  const [get, { isLoading: getLoading, isFetching: fetchLoding }] =
    useLazyGetSingleRawMaterialQuery();
  const [remove, { isLoading: deleteLoading }] = useDeleteRawMaterialMutation();

  const deletHandler = async (payload: IRawMaterial) => {
    try {
      await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#003CFF",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await remove(payload.id).unwrap();

          if (res.success) {
            Swal.fire("Deleted!", "Data has been deleted.", "success");
          }
        }
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to delete data", "error");
    }
  };
  const editHandler = async (payload: IRawMaterial) => {
    try {
      const result = await get(payload.id).unwrap();
      console.log(result);
      if (result?.success) {
        setFormData(JSON.parse(JSON.stringify(result?.data)));
        setMode(ENUM_MODE.UPDATE);
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to fetch data", "error");
    }
  };
  return (
    <div>
      <Table
        data={rawmaterial?.data}
        autoHeight
        cellBordered
        bordered
        loading={
          rawMaterialLoading ||
          rawMaterialFeatching ||
          getLoading ||
          fetchLoding ||
          deleteLoading
        }
      >
        <Column flexGrow={1}>
          <HeaderCell children="Material Id" flexGrow={1} />
          <Cell dataKey="id" />
        </Column>
        <Column flexGrow={3}>
          <HeaderCell children="Material Name" flexGrow={1} />
          <Cell dataKey="materialName" />
        </Column>
        <Column flexGrow={1}>
          <HeaderCell children="Base Unit" flexGrow={1} />
          <Cell dataKey="baseUnit" />
        </Column>
        <Column flexGrow={2} align="center">
          <HeaderCell children="... " flexGrow={1} />
          <Cell>
            {(rowdata: IRawMaterial) => {
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
                      color="red"
                      onClick={() => deletHandler(rowdata)}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </>
              );
            }}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default RawMaterialTable;
