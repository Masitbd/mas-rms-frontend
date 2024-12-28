"use client";

import MenuItemsCostingTable from "@/components/reports/MenuItemsCostingTable";
import { useGetMenuItemsConsumpitonCostingReportsQuery } from "@/redux/api/report/report.api";


const MenuItemConsumptionCostingPage = () => {
    const { data, isLoading } = useGetMenuItemsConsumpitonCostingReportsQuery({});
    return (
        <div>
        <h2 className="text-center text-xl font-semibold mt-5 px-5 py-2 bg-blue-600 text-gray-100 w-full max-w-80 mx-auto rounded-xl">
          Item Wise Sales Reports
        </h2>
        <div className="mt-10">
          {data && data?.data?.length > 0 && (
            <MenuItemsCostingTable isLoading={isLoading} data={data.data} />
          )}
        </div>
      </div>
    );
};

export default MenuItemConsumptionCostingPage;