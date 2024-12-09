import React, { useState, useContext } from "react";
import { Form, FormGroup, Label, Input, Button, Alert, Spinner  } from "reactstrap";
import UserContext from "../UserContext";
import { useNavigate } from "react-router-dom";
import "./SignupForm.css"

const SignupForm = () => {
  const { signup, errorMessages } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    lifxToken: ""  
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
    const success = await signup(formData);
    setLoading(false); // Stop spinner
    if (success) {
      navigate("/"); // Redirect after successful signup
    } else {
      // Using the error message from App's state
      setFormError(errorMessages.signup || "Signup failed. Please check your inputs and try again.");
    }
  };

  return (
    <div className="Signup">
      <h2>Signup Form</h2>
      
      {loading && (
        <div className="text-center">
          <Spinner color="primary" />
        </div>
      )} {/* Display spinner when loading is true */}

      {/* Display error message if there's an error */}
      {formError && <Alert color="danger">{formError}</Alert>}

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="username">Username</Label>
          <Input
            type="text"
            bsSize="lg"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            type="password"
            bsSize="lg"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for="firstName">First Name</Label>
          <Input
            type="text"
            bsSize="lg"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for="lastName">Last Name</Label>
          <Input
            type="text"
            bsSize="lg"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            bsSize="lg"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for="lifxToken">LIFX Token</Label>
          <Input
            type="text"
            bsSize="lg"
            name="lifxToken"
            id="lifxToken"
            value={formData.lifxToken}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <Button type="submit" size="lg" color="primary" block disabled={loading}>
          Signup
        </Button>
      </Form>
    </div>
  );
};

export default SignupForm;
