import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserContext from "../UserContext";
import AddDeviceForm from "./AddDeviceForm";
import { BrowserRouter } from "react-router-dom";

// Mock UserContext
const mockAddDevice = jest.fn();
const wrapper = ({ children }) => (
  <BrowserRouter>
    <UserContext.Provider value={{ addDevice: mockAddDevice }}>
      {children}
    </UserContext.Provider>
  </BrowserRouter>
);

describe("AddDeviceForm", () => {
  it("renders without crashing and matches snapshot", () => {
    const { asFragment } = render(<AddDeviceForm />, { wrapper });
    expect(asFragment()).toMatchSnapshot();
  });

  it("submits data correctly", async () => {
    const mockAddDevice = jest.fn().mockResolvedValue(true);
    const { getByLabelText, getByRole } = render(
      <BrowserRouter>
      <UserContext.Provider value={{ addDevice: mockAddDevice }}>
        <AddDeviceForm />
      </UserContext.Provider>
      </BrowserRouter>
    );

    fireEvent.change(getByLabelText(/Name/i), {
      target: { value: "New Light" },
    });
    fireEvent.change(getByLabelText(/Serial Number/i), {
      target: { value: "123456789" },
    });
    fireEvent.change(getByLabelText(/Type/i), { target: { value: "Light" } });
    fireEvent.change(getByLabelText(/Room/i), {
      target: { value: "Living Room" },
    });
    fireEvent.change(getByLabelText(/Status/i), { target: { value: "on" } });

    fireEvent.click(getByRole("button", { name: /add/i }));

    await waitFor(() =>
      expect(mockAddDevice).toHaveBeenCalledWith({
        name: "New Light",
        serial_number: "123456789",
        type: "Light",
        room: "Living Room",
        status: "on",
      })
    );
  });
});
