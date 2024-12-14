import React from "react";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import UserContext from "../UserContext";
import LightDevice from "./LightDevice";
import { faTrashAlt, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChromePicker } from "react-color";
import { debounce } from "lodash";

// Mock lodash debounce
jest.mock("lodash/debounce", () => jest.fn((fn) => fn));

jest.mock("react-color", () => ({
  ChromePicker: jest.fn(() => null), // Mock ChromePicker as a no-op component
}));

describe("LightDevice Component", () => {
  const deviceProps = {
    name: "Test Light",
    status: "on",
    brightness: 75,
    color: "#ff0000",
  };

  // Mock functions from UserContext
  const mockRemoveDevice = jest.fn();
  const mockControlLight = jest.fn();

  const mockContext = {
    removeDevice: mockRemoveDevice,
    controlLight: mockControlLight,
  };

  const Wrapper = ({ children }) => (
    <UserContext.Provider value={mockContext}>{children}</UserContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the device with correct initial props", () => {
    const { getByText } = render(<LightDevice device={deviceProps} />, {
      wrapper: Wrapper,
    });
    expect(getByText("Test Light")).toBeInTheDocument();
    expect(getByText(/75%/i)).toBeInTheDocument();
    expect(screen.getByLabelText("power-off")).toBeInTheDocument();
  });

  it("calls controlLight when the power button is clicked", async () => {
    const { getByLabelText } = render(<LightDevice device={deviceProps} />, {
      wrapper: Wrapper,
    });
    const powerButton = getByLabelText("power-off");
    await act(async () => {
      fireEvent.click(powerButton);
    });
    // Wait for any asynchronous operations in the event handlers to complete
    await waitFor(() => {
      expect(mockControlLight).toHaveBeenCalledWith(deviceProps.name, {
        status: "off",
      });
    });
  });

  it("calls removeDevice when the delete button is clicked", async() => {
    const { getByLabelText } = render(<LightDevice device={deviceProps} />, {
      wrapper: Wrapper,
    });
    const deleteButton = getByLabelText("delete");
    await act(async () => {
    fireEvent.click(deleteButton);
  });
  await waitFor(() => {
    expect(mockRemoveDevice).toHaveBeenCalledWith(deviceProps.name);
  });
});

  it("updates brightness via slider input", async () => {
    const { getByLabelText } = render(<LightDevice device={deviceProps} />, {
      wrapper: Wrapper,
    });
    const slider = getByLabelText("brightness");
    await act(async () => {
    fireEvent.change(slider, { target: { value: "30" } });
  });
    await waitFor(() => {
      expect(mockControlLight).toHaveBeenCalledWith(deviceProps.name, {
        brightness: 30,
      });
    });
  });

  it("triggers color picker and handles color change", async () => {
    const { getByText, getByRole } = render(
      <LightDevice device={deviceProps} />,
      { wrapper: Wrapper }
    );
    const colorButton = getByText(deviceProps.color);
    await act(async () => {
    fireEvent.click(colorButton);
  });
    expect(ChromePicker).toHaveBeenCalled();
    await act(async () => {
    ChromePicker.mock.calls[0][0].onChangeComplete({ hex: "#000000" });
  });
    await waitFor(() => {
      expect(mockControlLight).toHaveBeenCalledWith(deviceProps.name, {
        color: "#000000",
      });
    });
  });
});
