"use client";
import CustomerTable from "@/components/customers/CustomerTable";
import { Textarea } from "@/components/customers/TextArea";
import {
  useCreateCustomerListMutation,
  useGetCustomerListQuery,
} from "@/redux/api/customer/customer.api";
import { useState } from "react";
import { Form, Button, Checkbox, Loader } from "rsuite";
import Swal from "sweetalert2";

const CustomersPage = () => {
  const { data: customres, isLoading } = useGetCustomerListQuery({});

  const [createCustomer, { isLoading: creating }] =
    useCreateCustomerListMutation();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    dob: "",
    reward: "",
    discountCard: "",
    discount: "",
    address: "",
    isActive: false,
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
    const res = await createCustomer(formData).unwrap();
    if (res.success) {
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: "Customer Added successfully",
        icon: "success",
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto  drop-shadow-md shadow-xl m-5 py-8 px-5 bg-[#fcfbfb]">
      <h1 className="text-center text-[#003CFF] text-2xl font-bold">
        Customer Information
      </h1>

      {/* form */}

      <div className="w-full  my-10">
        <Form
          fluid
          layout="horizontal"
          formValue={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-5 justify-items-center"
        >
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
          <Form.Group controlId="discount">
            <Form.ControlLabel>Discount Amount</Form.ControlLabel>
            <Form.Control name="discount" />
          </Form.Group>
          {/*  */}
          <Form.Group controlId="address">
            <Form.ControlLabel>Address</Form.ControlLabel>
            <Form.Control name="address" accepter={Textarea} />
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

          <Form.Group className="w-full max-w-[300px] ml-auto">
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

      <CustomerTable data={customres?.data} isLoading={isLoading} />
    </div>
  );
};

export default CustomersPage;
