"use client";
import React from "react";
import { Dropdown, Nav, Sidebar, Sidenav } from "rsuite";
import Dashboard from "@rsuite/icons/legacy/Dashboard";

import Magic from "@rsuite/icons/legacy/Magic";
import GearCircle from "@rsuite/icons/legacy/GearCircle";
import TableIcon from "@rsuite/icons/Table";
import PeoplesIcon from "@rsuite/icons/Peoples";

import ListIcon from "@rsuite/icons/List";
import SettingIcon from "@rsuite/icons/Setting";

import PeoplesCostomizeIcon from "@rsuite/icons/PeoplesCostomize";

import NavToggle from "./NavToggle";
import { NavLink } from "./Navlink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config, IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import StorageIcon from "@rsuite/icons/Storage";
import FunnelTimeIcon from "@rsuite/icons/FunnelTime";

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
              <Nav.Item
                href="/table"
                eventKey="2"
                icon={<TableIcon />}
                as={NavLink}
              >
                Table
              </Nav.Item>
              <Nav.Item
                href="/customers"
                eventKey="3"
                icon={<PeoplesIcon />}
                as={NavLink}
              >
                Customers
              </Nav.Item>

              <Nav.Item href="/menu-group" eventKey="4" icon={<ListIcon />}>
                Menu Group
              </Nav.Item>
              <Nav.Item href="/items" eventKey="5" icon={<SettingIcon />}>
                Item Category
              </Nav.Item>

              <Nav.Item
                href="/users"
                eventKey="4"
                icon={<PeoplesCostomizeIcon />}
                as={NavLink}
              >
                Users
              </Nav.Item>
              <Nav.Item
                href="/raw-material-setup"
                eventKey="7"
                icon={<FunnelTimeIcon />}
                as={NavLink}
              >
                Raw Material Setup
              </Nav.Item>
              <Nav.Item
                href="/consumption"
                eventKey="8"
                icon={<StorageIcon />}
                as={NavLink}
              >
                Menu Item And consumption
              </Nav.Item>
              <Dropdown
                eventKey="5"
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
                eventKey="6"
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
