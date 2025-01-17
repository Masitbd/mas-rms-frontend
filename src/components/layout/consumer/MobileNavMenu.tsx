import { Navbar as ResuiteNavber, Nav, Button, Avatar } from "rsuite";

import { signOut, useSession } from "next-auth/react";
import { NavLink } from "../Navlink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCartShopping, faL } from "@fortawesome/free-solid-svg-icons";
import NavItemProvider from "./NavItemProvider";
import { Dispatch, SetStateAction, SyntheticEvent, useState } from "react";
import ThreeColumnsIcon from "@rsuite/icons/ThreeColumns";

export const MobileNavMenu = ({
  setPopUpOpen,
  onSelect,
  activeKey,
  ...props
}: {
  onSelect: SyntheticEvent<Element, Event>;
  activeKey: string;
  setPopUpOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const session = useSession();
  const [ismenuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <div className="bg-[#f7f7fa]">
        <ResuiteNavber
          {...props}
          appearance="default"
          style={{ zIndex: 222222 }}
          className="max-w-7xl mx-auto py-4"
        >
          <Nav
            onSelect={
              onSelect as unknown as (
                eventKey: unknown,
                event: SyntheticEvent<Element, Event>
              ) => void
            }
            className="fixed"
          >
            <Nav.Item
              eventKey="1"
              className="text-4xl flex items-center justify-center font-bold "
            >
              RMS
            </Nav.Item>
            {ismenuOpen && (
              <Nav.Item eventKey="2">
                <div className="fixed top-20 right-0 bg-[#f7f7fa] w-[100vw] px-4 grid grid-cols-1 gap-y-4   divide-y divide-stone-400 py-5">
                  <div className="p-2 flex justify-center bg-[#e9e9eb] rounded-md">
                    Profile
                  </div>
                  <div className="w-full py-2">
                    <Button
                      appearance="primary"
                      color="red"
                      onClick={() => signOut()}
                      className="w-full"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </Nav.Item>
            )}
          </Nav>
          <Nav pullRight className="">
            <Nav.Item>
              <FontAwesomeIcon icon={faCartShopping} className="" />
            </Nav.Item>
            {session?.status == "authenticated" ? (
              <Nav.Item onClick={() => setMenuOpen(!ismenuOpen)}>
                <FontAwesomeIcon
                  icon={faBars}
                  rotation={ismenuOpen ? 90 : undefined}
                />
              </Nav.Item>
            ) : (
              <Nav.Item>
                <Button
                  appearance="primary"
                  color="orange"
                  className="!font-bold !rounded-full"
                  onClick={() => setPopUpOpen((prev) => !prev)}
                >
                  Login/Sign Up
                </Button>
              </Nav.Item>
            )}
          </Nav>
        </ResuiteNavber>
      </div>
      <div className="overflow-x-scroll  mx-auto  scrollbar-hide bg-[#f7f7fa]">
        <Nav
          appearance="pills"
          onSelect={
            onSelect as unknown as (
              eventKey: unknown,
              event: SyntheticEvent<Element, Event>
            ) => void
          }
          activeKey={activeKey}
          className="mx-auto w-full scrollbar-hide"
        >
          <Nav.Item as={NavLink} href="/consumer/home" eventKey={"1"}>
            Home
          </Nav.Item>
          <Nav.Item as={NavLink} href="/consumer/category" eventKey={"2"}>
            Browse Menu
          </Nav.Item>
          <Nav.Item as={NavLink} href="/consumer/home" eventKey={"3"}>
            Special Offer
          </Nav.Item>
          <Nav.Item as={NavLink} href="/consumer/home" eventKey={"4"}>
            Track Order
          </Nav.Item>
          <Nav.Item as={NavLink} href="/consumer/home" eventKey={"5"}>
            Book A Table
          </Nav.Item>
        </Nav>
      </div>
    </>
  );
};
