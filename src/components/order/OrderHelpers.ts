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
  try {
    await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#003CFF",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Change Status!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const result = await fn({
          id: id,
          data: { status: status },
        }).unwrap();

        if (result?.success) {
          Swal.fire("Success", result?.message ?? "Status changed", "success");
          if (result?.data) {
            dispatch(updateBillDetails(result?.data));
          }
        }
      }
    });
  } catch (err) {
    Swal.fire("Error", (err ?? "Failed to change status") as string, "error");
  }
};
