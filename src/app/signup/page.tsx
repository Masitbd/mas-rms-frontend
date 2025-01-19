"use client";
import React from "react";
import regImage from "../../assets/images/regPageImage.jpg";
import Image from "next/image";
import { Button, Checkbox, Divider, Form } from "rsuite";
import Link from "next/link";
import "../../components/signup/SignupStyle.css";
import SingupForm from "@/components/signup/SingupForm";

const SignUp = () => {
  return (
    <div className="grid grid-cols-2 h-full w-full relative lg:static">
      <div className=" h-[100vh] flex items-center justify-center flex-col z-20 col-span-2 lg:col-span-1">
        <SingupForm />
      </div>
      <div className="lg:relative static z-10">
        <Image className="signup-image" src={regImage} alt="img" fill />
      </div>
    </div>
  );
};

export default SignUp;
