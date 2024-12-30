"use client";

import BranchFieldProvider from "@/components/branch/BranchFieldProvider";
import ItemCategoryTable from "@/components/items/ItemsTable";

import {
  useCreateItemsCategoryMutation,
  useGetItemsCategoryQuery,
} from "@/redux/api/items/items.api";
import { useGetMenuGroupQuery } from "@/redux/api/menugroup/menuGroup.api";
import React, { useState } from "react";
import { Button, Form, Loader, SelectPicker } from "rsuite";
import Swal from "sweetalert2";

export type FormDataType = {
  uid?: string;
  name: string;
  menuGroup: string | unknown;
  branch?: string;
};

export type TMenuGroupOption = {
  label: string;
  value: string;
};
export type TMenuGroupItem = {
  name: string;
  _id: string;
};

const ItemsCategoryPage = () => {
  const { data: menus, isLoading: menuLoading } = useGetMenuGroupQuery({});

  const { data: items, isLoading } = useGetItemsCategoryQuery(undefined);

  const menuGroupData: TMenuGroupOption[] = menus?.data?.map(
    (item: TMenuGroupItem) => ({
      label: item.name,
      value: item._id,
    })
  );

  const [craeteItem, { isLoading: creating }] =
    useCreateItemsCategoryMutation();

  const itemFormInitialState = {
    name: "",
  };

  const [formData, setFormData] = useState<FormDataType>(
    itemFormInitialState as FormDataType
  );

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
        title: "Item Added successfully",
        icon: "success",
      });
      setFormData(itemFormInitialState as FormDataType);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto  drop-shadow-md shadow-xl m-5 mt-10 py-8 px-5 bg-[#FAFBFF]">
      <h1 className="text-center text-[#003CFF] text-2xl font-bold">
        Item Category Setup
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
          <Form.Group controlId="menuGroup">
            <Form.ControlLabel>Menu Group</Form.ControlLabel>
            <SelectPicker
              disabled={menuLoading}
              data={menuGroupData}
              name="menuGroup"
              onChange={(value) =>
                setFormData({ ...formData, menuGroup: value })
              }
              placeholder="Select a menu group"
              style={{ width: 300 }}
            />
          </Form.Group>
          <Form.Group controlId="name">
            <Form.ControlLabel>Category Name</Form.ControlLabel>
            <Form.Control name="name" />
          </Form.Group>

          <BranchFieldProvider />

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

      <ItemCategoryTable data={items?.data} isLoading={isLoading} />
    </div>
  );
};

export default ItemsCategoryPage;
