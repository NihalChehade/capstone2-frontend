import React, { useState, useCallback } from "react";
import { Card, CardBody, CardTitle, CardText, Button, Badge, Input } from "reactstrap";
import { ChromePicker } from "react-color";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons'; 
import { debounce } from 'lodash';
import HomeAutomationApi from '../api';
import "./LightDevice.css";

const LightDevice = ({ device }) => {
  const { name, type, room, status, brightness, color } = device;
  const [action, setAction] = useState({ name, type, room, status, brightness, color });
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Handle input changes and update the backend
  const handleChange = async (name, value) => {
    setAction(prev => ({
      ...prev,
      [name]: value
    }));

    // Debounce API calls, especially for continuous inputs like sliders
    updateDevice(action.name, name, value);
  };

  // Debounced function for API calls
  const updateDevice = useCallback(debounce(async (deviceName, name, value) => {
    try {
      if(name === "brightness"){
        value = parseFloat(value);
      }
      const response = await HomeAutomationApi.controlALight(deviceName, { [name]: value });
      console.log(`${name} updated:`, response);
    } catch (error) {
      console.error(`Failed to update ${name}:`, error);
    }
  }, 300), []);  // 300ms debounce

  return (
    <Card className="LightDevice">
      <CardBody>
        <CardTitle tag="h3">{name}</CardTitle>
        <CardText>
          <Button color="link" onClick={() => handleChange('status', action.status === 'on' ? 'off' : 'on')} className="p-0">
            <FontAwesomeIcon 
              icon={faPowerOff} 
              size="2xl" 
              style={{ color: action.status === 'on' ? '#2d2af4' : '#878787' }} 
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
            onChange={(e) => handleChange('brightness', e.target.value)}
          />
          {action.brightness}%
        </CardText>
        <CardText>
          Color:
          <Button color="link" onClick={() => setShowColorPicker(!showColorPicker)} className="p-0">
            {action.color}
          </Button>
          {showColorPicker && (
            <ChromePicker
              color={action.color}
              onChangeComplete={(color) => handleChange('color', color.hex)}
            />
          )}
        </CardText>
      </CardBody>
    </Card>
  );
};

export default LightDevice;
