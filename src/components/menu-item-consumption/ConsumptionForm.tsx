"use client";
import React, { SetStateAction, useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  InputPicker,
  Message,
  SelectPicker,
  toaster,
} from "rsuite";
import { Textarea } from "../customers/TextArea";
import {
  defaultMenuItemConsumption,
  formModel,
  IItemConsumption,
  IMenuItemConsumption,
  MenuItemFormProps,
} from "./TypesAndDefault";
import { ValueType } from "rsuite/esm/Checkbox";
import ConsumptionList from "./ConsumptionList";
import ConsumptionListTable from "./ConsumptionListTable";
import { IRawMaterial } from "../raw-material-setup/TypesAndDefault";
import { useGetMenuGroupQuery } from "@/redux/api/menugroup/menuGroup.api";
import { useGetItemsCategoryQuery } from "@/redux/api/items/items.api";
import {
  usePostConsumptionMutation,
  useUpdateConsumptionMutation,
} from "@/redux/api/rawMaterialConsumption/rawMaterialConsumption.api";
import { ENUM_MODE } from "@/enums/EnumMode";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const ConsumptionForm = (params: MenuItemFormProps) => {
  const routes = useRouter();
  const { formData, mode, setFormData, setMode } = params;
  const [open, setOpen] = useState(false);
  const [filterOption, setFilterOption] = useState({ menuGroup: "" });
  const { data: itemCategoryData, isLoading: itemCategoryLoading } =
    useGetItemsCategoryQuery(filterOption);
  const { data: menuGroupData, isLoading: menuGroupLoading } =
    useGetMenuGroupQuery(undefined);
  const [post, { isLoading: postLoading }] = usePostConsumptionMutation();
  const [update, { isLoading: updateLoading }] = useUpdateConsumptionMutation();

  const handleSubmit = async (v: IMenuItemConsumption) => {
    const submissionData = JSON.parse(JSON.stringify(v));
    if (!submissionData?.consumptions.length) {
      toaster.push(<Message type="error">Please Enter Consumptions</Message>);
      return;
    }
    // Handle success
    const handleSuccess = (message: string) => {
      Swal.fire("Success", message, "success");
      defaultMenuItemConsumption.consumptions = [];
      setFormData(
        defaultMenuItemConsumption as unknown as IMenuItemConsumption
      );
      setMode(ENUM_MODE.NEW);
      routes.push(`/consumption`);
    };
    // modifying the consumption data
    submissionData.consumptions = submissionData.consumptions.map(
      (v: IItemConsumption) =>
        typeof v.item == "object" && {
          item: v?.item?._id,
          qty: v.qty,
        }
    );
    try {
      switch (mode) {
        case ENUM_MODE.NEW:
          const result = await post(submissionData).unwrap();
          if (result?.success) {
            handleSuccess("Item Consumption Setup Created Successfully");
          }
          break;
        case ENUM_MODE.UPDATE:
          const updateResult = await update(submissionData).unwrap();
          if (updateResult?.success) {
            handleSuccess("Item Consumption Setup Updated Successfully");
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to create Item Consumption Setup", "error");
    }
  };

  console.log(defaultMenuItemConsumption);

  return (
    <div>
      <Form
        layout="horizontal"
        className="grid grid-cols-2 font-roboto"
        fluid
        onSubmit={(v) => handleSubmit(v as IMenuItemConsumption)}
        formValue={params.formData}
        onChange={(v) => setFormData(v as SetStateAction<IMenuItemConsumption>)}
        model={formModel}
        disabled={mode == ENUM_MODE.VIEW}
      >
        <Form.Group controlId="id">
          <Form.ControlLabel>ID</Form.ControlLabel>
          <Form.Control name="id" disabled />
        </Form.Group>
        <Form.Group controlId="rate">
          <Form.ControlLabel>Rate</Form.ControlLabel>
          <Form.Control name="rate" type="number" />
        </Form.Group>
        <Form.Group controlId="itemGroup">
          <Form.ControlLabel>Item Group</Form.ControlLabel>
          <Form.Control
            name="itemGroup"
            accepter={InputPicker}
            className="w-[300px]"
            data={menuGroupData?.data?.map(
              (v: { name: string; _id: string }) => ({
                label: v?.name,
                value: v?._id,
              })
            )}
            onSelect={(v) => setFilterOption({ menuGroup: v })}
            loading={menuGroupLoading}
            block
          />
        </Form.Group>
        <Form.Group controlId="cookingTime">
          <Form.ControlLabel>Cooking Time</Form.ControlLabel>
          <Form.Control name="cookingTime" type="number" />
        </Form.Group>
        <Form.Group controlId="itemCategory">
          <Form.ControlLabel>Item Category</Form.ControlLabel>
          <Form.Control
            name="itemCategory"
            accepter={InputPicker}
            data={itemCategoryData?.data?.map(
              (v: { name: string; _id: string }) => ({
                label: v?.name,
                value: v?._id,
              })
            )}
            loading={itemCategoryLoading}
            className="w-[300px]"
          />
        </Form.Group>

        <Form.Group controlId="itemName">
          <Form.ControlLabel>Item Name</Form.ControlLabel>
          <Form.Control name="itemName" />
        </Form.Group>

        <Form.Group controlId="itemCode">
          <Form.ControlLabel>Item Code</Form.ControlLabel>
          <Form.Control name="itemCode" />
        </Form.Group>
        <Form.Group controlId="discount">
          <Form.ControlLabel>Discount(%)</Form.ControlLabel>
          <Form.Control name="discount" type="number" />
        </Form.Group>
        <Form.Group controlId="waiterTip">
          <Form.ControlLabel>Waiter Tip</Form.ControlLabel>
          <Form.Control name="waiterTip" type="number" />
        </Form.Group>
        <Form.Group controlId="description" className="row-span-2">
          <Form.ControlLabel>Description</Form.ControlLabel>
          <Form.Control name="description" accepter={Textarea} />
        </Form.Group>
        <div className="grid 2xl:grid-cols-3 xl:col-span-2 col-span-1 row-span-2">
          <Form.Group controlId="isDiscount">
            <Form.ControlLabel>No Discount</Form.ControlLabel>
            <Form.Control
              name="isDiscount"
              accepter={Checkbox}
              checked={!formData?.isDiscount}
              value={!formData?.isDiscount as unknown as ValueType}
            />
          </Form.Group>
          <Form.Group controlId="isVat">
            <Form.ControlLabel>No Vat</Form.ControlLabel>
            <Form.Control
              name="isVat"
              accepter={Checkbox}
              checked={!formData?.isVat}
              value={!formData?.isVat as unknown as ValueType}
            />
          </Form.Group>
          <Form.Group controlId="isWaiterTips">
            <Form.ControlLabel>Waiter Tips</Form.ControlLabel>
            <Form.Control
              name="isWaiterTips"
              accepter={Checkbox}
              checked={!formData?.isWaiterTips}
              value={!formData?.isWaiterTips as unknown as ValueType}
            />
          </Form.Group>
        </div>
        {mode !== ENUM_MODE.VIEW && (
          <div className="col-span-2 grid grid-cols-8 mt-2.5">
            <Button
              className="col-start-2 "
              color="green"
              appearance="primary"
              size="lg"
              onClick={() => setOpen(true)}
            >
              Consumption
            </Button>
            <Button
              className="col-start-6"
              style={{ backgroundColor: "#194BEE" }}
              size="lg"
              appearance="primary"
              type="submit"
              loading={postLoading || updateLoading}
            >
              Save
            </Button>
          </div>
        )}
      </Form>

      <div className="mt-5">
        <ConsumptionListTable
          data={formData?.consumptions as IItemConsumption<IRawMaterial>[]}
          formData={formData}
          setFormData={setFormData}
          mode={mode}
          setMode={setMode}
          isOpen={open}
          setOpen={setOpen}
        />
      </div>
    </div>
  );
};

export default ConsumptionForm;
