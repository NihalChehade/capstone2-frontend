import React, { useState, useContext } from "react";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import UserContext from "../UserContext";
import { useNavigate } from "react-router-dom";
import "./AddDeviceForm.css"

const AddDeviceForm = () => {
  const { addDevice } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: "",
    serial_number: "",
    type: "",
    room: "",
    status: ""
  });
  
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await addDevice(formData);
    if (success) {
      navigate("/"); // Redirect after successful device addition
    } else {
      setError("Device adding failed...try again later! ");
    }
  };

  return (
    <div className="AddDeviceForm">
      <h2>Add Device Form</h2>
      
      {/* Display error message if there's an error */}
      {error && <Alert color="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            type="text"
            bsSize="lg"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for="serial_number">Serial Number</Label>
          <Input
            type="text"
            bsSize="lg"
            name="serial_number"
            id="serial_number"
            value={formData.serial_number}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for="type">Device Type</Label>
          <Input
            type="text"
            bsSize="lg"
            name="type"
            id="type"
            value={formData.type}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for="room">Room</Label>
          <Input
            type="text"
            bsSize="lg"
            name="room"
            id="room"
            value={formData.room}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for="status">Device Status</Label>
          <Input
            type="text"
            bsSize="lg"
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <Button type="submit" size="lg" color="primary" block>
          ADD
        </Button>
      </Form>
    </div>
  );
};

export default AddDeviceForm