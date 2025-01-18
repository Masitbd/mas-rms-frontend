"use client";
import { Button, Table } from "rsuite";
import VisibleIcon from "@rsuite/icons/Visible";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";

import Swal from "sweetalert2";

import { BranchEditAndViewModal } from "./BranchEditAndViewModal";
import Column from "rsuite/esm/Table/TableColumn";
import { Cell, HeaderCell } from "rsuite-table";
import { useDeleteBranchMutation } from "@/redux/api/branch/branch.api";

type TBranchData = {
  bid: string;
  name: string;
  phone: string;
  email: string;
  vatNo: string;
  isActive: boolean;
  address1: string;
  address2: string;
  deliveryLocations?: string[];
  availability: string;
};

const BranchTable = ({
  data,
  isLoading,
}: {
  data: TBranchData[];
  isLoading: boolean;
}) => {
  const [deleteItem, { isLoading: deleting }] = useDeleteBranchMutation();

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
            {"Branch Id"}
          </HeaderCell>
          <Cell dataKey="bid" />
        </Column>

        <Column flexGrow={2}>
          <HeaderCell className="text-center text-lg font-semibold">
            {"Branch Name"}
          </HeaderCell>
          <Cell dataKey="name" />
        </Column>
        <Column flexGrow={3}>
          <HeaderCell className="text-center text-lg font-semibold">
            {"phone"}
          </HeaderCell>
          <Cell dataKey="phone" />
        </Column>
        <Column flexGrow={3}>
          <HeaderCell className="text-center text-lg font-semibold">
            {"Address"}
          </HeaderCell>
          <Cell dataKey="address1" />
        </Column>

        <Column flexGrow={3}>
          <HeaderCell className="text-center text-lg font-semibold">
            Action
          </HeaderCell>
          <Cell align="center">
            {(rowdate) => (
              <>
                <Button
                  disabled={deleting}
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

                <BranchEditAndViewModal
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

                <BranchEditAndViewModal
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

export default BranchTable;
