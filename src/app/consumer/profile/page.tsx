"use client";
import ContactInfo from "@/components/consumer-profile/ContactInfo";
import DeliveryAddress from "@/components/consumer-profile/DeliveryAddress";
import PersonalDetails from "@/components/consumer-profile/PersonalDetails";
import { useGetProfileListQuery } from "@/redux/api/profile/profile.api";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

const ConsumerProfile = () => {
  const { data } = useGetProfileListQuery(undefined);
  const session = useSession();

  return (
    <div className=" my-36 max-w-7xl mx-auto">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-6 rounded-xl">
          <PersonalDetails profileData={data?.data?.profile} />
        </div>
        <div className="col-span-12 lg:col-span-6 rounded-xl">
          <ContactInfo userInfo={data?.data} />
        </div>
        <div className="col-span-12 lg:col-span-6 rounded-xl">
          <DeliveryAddress />
        </div>
      </div>
    </div>
  );
};

export default ConsumerProfile;
