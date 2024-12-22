/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Ref, SetStateAction } from "react";
import { Button, DatePicker, Form, FormInstance, InputPicker } from "rsuite";
import PasswordFieldProvider from "./PasswordFieldProvider";
import { Textarea } from "../customers/TextArea";
import { IuserFormData, IUserPost, userFormSchema } from "./Types&Defaults";
import { genders, roles, userModelProvider } from "./userHelper";
import { ENUM_MODE } from "@/enums/EnumMode";

const UserForm = (props: {
  setFormData: React.Dispatch<SetStateAction<IuserFormData | undefined>>;
  formData: IuserFormData | undefined;
  forwardedFromRef: Ref<FormInstance>;
  mode: ENUM_MODE;
}) => {
  const { setFormData, formData, forwardedFromRef, mode } = props;
  const model = userModelProvider(mode);

  return (
    <div>
      <div className="bg-white border border-slate-200 rounded-lg px-4">
        <h3 className="font-roboto text-xl font-semibold -m-4 mx-2  text-[#343434]">
          <span className="bg-white px-2 rounded-md">User Information</span>
        </h3>
        <Form
          className="grid grid-cols-3 gap-5 justify-center w-full py-5"
          fluid
          onChange={(v) => {
            setFormData(v as IuserFormData);
          }}
          formValue={formData}
          model={model as any}
          ref={forwardedFromRef}
          disabled={props.mode == ENUM_MODE.VIEW}
        >
          {/* UUid field if data is in view or update mode */}
          {mode == ENUM_MODE.VIEW && (
            <Form.Group controlId="uuid">
              <Form.ControlLabel>UUID</Form.ControlLabel>
              <Form.Control name="uuid" />
            </Form.Group>
          )}
          <Form.Group controlId="name">
            <Form.ControlLabel>Name</Form.ControlLabel>
            <Form.Control name="name" />
          </Form.Group>
          <Form.Group controlId="motherName">
            <Form.ControlLabel>Mother Name</Form.ControlLabel>
            <Form.Control name="motherName" />
          </Form.Group>
          <Form.Group controlId="fatherName">
            <Form.ControlLabel>Father Name</Form.ControlLabel>
            <Form.Control name="fatherName" />
          </Form.Group>
          <Form.Group controlId="age">
            <Form.ControlLabel>Age</Form.ControlLabel>
            <Form.Control name="age" />
          </Form.Group>
          <Form.Group controlId="dateOfBirth">
            <Form.ControlLabel>Date Of Birth</Form.ControlLabel>
            <Form.Control
              name="dateOfBirth"
              accepter={DatePicker}
              block
              value={
                formData?.dateOfBirth
                  ? new Date(formData?.dateOfBirth as unknown as string)
                  : new Date()
              }
            />
          </Form.Group>
          <Form.Group controlId="gender">
            <Form.ControlLabel>Gender</Form.ControlLabel>
            <Form.Control
              name="gender"
              accepter={InputPicker}
              data={genders}
              className="w-full"
              block={true}
            />
          </Form.Group>
          <Form.Group controlId="role">
            <Form.ControlLabel>Role</Form.ControlLabel>
            <Form.Control
              name="role"
              accepter={InputPicker}
              data={roles}
              className="w-full"
              block={true}
            />
          </Form.Group>

          <Form.Group controlId="phone">
            <Form.ControlLabel>Phone</Form.ControlLabel>
            <Form.Control name="phone" className="w-full" />
          </Form.Group>
          <Form.Group controlId="email">
            <Form.ControlLabel>Email</Form.ControlLabel>
            <Form.Control name="email" type="email" />
          </Form.Group>
          {props.mode == ENUM_MODE.NEW && (
            <div className="contents">
              <PasswordFieldProvider />
            </div>
          )}

          <Form.Group controlId="address">
            <Form.ControlLabel>Address</Form.ControlLabel>
            <Form.Control
              name="address"
              className="w-full"
              accepter={Textarea}
            />
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};

export default UserForm;
