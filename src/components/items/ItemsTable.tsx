/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button, Table } from "rsuite";
import VisibleIcon from "@rsuite/icons/Visible";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";

import Swal from "sweetalert2";

import { ItemEditAndViewModal } from "./ItemEditAndViewModal";
import { useDeleteItemsCategoryMutation } from "@/redux/api/items/items.api";

export type TItemsData = {
  _id: string;
  uid: string;
  name: string;
  menuGroup: {
    name: string;
  };
};

export type TTableDataProps = {
  data: TItemsData[];

  isLoading?: boolean;
};

const { Column, HeaderCell, Cell } = Table;
const ItemCategoryTable = ({ data, isLoading }: TTableDataProps) => {
  const [deleteItem] = useDeleteItemsCategoryMutation();

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteItem(id).unwrap();
        console.log(res);

        if (res.success) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }

        //

        //
      }
    });
  };

  return (
    <div>
      <Table
        height={600}
        data={data}
        loading={isLoading}
        bordered
        cellBordered
        rowHeight={65}
        className="text-md"
      >
        <Column flexGrow={2}>
          <HeaderCell className="text-center text-lg font-semibold ">
            {"Menu Group Id"}
          </HeaderCell>
          <Cell dataKey="uid" />
        </Column>

        <Column flexGrow={2}>
          <HeaderCell className="text-center text-lg font-semibold">
            {"Menu Group Name"}
          </HeaderCell>
          <Cell>
            {(rowData) => (
              <div className="text-center">
                {rowData.menuGroup?.name || "N/A"}{" "}
                {/* Safely access the nested property */}
              </div>
            )}
          </Cell>
        </Column>
        <Column flexGrow={3}>
          <HeaderCell className="text-center text-lg font-semibold">
            {"Categoy Name"}
          </HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column flexGrow={3}>
          <HeaderCell className="text-center text-lg font-semibold">
            Action
          </HeaderCell>
          <Cell align="center">
            {(rowdate: TItemsData) => (
              <>
                <Button
                  appearance="primary"
                  color="red"
                  onClick={() => handleDelete(rowdate._id)}
                  startIcon={<TrashIcon />}
                />

                {/* <Button
                  appearance="primary"
                  color="green"
                  className="ml-2"
                  startIcon={<EditIcon />}
                /> */}

                <ItemEditAndViewModal
                  data={rowdate}
                  color="green"
                  openButton={<EditIcon />}
                />

                {/* <Button
                  // appearance="transparent"
                  className="ml-2"
                  color="blue"
                  appearance="primary"
                  startIcon={<VisibleIcon />}
                  onClick={() => {
                    // setPatchData(rowdate as IDoctor);
                    // setPostModelOpen(!open);
                    // setMode("watch");
                  }}
                /> */}

                <ItemEditAndViewModal
                  data={rowdate}
                  color="blue"
                  openButton={<VisibleIcon />}
                />
              </>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default ItemCategoryTable;
