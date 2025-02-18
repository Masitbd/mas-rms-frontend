import React, { Dispatch, SetStateAction } from "react";
import { Button, Modal } from "rsuite";
import facebookLogo from "../../../assets/logos/facebookLogo.svg";
import Image from "next/image";
import { NavLink } from "../Navlink";
import { signIn } from "next-auth/react";

const SignUpPopUp = (props: {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div>
      <Modal
        open={props.isOpen}
        size="xs"
        onClose={() => props.setOpen(!props.isOpen)}
        backdrop={true}
        style={{ zIndex: 999999999 }}
      >
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div>
            <h3 className="text-2xl font-semibold text-[#323232] my-3">
              Welcome !
            </h3>
            <h4 className="my-4">Login Or Signup To Continue</h4>
            <div className="w-full grid grid-cols-1 gap-3 mb-4">
              {/* <Button
                appearance="primary"
                color="blue"
                className="w-full"
                startIcon={
                  <Image
                    src={facebookLogo}
                    alt="Facebook Logo"
                    width={20}
                    height={20}
                  />
                }
              >
                &nbsp; Continue with Facebook
              </Button> */}
              <Button
                onClick={() => signIn("google")}
                appearance="default"
                className="w-full"
                startIcon={
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="h-5"
                  >
                    <g>
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      ></path>
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      ></path>
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      ></path>
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      ></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </g>
                  </svg>
                }
              >
                &nbsp; Continue with Google
              </Button>
            </div>
            <div className="text-center mb-4">Or</div>

            <div className="grid grid-cols-1 gap-4">
              <Button
                appearance="primary"
                color="orange"
                as={NavLink}
                href="login"
              >
                Login
              </Button>
              <Button
                appearance="ghost"
                color="orange"
                as={NavLink}
                href="/signup"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="text-left text-sm text-[#8a8a8a]">
            By signing up, you agree to our Terms and Conditions and Privacy
            Policy.
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SignUpPopUp;
