"use client";
import { SyntheticEvent, useEffect, useState } from "react";
import { Navbar as ResuiteNavber, Nav, Button, Avatar } from "rsuite";

import { signOut, useSession } from "next-auth/react";
import { NavLink } from "../Navlink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import NavItemProvider from "./NavItemProvider";

import { DesktopNavbar } from "./DesktopHamMenu";
import { MobileNavMenu } from "./MobileNavMenu";
import SignUpPopUp from "./SignUpPopUp";

export const Navbar = () => {
  const [activeKey, setActiveKey] = useState<string>("");
  const [isMobile, setMobile] = useState(false);
  const [popUpOpen, setPopUpOpen] = useState<boolean>(false);

  useEffect(() => {
    if (window) {
      const handleResize = () => {
        setMobile(window.innerWidth <= 1024);
      };
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  });

  return (
    <>
      <div className="w-[100vw] fixed " style={{ zIndex: 99999999 }}>
        {isMobile ? (
          <MobileNavMenu
            activeKey={activeKey}
            onSelect={setActiveKey as unknown as SyntheticEvent<Element, Event>}
            setPopUpOpen={setPopUpOpen}
          />
        ) : (
          <DesktopNavbar
            activeKey={activeKey}
            onSelect={setActiveKey as unknown as SyntheticEvent<Element, Event>}
            setPopUpOpen={setPopUpOpen}
          />
        )}
      </div>

      {/* Signup Login popup model */}

      <div>
        <SignUpPopUp isOpen={popUpOpen} setOpen={setPopUpOpen} />
      </div>
    </>
  );
};
