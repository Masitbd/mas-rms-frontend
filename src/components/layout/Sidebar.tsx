"use client";
import React from "react";
import { Dropdown, Nav, Sidebar, Sidenav } from "rsuite";
import Dashboard from "@rsuite/icons/legacy/Dashboard";

import AdminIcon from "@rsuite/icons/Admin";
import GearCircle from "@rsuite/icons/legacy/GearCircle";
import TableIcon from "@rsuite/icons/Table";
import PeoplesIcon from "@rsuite/icons/Peoples";
import ListIcon from "@rsuite/icons/List";
import SettingIcon from "@rsuite/icons/Setting";

import NavToggle from "./NavToggle";

const DashSidebar = () => {
  const [expand, setExpand] = React.useState(true);
  return (
    <>
      <Sidebar
        style={{
          display: "flex",
          flexDirection: "column",
          justifyItems: "center",
          minHeight: "93vh",
          justifyContent: "space-between",
        }}
        width={expand ? 260 : 56}
        collapsible
      >
        <Sidenav expanded={expand} defaultOpenKeys={["3"]} appearance="subtle">
          <Sidenav.Body>
            <Nav>
              <Nav.Item href="/" eventKey="1" active icon={<Dashboard />}>
                Dashboard
              </Nav.Item>
              <Nav.Item href="/table" eventKey="2" icon={<TableIcon />}>
                Table
              </Nav.Item>
              <Nav.Item href="/customers" eventKey="3" icon={<PeoplesIcon />}>
                Customers
              </Nav.Item>
              <Nav.Item href="/menu-group" eventKey="4" icon={<ListIcon />}>
                Menu Group
              </Nav.Item>
              <Nav.Item href="/items" eventKey="5" icon={<SettingIcon />}>
                Item Category
              </Nav.Item>
              <Nav.Item href="/waiter" eventKey="5" icon={<AdminIcon />}>
                Waiter List
              </Nav.Item>

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
