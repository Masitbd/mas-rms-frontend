"use client";
import Loading from "@/app/Loading";
import UserInfoGrid from "@/components/profile/UserInfo";
import { useGetProfileListQuery } from "@/redux/api/profile/profile.api";
import React from "react";
import { Avatar, Button } from "rsuite";

const Profile = () => {
  const { data, isLoading, isFetching } = useGetProfileListQuery(undefined);
  const userInfoData = data?.data;
  if (isLoading || isFetching) {
    return (
      <div>
        <Loading />
      </div>
    );
  }
  return (
    <div className="shadow-lg bg-[#003CFF05] p-4 m-2">
      <div className="text-center text-[#194BEE] text-2xl font-bold ">
        My Profile
      </div>
      <div className="rounded bg-white  border border-stone-200 mt-5 p-5 flex items-center relative">
        <div className="absolute top-5 right-5">
          <Button appearance="ghost">Edit</Button>
        </div>
        <div>
          <Avatar size="xxl" className="rounded-full " circle />
        </div>
        <div className="mx-5">
          <div className="text-xl font-semibold">
            {data?.data?.profile?.name}
          </div>
          <div className="text-stone-400 text-lg capitalize font-mono">
            {data?.data?.role}
          </div>
          <div className="text-stone-400 text-sm font-normal">
            {data?.data?.profile?.address}
          </div>
        </div>
      </div>
      <div className="rounded bg-white  border border-stone-200 mt-5 p-5 ">
        <div className="text-xl font-semibold">Personal Information</div>
        <div>
          <UserInfoGrid
            address={data?.data?.profile?.address}
            dateOfBirth={userInfoData?.profile?.dateOfBirth}
            email={userInfoData?.profile?.email}
            fatherName={userInfoData?.profile?.fatherName}
            gender={userInfoData?.profile?.gender}
            motherName={userInfoData?.profile?.motherName}
            phone={userInfoData?.profile?.phone}
            uuid={userInfoData?.profile?.uuid}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
