import React, { useState, useContext } from "react";
import { Form, FormGroup, Label, Input, Button, Alert, Spinner } from "reactstrap";
import UserContext from "../UserContext";
import { useNavigate } from "react-router-dom";
import "./AddDeviceForm.css"

const AddDeviceForm = () => {
  const { addDevice, errorMessages } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: "",
    serial_number: "",
    type: "",
    room: "",
    status: ""
  });
  
  const navigate = useNavigate();

  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true); // Start spinner
    const success = await addDevice(formData);
    setLoading(false); // Stop spinner
    if (success) {
      navigate("/"); // Redirect after successful device addition
    } else {
      // Using the error message from App's state
      setFormError(
        errorMessages.addDevice ||
          "Device adding failed... Please check your inputs and try again!"
      );
    }
  };

  return (
    <div className="AddDeviceForm">
      <h2>Add Device Form</h2>

      {loading && (
        <div className="text-center">
          <Spinner color="primary" />
        </div>
      )} {/* Display spinner when loading is true */}

      {/* Display error message if there's an error */}
      {formError && <Alert color="danger">{formError}</Alert>}

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

        <Button type="submit" size="lg" color="primary" block disabled={loading}>
          ADD
        </Button>
      </Form>
    </div>
  );
};

export default AddDeviceForm