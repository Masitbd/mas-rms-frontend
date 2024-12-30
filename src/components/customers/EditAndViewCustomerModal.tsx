/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Form, Button, Loader, Modal, Checkbox } from "rsuite";

import Swal from "sweetalert2";

import { useUpdateCustomerListMutation } from "@/redux/api/customer/customer.api";
import { Textarea } from "./TextArea";
import { TCustomer } from "./CustomerTable";
import BranchFieldProvider from "../branch/BranchFieldProvider";

type TEdittableProps = {
  data: TCustomer;
  color: any;
  openButton: JSX.Element;
};

export const EditAndViewCustomerModal = ({
  data,
  color,
  openButton,
}: TEdittableProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [updateCustomer, { isLoading }] = useUpdateCustomerListMutation();

  const [formData, setFormData] = useState<Partial<TCustomer>>({
    cid: "",
    name: "",
    email: "",
    dob: "",
    discount: 0,
    discountCard: "",
    reward: 0,
    address: "",
    isActive: false,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        cid: data.cid || "",
        name: data.name || "",
        email: data.email || "",
        dob: data.dob || "",
        discount: data.discount || 0,
        discountCard: data.discountCard || "",
        reward: data.reward || 0,
        isActive: data.isActive || false,
        address: data.address || "",
        ...(data?.branch ? { branch: data?.branch?._id } : {}),
      } as unknown as TCustomer);
    }
  }, [data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: Record<string, any>) => {
    setFormData({
      cid: event.cid,
      name: event.name,
      email: event.email,
      dob: event.dob,
      discount: event.discount,
      discountCard: event.discountCard,
      reward: event.reward,
      isActive: event.isActive,
      address: event.address,
      branch: event?.branch,
    });
  };

  // ? onsubmit

  const handleSubmit = async () => {
    const options = {
      id: data?._id,
      data: formData,
    };

    const res = await updateCustomer(options).unwrap();

    if (res.success) {
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: "Customer Updated successfully",
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

      <Modal size="large" open={open} onClose={handleClose}>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div className="w-full  my-10">
            <Form
              layout="horizontal"
              formValue={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              className="grid grid-cols-2 gap-5 justify-items-center"
            >
              <Form.Group controlId="cid">
                <Form.ControlLabel>Customer Id</Form.ControlLabel>
                <Form.Control name="cid" />
              </Form.Group>
              <Form.Group controlId="name">
                <Form.ControlLabel>Customer Name</Form.ControlLabel>
                <Form.Control name="name" />
              </Form.Group>
              <Form.Group controlId="phone">
                <Form.ControlLabel>Phone Number</Form.ControlLabel>
                <Form.Control name="phone" />
              </Form.Group>
              <Form.Group controlId="email">
                <Form.ControlLabel>Email</Form.ControlLabel>
                <Form.Control name="email" />
              </Form.Group>
              <Form.Group controlId="dob">
                <Form.ControlLabel>Date Of Birth</Form.ControlLabel>
                <Form.Control type="date" name="dob" />
              </Form.Group>
              <Form.Group controlId="reward">
                <Form.ControlLabel>Reward Point</Form.ControlLabel>
                <Form.Control name="reward" />
              </Form.Group>
              <Form.Group controlId="discountCard">
                <Form.ControlLabel>Discount Card</Form.ControlLabel>
                <Form.Control name="discountCard" />
              </Form.Group>
              <BranchFieldProvider />

              <div className="grid row-span-2">
                <Form.Group controlId="address">
                  <Form.ControlLabel>Address</Form.ControlLabel>
                  <Form.Control name="address" accepter={Textarea} />
                </Form.Group>
              </div>

              <Form.Group controlId="discount">
                <Form.ControlLabel>Discount Amount</Form.ControlLabel>
                <Form.Control name="discount" />
              </Form.Group>
              {/*  */}

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

              <Form.Group className="w-full max-w-[300px] ms-40">
                <Button
                  onClick={handleClose}
                  className="w-full"
                  appearance="primary"
                  disabled={isLoading}
                  style={{
                    backgroundColor: "#003CFF",
                    color: "white",
                    fontWeight: "600",
                  }}
                  type="submit"
                >
                  {isLoading ? <Loader content="Loading..." /> : "Save"}
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
