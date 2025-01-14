import Link from "next/link";
import React from "react";
import { Button, Checkbox, Divider, Form } from "rsuite";

const SingupForm = () => {
  return (
    <Form fluid className="lg:w-[50%] w-[80%]  user-signup-form">
      <h2 className="text-4xl font-semibold my-5">Get Started Now</h2>
      <Form.Group controlId="name">
        <Form.ControlLabel className="text-lg font-bold font-roboto">
          Name
        </Form.ControlLabel>
        <Form.Control name="Name" placeholder="Enter name" size="lg" />
      </Form.Group>
      <Form.Group controlId="email">
        <Form.ControlLabel className="text-lg font-bold font-roboto">
          Email
        </Form.ControlLabel>
        <Form.Control name="email" placeholder="Enter Email" size="lg" />
      </Form.Group>

      <Form.Group controlId="password">
        <Form.ControlLabel className="text-lg font-bold font-roboto">
          Password
        </Form.ControlLabel>
        <Form.Control name="password" placeholder="password" size="lg" />
      </Form.Group>

      <Form.Group controlId="username" className="flex flex-row">
        <Form.Control
          name="userName"
          placeholder="Enter username"
          size="lg"
          accepter={Checkbox}
        >
          I agree to the{" "}
          <Link href={"/terms"}>
            <span className="text-blue-600">Terms And Policy</span>
          </Link>
        </Form.Control>
      </Form.Group>

      <Button
        className="w-full text-lg"
        size="lg"
        style={{ backgroundColor: "#FC8A06", fontWeight: "bold" }}
        appearance="primary"
      >
        Submit
      </Button>
      <div className=" flex flex-row items-center mt-5">
        <Divider />
        <span className="mx-4"> Or</span>
        <Divider />
        <div></div>
      </div>

      <div className=" flex items-center justify-center">
        Already have an account ?
        <Link href={"/login"}>
          <span className="text-blue-600"> Login</span>
        </Link>
      </div>
    </Form>
  );
};

export default SingupForm;
