import { ENUM_MODE } from "@/enums/EnumMode";
import { ENUM_ORDER_STATUS } from "@/enums/EnumOrderStatus";
import React from "react";
import { Tag } from "rsuite";

const OrderStatusTagProvider = (props: { status: ENUM_ORDER_STATUS }) => {
  const { status } = props;
  if (status == ENUM_ORDER_STATUS.VOID) {
    return <Tag color="red">Void</Tag>;
  }
  if (status == ENUM_ORDER_STATUS.POSTED) {
    return <Tag color="green">Posted</Tag>;
  }
  if (status == ENUM_ORDER_STATUS.NOT_POSTED) {
    return <Tag color="yellow">Pending</Tag>;
  }
};

export default OrderStatusTagProvider;
