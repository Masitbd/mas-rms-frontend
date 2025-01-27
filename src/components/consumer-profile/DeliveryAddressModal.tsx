import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  InputPicker,
  Modal,
  Radio,
  SelectPicker,
} from "rsuite";
import {
  deliveryLocationModel,
  divisionData,
  initialFormData,
} from "./consumerProfileHelper";
import { Textarea } from "../customers/TextArea";
import {
  useLazyGetDeliverableCItyQuery,
  useLazyGetDeliverableZoneQuery,
} from "@/redux/api/branch/branch.api";
import {
  usePostDeliveryAddressMutation,
  useUpdateDeliveryAddressMutation,
} from "@/redux/api/deliveryAddress/deliveryAddress.api";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { ENUM_MODE } from "@/enums/EnumMode";

const DeliveryAddressModal = ({
  modalOpen,
  setModalOpen,
  formData,
  sefFormData,
  mode,
  setMode,
}: {
  modalOpen: boolean;
  setModalOpen: any;
  formData: Record<string, any> | undefined;
  sefFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<ENUM_MODE>>;
}) => {
  console.log(mode);
  const ref = useRef<any>();
  const session = useSession();
  const [getCity, { isLoading: cityLoading }] =
    useLazyGetDeliverableCItyQuery();
  const [getZone, { isLoading: zoneLoading }] =
    useLazyGetDeliverableZoneQuery();
  const [post, { isLoading: postLoading }] = usePostDeliveryAddressMutation();
  const [update, { isLoading: updateLoading }] =
    useUpdateDeliveryAddressMutation();

  const [city, setCity] = useState([]);
  const [zone, setZone] = useState([]);

  useEffect(() => {
    if (formData?.division) {
      (async function () {
        const cityData = await getCity(formData?.division).unwrap();
        if (cityData?.data[0]?.city?.length) {
          setCity(cityData?.data[0]?.city);
          setZone([]);
        } else {
          setCity([]);
        }
      })();
    }
  }, [formData?.division]);

  useEffect(() => {
    if (formData?.city) {
      (async function () {
        const cityData = await getZone({
          division: formData?.division,
          city: formData?.city,
        }).unwrap();
        if (cityData?.data[0]?.deliveryLocations?.length) {
          setZone(cityData?.data[0]?.deliveryLocations);
        } else {
          setZone([]);
        }
      })();
    }
  }, [formData?.city]);

  const submitHandler = async () => {
    try {
      if (ref?.current?.check()) {
        const data = {
          ...formData,
          userId: session?.data?.user?.id,
        };
        let result;
        if (mode == ENUM_MODE.NEW) {
          result = await post(data).unwrap();
        } else if (mode == ENUM_MODE.UPDATE) {
          result = await update({
            data: data,
            id: formData?._id as string,
          }).unwrap();
        }
        if (result?.success) {
          Swal.fire(
            "Success",
            result?.message ?? "Delivery Address Added Successfully",
            "success"
          );
          setModalOpen(false);
          sefFormData(initialFormData);
          setMode(ENUM_MODE.NEW);
        } else {
          Swal.fire("Error", "Add all the fields", "error");
        }
      }
    } catch (error) {
      Swal.fire("Error", (error ?? "Faild to add address") as string, "error");
      console.error(error);
    }
  };
  return (
    <div>
      <Modal open={modalOpen} className="!mt-28">
        <Modal.Header>
          <Modal.Title className="!text-xl !font-bold">
            Delivery Address
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Form
              fluid
              className="grid grid-cols-1 lg:grid-cols-2 gap-5"
              formValue={formData}
              onChange={sefFormData}
              model={deliveryLocationModel}
              ref={ref}
            >
              <Form.Group>
                <Form.ControlLabel>Full Name</Form.ControlLabel>
                <Form.Control name="name" placeholder="Full Name" />
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel>Phone</Form.ControlLabel>
                <Form.Control name="phone" placeholder="phone" />
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel>Landmark (optional) </Form.ControlLabel>
                <Form.Control
                  name="landMark"
                  placeholder="e.g Beside bus stand"
                />
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel>Division</Form.ControlLabel>
                <Form.Control
                  name="division"
                  placeholder="Division"
                  accepter={SelectPicker}
                  data={divisionData.map((dd) => ({
                    label: dd,
                    value: dd.toLowerCase(),
                  }))}
                  block
                />
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel>City</Form.ControlLabel>
                <Form.Control
                  name="city"
                  placeholder="Please choose your city"
                  accepter={SelectPicker}
                  data={city.map((cd: string) => ({
                    label: cd,
                    value: cd?.toLowerCase(),
                  }))}
                  loading={cityLoading}
                  disabled={!city?.length || !formData?.division}
                  block
                />
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel>Zone</Form.ControlLabel>
                <Form.Control
                  name="zone"
                  accepter={SelectPicker}
                  placeholder="Please choose your zone"
                  data={zone.map((z: string) => ({
                    label: z,
                    value: z?.toLowerCase(),
                  }))}
                  loading={zoneLoading}
                  disabled={!zone?.length || !formData?.city}
                  block
                />
              </Form.Group>

              <Form.Group>
                <Form.ControlLabel>Address</Form.ControlLabel>
                <Form.Control name="address" accepter={Textarea} />
              </Form.Group>

              <Form.Group>
                <Form.ControlLabel>Set As Default</Form.ControlLabel>
                <Form.Control
                  name="isDefault"
                  accepter={Checkbox}
                  value={!formData?.isDefault}
                  defaultChecked={formData?.isDefault}
                />
              </Form.Group>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            appearance="primary"
            onClick={() => submitHandler()}
            color="blue"
            loading={postLoading}
          >
            Save
          </Button>
          <Button
            onClick={() => {
              sefFormData(initialFormData);
              setModalOpen(false);
            }}
            appearance="primary"
            color="red"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeliveryAddressModal;
