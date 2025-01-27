import { Navbar as ResuiteNavber, Nav, Button, Avatar } from "rsuite";

import { signOut, useSession } from "next-auth/react";
import { NavLink } from "../Navlink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import NavItemProvider from "./NavItemProvider";
import { Dispatch, SetStateAction, SyntheticEvent } from "react";

export const DesktopNavbar = ({
  cartOpen,
  setCartOpen,
  setPopUpOpen,
  onSelect,
  activeKey,
  ...props
}: {
  onSelect: SyntheticEvent<Element, Event>;
  activeKey: string;
  setPopUpOpen: Dispatch<SetStateAction<boolean>>;
  cartOpen: boolean;
  setCartOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const session = useSession();
  return (
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
          className=""
        >
          <Nav.Item
            eventKey="1"
            className="text-4xl flex items-center justify-center font-bold "
          >
            RMS
          </Nav.Item>

          <>
            <NavItemProvider
              activeKey={activeKey}
              eventKey="2"
              name="Home"
              href="/consumer/home"
            />
            <NavItemProvider
              activeKey={activeKey}
              eventKey="3"
              name="Browse Menu"
              href="/consumer/category"
            />
            <NavItemProvider
              activeKey={activeKey}
              eventKey="4"
              name="Special Offer"
              href="/consumer/category"
            />
            <NavItemProvider
              activeKey={activeKey}
              eventKey="5"
              name="Track Order"
              href="/consumer/orders"
            />

            <NavItemProvider
              activeKey={activeKey}
              eventKey="6"
              name="Book a Table"
              href="/consumer/home"
            />
          </>
        </Nav>
        <Nav pullRight className="">
          <Nav.Item onClick={() => setCartOpen(!cartOpen)}>
            <FontAwesomeIcon icon={faCartShopping} className="" />
          </Nav.Item>
          {session?.status == "authenticated" ? (
            // Authenticated nav menu
            <Nav.Menu
              title={
                <div className="flex items-center justify-center">
                  <Avatar circle />{" "}
                  <b className="mx-2">{session?.data?.user?.name}</b>
                </div>
              }
            >
              <div className="">
                <Nav.Item as={NavLink} href="/consumer/profile">
                  Profile
                </Nav.Item>

                <Nav.Item onClick={() => signOut()}>
                  <Button appearance="primary" color="red">
                    Logout
                  </Button>
                </Nav.Item>
              </div>
            </Nav.Menu>
          ) : (
            // Unauthenticated Nav Menu
            <Nav.Item>
              <Button
                appearance="primary"
                color="orange"
                className="!font-bold !rounded-full"
                onClick={() => setPopUpOpen((prev) => !prev)}
                size="lg"
              >
                Login/Sign Up
              </Button>
            </Nav.Item>
          )}
        </Nav>
      </ResuiteNavber>
    </div>
  );
};
