"use client";

import MenuGroupItemTable from "@/components/reports/MenuGroupTable";
import { useGetMenuItemsReportsQuery } from "@/redux/api/report/report.api";
import { Loader } from "rsuite";

const MenuItemsPage = () => {
  const { data, isLoading } = useGetMenuItemsReportsQuery({});

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <h2 className="text-center text-xl font-semibold mt-5 px-5 py-2 bg-blue-600 text-gray-100 w-full max-w-80 mx-auto rounded-xl">
        Item Wise Sales Reports
      </h2>
      <div className="mt-10">
        {data && data?.data?.length > 0 && (
          <MenuGroupItemTable isLoading={isLoading} data={data.data} />
        )}
      </div>
    </div>
  );
};

export default MenuItemsPage;
