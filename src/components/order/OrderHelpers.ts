import { ENUM_MODE } from "@/enums/EnumMode";
import { ENUM_USER } from "@/enums/EnumUser";
import { useAppDispatch } from "@/lib/hooks";
import { IStatusChanger } from "@/redux/api/order/orderSlice";
import { IOrder, updateBillDetails } from "@/redux/features/order/orderSlice";
import { AppDispatch } from "@/redux/store";
import Swal from "sweetalert2";
import { PosPrinterDocProvider } from "./PosPrinterDocProvider";
import { LaserPrintingDocProvider } from "./LeserPrintingDocProvider";
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

export const isDueCollectionButtonVisible = (
  mode: ENUM_MODE,
  userRole: ENUM_USER,
  order: IOrder
) => {
  if (mode == ENUM_MODE.UPDATE && userRole == ENUM_USER.ADMIN) {
    return true;
  }

  if (mode == ENUM_MODE.UPDATE && order?.branch) {
    if (userRole !== ENUM_USER.USER) return true;
  }

  return false;
};

export const InvoiceDocProvider = (mode: any, bill: any, session: any) => {
  if (mode == "pos") {
    return PosPrinterDocProvider(bill, session);
  } else {
    return LaserPrintingDocProvider(bill, session);
  }
};

export function printPdfBlobSameTab(pdfBlob: Blob) {
  const blobUrl = URL.createObjectURL(pdfBlob);

  const iframe = document.createElement("iframe");
  // Keep it invisible but present in the DOM
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.src = blobUrl;

  const cleanUp = () => {
    URL.revokeObjectURL(blobUrl);
    iframe.remove();
  };

  const triggerPrint = () => {
    const w = iframe.contentWindow as Window | null;
    if (!w) {
      cleanUp();
      return;
    }

    const after = () => setTimeout(cleanUp, 300);

    // Use separate guards (not `else if`) so TS doesn't narrow to `never`
    if ("onafterprint" in w) {
      (w as Window & { onafterprint: (() => void) | null }).onafterprint =
        after;
    }

    if (typeof w.matchMedia === "function") {
      const mql: MediaQueryList = w.matchMedia("print");
      const onChange = (e: MediaQueryListEvent) => {
        if (!e.matches) after();
      };

      if ("addEventListener" in mql) {
        mql.addEventListener("change", onChange);
      } else if ("addListener" in mql) {
        // Older API (cast for TS)
        (
          mql as unknown as {
            addListener: (cb: (e: MediaQueryListEvent) => void) => void;
          }
        ).addListener(onChange);
      }
    }

    // Small delay helps some PDF viewers fully initialize
    setTimeout(() => {
      w.focus();
      w.print();
    }, 100);
  };

  iframe.addEventListener("load", () => setTimeout(triggerPrint, 200));
  document.body.appendChild(iframe);
}
