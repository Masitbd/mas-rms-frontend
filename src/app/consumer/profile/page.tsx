"use client";
import ContactInfo from "@/components/consumer-profile/ContactInfo";
import DeliveryAddress from "@/components/consumer-profile/DeliveryAddress";
import ForgetPassword from "@/components/consumer-profile/ForgetPassword";
import PasswordChangeForm from "@/components/consumer-profile/PasswordChangeForm";
import PersonalDetails from "@/components/consumer-profile/PersonalDetails";
import ProfileInfoChanger from "@/components/consumer-profile/ProfileInfoChanger";
import PasswordChangerFormProvider from "@/components/users/PasswordChangerFormProvider";
import { useGetProfileListQuery } from "@/redux/api/profile/profile.api";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

const ConsumerProfile = () => {
  const { data } = useGetProfileListQuery(undefined);
  const session = useSession();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [resetModelOpen, setResetModalOpen] = useState(false);
  console.log(session);

  return (
    <div className=" my-36 max-w-7xl mx-auto">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-6 rounded-xl">
          <PersonalDetails
            profileData={data?.data?.profile}
            profileModalOpen={profileModalOpen}
            setProfileModalOpen={setProfileModalOpen}
          />
        </div>
        <div className="col-span-12 lg:col-span-6 rounded-xl">
          <ContactInfo
            userInfo={data?.data}
            profileModalOpen={profileModalOpen}
            setProfileModalOpen={setProfileModalOpen}
          />
        </div>
        <div className="col-span-12 lg:col-span-6 rounded-xl">
          <DeliveryAddress />
        </div>
        <div className="flex flex-row justify-around col-span-12 lg:col-span-3 ">
          <PasswordChangeForm />
          <ForgetPassword
            resetModalOpen={resetModelOpen}
            setResetModalOpen={setResetModalOpen}
            email={session?.data?.user?.email}
          />
        </div>

        <div>
          <ProfileInfoChanger
            profileModalOpen={profileModalOpen}
            setProfileModalOpen={setProfileModalOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default ConsumerProfile;
