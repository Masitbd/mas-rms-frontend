"use client";

import { Textarea } from "@/components/customers/TextArea";
import MenuGroupTable from "@/components/menuGroup/MenuGroupTable";
import {
  useCreateMenuGroupMutation,
  useGetMenuGroupQuery,
} from "@/redux/api/menugroup/menuGroup.api";
import React, { useState } from "react";
import { Button, Form, Loader } from "rsuite";
import Swal from "sweetalert2";

const MenuGroupPage = () => {
  const { data: menus, isLoading } = useGetMenuGroupQuery({});

  const [craeteMenu, { isLoading: creating }] = useCreateMenuGroupMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (value: Record<string, any>) => {
    setFormData((prevData) => ({
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
        title: "Menu Added successfully",
        icon: "success",
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto  drop-shadow-md shadow-xl m-5 mt-10 py-8 px-5 bg-[#FAFBFF]">
      <h1 className="text-center text-[#003CFF] text-2xl font-bold">
        Menu Group Setup
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
            <Form.ControlLabel>Menu Group Name</Form.ControlLabel>
            <Form.Control name="name" />
          </Form.Group>

          {/*  */}
          <Form.Group controlId="description">
            <Form.ControlLabel>Description</Form.ControlLabel>
            <Form.Control name="description" accepter={Textarea} />
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

      <MenuGroupTable data={menus?.data} isLoading={isLoading} />
    </div>
  );
};

export default MenuGroupPage;
