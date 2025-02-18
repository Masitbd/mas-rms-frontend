"use client";
import {
  useApproveCancellationRequestMutation,
  useGetSingleCancellationQuery,
  useRejectCancellationRequestMutation,
} from "@/redux/api/order/orderSlice";
import React, { useEffect, useState } from "react";
import { Button, Form, Input } from "rsuite";
import { Textarea } from "../customers/TextArea";
import { NavLink } from "../layout/Navlink";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const IndoorCancellationDetails = (params: { id: string }) => {
  const router = useRouter();
  const { data: cancellationData } = useGetSingleCancellationQuery(params.id, {
    skip: !params.id,
  });
  const [approve, { isLoading: approveLoading }] =
    useApproveCancellationRequestMutation();

  const [reject, { isLoading: rejectLoading }] =
    useRejectCancellationRequestMutation();

  const [data, setData] = useState<Record<string, any>>();

  useEffect(() => {
    if (cancellationData?.data[0]?.orderId?._id) {
      setData(JSON.parse(JSON.stringify(cancellationData?.data[0])));
    }
  }, [cancellationData]);

  console.log(cancellationData);
  const submitHandler = async () => {
    try {
      const result = await approve({
        id: data?._id,
        data: {
          adminNote:
            data?.adminNote ?? "Your refund will be automatically processed",
        },
      }).unwrap();

      if (result?.success) {
        Swal.fire(
          "Success",
          result?.message ?? "Refund request approved successfully",
          "success"
        );
        setData(undefined);
        router.push("/cancellation");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        (error ?? "Failed to approve cancellation") as string,
        "error"
      );
      console.error(error);
    }
  };

  const rejectHandler = async () => {
    try {
      const result = await reject({
        id: data?._id,
        data: {
          adminNote: data?.adminNote ?? "Your Request rejected",
        },
      }).unwrap();

      if (result?.success) {
        Swal.fire(
          "Success",
          result?.message ?? "Refund request Rejected successfully",
          "success"
        );
        setData(undefined);
        router.push("/cancellation");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        (error ?? "Failed to reject cancellation") as string,
        "error"
      );
      console.error(error);
    }
  };
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Pending Cancellation Requests
        </h1>
      </div>
      <div className="border-t border-gray-200">
        {
          <ul role="list" className="divide-y divide-gray-200">
            <li className="px-4 py-5 sm:px-6">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <div className="text-lg font-medium text-gray-900 flex justify-between flex-row w-full">
                      <Link
                        href={`/order/new?mode=update&id=${cancellationData?.data[0]?.orderId?._id}`}
                        className="text-blue-600"
                      >
                        Order #{cancellationData?.data[0]?.orderId?.billNo}
                      </Link>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Requested on:{" "}
                      {new Date(
                        cancellationData?.data[0]?.createdAt ??
                          new Date().toString()
                      ).toLocaleDateString()}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Requested by:{" "}
                      <Link
                        className="text-blue-600 text-sm"
                        href={`/users/new?mode=view&uuid=${cancellationData?.data[0]?.postedBy?.uuid}`}
                      >
                        {" "}
                        {cancellationData?.data[0]?.postedBy?.uuid}
                      </Link>
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Reason: {cancellationData?.data[0]?.reason}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Platform: {cancellationData?.data[0]?.orderId?.platform}
                    </p>
                    <p className="mt-1 text-sm text-gray-800">
                      Order Total:{" "}
                      {cancellationData?.data[0]?.orderId?.totalBill?.toFixed(
                        2
                      )}
                    </p>
                    <p className="mt-1 text-sm text-gray-800">
                      Order Net:{" "}
                      {cancellationData?.data[0]?.orderId?.netPayable?.toFixed(
                        2
                      )}
                    </p>
                    {cancellationData?.data[0]?.status !== "pending" && (
                      <>
                        <p className="mt-1 text-sm text-gray-500  capitalize">
                          Status: {cancellationData?.data[0]?.status}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Request status Changed By:{" "}
                          <Link
                            className="text-blue-600 text-sm"
                            href={`/users/new?mode=view&uuid=${cancellationData?.data[0]?.approvedBy?.uuid}`}
                          >
                            {" "}
                            {cancellationData?.data[0]?.approvedBy?.uuid}
                          </Link>
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <Form
                    fluid
                    formValue={data}
                    onChange={setData}
                    disabled={cancellationData?.data[0]?.status !== "pending"}
                  >
                    {/* <Form.Group>
                      <Form.ControlLabel>
                        <label className="block text-sm font-medium text-gray-700">
                          Refund Amount
                        </label>
                      </Form.ControlLabel>
                      <Form.Control
                        name="orderId.netPayable"
                        type="number"
                        step="0.01"
                      />
                    </Form.Group> */}
                    <Form.Group>
                      <Form.ControlLabel>
                        <label className="block text-sm font-medium text-gray-700">
                          Admin Notes
                        </label>
                      </Form.ControlLabel>
                      <Form.Control
                        name="adminNote"
                        placeHolder="Add any notes about this cancellation"
                        accepter={Textarea}
                      />
                    </Form.Group>
                  </Form>

                  {cancellationData?.data[0]?.status == "pending" && (
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => rejectHandler()}
                        disabled={approveLoading || rejectLoading}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        {approveLoading ? "Processing..." : "Reject"}
                      </button>
                      <button
                        onClick={() => submitHandler()}
                        disabled={approveLoading || rejectLoading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                      >
                        {approveLoading ? "Processing..." : "Approve & Refund"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          </ul>
        }
      </div>
    </div>
  );
};

export default IndoorCancellationDetails;
