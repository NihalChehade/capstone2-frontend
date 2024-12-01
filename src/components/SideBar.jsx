import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../UserContext";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import "./SideBar.css";

function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const { currentUser } = useContext(UserContext);

  return (
    <Navbar expand="md" className="navbar">
      <NavbarBrand href="/">Home Automation</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mr-auto" navbar>
          <NavItem className="nav-item">
            <NavLink tag={Link} to="/" onClick={toggle}>
              {currentUser ? "My" : ""} Dashboard
            </NavLink>
          </NavItem>
          <NavItem className="nav-item">
            <NavLink tag={Link} to="/instructions" onClick={toggle}>
              Instructions
            </NavLink>
          </NavItem>
          {currentUser ? (
            <>
              <NavItem className="nav-item">
                <NavLink tag={Link} to="/devices/add" onClick={toggle}>
                  Add Device
                </NavLink>
              </NavItem>
              <NavItem className="nav-item">
                <NavLink tag={Link} to="/profile" onClick={toggle}>
                  Profile
                </NavLink>
              </NavItem>
              <NavItem className="nav-item">
                <NavLink tag={Link} to="/logout" onClick={toggle}>
                  Logout
                </NavLink>
              </NavItem>
            </>
          ) : (
            <>
              <NavItem className="nav-item">
                <NavLink tag={Link} to="/signup" onClick={toggle}>
                  Signup
                </NavLink>
              </NavItem>
              <NavItem className="nav-item">
                <NavLink tag={Link} to="/login" onClick={toggle}>
                  Login
                </NavLink>
              </NavItem>
            </>
          )}
        </Nav>
      </Collapse>
    </Navbar>
  );
}

export default SideBar;
