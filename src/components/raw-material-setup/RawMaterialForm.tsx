import React, { SetStateAction } from "react";
import { Button, Form } from "rsuite";
import { Textarea } from "../customers/TextArea";
import {
  IMaterialFormProps,
  IRawMaterial,
  rawMaterialDefaultValue,
  RawMaterialFormValues,
  rawMaterialSetupFormmodel,
} from "./TypesAndDefault";
import { ENUM_MODE } from "@/enums/EnumMode";
import {
  usePostRawMaterialMutation,
  useUpdateRawMaterialMutation,
} from "@/redux/api/raw-material-setup/rawMaterial.api";
import Swal from "sweetalert2";
import BranchFieldProvider from "../branch/BranchFieldProvider";
import omitEmpty from "omit-empty-es";

const RawMaterialForm = (props: IMaterialFormProps) => {
  const { formData, mode, setFormData, setMode } = props;
  const [post, { isLoading: postLoading }] = usePostRawMaterialMutation();
  const [patch, { isLoading: patchLoading }] = useUpdateRawMaterialMutation();

  const handleSuccess = (message: string) => {
    Swal.fire("Success", message, "success");
    setFormData(rawMaterialDefaultValue);
    setMode(ENUM_MODE.NEW);
  };

  const handleSubmit = async (v: RawMaterialFormValues) => {
    try {
      switch (mode) {
        case ENUM_MODE.NEW:
          const result = await post(omitEmpty(v) as IRawMaterial).unwrap();
          if (result?.success) {
            handleSuccess("Raw Material Added Successfully");
          }
          break;
        case ENUM_MODE.UPDATE:
          const patchResult = await patch(v).unwrap();
          if (patchResult?.success) {
            handleSuccess("Raw Material Updated Successfully");
          }

        default:
          break;
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", (error ?? "Failed") as string, "error");
    }
  };
  return (
    <div>
      <Form
        layout="horizontal"
        className="grid grid-cols-2 font-roboto"
        onSubmit={(v) => handleSubmit(v as RawMaterialFormValues)}
        formValue={formData}
        onChange={(v) =>
          setFormData(v as SetStateAction<RawMaterialFormValues>)
        }
        model={rawMaterialSetupFormmodel}
      >
        <Form.Group controlId="id">
          <Form.ControlLabel>ID</Form.ControlLabel>
          <Form.Control name="id" size="lg" disabled />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Base Unit</Form.ControlLabel>
          <Form.Control name="baseUnit" size="lg" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Material Name</Form.ControlLabel>
          <Form.Control name="materialName" size="lg" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Super Unit</Form.ControlLabel>
          <Form.Control name="superUnit" size="lg" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Rate/Base Unit</Form.ControlLabel>
          <Form.Control name="rate" size="lg" type="number" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Conversion</Form.ControlLabel>
          <Form.Control name="conversion" size="lg" type="number" />
        </Form.Group>
        <BranchFieldProvider />
        <Form.Group>
          <Form.ControlLabel>Description</Form.ControlLabel>
          <Form.Control name="description" accepter={Textarea} />
        </Form.Group>

        <Form.Group>
          <Form.ControlLabel></Form.ControlLabel>
          <Button
            style={{
              backgroundColor: "#003CFF",
              whiteSpace: "pre",
              width: "19rem",
            }}
            size="lg"
            appearance="primary"
            type="submit"
            loading={postLoading || patchLoading}
          >
            Submit
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default RawMaterialForm;
