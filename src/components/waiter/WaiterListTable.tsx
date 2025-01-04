/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button, Table } from "rsuite";
import VisibleIcon from "@rsuite/icons/Visible";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";

import Swal from "sweetalert2";

import { useDeleteWaiterListMutation } from "@/redux/api/waiter/waiter.api";
import { WaiterEditAndViewModal } from "./WaiterEditAndViewModal";
import { useSession } from "next-auth/react";
import { ENUM_USER } from "@/enums/EnumUser";

export type TMenuTableData = {
  _id: string;
  uid: string;
  name: string;
  description: string;
};

export type TTableDataProps = {
  data: TMenuTableData[];

  isLoading?: boolean;
};

const { Column, HeaderCell, Cell } = Table;
const WaiterListTable = ({ data, isLoading }: TTableDataProps) => {
  const session = useSession();
  const userRole = session?.data?.user?.role;
  const [deleteMenu] = useDeleteWaiterListMutation();

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
        const res = await deleteMenu(id).unwrap();
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
            {"Waiter Id"}
          </HeaderCell>
          <Cell dataKey="uid" />
        </Column>

        <Column flexGrow={2}>
          <HeaderCell className="text-center text-lg font-semibold">
            {"Waiter Name"}
          </HeaderCell>
          <Cell dataKey="name" />
        </Column>
        {(userRole == ENUM_USER.ADMIN || ENUM_USER.SUPER_ADMIN) && (
          <Column flexGrow={2}>
            <HeaderCell className="text-center text-lg font-semibold ">
              {"Branch"}
            </HeaderCell>
            <Cell dataKey="branch.name" />
          </Column>
        )}

        <Column flexGrow={3}>
          <HeaderCell className="text-center text-lg font-semibold">
            Action
          </HeaderCell>
          <Cell align="center">
            {(rowdate: TMenuTableData) => (
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

                <WaiterEditAndViewModal
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

                <WaiterEditAndViewModal
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

export default WaiterListTable;
