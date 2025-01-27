import React, { useState } from "react";
import { Button, Divider, HStack, Radio, VStack } from "rsuite";
import DeliveryAddressModal from "./DeliveryAddressModal";
import { useGetAllDeliveryAddressQuery } from "@/redux/api/deliveryAddress/deliveryAddress.api";
import { initialFormData, TDeliveryAddress } from "./consumerProfileHelper";
import { ENUM_MODE } from "@/enums/EnumMode";

const DeliveryAddress = () => {
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [formData, setFormData] =
    useState<Record<string, any>>(initialFormData);
  const [mode, setMode] = useState(ENUM_MODE.NEW);
  const { isLoading: deliveryAddressesLoading, data: deliveryAddressData } =
    useGetAllDeliveryAddressQuery(undefined);

  const modalChangeButtonHandler = (data: TDeliveryAddress) => {
    setFormData(data);
    setDeliveryModalOpen(true);
    setMode(ENUM_MODE.UPDATE);
  };

  return (
    <>
      <DeliveryAddressModal
        modalOpen={deliveryModalOpen}
        setModalOpen={setDeliveryModalOpen}
        formData={formData}
        sefFormData={setFormData}
        mode={mode}
        setMode={setMode}
      />
      <div className=" w-full h-full lg:p-6 p-3  rounded-xl border border-[#DCDCDC] bg-white">
        <div className="flex flex-row justify-between">
          <h2 className="text-2xl font-bold ">Delivery Addresses</h2>
          <h5 className="font-semibold">
            <Button
              size="sm"
              appearance="subtle"
              className="!font-semibold"
              onClick={() => setDeliveryModalOpen(true)}
            >
              Add
            </Button>
          </h5>
        </div>
        <div className="mt-6 ">
          <VStack spacing={10}>
            {deliveryAddressData?.data?.map(
              (dd: TDeliveryAddress, index: string) => {
                return (
                  <div
                    className="flex items-center bg-[#FAFBFF] rounded-xl border border-[#DCDCDC] px-4 py-2 cursor-pointer my-2 w-full relative"
                    key={index}
                  >
                    <div className="">
                      <div className="absolute top-0 right-0">
                        <Button
                          size="xs"
                          onClick={() => modalChangeButtonHandler(dd)}
                        >
                          Edit
                        </Button>
                      </div>
                      <HStack divider={<Divider vertical />} spacing={10}>
                        <h2 className=" font-semibold">
                          {dd?.name} <br />
                          <span className="text-sm font-normal">
                            {dd.phone}
                          </span>
                        </h2>

                        {dd?.landMark && (
                          <p className="text-sm">{dd?.landMark}</p>
                        )}
                        <p className="text-sm">{dd?.address}</p>
                        <p className="text-sm">
                          {dd?.zone} <br />
                          {dd.city} ,{dd?.division}
                        </p>
                      </HStack>
                    </div>
                  </div>
                );
              }
            )}
          </VStack>
        </div>
      </div>
    </>
  );
};

export default DeliveryAddress;
