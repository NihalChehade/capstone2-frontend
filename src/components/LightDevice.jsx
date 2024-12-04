
import React, { useState, useContext, useCallback } from "react";
import { Card, CardBody, CardTitle, CardText, Button, Input } from "reactstrap";
import { ChromePicker } from "react-color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import UserContext from "../UserContext";
import { debounce } from "lodash";
import "./LightDevice.css";

const LightDevice = ({ device }) => {
  const { status, brightness, color } = device;
  const { removeDevice, controlLight } = useContext(UserContext);
  const [action, setAction] = useState({ status, brightness, color });
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Handle input changes and update the backend via UserContext
  const handleChange = async (name, value) => {
    setAction((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Debounce API calls, especially for continuous inputs like sliders
    updateDevice(device.name, name, value);
  };

  // Debounced function for API calls
  const updateDevice = useCallback(
    debounce(async (deviceName, name, value) => {
      try {
        if (name === "brightness") {
          value = parseFloat(value);
        }
        await controlLight(deviceName, { [name]: value });
        console.log(`${device.name} updated successfully`);
      } catch (error) {
        console.error(`Failed to update ${device.name}:`, error);
      }
    }, 300),
    []
  ); // 300ms debounce

  // Function to handle device deletion
  const handleDelete = async () => {
    try {
      await removeDevice(device.name);
      console.log("Device removed successfully");
    } catch (error) {
      console.error("Failed to delete device:", error);
    }
  };

  return (
    <Card className="LightDevice">
      <CardBody>
        <CardTitle tag="h3">
          {device.name}
          <Button
            color="link"
            onClick={handleDelete}
            className="float-right text-danger"
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </Button>
        </CardTitle>
        <CardText>
          <Button
            color="link"
            onClick={() =>
              handleChange("status", action.status === "on" ? "off" : "on")
            }
            className="p-0"
          >
            <FontAwesomeIcon
              icon={faPowerOff}
              size="2xl"
              style={{ color: action.status === "on" ? "#2d2af4" : "#878787" }}
            />
          </Button>
        </CardText>
        <CardText>
          Brightness:
          <Input
            type="range"
            name="brightness"
            min="0"
            max="100"
            value={action.brightness}
            onChange={(e) => handleChange("brightness", e.target.value)}
          />
          {action.brightness}%
        </CardText>
        <CardText>
          Color:
          <Button
            color="link"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-0"
          >
            {action.color}
          </Button>
          {showColorPicker && (
            <ChromePicker
              color={action.color}
              onChangeComplete={(color) => handleChange("color", color.hex)}
            />
          )}
        </CardText>
      </CardBody>
    </Card>
  );
};

export default LightDevice;
