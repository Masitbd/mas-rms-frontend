/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Form, Button, Loader, Modal, SelectPicker } from "rsuite";

import Swal from "sweetalert2";

import { useUpdateItemsCategoryMutation } from "@/redux/api/items/items.api";
import { useGetMenuGroupQuery } from "@/redux/api/menugroup/menuGroup.api";
import {
  FormDataType,
  TMenuGroupItem,
  TMenuGroupOption,
} from "@/app/(indoorLayout)/items/page";
import BranchFieldProvider from "../branch/BranchFieldProvider";

type TEdittableProps = {
  data: any;
  color: any;
  openButton: JSX.Element;
};

export const ItemEditAndViewModal = ({
  data,
  color,
  openButton,
}: TEdittableProps) => {
  const { data: menus, isLoading: menuLoading } = useGetMenuGroupQuery({});

  const menuGroupData: TMenuGroupOption[] = menus?.data?.map(
    (item: TMenuGroupItem) => ({
      label: item.name,
      value: item._id,
    })
  );
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [updateItem, { isLoading }] = useUpdateItemsCategoryMutation();

  const [formData, setFormData] = useState<FormDataType>({
    uid: "",
    name: "",
    menuGroup: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        uid: data.uid || "",
        name: data.name || "",
        menuGroup: data.menuGroup?._id || "", // Correct way to set the nested property
        ...(data?.branch ? { branch: data?.branch?._id } : {}),
      });
    }
  }, [data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: Record<string, any>) => {
    setFormData({
      uid: event.uid,
      name: event.name,
      menuGroup: event.menuGroup,
      branch: event.branch,
    });
  };

  // ? onsubmit

  const handleSubmit = async () => {
    const options = {
      id: data?._id,
      data: formData,
    };

    const res = await updateItem(options).unwrap();

    if (res.success) {
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: "Item Updated successfully",
        icon: "success",
      });
    }
  };

  return (
    <>
      <Button
        appearance="primary"
        color={color}
        className="ml-2"
        onClick={handleOpen}
        startIcon={openButton}
      />

      <Modal open={open} onClose={handleClose}>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div className="w-full flex justify-center my-10">
            <Form
              layout="horizontal"
              formDefaultValue={data}
              formValue={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
            >
              <Form.Group controlId="uid">
                <Form.ControlLabel className="text-xl">
                  Menu Group Id
                </Form.ControlLabel>
                <Form.Control name="uid" />
              </Form.Group>

              <Form.Group controlId="menuGroup">
                <Form.ControlLabel>Menu Group Name</Form.ControlLabel>

                <SelectPicker
                  disabled={menuLoading}
                  data={menuGroupData}
                  name="menuGroup"
                  value={formData.menuGroup} // Bind stored menu object ID
                  onChange={
                    (value) => setFormData({ ...formData, menuGroup: value }) // Update ID in formData on change
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

              <Form.Group>
                <Button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="w-full"
                  appearance="primary"
                  type="submit"
                  style={{
                    background: "#003CFF",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {isLoading ? <Loader content="Loading..." /> : "Update"}
                </Button>
              </Form.Group>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="primary" color="red">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
