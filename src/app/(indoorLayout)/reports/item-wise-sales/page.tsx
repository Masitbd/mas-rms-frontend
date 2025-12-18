/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { formatDate } from "@/utils/formateDate";
import { useState } from "react";
import { IFormValues } from "../daily-sales-report/page";
import {
  useGetDailySalesSatementSummeryQuery,
  useGetItemWiseSalesReports_v2Query,
  useGetItemWiseSalesReportsQuery,
} from "@/redux/api/report/report.api";
import { Button, DatePicker, Form, SelectPicker } from "rsuite";

import ItemWiseSalesTable from "@/components/reports/ItemWiseSalesTable";
import { useGetBranchQuery } from "@/redux/api/branch/branch.api";
import { useSession } from "next-auth/react";

const ItemWiseSalesPage = () => {
  const [isSearchEnable, setIsSearchEnable] = useState(false);
  const queryParams: Record<string, any> = {};

  const { data: branchs, isLoading: branchLoading } =
    useGetBranchQuery(undefined);

  const session = useSession();

  const [formValue, setFormValue] = useState<IFormValues>({
    branch: "",
    startDate: null,
    endDate: null,
  });

  const handleChange = (value: Record<string, any>) => {
    setFormValue({
      branch: value.branch,
      startDate: value.startDate || null,
      endDate: value.endDate || null,
    });
  };

  if (formValue.startDate)
    queryParams.startDate = formatDate(formValue.startDate);
  if (formValue.endDate) queryParams.endDate = formatDate(formValue.endDate);
  if (formValue.branch) queryParams.branch = formValue.branch;

  // Handle form submission
  const handleSubmit = async (
    formValue: Record<string, any> | null,
    event?: React.FormEvent<HTMLFormElement>
  ) => {
    if (formValue) {
      setIsSearchEnable(true);
    }
  };

  const { data, isLoading } = useGetItemWiseSalesReportsQuery(queryParams, {
    skip: !isSearchEnable,
  });

  return (
    <div>
      <h2 className="text-center text-xl font-semibold mt-5 px-5 py-2 bg-blue-600 text-gray-100 w-full max-w-80 mx-auto rounded-xl">
        Item Wise Sales Reports
      </h2>
      <div className="px-2 my-5">
        <Form
          onChange={handleChange}
          onSubmit={handleSubmit}
          formValue={formValue}
          className="grid grid-cols-4 gap-10 justify-center  w-full"
        >
          <Form.Group controlId="startDate">
            <Form.ControlLabel>Start Date</Form.ControlLabel>
            <DatePicker
              oneTap
              name="startDate"
              format="yyyy-MM-dd"
              value={formValue.startDate}
              onChange={(date: Date | null) =>
                setFormValue((prev) => ({ ...prev, startDate: date }))
              }
            />
          </Form.Group>

          <Form.Group controlId="endDate">
            <Form.ControlLabel>End Date</Form.ControlLabel>
            <DatePicker
              oneTap
              name="endDate"
              format="yyyy-MM-dd"
              value={formValue.endDate}
              onChange={(date: Date | null) =>
                setFormValue((prev) => ({ ...prev, endDate: date }))
              }
            />
          </Form.Group>

          {!session.data?.user?.branch && (
            <Form.Group controlId="branch">
              <Form.ControlLabel>Branch</Form.ControlLabel>
              <SelectPicker
                data={
                  branchs?.data?.map(
                    (branch: { name: string; _id: string }) => ({
                      label: branch.name,
                      value: branch._id,
                    })
                  ) || []
                }
                placeholder="Select a branch"
                style={{ width: 250 }}
                value={formValue.branch} // Current selected value
                onChange={(value) =>
                  setFormValue((prev) => ({ ...prev, branch: value }))
                }
                loading={branchLoading} // Show loading spinner while fetching data
              />
            </Form.Group>
          )}

          <Button
            className="max-h-11 mt-5 lg:col-span-3 w-full max-w-md mx-auto"
            size="sm"
            appearance="primary"
            type="submit"
          >
            Search
          </Button>
        </Form>

        {data && data?.data && (
          <ItemWiseSalesTable
            isLoading={isLoading}
            data={data.data}
            startDate={formValue.startDate}
            endDate={formValue.endDate}
          />
        )}
      </div>
    </div>
  );
};

export default ItemWiseSalesPage;
