/* eslint-disable react/no-children-prop */
"use client";
import LoginForm from "@/components/login/LoginForm";
import React from "react";

const Login = () => {
  return (
    <div>
      <div className="w-full h-[90vh] flex items-center justify-center">
        <div className="w-[33.31rem] h-[28.6rem] shadow-lg bg-[#003CFF05] p-16">
          <div className="text-4xl text-center font-serif">
            <span className="text-[#E54E0D]">MAS</span>{" "}
            <span className="text-[#194BEE]">Restaurant</span> System
          </div>
          <div className="text-center mt-8">
            <span className="text-xl font-bold">Login</span> <br />
            <span className="text-sm text-gray-700">
              {" "}
              Please Enter Login Information
            </span>
          </div>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
