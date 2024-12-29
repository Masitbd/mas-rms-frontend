"use client";

import MenuGroupItemTable from "@/components/reports/MenuGroupTable";
import { useGetBranchQuery } from "@/redux/api/branch/branch.api";
import { useGetMenuItemsReportsQuery } from "@/redux/api/report/report.api";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Form, Loader, SelectPicker } from "rsuite";
import { IFormValues } from "../daily-sales-report/page";

const MenuItemsPage = () => {
  const { data: branchs, isLoading: branchLoading } =
    useGetBranchQuery(undefined);

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

  const session = useSession();
  const queryParams: Record<string, any> = {};
  if (formValue.branch) queryParams.branch = formValue.branch;
  const handleSubmit = async (
    formValue: Record<string, any> | null,
    event?: React.FormEvent<HTMLFormElement>
  ) => {
    if (formValue) {
      refetch();
    }
  };

  const { data, isLoading, refetch } = useGetMenuItemsReportsQuery(queryParams);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <h2 className="text-center text-xl font-semibold mt-5 px-5 py-2 bg-blue-600 text-gray-100 w-full max-w-80 mx-auto rounded-xl">
        Item Wise Sales Reports
      </h2>
      <Form
        onChange={handleChange}
        onSubmit={handleSubmit}
        formValue={formValue}
        className="grid grid-cols-4 gap-10 justify-center  w-full"
      >
        {!session.data?.user?.branch && (
          <Form.Group controlId="branch">
            <Form.ControlLabel>Branch</Form.ControlLabel>
            <SelectPicker
              data={
                branchs?.data?.map((branch: { name: string; _id: string }) => ({
                  label: branch.name,
                  value: branch._id,
                })) || []
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
      </Form>
      <div className="mt-10">
        {data && data?.data && (
          <MenuGroupItemTable isLoading={isLoading} data={data.data} />
        )}
      </div>
    </div>
  );
};

export default MenuItemsPage;
