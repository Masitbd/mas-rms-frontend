/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button, Table } from "rsuite";
import VisibleIcon from "@rsuite/icons/Visible";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import { EditTableModel } from "./EditTableModal";
import Swal from "sweetalert2";
import { useDeleteTableListMutation } from "@/redux/api/table/table.api";

export type TTableData = {
  _id: string;
  tid: string;
  name: string;
  details: string;
};

export type TTableDataProps = {
  data: TTableData[];

  isLoading?: boolean;
};

const { Column, HeaderCell, Cell } = Table;
const TableList = ({ data, isLoading }: TTableDataProps) => {
  const [deleteTable] = useDeleteTableListMutation();

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
        const res = await deleteTable(id).unwrap();
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
            {"Table Id"}
          </HeaderCell>
          <Cell dataKey="tid" />
        </Column>

        <Column flexGrow={2}>
          <HeaderCell className="text-center text-lg font-semibold">
            {"Table Name"}
          </HeaderCell>
          <Cell dataKey="name" />
        </Column>
        <Column flexGrow={3}>
          <HeaderCell className="text-center text-lg font-semibold">
            {"Branch"}
          </HeaderCell>
          <Cell dataKey="branch.name" />
        </Column>

        <Column flexGrow={3}>
          <HeaderCell className="text-center text-lg font-semibold">
            Action
          </HeaderCell>
          <Cell align="center">
            {(rowdate: TTableData) => (
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

                <EditTableModel
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

                <EditTableModel
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

export default TableList;
