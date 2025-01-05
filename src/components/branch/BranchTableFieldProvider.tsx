import { ENUM_USER } from "@/enums/EnumUser";
import { useSession } from "next-auth/react";
import React from "react";
import { Table } from "rsuite";

const BranchTableFieldProvider = () => {
  const { Column, HeaderCell, Cell } = Table;
  const session = useSession();
  const userRole = session?.data?.user?.role;
  if (userRole == ENUM_USER.ADMIN || ENUM_USER.SUPER_ADMIN)
    return (
      <Column flexGrow={1}>
        <HeaderCell className="text-center text-lg font-semibold ">
          {"Branch"}
        </HeaderCell>
        <Cell dataKey="branch.name" />
      </Column>
    );
};

export default BranchTableFieldProvider;
