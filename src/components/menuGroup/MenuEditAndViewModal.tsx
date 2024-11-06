/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Form, Button, Loader, Modal } from "rsuite";

import Swal from "sweetalert2";
import { Textarea } from "../customers/TextArea";
import { useUpdateMenuGroupMutation } from "@/redux/api/menugroup/menuGroup.api";

type TEdittableProps = {
  data: any;
  color: any;
  openButton: JSX.Element;
};

export const MenuEditAndViewModal = ({
  data,
  color,
  openButton,
}: TEdittableProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [updateMenu, { isLoading }] = useUpdateMenuGroupMutation();

  const [formData, setFormData] = useState({
    uid: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        uid: data.uid || "",
        name: data.name || "",
        description: data.description || "",
      });
    }
  }, [data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: Record<string, any>) => {
    setFormData({
      uid: event.uid,
      name: event.name,
      description: event.description,
    });
  };

  // ? onsubmit

  const handleSubmit = async () => {
    const options = {
      id: data?._id,
      data: formData,
    };

    console.log(data, "data");

    const res = await updateMenu(options).unwrap();

    if (res.success) {
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: "Menu Updated successfully",
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

              <Form.Group controlId="name">
                <Form.ControlLabel>Menu Group Name</Form.ControlLabel>
                <Form.Control name="name" />
              </Form.Group>
              <Form.Group controlId="description">
                <Form.ControlLabel>Description</Form.ControlLabel>
                <Form.Control name="description" accepter={Textarea} />
              </Form.Group>

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
