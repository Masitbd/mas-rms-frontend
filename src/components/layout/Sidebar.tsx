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
import PeopleBranchIcon from "@rsuite/icons/PeopleBranch";

import NavToggle from "./NavToggle";
import { NavLink } from "./Navlink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config, IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import StorageIcon from "@rsuite/icons/Storage";
import FunnelTimeIcon from "@rsuite/icons/FunnelTime";
import DocPassIcon from "@rsuite/icons/DocPass";

import DateTaskIcon from "@rsuite/icons/DateTask";
import { useRouter } from "next/navigation";
import UserInfoIcon from "@rsuite/icons/UserInfo";
import { useSession } from "next-auth/react";
import { ENUM_USER } from "@/enums/EnumUser";

const DashSidebar = () => {
  const navigate = useRouter();
  const [expand, setExpand] = React.useState(true);
  const session = useSession();
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
              {(session?.data?.user?.role == ENUM_USER.SUPER_ADMIN ||
                session?.data?.user?.role == ENUM_USER.SUPER_ADMIN) && (
                <Nav.Item
                  href="/branch"
                  eventKey="7"
                  icon={<PeopleBranchIcon />}
                  as={NavLink}
                >
                  Branch List
                </Nav.Item>
              )}
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

              <Nav.Item
                href="/menu-group"
                eventKey="4"
                icon={<ListIcon />}
                as={NavLink}
              >
                Menu Group
              </Nav.Item>
              <Nav.Item
                href="/items"
                eventKey="5"
                icon={<SettingIcon />}
                as={NavLink}
              >
                Item Category
              </Nav.Item>
              <Nav.Item
                href="/waiter"
                eventKey="6"
                icon={<AdminIcon />}
                as={NavLink}
              >
                Waiter List
              </Nav.Item>

              <Nav.Item
                href="/raw-material-setup"
                eventKey="15"
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
              <Nav.Item
                href="/order"
                eventKey="9"
                icon={<DocPassIcon />}
                as={NavLink}
              >
                Order
              </Nav.Item>
              <Nav.Item
                href="/users"
                eventKey="10"
                icon={<UserInfoIcon />}
                as={NavLink}
              >
                Users
              </Nav.Item>

              <Nav.Menu
                eventKey="9"
                trigger="hover"
                title="Reports"
                icon={<DateTaskIcon />}
                placement="rightStart"
              >
                <Nav.Item
                  eventKey="9-1"
                  href="/reports/daily-sales-report"
                  as={NavLink}
                >
                  Daily Sales Reports
                </Nav.Item>
                <Nav.Item
                  eventKey="9-2"
                  href="/reports/daily-sales-summery"
                  as={NavLink}
                >
                  Daily Sales Summery
                </Nav.Item>
                {/*  */}
                <Nav.Item
                  eventKey="9-3"
                  href="/reports/menu-items"
                  as={NavLink}
                >
                  Menu Items
                </Nav.Item>
                <Nav.Item
                  eventKey="9-4"
                  href="/reports/item-wise-sales"
                  as={NavLink}
                >
                  Item Wise Sales Statement
                </Nav.Item>
                {/*  */}
                <Nav.Item
                  eventKey="8-5"
                  href="/reports/menu-item-consumption"
                  as={NavLink}
                >
                  Menu Item Conssumption
                </Nav.Item>
                {/*  */}
                <Nav.Item
                  eventKey="8-6"
                  href="/reports/menu-item-costing"
                  as={NavLink}
                >
                  Menu Item Costing
                </Nav.Item>
                <Nav.Item
                  eventKey="8-7"
                  href="/reports/raw-material-consumption"
                  as={NavLink}
                >
                  Raw Material Consumption
                </Nav.Item>
                {/*  */}
                <Nav.Item
                  eventKey="8-8"
                  href="/reports/item-wise-raw-material-consumption"
                  as={NavLink}
                >
                  Item wise Raw Material Consumption
                </Nav.Item>
                {/*  */}
                <Nav.Item
                  eventKey="8-0"
                  href="/reports/due-sales-statement"
                  as={NavLink}
                >
                  Due Sales Statement
                </Nav.Item>
                {/*  */}
                <Nav.Item
                  eventKey="10"
                  href="/reports/waiter-wise-sales"
                  as={NavLink}
                >
                  Waiter wise Sales
                </Nav.Item>
                {/*  */}
                <Nav.Item
                  eventKey="10-1"
                  href="/reports/waiter-wise-sales-details"
                  as={NavLink}
                >
                  Waiter wise Sales Details
                </Nav.Item>
                {/*  */}
              </Nav.Menu>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
        <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
      </Sidebar>
    </>
  );
};

export default DashSidebar;
