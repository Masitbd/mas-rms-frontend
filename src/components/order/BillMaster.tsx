/* eslint-disable react/no-children-prop */
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  IOrder,
  resetBill,
  TBranch,
  updateBillDetails,
} from "@/redux/features/order/orderSlice";
import { useRouter } from "next/navigation";
import React from "react";
import { Button, Input, InputPicker, Message, toaster } from "rsuite";
import { paymentMethod } from "./TypesAndDefaultes";
import { IMenuItemConsumption } from "../menu-item-consumption/TypesAndDefault";
import {
  useLazyGetSIngleOrderWithDetailsQuery,
  usePostOrderMutation,
  useStatusChangerMutation,
  useUpdateOrderMutation,
} from "@/redux/api/order/orderSlice";
import Swal from "sweetalert2";
import { faPrint } from "@fortawesome/free-solid-svg-icons/faPrint";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from "pdfmake/build/pdfmake";
import { ToWords } from "to-words";
import { useSession } from "next-auth/react";
import { ENUM_MODE } from "@/enums/EnumMode";
import CheckIcon from "@rsuite/icons/Check";
import { changeOrderStatus } from "./OrderHelpers";
import { TDocumentDefinitions } from "pdfmake/interfaces";

pdfMake.vfs = pdfFonts as unknown as { [file: string]: string };

const BillMaster = (props: { mode: string }) => {
  const [changeStatus, { isLoading: changeStatusLoading }] =
    useStatusChangerMutation();
  const dispatch = useAppDispatch();
  const bill = useAppSelector((state) => state.order);
  const [postOrder, { isLoading: orderPostLoading }] = usePostOrderMutation();
  const [getFullOrderData, { isLoading: detailsLoading }] =
    useLazyGetSIngleOrderWithDetailsQuery();
  const [updateOrder, { isLoading: orderUpdateLoading }] =
    useUpdateOrderMutation();
  const router = useRouter();
  const cancelHandler = () => {
    dispatch(resetBill());
    router.push("/order");
  };
  const submitHandler = async (button: string) => {
    try {
      const orderData: IOrder = {
        tableName: bill?.tableName,
        waiter: bill.waiter,
        items: bill?.items?.map((item) => ({
          ...item,
          item: item?.item?._id as unknown as IMenuItemConsumption,
        })),
        guest: bill.guest,
        sCharge: bill.sCharge,
        vat: bill.vat,
        percentDiscount: bill.percentDiscount,
        discountAmount: bill.discountAmount,
        totalBill: bill.totalBill,
        totalVat: bill.totalVat,
        serviceCharge: bill.serviceCharge,
        totalDiscount: bill.totalDiscount,
        netPayable: bill.netPayable,
        pPaymentMode: bill?.paymentMode,
        paid: bill?.paid ?? 0,
        pPayment: bill?.pPayment ?? 0,
        due: bill?.due ?? 0,
        cashBack: bill?.cashBack ?? 0,
        cashReceived: bill?.cashReceived ?? 0,
        paymentMode: bill?.paymentMode ?? "cash",
        remark: bill?.remark,
        serviceChargeRate: bill?.serviceChargeRate ?? 0,
        discountCard: bill?.discountCard,
        customer: bill?.customer,
      } as IOrder;

      if (
        typeof bill.customer == "object" &&
        Object.hasOwn(bill.customer, "_id")
      ) {
        orderData.guestType = "registered";
      } else {
        orderData.guestType = "unRegistered";
      }

      let result;
      if (props.mode == ENUM_MODE.NEW) {
        result = await postOrder(orderData).unwrap();
        dispatch(updateBillDetails({ _id: result?.data?._id }));
        dispatch(updateBillDetails({ billNo: result?.data?.billNo }));
      }
      if (props.mode == ENUM_MODE.UPDATE) {
        result = await updateOrder({
          id: bill?._id as string,
          data: orderData,
        }).unwrap();
      }
      if (result?.success) {
        Swal.fire("Success", result?.message ?? "Posted", "success");

        if (button == "save&print") {
          await handlePrint(result?.data?._id);
        }
        if (props.mode == ENUM_MODE.NEW) {
          router.push(`/order/new?mode=update&id=${result?.data?._id}`);
        }
        if (button == "exit") {
          cancelHandler();
        }
      }
    } catch (err) {
      toaster.push(
        <Message type="error">{(err ?? "Failed to post") as string}</Message>
      );
    }
  };

  const session = useSession();

  const handlePrint = async (id: string) => {
    const Data = await getFullOrderData(id).unwrap();
    const bill = Data?.data;
    const numberToWord = new ToWords({
      localeCode: "en-BD",
      converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: false,
      },
    });
    const doc = {
      pageSize: { width: 227, height: "auto" }, // Credit card size in mm
      pageMargins: [2, 2, 2, 2], // Very small margins
      content: [
        {
          text: bill?.branch?.name,
          style: "header",
        },
        {
          text: bill?.branch?.address1,
          style: "subHeader",
        },
        {
          text: bill?.branch?.address2,
          style: "subHeader",
        },
        {
          text: `Helpline: ${bill?.branch?.phone}`,
          style: "subHeader",
        },
        {
          table: {
            widths: ["*"],
            heights: [1],
            body: [
              [
                {
                  text: "   Customer Copy   ",
                  border: [false, false, false, true],
                  fillColor: "#eeeeee",
                  style: { alignment: "center", fontSize: 10, bold: "true" },
                },
              ],
            ],
          },
          margin: [0, 2],
        },

        {
          columns: [
            {
              stack: [
                {
                  text: [
                    { text: "Vat Reg: ", bold: true },
                    bill?.branch?.vatNo,
                  ],
                  style: "infoText",
                },
                {
                  text: [{ text: "Bill No.: ", bold: true }, bill.billNo],
                  style: "infoText",
                },
                {
                  text: [
                    { text: "Table Name:", bold: true },
                    bill?.tableName?.name,
                  ],
                  style: "infoText",
                },
                {
                  text: [
                    { text: "waiter Name ", bold: true },
                    bill?.waiter?.name,
                  ],
                  style: "infoText",
                },

                {
                  text: [
                    { text: "Guest Name: ", bold: true },
                    bill?.customer?.name,
                  ],
                  style: "infoText",
                },
              ],
              width: "60%",
            },
            {
              stack: [
                {
                  text: [
                    { text: "Bill Date: ", bold: true },
                    new Date(bill.date).toLocaleDateString(),
                  ],
                  style: "infoText",
                },
                {
                  text: [
                    { text: "Bill Time: ", bold: true },
                    new Date(bill.date).toLocaleTimeString(),
                  ],
                  style: "infoText",
                },
                {
                  text: [{ text: "Guest: ", bold: true }, bill.guest],
                  style: "infoText",
                },
              ],
              width: "40%",
              alignment: "center",
            },
          ],
        },
        {
          table: {
            widths: [100, 20, 20, 30],
            headerRows: 1,
            body: [
              [
                { text: "Item Name", bold: true },
                { text: "Qty", bold: true },
                { text: "Rate", bold: true },
                { text: "Amount", bold: true },
              ],
              ...(bill?.items?.map((item: any) => {
                return [
                  { text: item?.item?.itemName },
                  { text: item?.qty },
                  { text: item?.rate },
                  {
                    text: parseFloat((item?.rate * item?.qty).toFixed(2)),
                  },
                ];
              }) as []),
            ],
          },
          style: "infoText",
          layout: "headerLineOnly",
        },
        {
          table: {
            widths: ["*"],
            body: [
              [
                {
                  text: "",
                  border: [false, false, false, true],
                  style: { alignment: "center", fontSize: 10, bold: "true" },
                },
              ],
            ],
          },
          margin: [0, 2],
        },
        {
          columns: [
            {
              stack: [
                {
                  text: [{ text: "Food Amount: " }],
                  style: "infoText",
                },
                {
                  text: [{ text: "Total Discount: " }],
                  style: "infoText",
                },
                {
                  text: [{ text: `Vat(${bill?.vat}):` }],
                  style: "infoText",
                },
                {
                  text: [
                    { text: `Service Charge(${bill?.serviceChargeRate}):` },
                  ],
                  style: "infoText",
                },
              ],
              width: "50%",
              alignment: "right",
            },
            {
              stack: [
                {
                  text: [{ text: bill?.totalBill, bold: true }],
                  style: "infoText",
                },
                {
                  text: [{ text: bill?.totalDiscount }],
                  style: "infoText",
                },
                {
                  text: [{ text: bill?.totalVat }],
                  style: "infoText",
                },
                {
                  text: [{ text: bill?.serviceCharge }],
                  style: "infoText",
                },
              ],
              width: "40%",
              alignment: "right",
            },
          ],
        },
        {
          table: {
            widths: ["*"],
            body: [
              [
                {
                  text: "",
                  border: [false, false, false, true],
                  style: { alignment: "center", fontSize: 10, bold: "true" },
                },
              ],
            ],
          },
          margin: [0, 2],
        },
        {
          columns: [
            {
              stack: [
                {
                  text: [{ text: "Net Payable: " }],
                  style: "infoText",
                },
              ],
              width: "50%",
              alignment: "right",
            },
            {
              stack: [
                {
                  text: [{ text: bill?.netPayable, bold: true }],
                  style: "infoText",
                },
              ],
              width: "40%",
              alignment: "right",
            },
          ],
        },

        {
          text: numberToWord.convert(bill.netPayable),
          style: {
            fontSize: 8,
            bold: true,
            alignment: "center",
          },
        },
        {
          columns: [
            {
              stack: [
                {
                  text: [{ text: new Date().toLocaleTimeString() }],
                  style: "infoText",
                },
              ],
              width: "50%",
              alignment: "left",
            },
            {
              stack: [
                {
                  text: [{ text: session?.data?.user?.name, bold: true }],
                  style: "infoText",
                },
              ],
              width: "40%",
              alignment: "right",
            },
          ],
        },
        {
          table: {
            widths: ["*"],
            heights: [1],
            body: [
              [
                {
                  text: "Thank you for coming!",
                  border: [false, false, false, false],
                  fillColor: "#eeeeee",
                  style: { alignment: "center", fontSize: 9, bold: "true" },
                },
              ],
            ],
          },
          margin: [0, 2],
        },

        {
          text: "Developed By Mass It  Sollutions",
          style: {
            fontSize: 7,
            bold: true,
            alignment: "center",
          },
        },
      ],
      styles: {
        infoText: { fontSize: 8, margin: [0, 1, 0, 1] }, // Smaller font and tighter spacing
        barcodeText: { fontSize: 4, bold: true }, // Reduced barcode font size
        header: {
          bold: true,
          alignment: "center",
          fontSize: 18,
        },
        subHeader: {
          alignment: "center",
          fontSize: 8,
        },
      },
    };

    pdfMake.createPdf(doc as unknown as TDocumentDefinitions).print();
  };

  return (
    <div>
      <h3 className="text-[#003CFF] font-roboto text-xl font-semibold">
        Bill Master
      </h3>
      <div className="border border-[#DCDCDC] p-2 rounded-md">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-3 grid grid-cols-1 gap-2">
            <div className="grid grid-cols-3">
              <label htmlFor="">Total Bill</label>
              <Input
                size="sm"
                className="col-span-2"
                value={bill?.totalBill}
                disabled
              />
            </div>
            <div className="grid grid-cols-3">
              <label htmlFor="">Total Vat</label>
              <Input
                size="sm"
                className="col-span-2"
                value={bill?.totalVat}
                disabled
              />
            </div>
            <div className="grid grid-cols-3">
              <label htmlFor="">Service Charge</label>
              <Input
                size="sm"
                className="col-span-2"
                value={bill?.serviceCharge}
                disabled
              />
            </div>

            <div className="grid grid-cols-3">
              <label htmlFor="">Total Discount</label>
              <Input
                size="sm"
                className="col-span-2"
                value={bill.totalDiscount}
                disabled
              />
            </div>
            <div className="grid grid-cols-3">
              <label htmlFor="">Net Payable</label>
              <Input
                size="sm"
                className="col-span-2"
                value={bill?.netPayable}
                disabled
              />
            </div>
          </div>

          <div className="col-span-3 grid grid-cols-1 gap-2">
            <div className="grid grid-cols-3">
              <label htmlFor="">Payment Mode</label>
              <InputPicker
                size="sm"
                className="col-span-2"
                data={paymentMethod}
                onSelect={(v) =>
                  dispatch(updateBillDetails({ paymentMode: v }))
                }
                placement="top"
                value={bill.paymentMode}
              />
            </div>
            <div className="grid grid-cols-3">
              <label htmlFor="">Remark</label>
              <Input
                size="sm"
                className="col-span-2"
                onChange={(v) => dispatch(updateBillDetails({ remark: v }))}
                value={bill.remark}
              />
            </div>
            <div className="grid grid-cols-3">
              <label htmlFor="">P. Payment Mode</label>
              <InputPicker
                size="sm"
                className="col-span-2"
                data={paymentMethod}
                onSelect={(v) =>
                  dispatch(updateBillDetails({ pPaymentMode: v }))
                }
                placement="top"
                value={bill.pPaymentMode}
              />
            </div>

            <div className="grid grid-cols-3">
              <label htmlFor="">Paid</label>
              <Input
                size="sm"
                className="col-span-2"
                onChange={(v) =>
                  dispatch(updateBillDetails({ paid: Number(v) }))
                }
                type="number"
                value={bill.paid}
              />
            </div>
            <div className="grid grid-cols-3">
              <label htmlFor="">P. Payment</label>
              <Input
                size="sm"
                className="col-span-2"
                onChange={(v) =>
                  dispatch(updateBillDetails({ pPayment: Number(v) }))
                }
                type="number"
                value={bill?.pPayment}
              />
            </div>
            <div className="grid grid-cols-3">
              <label htmlFor="">Due</label>
              <Input
                size="sm"
                className="col-span-2"
                value={bill.due}
                disabled
              />
            </div>
          </div>

          <div className="col-span-3">
            <div className="grid grid-cols-3 mb-2">
              <label htmlFor="">Cash Received</label>
              <div className="col-span-2 ">
                <Input
                  size="sm"
                  className="col-span-2 w"
                  onChange={(v) =>
                    dispatch(updateBillDetails({ cashReceived: Number(v) }))
                  }
                  value={bill.cashReceived}
                />
              </div>
            </div>
            <div className="grid grid-cols-3">
              <label htmlFor="">Cash Back</label>
              <div className="col-span-2 ">
                <Input
                  size="sm"
                  className="col-span-2 w"
                  disabled
                  value={bill.cashBack}
                />
              </div>
            </div>
          </div>

          <div className="col-span-3 grid grid-cols-2 gap-2">
            <Button
              size="lg"
              appearance="primary"
              style={{ backgroundColor: "#003CFF" }}
              onClick={() => submitHandler("save")}
              loading={orderPostLoading || orderUpdateLoading}
              disabled={bill?.status == "posted"}
            >
              {props?.mode == ENUM_MODE.NEW ? "Save" : "Update"}
            </Button>
            <Button
              size="lg"
              loading={orderPostLoading || orderUpdateLoading}
              appearance="primary"
              style={{ backgroundColor: "#003CFF" }}
              onClick={() => submitHandler("save&print")}
              disabled={bill?.status == "posted"}
            >
              {props?.mode == ENUM_MODE.NEW ? "Save & Print" : "Update & Print"}
            </Button>
            <Button
              size="lg"
              appearance="primary"
              style={{ backgroundColor: "#003CFF" }}
              onClick={() => submitHandler("exit")}
              disabled={bill?.status == "posted"}
              loading={orderPostLoading || orderUpdateLoading}
            >
              {props?.mode == ENUM_MODE.NEW ? "Save & Exit" : "Update & Exit"}
            </Button>
            <Button
              size="lg"
              appearance="primary"
              style={{ backgroundColor: "#003CFF" }}
              endIcon={<FontAwesomeIcon icon={faPrint} />}
              children={"Print"}
              onClick={() => handlePrint(bill?._id as string)}
              disabled={bill?.status == "posted"}
              loading={orderPostLoading || orderUpdateLoading}
            />

            <Button
              size="lg"
              appearance="primary"
              color="green"
              endIcon={<CheckIcon />}
              children={"Posted"}
              onClick={() =>
                changeOrderStatus(
                  bill?._id as string,
                  "posted",
                  changeStatus,
                  dispatch
                )
              }
              loading={
                changeStatusLoading || orderUpdateLoading || orderPostLoading
              }
              disabled={bill?.status == "posted"}
            />

            <Button
              color="red"
              size="lg"
              appearance="primary"
              onClick={() => cancelHandler()}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillMaster;
