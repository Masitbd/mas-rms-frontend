import { ENUM_MODE } from "@/enums/EnumMode";
import { formModel, Image } from "./TypesAndDefault";
import {
  TuseUpdateConsumptionImagesMutation,
  TuseUploadConsumptionImagesMutation,
} from "@/redux/api/rawMaterialConsumption/rawMaterialConsumption.api";

export const imageUploader = async (
  Images: Image[],
  mode: string,
  id?: string,
  updateFn?: TuseUpdateConsumptionImagesMutation[0],
  postFn?: TuseUploadConsumptionImagesMutation[0],
  imageMode?: string
) => {
  try {
    if (!Images.length) {
      return;
    }
    const formData = new FormData();
    Images.forEach((image) => {
      formData.append("images", image.file as File);
    });

    console.log({
      data: formData as FormData,
      id: id as string,
      mode: imageMode,
    });
    switch (mode) {
      case ENUM_MODE.NEW:
        const result = postFn && (await postFn(formData).unwrap());
        if (result?.success) {
          return result?.data;
        }
        break;
      case ENUM_MODE.UPDATE:
        const updateResult =
          updateFn &&
          (await updateFn({
            data: formData as FormData,
            id: id as string,
            mode: imageMode,
          }).unwrap());

        if (updateResult?.success) {
          return updateResult?.data;
        }

      default:
        break;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const consumptionSortOption = [
  { label: "Created At", value: "createdAt" },
  { label: "Price", value: "price" },
];
