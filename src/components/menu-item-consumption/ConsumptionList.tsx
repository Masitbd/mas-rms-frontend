import React, { useEffect, useState } from "react";
import { ConsumptionListProps, IItemConsumption } from "./TypesAndDefault";
import {
  Button,
  Input,
  InputGroup,
  InputPicker,
  Message,
  Modal,
  SelectPicker,
  toaster,
} from "rsuite";
import { useGetRawMaterialQuery } from "@/redux/api/raw-material-setup/rawMaterial.api";
import { IRawMaterial } from "../raw-material-setup/TypesAndDefault";
import { ENUM_MODE } from "@/enums/EnumMode";

const ConsumptionList = (props: ConsumptionListProps) => {
  const {
    formData,
    isOpen,
    mode,
    setFormData,
    setMode,
    setOpen,
    setUpdatableData,
    updatableData,
  } = props;
  const [data, setData] = useState<IItemConsumption<IRawMaterial>>();

  const handleInputChange = (key: string, value: string | number) => {
    setData({ ...data, [key]: value } as IItemConsumption<IRawMaterial>);
  };

  const handleModalSubmission = () => {
    if (!data?.item) {
      toaster.push(<Message type="error">Add Item</Message>);
      return;
    }
    if (!data?.qty) {
      toaster.push(<Message type="error">Add Quantity</Message>);
      return;
    }

    if (mode == ENUM_MODE.UPDATE) {
      const index = formData.consumptions.findIndex(
        (value) =>
          value?.item &&
          typeof value?.item == "object" &&
          value?.item?.id == updatableData?.item.id
      );
      formData.consumptions.splice(index, 1);
    }

    setData(null as unknown as IItemConsumption<IRawMaterial>);
    formData.consumptions.push(data as IItemConsumption);
    setFormData(formData);
    setOpen(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    setUpdatableData &&
      setUpdatableData(null as unknown as IItemConsumption<IRawMaterial>);
    setMode(ENUM_MODE.NEW);
  };

  const handleModalClose = () => {
    setData(null as unknown as IItemConsumption<IRawMaterial>);
    setOpen(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    setUpdatableData &&
      setUpdatableData(null as unknown as IItemConsumption<IRawMaterial>);
  };

  const {
    data: rawMaterial,
    isLoading: rawMaterialLoading,
    isFetching: rawMaterialFetching,
  } = useGetRawMaterialQuery(undefined);

  useEffect(() => {
    if (updatableData) {
      setData(updatableData);
    }
  }, [updatableData]);
  return (
    <div>
      <Modal open={isOpen} onClose={handleModalClose}>
        <Modal.Header>
          <Modal.Title className="text-center font-roboto ">
            <span className="text-2xl font-semibold text-[#003CFF]">
              Consumption List
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <div className="grid grid-cols-12 items-center gap-2">
              <div className="col-span-3 ">Raw Materials</div>
              <InputPicker
                data={rawMaterial?.data?.map((v: IRawMaterial) => {
                  return { label: v?.materialName, value: v._id, children: v };
                })}
                size="lg"
                className="col-span-8"
                loading={rawMaterialLoading || rawMaterialFetching}
                onSelect={(v, i, j) => {
                  handleInputChange("item", i?.children as unknown as string);
                }}
                disabledItemValues={formData?.consumptions?.map(
                  (value: IItemConsumption) =>
                    typeof value?.item == "object" && value?.item?._id
                )}
                value={data?.item?._id}
              />
            </div>
            <div className="grid grid-cols-12 items-center mt-2.5 gap-2">
              <div className="col-span-3">Quantity</div>
              <Input
                type="number"
                className="col-span-6"
                size="lg"
                onChange={(value: string) =>
                  handleInputChange("qty", Number(value))
                }
                value={data?.qty}
              />
              <div>{data?.item?.baseUnit}</div>
            </div>
            <div className="flex justify-end items-end mt-2.5">
              <div className="grid grid-cols-4 gap-5">
                <Button
                  className="col-span-2"
                  appearance="primary"
                  onClick={() => handleModalSubmission()}
                >
                  Add
                </Button>
                <Button
                  className="col-span-2 "
                  appearance="primary"
                  color="red"
                  onClick={() => handleModalClose()}
                >
                  Close
                </Button>
              </div>
            </div>
          </>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ConsumptionList;
