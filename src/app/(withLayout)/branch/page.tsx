"use client";

import BranchTable from "@/components/branch/BranchTable";
import {
  useCreateBranchMutation,
  useGetBranchQuery,
} from "@/redux/api/branch/branch.api";

import React, { useState } from "react";
import { Button, Checkbox, Form, Loader } from "rsuite";
import Swal from "sweetalert2";

export type FormBranchDataType = {
  bid?: string;
  name: string;
  phone: string;
  email: string;
  vatNo: string;
  isActive: boolean;
  address1: string;
  address2: string;
};

const BranchPage = () => {
  const { data: items, isLoading } = useGetBranchQuery({});

  const [craeteItem, { isLoading: creating }] = useCreateBranchMutation();

  const itemFormInitialState = {
    name: "",
    phone: "",
    email: "",
    vatNo: "",
    isActive: false,
    address1: "",
    address2: "",
  };

  const [formData, setFormData] = useState<FormBranchDataType>(itemFormInitialState);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (value: Record<string, any>) => {
    setFormData((prevData) => ({
      ...prevData,
      ...value,
    }));
  };
  // ? onsubmit

  const handleSubmit = async () => {
    const res = await craeteItem(formData).unwrap();
    if (res.success) {
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: "Branch Added successfully",
        icon: "success",
      });
      setFormData(itemFormInitialState);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto  drop-shadow-md shadow-xl m-5 py-8 px-5 bg-[#fcfbfb]">
      <h1 className="text-center text-[#003CFF] text-2xl font-bold">
        Branch Information
      </h1>

      {/* form */}

      <div className="w-full  my-10">
        <Form
          fluid
          layout="horizontal"
          formValue={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          className=" grid grid-cols-1 lg:grid-cols-2 gap-5 justify-items-center "
        >
          {/* name */}
          <Form.Group controlId="name">
            <Form.ControlLabel>Branch Name</Form.ControlLabel>
            <Form.Control name="name" />
          </Form.Group>

          <Form.Group controlId="isActive">
            <Form.Control
              name="isActive"
              accepter={Checkbox}
              defaultChecked={formData?.isActive}
              value={!formData?.isActive}
            >
              Is Active
            </Form.Control>
          </Form.Group>

          {/* phone */}
          <Form.Group controlId="phone">
            <Form.ControlLabel>Phone</Form.ControlLabel>
            <Form.Control name="phone" />
          </Form.Group>
          {/* email */}
          <Form.Group controlId="email">
            <Form.ControlLabel>Email</Form.ControlLabel>
            <Form.Control name="email" />
          </Form.Group>
          {/* vat */}
          <Form.Group controlId="vatNo">
            <Form.ControlLabel>Vat Reg No:</Form.ControlLabel>
            <Form.Control name="vatNo" />
          </Form.Group>
          {/* is active */}

          {/* <Form.Group controlId="isActive">
            <Form.Control
              name="isActive"
              accepter={Checkbox}
              defaultChecked={formData?.isActive}
              value={!formData?.isActive}
            >
              Is Active
            </Form.Control>
          </Form.Group> */}

          {/* address 1 */}
          <Form.Group controlId="address1">
            <Form.ControlLabel>Address Line 1</Form.ControlLabel>
            <Form.Control name="address1" />
          </Form.Group>
          {/* address 2 */}
          <Form.Group controlId="address2">
            <Form.ControlLabel>Address Line 2</Form.ControlLabel>
            <Form.Control name="address2" />
          </Form.Group>

          {/*  */}

          <Form.Group className="w-full max-w-[300px]  ms-48">
            <Button
              className="w-full"
              appearance="primary"
              disabled={creating}
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

      {/* table */}

      <BranchTable data={items?.data} isLoading={isLoading} />
    </div>
  );
};

export default BranchPage;
