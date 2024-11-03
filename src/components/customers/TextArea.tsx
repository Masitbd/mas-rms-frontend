/* eslint-disable react/display-name */
import React from "react";
import { Input } from "rsuite";

export const Textarea = React.forwardRef(
  (props, ref: React.ForwardedRef<HTMLTextAreaElement>) => (
    <Input rows={3} {...props} as="textarea" ref={ref} />
  )
);
