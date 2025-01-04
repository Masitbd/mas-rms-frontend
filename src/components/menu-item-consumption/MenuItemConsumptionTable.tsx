/* eslint-disable react/no-children-prop */
"use client";
import React from "react";
import { Button, Pagination, Table } from "rsuite";
import TrashIcon from "@rsuite/icons/Trash";
import EditIcon from "@rsuite/icons/Edit";
import ViewIcon from "@rsuite/icons/EyeClose";
import {
  useDeleteRawMaterialMutation,
  useGetRawMaterialQuery,
  useLazyGetRawMaterialQuery,
} from "@/redux/api/raw-material-setup/rawMaterial.api";
import { ENUM_MODE } from "@/enums/EnumMode";
import Swal from "sweetalert2";
import { IMenuItemConsumption, IMenuItemTableProps } from "./TypesAndDefault";
import {
  useDeleteConsumptionMutation,
  useGetConsumptionQuery,
} from "@/redux/api/rawMaterialConsumption/rawMaterialConsumption.api";
import { useRouter } from "next/navigation";
import { ENUM_USER } from "@/enums/EnumUser";
import { useSession } from "next-auth/react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RawMaterialConsumptionTable = () => {
  const session = useSession();
  const userRole = session?.data?.user?.role;
  const router = useRouter();
  const { Cell, Column, HeaderCell } = Table;
  const {
    data: menuItemData,
    isLoading: menuItemLoading,
    isFetching: menuItemFetching,
  } = useGetConsumptionQuery(undefined);
  const [get, { isLoading: getLoading, isFetching: fetchLoding }] =
    useLazyGetRawMaterialQuery();
  const [remove, { isLoading: deleteLoading }] = useDeleteConsumptionMutation();

  const deletHandler = async (payload: IMenuItemConsumption) => {
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
          const res = await remove(payload?._id).unwrap();

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
  const editHandler = async (payload: IMenuItemConsumption) => {
    if (payload?._id) {
      router.push(`/consumption/new?mode=update&id=${payload?._id}`);
    }
  };

  const viewHandler = async (payload: IMenuItemConsumption) => {
    if (payload?._id) {
      router.push(`/consumption/new?mode=view&id=${payload?._id}`);
    }
  };
  return (
    <div>
      <Table
        data={menuItemData?.data}
        autoHeight
        cellBordered
        bordered
        loading={
          menuItemFetching ||
          menuItemLoading ||
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
          <HeaderCell children="Item Name" flexGrow={1} />
          <Cell dataKey="itemName" />
        </Column>
        <Column flexGrow={1}>
          <HeaderCell children="Item Code" flexGrow={1} />
          <Cell dataKey="itemCode" />
        </Column>
        <Column flexGrow={1}>
          <HeaderCell children="Rate" flexGrow={1} />
          <Cell dataKey="rate" />
        </Column>

        <Column flexGrow={2} align="center">
          <HeaderCell children="... " flexGrow={1} />
          <Cell align="center">
            {(rowdata: IMenuItemConsumption) => {
              return (
                <>
                  <div className="grid grid-cols-3  gap-5">
                    <Button
                      appearance="primary"
                      color="blue"
                      onClick={() => editHandler(rowdata)}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      appearance="primary"
                      color="red"
                      onClick={() => deletHandler(rowdata)}
                    >
                      <TrashIcon />
                    </Button>
                    <Button
                      appearance="primary"
                      color="green"
                      onClick={() => viewHandler(rowdata)}
                    >
                      <ViewIcon />
                    </Button>
                  </div>
                </>
              );
            }}
          </Cell>
        </Column>
      </Table>
      {/* <Pagination
        layout={["total", "-", "limit", "|", "pager", "skip"]}
        size={"md"}
        prev={true}
        next={true}
        first={true}
        last={true}
        ellipsis={true}
        boundaryLinks={true}
        total={menuItemData?.ment?.total} */}
      {/* // limit={limit}
        // limitOptions={limitOptions}
        // maxButtons={maxButtons}
        // activePage={activePage}
        // onChangePage={setActivePage}
        // onChangeLimit={setLimit} */}
      {/* /> */}
    </div>
  );
};

export default RawMaterialConsumptionTable;
