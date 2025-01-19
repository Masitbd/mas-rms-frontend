import { useSession } from "next-auth/react";
import React from "react";
import { Button } from "rsuite";

const PersonalDetails = () => {
  const sesssion = useSession();
  return (
    <div className=" w-full h-full lg:p-6 p-3  rounded-xl border border-[#DCDCDC] bg-white">
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold ">Personal Details</h2>
        <h5 className="font-semibold">
          <Button size="sm" appearance="subtle" className="!font-semibold">
            Change
          </Button>
        </h5>
      </div>
      <div className="mt-6 font-semibold">
        {sesssion?.data?.user?.name}
        <br />
        {sesssion?.data?.user?.email}
      </div>
      <div className="mt-4"></div>
    </div>
  );
};

export default PersonalDetails;
