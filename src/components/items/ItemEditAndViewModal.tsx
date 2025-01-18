/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Form, Button, Loader, Modal, SelectPicker, Checkbox } from "rsuite";

import Swal from "sweetalert2";

import { useUpdateItemsCategoryMutation } from "@/redux/api/items/items.api";
import { useGetMenuGroupQuery } from "@/redux/api/menugroup/menuGroup.api";
import {
  FormDataType,
  TMenuGroupItem,
  TMenuGroupOption,
} from "@/app/(indoorLayout)/items/page";
import BranchFieldProvider from "../branch/BranchFieldProvider";
import ImageCropperModal from "./ImageCropper";
import {
  useUpdateConsumptionImagesMutation,
  useUploadConsumptionImagesMutation,
} from "@/redux/api/rawMaterialConsumption/rawMaterialConsumption.api";
import { imageUploader } from "../menu-item-consumption/ConsumptionHelper";
import { ENUM_MODE } from "@/enums/EnumMode";

type TEdittableProps = {
  data: any;
  color: any;
  openButton: JSX.Element;
};

export const ItemEditAndViewModal = ({
  data,
  color,
  openButton,
}: TEdittableProps) => {
  const [image, setImage] = useState<Blob | null>(null);

  const [post, { isLoading: ImagePostLoading }] =
    useUploadConsumptionImagesMutation();
  const [update, { isLoading: updateLoading }] =
    useUpdateConsumptionImagesMutation();
  const { data: menus, isLoading: menuLoading } = useGetMenuGroupQuery({});

  const menuGroupData: TMenuGroupOption[] = menus?.data?.map(
    (item: TMenuGroupItem) => ({
      label: item.name,
      value: item._id,
    })
  );
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setImage(null);
    setOpen(false);
  };

  const [updateItem, { isLoading }] = useUpdateItemsCategoryMutation();

  const [formData, setFormData] = useState<FormDataType>({
    uid: "",
    name: "",
    menuGroup: "",
    isPopular: false,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        isPopular: data.isPopular,
        uid: data.uid || "",
        name: data.name || "",
        menuGroup: data.menuGroup?._id || "", // Correct way to set the nested property
        ...(data?.branch ? { branch: data?.branch?._id } : {}),
        ...(data?.image ? { image: data?.image?.files[0]?.secure_url } : {}),
      });
    }
  }, [data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: Record<string, any>) => {
    setFormData({
      uid: event.uid,
      name: event.name,
      menuGroup: event.menuGroup,
      branch: event.branch,
      image: event.image,
      isPopular: event.isPopular,
    });
  };

  const handleImageUpload = async () => {
    if (image) {
      try {
        const mimeType = image.type; // Get the correct mime type (e.g., 'image/jpeg', 'image/png')
        const fileExtension = mimeType.split("/")[1]; // Extract the file extension (e.g., 'jpeg', 'png')
        const croppedFile = new File(
          [image],
          `cropped-image.${fileExtension}`,
          { type: mimeType }
        );

        const imageData = await imageUploader(
          [{ url: URL.createObjectURL(image), file: croppedFile }],
          ENUM_MODE.UPDATE,
          data?.image?._id,
          update,
          post,
          "single"
        );

        return imageData;
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = async () => {
    const imageId = await handleImageUpload();

    if (imageId) {
      formData.image = imageId;
      // Reset the image
      setImage(null);
    } else {
      formData.image = data?.image?._id;
    }
    const options = {
      id: data?._id,
      data: formData,
    };

    const res = await updateItem(options).unwrap();

    if (res.success) {
      handleClose();
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: "Item Updated successfully",
        icon: "success",
      });
    }
  };

  return (
    <>
      <Button
        appearance="primary"
        color={color}
        className="ml-2"
        onClick={handleOpen}
        startIcon={openButton}
      />

      <Modal open={open} onClose={handleClose} backdrop={"static"}>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div className="w-full flex justify-center my-10">
            <Form
              layout="horizontal"
              formDefaultValue={data}
              formValue={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
            >
              <Form.Group controlId="uid">
                <Form.ControlLabel className="text-xl">
                  Menu Group Id
                </Form.ControlLabel>
                <Form.Control name="uid" />
              </Form.Group>

              <Form.Group controlId="menuGroup">
                <Form.ControlLabel>Menu Group Name</Form.ControlLabel>

                <SelectPicker
                  disabled={menuLoading}
                  data={menuGroupData}
                  name="menuGroup"
                  value={formData.menuGroup} // Bind stored menu object ID
                  onChange={
                    (value) => setFormData({ ...formData, menuGroup: value }) // Update ID in formData on change
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
                  value={!formData?.isPopular}
                  defaultChecked={formData?.isPopular}
                />
              </Form.Group>

              <BranchFieldProvider />

              {/* Image */}
              <Form.Group>
                <Form.ControlLabel>Category Image</Form.ControlLabel>
                <div className="flex ">
                  <ImageCropperModal
                    setCroppedImageState={setImage}
                    key={data?._id}
                    id={data?._id}
                  />
                  <div className="flex items-center ms-4">
                    {image || formData?.image ? (
                      <img
                        src={
                          image ? URL.createObjectURL(image) : formData?.image
                        }
                        alt="croppedImage"
                        style={{ width: "50%", height: "auto" }}
                      />
                    ) : (
                      <p>No image Found yet.</p>
                    )}
                  </div>
                </div>
              </Form.Group>

              <Form.Group>
                <Button
                  disabled={isLoading}
                  className="w-full"
                  appearance="primary"
                  type="submit"
                  style={{
                    background: "#003CFF",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {isLoading || updateLoading ? (
                    <Loader content="Loading..." />
                  ) : (
                    "Update"
                  )}
                </Button>
              </Form.Group>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="primary" color="red">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
