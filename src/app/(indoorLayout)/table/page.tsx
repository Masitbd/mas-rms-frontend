"use client";

import BranchFieldProvider from "@/components/branch/BranchFieldProvider";
import TableList, { TTableData } from "@/components/Table/Table";
import { useGetBranchQuery } from "@/redux/api/branch/branch.api";
import {
  useCreateTableListMutation,
  useGetTableListQuery,
} from "@/redux/api/table/table.api";
import { useState } from "react";
import { Form, Button, Loader, InputPicker } from "rsuite";
import Swal from "sweetalert2";
import omitDeep from "omit-empty-es";

type TError = {
  data: {
    message: string;
    success: boolean;
  };
};

export type TTableFormData = {
  name: string;
  details: string;
  branch?: string;
  tid?: string;
};
const TablePage = () => {
  const { data: tables, isLoading } = useGetTableListQuery({});

  const [craetTable, { isLoading: creating }] = useCreateTableListMutation();

  const [formData, setFormData] = useState<TTableFormData>({
    name: "",
    details: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: Record<string, any>) => {
    setFormData({
      name: event.name,
      details: event.details,
      branch: event.branch,
    });
  };

  // ? onsubmit

  const handleSubmit = async () => {
    try {
      const res = await craetTable(omitDeep(formData)).unwrap();

      if (res.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          title: "Table Added successfully",
          icon: "success",
        });
        setFormData({ name: "", details: "", branch: "" } as never);
      }
    } catch (err) {
      const error = err as TError;
      // Log the error to see its structure
      Swal.fire({
        title: `${error.data?.message || "Something went wrong"}`,
        text: "Table Id Must be Unique",
        icon: "error",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto  drop-shadow-md shadow-xl m-5 py-8 px-5 bg-[#F7F7F7]">
      <h1 className="text-center text-[#003CFF] text-2xl font-bold">
        Table List
      </h1>

      {/* form */}

      <div className="w-full md:ms-20 my-10 ">
        <Form
          fluid
          layout="horizontal"
          formValue={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
        >
          <Form.Group controlId="name">
            <Form.ControlLabel className="text-xl">
              Table Name
            </Form.ControlLabel>
            <Form.Control name="name" />
          </Form.Group>
          <BranchFieldProvider />
          <Form.Group controlId="details">
            <Form.ControlLabel>Table Description</Form.ControlLabel>
            <Form.Control name="details" />
          </Form.Group>

          <Form.Group className="">
            <Form.ControlLabel></Form.ControlLabel>
            <Button
              disabled={creating}
              className="w-full max-w-[300px] bg-[#003CFF]"
              style={{
                backgroundColor: "#003CFF",
                color: "white",
                fontWeight: "600",
              }}
              type="submit"
            >
              {creating ? <Loader content="Loading..." /> : "Save"}
            </Button>
          </Form.Group>
        </Form>
      </div>

      <TableList data={tables?.data} isLoading={isLoading} />
    </div>
  );
};

export default TablePage;
