import { ENUM_USER } from "@/enums/EnumUser";
import { useGetBranchQuery } from "@/redux/api/branch/branch.api";
import { TBranch } from "@/redux/features/order/orderSlice";
import { useSession } from "next-auth/react";
import React from "react";
import { Form, InputPicker, TagPicker } from "rsuite";

const BranchFieldProvider = (props: { usedFor?: string }) => {
  const session = useSession();
  const userRole = session?.data?.user?.role;
  const { data: branchData, isLoading: branchDataLoading } =
    useGetBranchQuery(undefined);

  if (userRole == ENUM_USER.ADMIN || userRole == ENUM_USER.SUPER_ADMIN) {
    return (
      <Form.Group controlId="branch">
        <Form.ControlLabel className="text-xl">Branch</Form.ControlLabel>
        <Form.Control
          name="branch"
          accepter={props?.usedFor == "consumption" ? TagPicker : InputPicker}
          data={branchData?.data?.map((bd: TBranch & { _id: string }) => ({
            label: bd?.name,
            value: bd._id,
          }))}
          loading={branchDataLoading}
          block
          className="lg:w-[300px] w-fit"
        />
      </Form.Group>
    );
  }
};

export default BranchFieldProvider;
