import React, { Ref, SetStateAction } from "react";
import { Form, Schema, SelectPicker } from "rsuite";
import { paymentMethod } from "./TypesAndDefaultes";
import { Textarea } from "../customers/TextArea";
import { IOrder } from "@/redux/features/order/orderSlice";

const DueCollectionForm = (props: {
  order: IOrder;
  forwardedRef: React.MutableRefObject<any>;
  setFormData: React.Dispatch<SetStateAction<Record<string, any>>>;
  formData: Record<string, any>;
}) => {
  const { StringType, NumberType } = Schema.Types;

  const model = Schema.Model({
    amount: Schema.Types.NumberType()
      .isRequired("Amount is required")
      .addRule((v) => Number(v) > 0, "Value cannot be negative")
      .addRule(
        (v) => Number(v) <= Number(props.order.due),
        "Value cannot be Greater Than due amount"
      )
      .pattern(/^[0-9]/, "Amount must contain only number"),
    method: Schema.Types.StringType().isRequired("Method is required"),
    remark: Schema.Types.StringType(),
  });

  return (
    <Form
      className="contents mt-4"
      fluid
      model={model}
      ref={props.forwardedRef}
      onChange={props.setFormData}
      formValue={props.formData}
    >
      <Form.Group>
        <Form.ControlLabel className="font-semibold">Amount</Form.ControlLabel>
        <Form.Control name="amount" type="number" />
      </Form.Group>
      <Form.Group>
        <Form.ControlLabel className="font-semibold">Method</Form.ControlLabel>
        <Form.Control
          name="method"
          accepter={SelectPicker}
          data={paymentMethod}
          block
        />
      </Form.Group>
      <Form.Group className="col-span-2">
        <Form.ControlLabel className="font-semibold ">Remark</Form.ControlLabel>
        <Form.Control name="remark" accepter={Textarea} />
      </Form.Group>
    </Form>
  );
};

export default DueCollectionForm;
