"use client";
import { SyntheticEvent, useState } from "react";
import { Navbar as ResuiteNavber, Nav } from "rsuite";
import { NavLink } from "./Navlink";

const CustomNavbar = ({
  onSelect,
  activeKey,
  ...props
}: {
  onSelect: SyntheticEvent<Element, Event>;
  activeKey: boolean;
}) => {
  return (
    <ResuiteNavber {...props} appearance="inverse" style={{ zIndex: 222222 }}>
      <Nav
        onSelect={
          onSelect as unknown as (
            eventKey: unknown,
            event: SyntheticEvent<Element, Event>
          ) => void
        }
        activeKey={activeKey}
      >
        <Nav.Item eventKey="2" as={NavLink} href="/profile">
          Profile
        </Nav.Item>
        <Nav.Item eventKey="3" as={NavLink} href="/order">
          Dashboard
        </Nav.Item>
      </Nav>
    </ResuiteNavber>
  );
};

export const Navbar = () => {
  const [activeKey, setActiveKey] = useState(null);

  return (
    <>
      <CustomNavbar
        activeKey={activeKey as unknown as boolean}
        onSelect={setActiveKey as unknown as SyntheticEvent<Element, Event>}
      />
    </>
  );
};
