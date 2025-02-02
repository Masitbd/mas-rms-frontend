import React, { SetStateAction } from "react";
import { IProfile, IUser } from "../users/Types&Defaults";
import { Button } from "rsuite";

const ContactInfo = ({
  userInfo,
  profileModalOpen,
  setProfileModalOpen,
}: {
  userInfo: Partial<IUser & { profile: IProfile }>;
  profileModalOpen: boolean;
  setProfileModalOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className=" w-full h-full lg:p-6 p-3  rounded-xl border border-[#DCDCDC] bg-white">
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold ">Contact Information</h2>
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
      <div className="mt-6 grid grid-cols-12 gap-2">
        <div className="col-span-6">
          <h3 className="capitalize text-lg font-bold gap-5 gap-y-10">Email</h3>
          <p>{userInfo?.email}</p>
        </div>
        <div className="col-span-6">
          <h3 className="capitalize text-lg font-bold gap-5 gap-y-10">Phone</h3>
          <p>{userInfo?.profile?.phone}</p>
        </div>
        {/* <div className="col-span-12">
          <h3 className="capitalize text-lg font-bold gap-5 gap-y-10">
            Address
          </h3>
          <p>{userInfo?.profile?.address}</p>
        </div> */}
      </div>
    </div>
  );
};

export default ContactInfo;
