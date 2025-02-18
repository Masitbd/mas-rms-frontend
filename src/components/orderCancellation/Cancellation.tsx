/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import { ENUM_ORDER_STATUS } from "@/enums/EnumOrderStatus";
import {
  useGetSingleCancellationQuery,
  useGetSIngleOrderWithDetailsQuery,
  usePostCancellationRequestMutation,
} from "@/redux/api/order/orderSlice";
import React, { useEffect, useState } from "react";
import { InputPicker, SelectPicker } from "rsuite";
import { cancellationReasons } from "./CancellationHelper";
import { Textarea } from "../customers/TextArea";
import { paymentMethod } from "../order/TypesAndDefaultes";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import CancellationStatus from "./CancellationStatus";

const Cancellation = ({
  params,
}: {
  params: { id: string; redirect?: boolean; successHandler?(): void };
}) => {
  const router = useRouter();
  const {
    isLoading,
    isFetching,
    data: order,
  } = useGetSIngleOrderWithDetailsQuery(params?.id, { skip: !params?.id });

  const { data: existedCancellationData } = useGetSingleCancellationQuery(
    params?.id,
    {
      skip: !params?.id,
    }
  );

  const [post, { isLoading: cancellationLaoding }] =
    usePostCancellationRequestMutation();

  const initialCancellationData = {
    reason: "",
    refundMethod: "",
    description: "",
  };

  const [cancellationData, setCancellationData] = useState(
    initialCancellationData
  );
  const handleDataChange = (key: string, value: string) => {
    setCancellationData({ ...cancellationData, [key]: value });
  };

  const handelSubmit = async () => {
    if (!cancellationData?.reason) {
      Swal.fire("Error", "Please select a cancellation reason", "error");
      return;
    }
    if (order?.data?.due > 0 && !cancellationData.refundMethod) {
      Swal.fire("Error", "Please select a refund method", "error");
      return;
    }

    const data = {
      orderId: order?.data?._id,
      reason: cancellationData.reason,

      ...(cancellationData?.reason &&
      cancellationData?.description &&
      cancellationData?.reason == "other"
        ? { description: cancellationData?.description }
        : {}),
      ...(cancellationData?.refundMethod
        ? { refundOption: cancellationData?.refundMethod }
        : {}),
    };

    try {
      const result = await post(data).unwrap();
      if (result?.success) {
        Swal.fire("Success", "Order Cancellation is on progress. ", "success");

        if (params?.redirect) {
          router.push(`/consumer/orders/${order?.data?._id}`);
        }
        params?.successHandler && params.successHandler();
        setCancellationData(initialCancellationData);
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", (error ?? "Something went wrong") as string, "error");
    }
  };

  useEffect(() => {
    if (existedCancellationData?.data?.length) {
      setCancellationData(existedCancellationData?.data[0]);
    }
  }, [existedCancellationData]);

  return (
    <div>
      <div className="bg-white shadow rounded-lg">
        {/* Header */}
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Cancel Order #{order?.data?.billNo}
            </h1>
          </div>
        </div>

        {existedCancellationData?.data?.length ? (
          <div className="px-4 py-5 sm:px-6 space-y-6">
            <CancellationStatus
              status={
                existedCancellationData?.data?.length
                  ? existedCancellationData?.data[0]?.status
                  : "pending"
              }
            />
          </div>
        ) : (
          <>
            <form className="px-4 py-5 sm:px-6 space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-sm font-medium text-gray-700 mb-3">
                  Order Summary
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Date:</span>
                    <span className="text-gray-900">
                      {new Date(
                        order?.data?.createdAt ?? Date.now().toString()
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full
                ${
                  order?.data?.status === ENUM_ORDER_STATUS.NOT_POSTED
                    ? "bg-yellow-100 text-yellow-800"
                    : ""
                }`}
                    >
                      {order?.data?.status === ENUM_ORDER_STATUS.NOT_POSTED
                        ? "Pending"
                        : order?.data?.status === ENUM_ORDER_STATUS.VOID
                        ? "Cancelled"
                        : "Delivered"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cancellation Reason */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please select a reason for cancellation
                  </label>
                  <InputPicker
                    data={cancellationReasons?.map((cr) => ({
                      label: cr?.label,
                      value: cr?.label,
                    }))}
                    block
                    onChange={(v) => handleDataChange("reason", v)}
                  />
                </div>
                {cancellationData?.reason == "Other" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Please select a reason for cancellation
                    </label>
                    <div>
                      <Textarea
                        onChange={(v: string) => {
                          handleDataChange("description", v);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Refund Option */}
              {order?.data?.due > 0 && (
                <div className=" w-full">
                  <label
                    htmlFor="requestRefund"
                    className="block text-sm text-gray-700"
                  >
                    Specify a refund option
                  </label>
                  <SelectPicker
                    data={paymentMethod.map((pm) => ({
                      value: pm.value,
                      label: pm.label,
                    }))}
                    block
                    onChange={(v) =>
                      handleDataChange("refundMethod", v as string)
                    }
                  />
                </div>
              )}

              {/* Action Buttons */}
            </form>
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 border-t border-gray-200 py-5">
              <button
                // onClick={() => navigate(`/order/${id}`)}
                className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                disabled={cancellationLaoding}
              >
                Back
              </button>
              <button
                onClick={() => handelSubmit()}
                className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                disabled={cancellationLaoding}
              >
                {/* {isSubmitting ? "Submitting..." : "Submit Cancellation"} */}
                Submit
              </button>
            </div>
          </>
        )}
        {/* Form */}
      </div>
    </div>
  );
};

export default Cancellation;
