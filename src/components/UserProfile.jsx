import React, { useState, useContext } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Spinner,
  FormFeedback,
} from "reactstrap";
import UserContext from "../UserContext";
import { Navigate } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = () => {
  const { currentUser, updateUser } = useContext(UserContext);
  if (!currentUser) {
    return <Navigate to="/" />;
  }

  const [formData, setFormData] = useState({
    firstName: currentUser.firstName || "",
    lastName: currentUser.lastName || "",
    email: currentUser.email || "",
    lifxToken: currentUser.lifxToken || "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));

    // Clear the specific field error when user changes the input
    if (formError[name]) {
      const newError = { ...formError };
      delete newError[name];
      setFormError(newError);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const isUpdated = await updateUser(formData);
      if (isUpdated) {
        setSuccess(true); // Indicate successful update
        setFormError({}); // Clear any errors
      }
    } catch (err) {
      setFormError(err); // Capture structured errors or general error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="UserProfile">
      <h1>Profile</h1>

      {loading && (
        <div className="text-center">
          <Spinner color="primary" />
        </div>
      )}

      {success && <Alert color="success">Profile updated successfully!</Alert>}

      {formError.general && <Alert color="danger">{formError.general}</Alert>}

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="username">Username</Label>
          <Input
            type="text"
            bsSize="lg"
            id="username"
            name="username"
            value={currentUser.username}
            disabled
          />
        </FormGroup>

        <FormGroup>
          <Label for="firstName">First Name</Label>
          <Input
            type="text"
            bsSize="lg"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            invalid={!!formError.firstName}
          />
          <FormFeedback>{formError.firstName}</FormFeedback>
        </FormGroup>

        <FormGroup>
          <Label for="lastName">Last Name</Label>
          <Input
            type="text"
            bsSize="lg"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            invalid={!!formError.lastName}
          />
          <FormFeedback>{formError.lastName}</FormFeedback>
        </FormGroup>

        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            bsSize="lg"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            invalid={!!formError.email}
          />
          <FormFeedback>{formError.email}</FormFeedback>
        </FormGroup>

        <FormGroup>
          <Label for="lifxToken">LIFX Token</Label>
          <Input
            type="text"
            bsSize="lg"
            id="lifxToken"
            name="lifxToken"
            value={formData.lifxToken}
            onChange={handleChange}
            placeholder="Enter your LIFX API Token"
            invalid={!!formError.lifxToken}
          />
          <FormFeedback>{formError.lifxToken}</FormFeedback>
        </FormGroup>

        <Button type="submit" size="lg" color="primary" block disabled={loading}>
          Save Changes
        </Button>
      </Form>
    </div>
  );
};

export default UserProfile;
