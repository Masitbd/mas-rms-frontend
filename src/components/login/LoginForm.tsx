"use client";
import React, { useState } from "react";
import EyeIcon from "@rsuite/icons/legacy/Eye";
import EyeSlashIcon from "@rsuite/icons/legacy/EyeSlash";
import { Button, Form, InputGroup } from "rsuite";
import FormControl from "rsuite/esm/FormControl";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ILoginData, model } from "./ModalsAndTypes";
config.autoAddCss = false;

const LoginForm = () => {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const route = useRouter();
  const session = useSession();

  const handleChange = () => {
    setVisible(!visible);
  };

  const formSubmitHandler = (payload: ILoginData) => {
    handleLogin(payload);
  };

  async function handleLogin(credentials: ILoginData) {
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        email: credentials.email,
        password: credentials.password,
      });
      // console.log(result, "login rest");
      if (result?.error) {
        setError(result.error);
      }
      if (result?.ok) {
        setLoading(false);
        const updatedSession = await getSession();
        if (updatedSession?.user?.role === "super-admin") {
          route.push("/home");
        } else {
          route.push("/welcome-page");
        }
      }
    } catch (error) {
      if (error) {
        console.error("Login failed:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Form
        fluid
        onSubmit={(v) => formSubmitHandler(v as ILoginData)}
        model={model}
      >
        {error && (
          <Form.HelpText>
            <div className="text-red-600">{error}</div>
          </Form.HelpText>
        )}
        <Form.Group controlId="email">
          <InputGroup inside>
            <InputGroup.Addon>
              <FontAwesomeIcon icon={faUser} className="" />
            </InputGroup.Addon>
            <FormControl name="email" placeholder="Enter Email" size="lg" />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="password">
          <InputGroup inside>
            <InputGroup.Addon>
              <FontAwesomeIcon icon={faLock} />
            </InputGroup.Addon>
            <FormControl
              name="password"
              placeholder="Enter password"
              type={`${visible ? "text" : "password"}`}
              size="lg"
            />
            <InputGroup.Button
              onClick={handleChange}
              size="lg"
              className="mt-0.5 p-2"
              appearance="ghost"
            >
              {visible ? <EyeIcon /> : <EyeSlashIcon />}
            </InputGroup.Button>
          </InputGroup>
        </Form.Group>

        <Form.Group>
          <Button
            type="submit"
            style={{ backgroundColor: "#003CFF", whiteSpace: "pre" }}
            className="w-full text-lg font-bold whitespace-pre"
            size="lg"
            appearance="primary"
            loading={session.status === "loading" || loading}
          >
            <div className="text-lg flex items-center space-x-3">
              <span>Login</span> {`  `}
              <FontAwesomeIcon icon={faCircleArrowRight} />
            </div>
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default LoginForm;
