"use client";
import { useGetUserOrdersQuery } from "@/redux/api/order/orderSlice";
import React, { useEffect, useState } from "react";
import { Button, Table } from "rsuite";
import EyeRoundIcon from "@rsuite/icons/EyeRound";
import CloseIcon from "@rsuite/icons/Close";
import Link from "next/link";
import { ENUM_ORDER_STATUS } from "@/enums/EnumOrderStatus";
import { useRouter } from "next/navigation";
import { IOrder } from "@/redux/features/order/orderSlice";

const Orders = () => {
  const router = useRouter();
  const {
    data: orderData,
    isLoading: orderDataLoading,
    isFetching: orderDataFetching,
  } = useGetUserOrdersQuery(undefined);
  const { Cell, Column, ColumnGroup, HeaderCell } = Table;
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const updateIsDesktop = () => {
      setIsDesktop(window.innerWidth > 1020);
    };

    // Update the state on mount
    updateIsDesktop();

    // Add resize event listener
    window.addEventListener("resize", updateIsDesktop);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("resize", updateIsDesktop);
    };
  }, []);

  const orderStatusProvider = (status: ENUM_ORDER_STATUS) => {
    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${
                      status === ENUM_ORDER_STATUS.POSTED
                        ? "bg-green-100 text-green-800"
                        : status === ENUM_ORDER_STATUS.VOID
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
      >
        {status == ENUM_ORDER_STATUS.POSTED
          ? "Delivered"
          : status == ENUM_ORDER_STATUS.VOID
          ? "Cancelled"
          : "Pending"}
      </span>
    );
  };

  const clickHandler = (mode: "view" | "cancel", id: string) => {
    if (mode == "view") {
      router.push(`/consumer/orders/${id}`);
    } else {
      router.push(`/consumer/orders/cancellation/${id}`);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg mt-36 max-w-7xl mx-auto">
      <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900">Your Orders</h1>
      </div>

      {/* Large screens - Table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orderData?.data?.map((order: IOrder) => (
              <tr key={order?._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order.billNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(
                    order?.createdAt ?? Date.now().toString()
                  ).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {orderStatusProvider(order?.status as ENUM_ORDER_STATUS)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${order?.totalBill?.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => clickHandler("view", order?._id as string)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    View
                  </button>
                  {order.status === ENUM_ORDER_STATUS.NOT_POSTED && (
                    <button
                      onClick={() =>
                        clickHandler("cancel", order?._id as string)
                      }
                      className="text-red-600 hover:text-red-900"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view - Card layout */}
      <div className="md:hidden">
        <div className="divide-y divide-gray-200">
          {orderData?.data?.map((order: IOrder) => (
            <div key={order?.billNo} className="px-4 py-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Order #{order.billNo}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(
                      order?.createdAt ?? Date.now().toString()
                    ).toLocaleDateString()}
                  </p>
                </div>
                {orderStatusProvider(order?.status as ENUM_ORDER_STATUS)}
              </div>

              <div className="text-sm text-gray-500">
                Total: {order?.totalBill?.toFixed(2)}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => clickHandler("view", order?._id as string)}
                  className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  View Details
                </button>
                {order.status === ENUM_ORDER_STATUS.NOT_POSTED && (
                  <button
                    onClick={() => clickHandler("cancel", order?._id as string)}
                    className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
