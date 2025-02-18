import { useGetProfileListQuery } from "@/redux/api/profile/profile.api";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { Button, DatePicker, Form, Loader, Modal, SelectPicker } from "rsuite";
import {
  genderOptions,
  initialProfileValue,
  profileModal,
} from "./consumerProfileHelper";
import Loading from "@/app/Loading";
import { useUpdateUserProfileMutation } from "@/redux/api/users/user.api";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { IProfile } from "../users/Types&Defaults";
import dobToAge from "dob-to-age";

const ProfileInfoChanger = ({
  profileModalOpen,
  setProfileModalOpen,
  additionalInfo,
}: {
  profileModalOpen: boolean;
  setProfileModalOpen: React.Dispatch<SetStateAction<boolean>>;
  additionalInfo?: boolean;
}) => {
  const { update, data: SessionData } = useSession();
  const formRef = useRef<any>();
  const {
    data,
    isLoading: profileDataLoading,
    isFetching,
    refetch,
  } = useGetProfileListQuery(undefined);
  const [profileData, setProfileData] = React.useState<any>();

  const [updateProfile, { isLoading: updateProfileLoading }] =
    useUpdateUserProfileMutation();

  const handleClose = () => {
    setProfileModalOpen(false);
    setProfileData(initialProfileValue);
  };

  const handleSubmit = async () => {
    if (!formRef?.current?.check()) {
      Swal.fire("Error!", "Fill in all the form fields", "error");
      return;
    }
    try {
      const result = await updateProfile({
        profile: profileData,
        uuid: SessionData?.user.uuid as string,
      }).unwrap();
      if (result?.success) {
        Swal.fire("Success!", "Profile Updated successfully", "success");
        update();
        handleClose();
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        title: "Error updating profile",
        icon: "error",
      });
    }
  };

  const dobHandler = (v: string) => {
    // Create a date object for 2024-11-30
    const specificDate = new Date(v);

    // Format the date into a custom string
    const year = specificDate.getFullYear(); // Get the year (2024)
    const month = String(specificDate.getMonth() + 1).padStart(2, "0"); // Get the month (11), pad if needed
    const day = String(specificDate.getDate()).padStart(2, "0"); // Get the day (30)

    // Combine the parts into a single numeric string
    const formattedDate = `${year}-${month}-${day}`;
    const age = dobToAge(formattedDate);
    const ageData = (age?.count + " " + age?.unit) as string;

    setProfileData({
      ...profileData,
      age: ageData,
      dateOfBirth: v,
    });
  };

  useEffect(() => {
    if (data?.data?.profile && profileModalOpen) {
      setProfileData(JSON.parse(JSON?.stringify(data?.data?.profile)));
    }
  }, [data, data?.data?.profile, isFetching, profileModalOpen]);

  console.log(profileData);
  return (
    <div>
      <Modal
        open={profileModalOpen}
        style={{ marginTop: !additionalInfo ? "4rem" : "" }}
        overflow
      >
        <Modal.Body>
          <>
            <div
              className={`${
                !additionalInfo ? " bg-[#FC8A06]" : "bg-blue-600"
              } text-center  font-semibold text-white rounded py-2 relative grid grid-cols-12 `}
            >
              <div className="text-center col-span-11 text-lg">
                Change Your Profile
              </div>
              <div
                className="text-center rounded bg-red-600 mx-1 cursor-pointer"
                onClick={() => handleClose()}
              >
                X
              </div>
            </div>
            <div className=" mx-auto p-4">
              {profileDataLoading ? (
                <div className="flex items-center justify-center">
                  <Loader size="lg" />
                </div>
              ) : (
                <Form
                  fluid
                  model={profileModal}
                  formValue={profileData}
                  onChange={setProfileData}
                  onSubmit={handleSubmit}
                  className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                  ref={formRef}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name Field - Full width on mobile, spans 2 columns on desktop */}
                    <div className="md:col-span-2">
                      <Form.Group controlId="name">
                        <Form.ControlLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </Form.ControlLabel>
                        <Form.Control
                          name="name"
                          className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Form.HelpText className="text-xs text-gray-500 mt-1">
                          Required
                        </Form.HelpText>
                      </Form.Group>
                    </div>
                    {additionalInfo && (
                      <>
                        <div>
                          <Form.Group controlId="fatherName">
                            <Form.ControlLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Father Name
                            </Form.ControlLabel>
                            <Form.Control
                              name="fatherName"
                              className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Form.HelpText className="text-xs text-gray-500 mt-1">
                              Required
                            </Form.HelpText>
                          </Form.Group>
                        </div>
                        <div>
                          <Form.Group controlId="motherName">
                            <Form.ControlLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Mother Name
                            </Form.ControlLabel>
                            <Form.Control
                              name="motherName"
                              className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Form.HelpText className="text-xs text-gray-500 mt-1">
                              Required
                            </Form.HelpText>
                          </Form.Group>
                        </div>
                        <div className="col-span-2">
                          <Form.Group controlId="dateOfBirth">
                            <Form.ControlLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Date of Birth
                            </Form.ControlLabel>
                            <Form.Control
                              name="dateOfBirth"
                              accepter={DatePicker}
                              value={new Date(profileData?.dateOfBirth)}
                              onChange={(e) => dobHandler(e)}
                              block
                            />
                            <Form.HelpText className="text-xs text-gray-500 mt-1">
                              Required
                            </Form.HelpText>
                          </Form.Group>
                        </div>
                      </>
                    )}
                    {/* Email Field - Full width on mobile, spans 2 columns on desktop */}
                    <div className="md:col-span-2">
                      <Form.Group controlId="email">
                        <Form.ControlLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </Form.ControlLabel>
                        <Form.Control
                          name="email"
                          type="email"
                          className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Form.HelpText className="text-xs text-gray-500 mt-1">
                          Required
                        </Form.HelpText>
                      </Form.Group>
                    </div>

                    {/* Phone Field - Full width on mobile, 1 column on desktop */}
                    <div>
                      <Form.Group controlId="phone">
                        <Form.ControlLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </Form.ControlLabel>
                        <Form.Control
                          name="phone"
                          className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Form.HelpText className="text-xs text-gray-500 mt-1">
                          Format: 1234567890
                        </Form.HelpText>
                      </Form.Group>
                    </div>

                    {/* Age Field - Full width on mobile, 1 column on desktop */}
                    <div>
                      <Form.Group controlId="age">
                        <Form.ControlLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Age
                        </Form.ControlLabel>
                        <Form.Control
                          name="age"
                          min={0}
                          className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </Form.Group>
                    </div>

                    {/* Gender Field - Full width */}
                    <div className="md:col-span-2">
                      <Form.Group controlId="gender">
                        <Form.ControlLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Gender
                        </Form.ControlLabel>
                        <Form.Control
                          name="gender"
                          accepter={SelectPicker}
                          data={genderOptions}
                          cleanable={false}
                          className="w-full"
                        />
                      </Form.Group>
                    </div>

                    {/* Submit Button - Centered */}
                  </div>
                </Form>
              )}
            </div>
          </>
        </Modal.Body>

        <Modal.Footer>
          <Button
            appearance="primary"
            onClick={() => handleSubmit()}
            loading={updateProfileLoading || profileDataLoading}
            disabled={updateProfileLoading || profileDataLoading}
          >
            Save Changes
          </Button>
          <Button
            onClick={() => handleClose()}
            appearance="primary"
            color="red"
            loading={updateProfileLoading || profileDataLoading}
            disabled={updateProfileLoading || profileDataLoading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfileInfoChanger;
