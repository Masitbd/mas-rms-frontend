/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button, Table } from "rsuite";
import VisibleIcon from "@rsuite/icons/Visible";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import { EditAndViewCustomerModal } from "./EditAndViewCustomerModal";
import Swal from "sweetalert2";
import { useDeleteCustomerListMutation } from "@/redux/api/customer/customer.api";

export type TCustomer = {
  _id: string;
  cid: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  dob?: string;
  reward?: number;
  discountCard?: string;
  discount?: number;
  isActive?: boolean;
};

const { Column, HeaderCell, Cell } = Table;
const CustomerTable = ({
  data,
  isLoading,
}: {
  data: TCustomer[];
  isLoading: boolean;
}) => {
  const [deleteCustomer, { isLoading: deleting }] =
    useDeleteCustomerListMutation();

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
        const res = await deleteCustomer(id).unwrap();

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
            {"Customer Id"}
          </HeaderCell>
          <Cell dataKey="cid" />
        </Column>

        <Column flexGrow={2}>
          <HeaderCell className="text-center text-lg font-semibold ">
            {"Customer Name"}
          </HeaderCell>
          <Cell dataKey="name" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell className="text-center text-lg font-semibold ">
            {"Discount Card"}
          </HeaderCell>
          <Cell dataKey="discountCard" />
        </Column>
        <Column flexGrow={2}>
          <HeaderCell className="text-center text-lg font-semibold ">
            {"Customer Phone"}
          </HeaderCell>
          <Cell dataKey="phone" />
        </Column>

        <Column flexGrow={3}>
          <HeaderCell className="text-center text-lg font-semibold ">
            Action
          </HeaderCell>
          <Cell align="center">
            {(rowdate: TCustomer) => (
              <>
                <Button
                  appearance="primary"
                  color="red"
                  disabled={deleting}
                  onClick={() => handleDelete(rowdate._id)}
                  startIcon={<TrashIcon />}
                />

                <EditAndViewCustomerModal
                  data={rowdate}
                  color="green"
                  openButton={<EditIcon />}
                />
                <EditAndViewCustomerModal
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

export default CustomerTable;
