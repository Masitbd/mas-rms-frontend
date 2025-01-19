"use client";

import BranchFieldProvider from "@/components/branch/BranchFieldProvider";
import ImageCropperModal from "@/components/items/ImageCropper";
import ItemCategoryTable from "@/components/items/ItemsTable";
import { imageUploader } from "@/components/menu-item-consumption/ConsumptionHelper";
import { ENUM_MODE } from "@/enums/EnumMode";

import {
  useCreateItemsCategoryMutation,
  useGetItemsCategoryQuery,
} from "@/redux/api/items/items.api";
import { useGetMenuGroupQuery } from "@/redux/api/menugroup/menuGroup.api";
import {
  useUpdateConsumptionImagesMutation,
  useUploadConsumptionImagesMutation,
} from "@/redux/api/rawMaterialConsumption/rawMaterialConsumption.api";
import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Loader,
  Message,
  SelectPicker,
  toaster,
} from "rsuite";
import { ValueType } from "rsuite/esm/Checkbox";
import SchemaTyped from "rsuite/esm/Schema/Schema";
import Swal from "sweetalert2";

export type FormDataType = {
  uid?: string;
  name: string;
  menuGroup: string | unknown;
  branch?: string;
  image?: string;
  isPopular: false;
};

export type TMenuGroupOption = {
  label: string;
  value: string;
};
export type TMenuGroupItem = {
  name: string;
  _id: string;
};

const ItemsCategoryPage = () => {
  const { data: menus, isLoading: menuLoading } = useGetMenuGroupQuery({});
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
  const [post, { isLoading: ImagePostLoading }] =
    useUploadConsumptionImagesMutation();
  const [update] = useUpdateConsumptionImagesMutation();

  const { data: items, isLoading } = useGetItemsCategoryQuery(undefined);

  const menuGroupData: TMenuGroupOption[] = menus?.data?.map(
    (item: TMenuGroupItem) => ({
      label: item.name,
      value: item._id,
    })
  );

  const [craeteItem, { isLoading: creating }] =
    useCreateItemsCategoryMutation();

  const itemFormInitialState = {
    name: "",
    branch: null,
    menuGroup: null,
    isPopular: false,
  };

  const [formData, setFormData] = useState<FormDataType>(
    itemFormInitialState as unknown as FormDataType
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (value: Record<string, any>) => {
    setFormData((prevData) => ({
      ...prevData,
      ...value,
    }));
  };
  // ? onsubmit

  const handleImageUpload = async () => {
    if (croppedImage) {
      try {
        const mimeType = croppedImage.type; // Get the correct mime type (e.g., 'image/jpeg', 'image/png')
        const fileExtension = mimeType.split("/")[1]; // Extract the file extension (e.g., 'jpeg', 'png')
        const croppedFile = new File(
          [croppedImage],
          `cropped-image.${fileExtension}`,
          { type: mimeType }
        );

        const imageData = await imageUploader(
          [{ url: URL.createObjectURL(croppedImage), file: croppedFile }],
          ENUM_MODE.NEW,
          "",
          update,
          post
        );

        return imageData;
      } catch (error) {
        // toaster.push(<Message type="error">{error as string}</Message>);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const imageId = await handleImageUpload();
      if (imageId) {
        formData.image = imageId;
        // Reset the image
        setCroppedImage(null);
      }
      const res = await craeteItem(formData).unwrap();
      if (res.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          title: "Item Added successfully",
          icon: "success",
        });
        itemFormInitialState.isPopular = false;
        setFormData(itemFormInitialState as unknown as FormDataType);
      }
    } catch (error) {}
  };

  console.log(formData);
  return (
    <div className="w-full max-w-5xl mx-auto  drop-shadow-md shadow-xl m-5 mt-10 py-8 px-5 bg-[#FAFBFF]">
      <h1 className="text-center text-[#003CFF] text-2xl font-bold">
        Item Category Setup
      </h1>

      {/* form */}

      <div className="w-full  my-10">
        <Form
          fluid
          layout="horizontal"
          formValue={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          className="lg:justify-items-center lg:pe-40"
          model={SchemaTyped.Model({
            menuGroup: SchemaTyped.Types.StringType().isRequired(
              "Menu Group is required"
            ),
            name: SchemaTyped.Types.StringType().isRequired(
              "Name  is required"
            ),
          })}
        >
          <Form.Group controlId="menuGroup">
            <Form.ControlLabel>Menu Group</Form.ControlLabel>
            <Form.Control
              name="menuGroup"
              accepter={SelectPicker}
              disabled={menuLoading}
              data={menuGroupData}
              onChange={(value) =>
                setFormData({ ...formData, menuGroup: value })
              }
              placeholder="Select a menu group"
              style={{ width: 300 }}
            />
          </Form.Group>
          <Form.Group controlId="name">
            <Form.ControlLabel>Category Name</Form.ControlLabel>
            <Form.Control name="name" />
          </Form.Group>
          <Form.Group controlId="isPopular">
            <Form.ControlLabel>Display on Popular</Form.ControlLabel>
            <Form.Control
              name="isPopular"
              accepter={Checkbox}
              value={!formData?.isPopular as unknown as ValueType}
              defaultChecked={formData?.isPopular}
              checked={formData?.isPopular}
            />
          </Form.Group>

          <BranchFieldProvider />

          {/*  */}

          {/* Image */}
          <Form.Group>
            <Form.ControlLabel>Category Image</Form.ControlLabel>
            <div className="flex ">
              <ImageCropperModal
                setCroppedImageState={setCroppedImage}
                id="10000"
              />
              <div className="flex items-center ms-4">
                {croppedImage ? (
                  <img
                    src={URL.createObjectURL(croppedImage)}
                    alt="croppedImage"
                    style={{ width: "50%", height: "auto" }}
                  />
                ) : (
                  <p>No image uploaded yet.</p>
                )}
              </div>
            </div>
          </Form.Group>
          <Form.Group className="w-full max-w-[300px]  ms-48">
            <Button
              className="w-full"
              appearance="primary"
              disabled={creating}
              style={{
                backgroundColor: "#003CFF",
                color: "white",
                fontWeight: "600",
              }}
              type="submit"
            >
              {creating || ImagePostLoading ? (
                <Loader content="Loading..." />
              ) : (
                "Save"
              )}
            </Button>
          </Form.Group>
        </Form>
      </div>

      {/* table */}

      <ItemCategoryTable data={items?.data} isLoading={isLoading} />
    </div>
  );
};

export default ItemsCategoryPage;
