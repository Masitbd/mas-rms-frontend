import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Input, Modal, SelectPicker } from "rsuite";
import { isDueCollectionButtonVisible } from "./OrderHelpers";
import { ENUM_MODE } from "@/enums/EnumMode";
import { IOrder, updateBillDetails } from "@/redux/features/order/orderSlice";
import { useSession } from "next-auth/react";
import { ENUM_USER } from "@/enums/EnumUser";
import { paymentMethod } from "./TypesAndDefaultes";
import { Textarea } from "../customers/TextArea";
import DueCollectionForm from "./DueCollectionForm";
import DueCollectionDetails from "./DueCollectionDetails";
import Swal from "sweetalert2";
import { useDueCollectionMutation } from "@/redux/api/order/orderSlice";
import { useAppDispatch } from "@/lib/hooks";
export type DueFormData = {
  amount: number;
  method: string;
  remark?: string;
};
const DueCollection = (props: { mode: ENUM_MODE; order: IOrder }) => {
  const dispatch = useAppDispatch();
  const [post, { isLoading }] = useDueCollectionMutation();
  const formRef = useRef<any>();
  const session = useSession();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>();
  const [visible, setVisible] = useState(false);

  const successHandler = (message: string) => {
    setFormData({ amount: 0 });
    setOpen(false);
    Swal.fire("Success", "Due Amount Collected Successfully", "success");
  };

  const cancelHandler = () => {
    setOpen(false);
    setFormData({ amount: 0 });
  };

  const submitHandler = async () => {
    try {
      if (formRef.current?.check()) {
        const data = {
          ...formData,
        };
        const result = await post({
          id: props.order?._id as string,
          data: data as DueFormData,
        }).unwrap();
        if (result?.success) {
          successHandler(
            result?.message ?? "Due Amount Collected Successfully"
          );
          dispatch(updateBillDetails(result?.data));
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        (error ?? "Failed to collect due amount") as string,
        "error"
      );
    }
  };

  useEffect(() => {
    if (props.mode === ENUM_MODE.UPDATE) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [props]);
  return (
    <>
      <Button
        size="lg"
        appearance="primary"
        style={{
          backgroundColor: "#003CFF",
          display: visible ? "block" : "none",
        }}
        hidden={true}
        onClick={() => setOpen(!open)}
      >
        Collect Due
      </Button>

      <Modal open={open} onClose={() => cancelHandler()}>
        <Modal.Header>
          <Modal.Title>Due Collection</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="grid grid-cols-2 gap-2">
            <DueCollectionDetails order={props.order} />
            <DueCollectionForm
              order={props.order}
              forwardedRef={formRef}
              formData={formData as Record<string, any>}
              setFormData={setFormData}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            appearance="primary"
            style={{ backgroundColor: "#003CFF" }}
            onClick={() => submitHandler()}
            loading={isLoading}
            disabled={isLoading}
          >
            Submit
          </Button>
          <Button
            appearance="primary"
            color="red"
            onClick={() => cancelHandler()}
            loading={isLoading}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DueCollection;
