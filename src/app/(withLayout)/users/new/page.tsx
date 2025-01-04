"use client";
import {
  IProfile,
  IuserFormData,
  IUserPost,
} from "@/components/users/Types&Defaults";
import UserForm from "@/components/users/UserForm";
import {
  userDataFormatter,
  userPostHandler,
  userUpdateHandler,
} from "@/components/users/userHelper";
import { ENUM_MODE } from "@/enums/EnumMode";
import { useGetProfileListQuery } from "@/redux/api/profile/profile.api";
import {
  useCreateUserMutation,
  useLazyGetSingleUserByUUidQuery,
  useUpdateUserProfileMutation,
} from "@/redux/api/users/user.api";
import React, { Ref, useEffect, useRef, useState } from "react";
import { Button, FormInstance, Message, toaster } from "rsuite";

import { useRouter } from "next/navigation";
import { PageProps } from "../../../../../.next/types/app/page";
import PasswordChangerFormProvider from "@/components/users/PasswordChangerFormProvider";

const NewUser = (props: PageProps) => {
  const router = useRouter();
  const formRef = useRef<FormInstance>();
  const { mode, uuid } = props.searchParams;
  const [getSingle, { isLoading, isFetching }] =
    useLazyGetSingleUserByUUidQuery();
  const [update, { isLoading: updateLoading, isSuccess: updateSuccess }] =
    useUpdateUserProfileMutation();
  const [post, { isLoading: postLoading, isSuccess: postSuccess }] =
    useCreateUserMutation();
  const [userData, setUserData] = useState<IuserFormData | undefined>();

  const submitHandler = async () => {
    try {
      if (formRef.current?.check()) {
        const data = userDataFormatter(userData as IuserFormData, mode);
        if (mode == ENUM_MODE.NEW) {
          await userPostHandler(data as IUserPost, post);
        }
        if (mode === ENUM_MODE.UPDATE) {
          await userUpdateHandler(data as unknown as IProfile, update);
        }
      } else {
        toaster.push(<Message type="error">Please fill out the form</Message>);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if ((uuid && mode == ENUM_MODE.UPDATE) || mode == ENUM_MODE.VIEW) {
      (async () => {
        const data = await getSingle(uuid).unwrap();
        if (data?.success) {
          const copiedData = JSON.parse(JSON.stringify(data?.data));
          const userData = {
            ...copiedData,
            ...copiedData?.profile,
          };
          setUserData(userData);
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (postSuccess || updateSuccess) {
      router.push("/users");

      setUserData(undefined);
    }
  }, [postSuccess, updateSuccess]);
  return (
    <div className="shadow-lg bg-[#003CFF05] p-4 m-2">
      <div className="text-center text-[#194BEE] text-2xl font-bold font-roboto ">
        Add New User
      </div>
      <div>
        <UserForm
          formData={userData}
          setFormData={setUserData}
          forwardedFromRef={formRef as Ref<FormInstance>}
          mode={mode}
        />
      </div>
      <div className="my-5 flex items-end justify-end ">
        <div className="grid grid-cols-2 gap-5">
          <PasswordChangerFormProvider mode={mode} id={userData?.uuid} />
          <Button
            onClick={() => submitHandler()}
            size="lg"
            loading={postLoading || updateLoading}
            appearance="primary"
            color="blue"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
