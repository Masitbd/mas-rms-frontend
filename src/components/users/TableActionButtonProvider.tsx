import React from "react";
import { Button } from "rsuite";
import EditIcon from "@rsuite/icons/Edit";
import ViewIcon from "@rsuite/icons/EyeClose";
import TrashIcon from "@rsuite/icons/Trash";
import { useRouter } from "next/navigation";
import { deleteUser } from "./userHelper";
import { IUserDeleteMutation } from "@/redux/api/users/user.api";
const TableActionButtonProvider = (props: {
  uuid: string;
  mode: string;
  route: string;
  deleteFn: IUserDeleteMutation[0];
}) => {
  const router = useRouter();
  const editHandler = () => {
    router.push("/users/new?" + "mode=update&" + "uuid=" + props.uuid);
  };

  const viewHandler = () => {
    router.push("/users/new?" + "mode=view&" + "uuid=" + props.uuid);
  };

  const deletHandler = async () => {
    await deleteUser(props.uuid, props.deleteFn);
  };
  return (
    <div className="grid grid-cols-3 gap-3">
      <Button appearance="ghost" color="blue" onClick={() => editHandler()}>
        <EditIcon />
      </Button>

      <Button appearance="ghost" color="green" onClick={() => viewHandler()}>
        <ViewIcon />
      </Button>
      <Button appearance="ghost" color="red" onClick={() => deletHandler()}>
        <TrashIcon />
      </Button>
    </div>
  );
};

export default TableActionButtonProvider;
