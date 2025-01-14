/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Form, Button, Loader, Modal } from "rsuite";
import { useUpdateTableListMutation } from "@/redux/api/table/table.api";
import Swal from "sweetalert2";
import { TTableData } from "./Table";
import BranchFieldProvider from "../branch/BranchFieldProvider";
import { TTableFormData } from "@/app/(indoorLayout)/table/page";
import { TBranch } from "@/redux/features/order/orderSlice";

type TEdittableProps = {
  data: TTableData & { branch?: TBranch };
  color: any;
  openButton: JSX.Element;
};

export const EditTableModel = ({
  data,
  color,
  openButton,
}: TEdittableProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [updateTable, { isLoading }] = useUpdateTableListMutation();

  const [formData, setFormData] = useState<TTableFormData>({
    tid: "",
    name: "",
    details: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        tid: data.tid || "",
        name: data.name || "",
        details: data.details || "",
        ...(data?.branch?._id ? { branch: data.branch._id } : {}),
      });
    }
  }, [data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: Record<string, any>) => {
    setFormData({
      tid: event.tid,
      name: event.name,
      details: event.details,
      branch: event.branch,
    });
  };

  // ? onsubmit

  const handleSubmit = async () => {
    const options = {
      id: data?._id,
      data: formData,
    };

    const res = await updateTable(options).unwrap();

    if (res.success) {
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: "Table Updated successfully",
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
              <Form.Group controlId="name">
                <Form.ControlLabel>Table Name</Form.ControlLabel>
                <Form.Control name="name" />
              </Form.Group>
              <BranchFieldProvider />
              <Form.Group controlId="details">
                <Form.ControlLabel>Table Description</Form.ControlLabel>
                <Form.Control name="details" />
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
