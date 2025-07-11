/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Form,
  Button,
  Loader,
  Modal,
  Checkbox,
  SelectPicker,
  TagInput,
  InputPicker,
} from "rsuite";

import Swal from "sweetalert2";

import { useUpdateBranchMutation } from "@/redux/api/branch/branch.api";
import { FormBranchDataType } from "@/app/(indoorLayout)/branch/page";
import { divisionData } from "../consumer-profile/consumerProfileHelper";

type TEdittableProps = {
  data: any;
  color: any;
  openButton: JSX.Element;
};

export const BranchEditAndViewModal = ({
  data,
  color,
  openButton,
}: TEdittableProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const availability = [
    { label: "ONLINE", value: "online" },
    { label: "OFFLINE", value: "offline" },

    { label: "BOTH", value: "both" },
  ];

  const [updateItem, { isLoading }] = useUpdateBranchMutation();

  const [formData, setFormData] = useState<FormBranchDataType>({
    bid: "",
    name: "",
    phone: "",
    email: "",
    vatNo: "",
    binNo: "",
    isActive: false,
    address1: "",
    address2: "",
    availability: "offline",
    division: "",
    city: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
      });
    }
  }, [data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: Record<string, any>) => {
    setFormData({
      bid: event.bid,
      name: event.name,
      phone: event.phone,
      email: event.email,
      vatNo: event.vatNo,
      address1: event.address1,
      address2: event.address2,
      isActive: event.isActive,
      availability: event.availability,
      deliveryLocations: event.deliveryLocations,
      division: event.division,
      city: event.city,
      binNo: event.binNo,
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
      await handleClose();
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
          <div className="w-full flex justify-center my-10">
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
              <Form.Group controlId="binNo">
                <Form.ControlLabel>Bin NO.</Form.ControlLabel>
                <Form.Control name="binNo" />
              </Form.Group>
              <Form.Group controlId="division">
                <Form.ControlLabel>Division</Form.ControlLabel>
                <Form.Control
                  name="division"
                  accepter={InputPicker}
                  data={divisionData.map((dd) => ({
                    label: dd,
                    value: dd.toLowerCase(),
                  }))}
                  style={{ minWidth: "300px" }}
                />
              </Form.Group>
              <Form.Group controlId="city">
                <Form.ControlLabel>City</Form.ControlLabel>
                <Form.Control name="city" />
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

              {/*brunch availability  */}
              <Form.Group controlId="availability">
                <Form.ControlLabel>Brunch Availability</Form.ControlLabel>
                <Form.Control
                  style={{ minWidth: "300px" }}
                  name="availability"
                  accepter={SelectPicker}
                  data={availability.map((a) => {
                    return { label: a.label, value: a.value };
                  })}
                  block
                />
              </Form.Group>

              {/*Locations for delivery */}
              {(formData?.availability == "online" ||
                formData?.availability == "both") && (
                <Form.Group controlId="deliveryLocations">
                  <Form.ControlLabel>Delivery Locations</Form.ControlLabel>
                  <Form.Control
                    style={{ minWidth: "300px" }}
                    name="deliveryLocations"
                    accepter={TagInput}
                  />
                </Form.Group>
              )}

              {/*  */}

              <Form.Group className="w-full max-w-[300px]  ms-48">
                <Button
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
