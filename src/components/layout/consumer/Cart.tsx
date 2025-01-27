import MyCart from "@/components/consumer-components/MyCart";
import React, { SetStateAction } from "react";
import { Modal } from "rsuite";

const Cart = ({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div>
      <Modal
        overflow
        onClose={() => setOpen(false)}
        open={isOpen}
        style={{ zIndex: 8788787881998 }}
        size={"xs"}
      >
        <Modal.Header>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body className="flex items-center justify-center mt-5">
          <MyCart />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Cart;
