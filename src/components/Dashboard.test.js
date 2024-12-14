import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";

import UserContext from "../UserContext";
import Dashboard from "./Dashboard";
import { BrowserRouter } from "react-router-dom";

describe("Dashboard", () => {
 
  // Mock UserContext for different scenarios
  const mockUserContextLoggedIn = {
    currentUser: { username: "testUser" },
    devices: [{ serial_number: "123456789134", name: "Test Light", status: "on", room: "livingroom", type: "light", brightness: 75, color: "blue"}],
  };

  const mockUserContextLoggedOut = {
    currentUser: null,
    devices: [],
  };

  const Wrapper = ({ children, value }) => (
    <BrowserRouter>
      <UserContext.Provider value={value}>
        {children}
      </UserContext.Provider>
    </BrowserRouter>
  );
  

  it("renders without crashing for logged-in users with devices", () => {
    const { getByText } = render(<Dashboard />, {
      wrapper: (props) => Wrapper({ ...props, value: mockUserContextLoggedIn }),
    });
    expect(getByText(/Test Light/i)).toBeInTheDocument();
  });
  

  it("renders without crashing for logged-out users", () => {
    const { getByText } = render(<Dashboard />, {
      wrapper: (props) => Wrapper({ ...props, value: mockUserContextLoggedOut }),
    });
    expect(getByText(/Control Your Home, Effortlessly/i)).toBeInTheDocument();
  });

  // Test for interactions
  it("shows no devices message when no devices are present", () => {
    const contextValueNoDevices = {
      currentUser: { username: "testuser" },
      devices: [],
    };
    const { getByText } = render(<Dashboard />, {
      wrapper: (props) => Wrapper({ ...props, value: contextValueNoDevices }),
    });
    expect(
      getByText(/You have no LIFX lights registered!/i)
    ).toBeInTheDocument();
  });
  

  
});
