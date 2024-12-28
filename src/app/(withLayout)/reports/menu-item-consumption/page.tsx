"use client";

import MenuItemConsumptionTable from "@/components/reports/MenuItemConsumptionTable";
import { useGetMenuItemsConsumptionReportsQuery } from "@/redux/api/report/report.api";

const MenuItemConsumptionPage = () => {
    const { data, isLoading } = useGetMenuItemsConsumptionReportsQuery({});
    return (
        <div>
        <h2 className="text-center text-xl font-semibold mt-5 px-5 py-2 bg-blue-600 text-gray-100 w-full max-w-80 mx-auto rounded-xl">
          Item Wise Sales Reports
        </h2>
        <div className="mt-10">
          {data && data?.data?.length > 0 && (
            <MenuItemConsumptionTable isLoading={isLoading} data={data.data} />
          )}
        </div>
      </div>
    );
};

export default MenuItemConsumptionPage;