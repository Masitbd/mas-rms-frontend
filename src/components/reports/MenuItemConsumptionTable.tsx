/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Loader } from 'rsuite';

 export type TMenuItemConsumptionGroups = {
    itemGroup: string;
    granTotalBill: number;
    grandTotalQty: number;
    grandTotalRate: number;
    items: TRecord[];
    menuGroup: string;
    totalConsumptionCount: number;
    menuGroupTotalConsumption: number;
  };

 export type TConsumption = {
    materialName: string;
    rate: number;
    baseUnit: string;
    qty: number;
    price: number;
  }
  
  export type TRecord = {
    code: string;
    consumptions: TConsumption[];
    name: number;
    cookingTime: number;
  totalCosting: number;
    rate: number;
  };
  
  export type TGroup = {
    records: TRecord[];
    itemGroups: TMenuItemConsumptionGroups[];
    menuGroup: string;
    menuGroupTotalConsumption: number;
  };
  
 export type TMenuItemConsumptionProps = {
    data: TGroup[];
  
    isLoading: boolean;
  };

const MenuItemConsumptionTable: React.FC<TMenuItemConsumptionProps> = ({data, isLoading}) => {
    
    return (
        <div className="p-5">
        {/* <div className="text-center mb-10 flex flex-col items-center justify-center">
          <div className="text-xl font-bold flex items-center justify-center gap-5 mb-4">
            <Image
              src={comapnyInfo?.data?.photoUrl}
              alt="Header"
              width={50}
              height={50}
            />{" "}
            <p>{comapnyInfo?.data?.name}</p>
          </div>
          <p>{comapnyInfo?.data?.address}</p>
          <p>HelpLine:{comapnyInfo?.data?.phone} (24 Hours Open)</p>
          <p className="italic text-red-600 text-center mb-5 font-semibold">
            Investigation Income Statement : Between{" "}
            {startDate ? formatDateString(startDate) : "N/A"} to{" "}
            {endDate ? formatDateString(endDate) : "N/A"}
          </p>
        </div> */}
  
        <div className="w-full">
          <div className="grid grid-cols-4 bg-gray-100 font-semibold text-center p-2">
            <div>Code</div>
            <div>Item Name</div>
            <div>Rate </div>
            <div>Cooking Time </div>
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            data?.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-8">
                {/* Group Date Row */}
                <div className="text-lg font-semibold p-2 mb-2 bg-slate-200 mt-2 rounded-md">
                  {group.menuGroup}
                </div>
  
                {/* Payment Types */}
                {group?.itemGroups?.map((orderItemGroup, paymentIndex) => (
                  <div key={paymentIndex} className="mb-4">
                    {/* Payment Type Header */}
                    <div className="text-lg font-bold p-2 border-b text-violet-700">
                      {orderItemGroup.itemGroup}
                    </div>
  
                    {/* Time Periods */}
  
                    {orderItemGroup?.items?.map((record, recordIndex) => (
  <div key={recordIndex} className="border-b p-2">
    {/* Item Details */}
    <div className="grid grid-cols-4 border-b text-neutral-800 font-semibold bg-gray-50 mb-3 text-center p-2">
      <div>{record.code || "N/A"}</div>
      <div>{record.name}</div>
      <div>{record.rate || 0}</div>
      <div>{record?.cookingTime }</div>
    </div>

    {/* Consumption Details */}
    {record.consumptions?.length > 0 && (
      <div className=" ">
        
        {record.consumptions.map((consumption, consumptionIndex) => (
          <div
            key={consumptionIndex}
            className="grid grid-cols-4 text-sm  border-b text-center py-1"
          >
            <div className='col-span-2'>{consumption.materialName || "N/A"}</div>
         
            <div className='flex gap-5 justify-center text-left'>
                <p>

                {consumption.rate || 0} 
                </p>
                <p>
                {consumption.baseUnit || "N/A"}
                </p>
            </div>
            
          </div>
        ))}
        <div className="grid grid-cols-4 text-red-600 font-semibold  text-center bg-white py-2">
        <p className='col-span-2 '>
            {record?.name}  
        </p>
            <p>

            {record.consumptions?.length} 
            </p>
        </div>
       
      </div>
    )}
  </div>
))}

                    

  
                    <div className="grid grid-cols-4 font-bold text-violet-600 mt-3">
                      <div className="col-span-2 text-end ">
                        {group.menuGroup}
                      </div>
                      <div className="text-center ">
                        {group?.menuGroupTotalConsumption}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

<div className="border w-[500px] mx-auto mt-10">


        {
            data?.map((item)=>(
                <div key={item.menuGroup} className='grid grid-cols-2 justify-items-center  text-purple-700 font-semibold mx-auto py-2'>
                    
                    <p>

                    {item.menuGroup}
                    </p>
                    <p className='text-black'>
                        {item.menuGroupTotalConsumption}
                    </p>

                </div>
            ))
        }

<div className="grid grid-cols-2 text-center text-lg border-t font-bold text-red-600">

        <p className="">
        GrandTotal: 
        </p>
        <p>
        {data?.reduce((acc: any, item: { menuGroupTotalConsumption: any; }) => acc + item.menuGroupTotalConsumption, 0)}
        </p>
</div>
        </div>
  
        {/* <button
          onClick={generatePDF}
          className="bg-blue-600 px-3 py-2 rounded-md text-white font-semibold mt-4"
        >
          Print
        </button> */}
      </div>
    );
};

export default MenuItemConsumptionTable;