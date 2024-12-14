import React, { useState, useContext } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
  Spinner,
  Alert
} from "reactstrap";
import UserContext from "../UserContext";
import { useNavigate } from "react-router-dom";
import "./AddDeviceForm.css";

const AddDeviceForm = () => {
  const { addDevice } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: "",
    serial_number: "",
    type: "",
    room: "",
    status: "",
  });

  const navigate = useNavigate();

  const [formError, setFormError] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
    // Clear the specific field error when user changes the input
    if (formError[name]) {
      setFormError({ ...formError, [name]: undefined });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start spinner
    try {
      const success = await addDevice(formData);
      if (success) {
        navigate("/"); // Redirect after successful device addition
      }
    } catch (error) {
      setFormError(error); // Set form errors based on the error object received
    } finally {
      setLoading(false); // Stop spinner regardless of the outcome
    }
  };

  return (
    <div className="AddDeviceForm">
      <h2>Add Device Form</h2>
      {loading && <div className="text-center"><Spinner color="primary" /></div>}
      {/* Display a general error message if there is one */}
       {formError.general && <Alert color="danger" >{formError.general}</Alert>}
      <Form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) => (
          <FormGroup key={key}>
            <Label for={key}>{key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
            <Input
              type="text"
              bsSize="lg"
              name={key}
              id={key}
              value={value}
              onChange={handleChange}
              invalid={!!formError[key]}
              required
            />
            <FormFeedback>{formError[key]}</FormFeedback>
          </FormGroup>
        ))}

        <Button
          type="submit"
          size="lg"
          color="primary"
          block
          disabled={loading}
        >
          ADD
        </Button>
      </Form>
    </div>
  );
};

export default AddDeviceForm;
