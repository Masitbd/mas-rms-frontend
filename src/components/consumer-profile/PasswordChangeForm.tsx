import { useChangePasswordMutation } from "@/redux/api/users/user.api";
import React, { useRef, useState } from "react";
import { Button, Modal } from "rsuite";
import { Form, Schema, Notification, toaster } from "rsuite";
import Swal from "sweetalert2";

const PasswordChangeForm = () => {
  const formref = useRef<any>();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const { StringType } = Schema.Types;
  const [formValue, setFormValue] = useState<Record<string, string>>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  // Define the form model for validation
  const model = Schema.Model({
    oldPassword: StringType().isRequired("This field is required."),
    newPassword: StringType().isRequired("This field is required."),
    confirmPassword: StringType()
      .isRequired("This field is required.")
      .addRule(
        (value, data) => value === data.newPassword,
        "Passwords do not match."
      ),
  });

  const [open, setOpen] = useState(false);
  const colseHandler = () => {
    setOpen(false);
    setFormValue({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };
  const handleSubmit = async () => {
    if (!formref?.current?.check()) {
      Swal.fire("Error!", "Fill in all the form fields", "error");
      return;
    }
    // Handle form submission here
    try {
      const result = await changePassword({
        oldPassword: formValue.oldPassword,
        newPassword: formValue.newPassword,
      }).unwrap();
      if (result?.success) {
        Swal.fire("Success", "Password Changed Successfully", "success");
        setOpen(false);
        colseHandler();
      }
    } catch (error) {
      Swal.fire(
        "Error",
        (error ?? "Failed to change password") as string,
        "error"
      );
    }
  };

  return (
    <div>
      <Button appearance="primary" color="green" onClick={() => setOpen(true)}>
        Change Password
      </Button>
      <Modal
        open={open}
        style={{ marginTop: "4rem" }}
        closeButton={false}
        size={"xs"}
      >
        {/* <Modal.Header className="bg-blue-600 text-center text-lg font-semibold text-white rounded py-2 relative grid grid-cols-12">
        
        </Modal.Header> */}
        <>
          <div className="bg-[#FC8A06] text-center  font-semibold text-white rounded py-2 relative grid grid-cols-12 ">
            <div className="text-center col-span-11 text-lg">
              Change Password
            </div>
            <div
              className="text-center rounded bg-red-600 mx-1 cursor-pointer"
              onClick={() => colseHandler()}
            >
              X
            </div>
          </div>
          <div className="py-5 px-2  -mt-1 rounded-b">
            <Form
              fluid
              model={model}
              formValue={formValue}
              onChange={setFormValue}
              ref={formref}
            >
              <Form.Group controlId="oldPassword">
                <Form.ControlLabel>Old Password</Form.ControlLabel>
                <Form.Control name="oldPassword" type="text" />
              </Form.Group>

              <Form.Group controlId="newPassword">
                <Form.ControlLabel>New Password</Form.ControlLabel>
                <Form.Control name="newPassword" type="text" />
              </Form.Group>

              <Form.Group controlId="confirmPassword">
                <Form.ControlLabel>Confirm New Password</Form.ControlLabel>
                <Form.Control name="confirmPassword" type="text" />
              </Form.Group>
            </Form>
          </div>
        </>

        <Modal.Footer>
          <Button
            appearance="primary"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
          >
            Change Password
          </Button>
          <Button
            onClick={colseHandler}
            appearance="primary"
            color="red"
            loading={isLoading}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PasswordChangeForm;
