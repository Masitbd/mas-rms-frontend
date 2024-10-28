"use client";
import React from "react";
import { Dropdown, Nav, Sidebar, Sidenav } from "rsuite";
import Dashboard from "@rsuite/icons/legacy/Dashboard";
import Group from "@rsuite/icons/legacy/Group";
import Magic from "@rsuite/icons/legacy/Magic";
import GearCircle from "@rsuite/icons/legacy/GearCircle";

import NavToggle from "./NavToggle";

const DashSidebar = () => {
  const [expand, setExpand] = React.useState(true);
  return (
    <>
      <Sidebar
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "93vh",
          justifyContent: "space-between",
        }}
        width={expand ? 260 : 56}
        collapsible
      >
        <Sidenav expanded={expand} defaultOpenKeys={["3"]} appearance="subtle">
          <Sidenav.Body>
            <Nav>
              <Nav.Item eventKey="1" active icon={<Dashboard />}>
                Dashboard
              </Nav.Item>
              <Nav.Item eventKey="2" icon={<Group />}>
                User Group
              </Nav.Item>
              <Dropdown
                eventKey="3"
                trigger="hover"
                title="Advanced"
                icon={<Magic />}
                placement="rightStart"
              >
                <Dropdown.Item eventKey="3-1">Geo</Dropdown.Item>
                <Dropdown.Item eventKey="3-2">Devices</Dropdown.Item>
                <Dropdown.Item eventKey="3-3">Brand</Dropdown.Item>
                <Dropdown.Item eventKey="3-4">Loyalty</Dropdown.Item>
                <Dropdown.Item eventKey="3-5">Visit Depth</Dropdown.Item>
              </Dropdown>
              <Dropdown
                eventKey="4"
                trigger="hover"
                title="Settings"
                icon={<GearCircle />}
                placement="rightStart"
              >
                <Dropdown.Item eventKey="4-1">Applications</Dropdown.Item>
                <Dropdown.Item eventKey="4-2">Websites</Dropdown.Item>
                <Dropdown.Item eventKey="4-3">Channels</Dropdown.Item>
                <Dropdown.Item eventKey="4-4">Tags</Dropdown.Item>
                <Dropdown.Item eventKey="4-5">Versions</Dropdown.Item>
                <Dropdown.Item eventKey="4-3">Channels</Dropdown.Item>
                <Dropdown.Item eventKey="4-4">Tags</Dropdown.Item>
                <Dropdown.Item eventKey="4-5">Versions</Dropdown.Item>
                <Dropdown.Item eventKey="4-3">Channels</Dropdown.Item>
                <Dropdown.Item eventKey="4-4">Tags</Dropdown.Item>
                <Dropdown.Item eventKey="4-5">Versions</Dropdown.Item>
                <Dropdown.Item eventKey="4-3">Channels</Dropdown.Item>
                <Dropdown.Item eventKey="4-4">Tags</Dropdown.Item>
              </Dropdown>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
        <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
      </Sidebar>
    </>
  );
};

export default DashSidebar;
