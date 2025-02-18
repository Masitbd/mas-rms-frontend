import React, { useState } from "react";
import { Button, Modal } from "rsuite";
import CloseIcon from "@rsuite/icons/Close";
import Cancellation from "../orderCancellation/Cancellation";
import { ENUM_ORDER_STATUS } from "@/enums/EnumOrderStatus";
const OrderVoid = (props: { id: string; status: ENUM_ORDER_STATUS }) => {
  const [open, setOpen] = useState(false);
  const successHandler = () => {
    setOpen(false);
  };
  return (
    <>
      <Button
        color="yellow"
        size="lg"
        appearance="primary"
        endIcon={<CloseIcon />}
        onClick={() => setOpen(true)}
        disabled={
          props.status === ENUM_ORDER_STATUS.VOID ||
          props.status === ENUM_ORDER_STATUS.POSTED
        }
      >
        Void Oder
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header>Void Order</Modal.Header>
        <Modal.Body>
          <Cancellation
            params={{ id: props.id, successHandler: successHandler }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => setOpen(false)}
            appearance="primary"
            color="red"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderVoid;
