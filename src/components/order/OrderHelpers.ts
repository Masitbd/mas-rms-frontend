import { useAppDispatch } from "@/lib/hooks";
import { IStatusChanger } from "@/redux/api/order/orderSlice";
import { updateBillDetails } from "@/redux/features/order/orderSlice";
import { AppDispatch } from "@/redux/store";
import Swal from "sweetalert2";
export const changeOrderStatus = async (
  id: string,
  status: string,
  fn: IStatusChanger,
  dispatch: AppDispatch
) => {
  const result = await fn({ id: id, data: { status: status } }).unwrap();
  if (result?.success) {
    Swal.fire("Success", result?.message ?? "Status changed", "success");
    if (result?.data) {
      dispatch(updateBillDetails(result?.data));
    }
  } else {
    Swal.fire("Error", result?.message ?? "Failed to change status", "error");
  }
};
