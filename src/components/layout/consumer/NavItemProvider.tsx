import React, { useEffect, useState } from "react";
import { Nav } from "rsuite";
import { NavLink } from "../Navlink";

const NavItemProvider = (props: {
  name: string;
  eventKey: string;
  activeKey: string;
  href?: string;
}) => {
  const { name, activeKey, eventKey, href, ...rest } = props;
  const [active, setActive] = useState<boolean>();

  const activeClasses =
    "bg-[#FC8A06] font-bold text-white py-3 px-10 flex items-center justify-center rounded-full border border-[#2C2F24]";
  const inactiveClasses = " flex items-center justify-center rounded-full";

  useEffect(() => {
    setActive(activeKey === eventKey);
  }, [activeKey]);

  return (
    <Nav.Item {...rest} as={NavLink} href={href ?? "#"} eventKey={eventKey}>
      <div className={active ? activeClasses : inactiveClasses}>
        {name ?? ""}
      </div>
    </Nav.Item>
  );
};

export default NavItemProvider;
