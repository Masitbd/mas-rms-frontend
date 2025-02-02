import { useSession } from "next-auth/react";
import React, { ReactNode, SetStateAction } from "react";
import { Button } from "rsuite";
import { IProfile } from "../users/Types&Defaults";

const PersonalDetails = ({
  profileData,
  profileModalOpen,
  setProfileModalOpen,
}: {
  profileData: IProfile;
  profileModalOpen: boolean;
  setProfileModalOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const personalDetailsFields: Array<keyof typeof profileData> = [
    "name",
    "age",
    "gender",
  ];

  return (
    <div className=" w-full h-full lg:p-6 p-3  rounded-xl border border-[#DCDCDC] bg-white">
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold ">Personal Details</h2>
        <h5 className="font-semibold">
          <Button
            size="sm"
            appearance="subtle"
            className="!font-semibold"
            onClick={() => setProfileModalOpen(true)}
          >
            Change
          </Button>
        </h5>
      </div>
      <div className="mt-6 grid grid-cols-12  gap-2">
        {profileData &&
          personalDetailsFields.map((pd) => {
            return (
              <>
                <div className="col-span-6">
                  <h3 className="capitalize text-lg font-bold ">{pd}</h3>
                  <p>
                    {pd == "dateOfBirth" && profileData?.dateOfBirth
                      ? new Date(profileData.dateOfBirth).toLocaleDateString()
                      : (profileData[pd] as ReactNode)}
                  </p>
                </div>
              </>
            );
          })}
      </div>
    </div>
  );
};

export default PersonalDetails;
