"use client";

import BranchFieldProvider from "@/components/branch/BranchFieldProvider";
import { Textarea } from "@/components/customers/TextArea";

import WaiterListTable from "@/components/waiter/WaiterListTable";

import {
  useCreateWaiterListMutation,
  useGetWaiterListQuery,
} from "@/redux/api/waiter/waiter.api";
import React, { useState } from "react";
import { Button, Form, Loader } from "rsuite";
import Swal from "sweetalert2";

const MenuGroupPage = () => {
  const { data: waiters, isLoading } = useGetWaiterListQuery({});

  const [craeteMenu, { isLoading: creating }] = useCreateWaiterListMutation();

  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (value: Record<string, any>) => {
    setFormData((prevData: any) => ({
      ...prevData,
      ...value,
    }));
  };
  // ? onsubmit

  const handleSubmit = async () => {
    const res = await craeteMenu(formData).unwrap();
    if (res.success) {
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: "Waiter Added successfully",
        icon: "success",
      });
      setFormData({
        name: "",
        remarks: "",
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto  drop-shadow-md shadow-xl m-5 mt-10 py-8 px-5 bg-[#FAFBFF]">
      <h1 className="text-center text-[#003CFF] text-2xl font-bold">
        Restaurant Waiter List
      </h1>

      {/* form */}

      <div className="w-full  my-10">
        <Form
          fluid
          layout="horizontal"
          formValue={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          className="lg:justify-items-center lg:pe-40"
        >
          <Form.Group controlId="name">
            <Form.ControlLabel>Waiter Name</Form.ControlLabel>
            <Form.Control name="name" />
          </Form.Group>
          <BranchFieldProvider />

          {/*  */}
          <Form.Group controlId="remarks">
            <Form.ControlLabel>Remarks</Form.ControlLabel>
            <Form.Control name="remarks" accepter={Textarea} />
          </Form.Group>

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

      <WaiterListTable data={waiters?.data} isLoading={isLoading} />
    </div>
  );
};

export default MenuGroupPage;
