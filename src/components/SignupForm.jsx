import React, { useState, useContext } from "react";
import { Form, FormGroup, Label, Input, Button, Spinner, FormFeedback, Alert } from "reactstrap";
import UserContext from "../UserContext";
import { useNavigate } from "react-router-dom";
import "./SignupForm.css";

const SignupForm = () => {
  const { signup } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    lifxToken: "",
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
      const newError = { ...formError };
      delete newError[name];
      setFormError(newError);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start spinner

    try {
      const success = await signup(formData);
      if (success) {
        navigate("/"); // Redirect after successful signup
      }
    } catch (error) {
      setFormError(error); // Capture errors (general or field-specific)
    } finally {
      setLoading(false); // Stop spinner
    }
  };

  return (
    <div className="Signup">
      <h2>Signup Form</h2>

      {loading && (
        <div className="text-center">
          <Spinner color="primary" />
        </div>
      )}

      {formError.general && <Alert color="danger" >{formError.general}</Alert>}

      <Form role="form" onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="username">Username</Label>
          <Input
            type="text"
            bsSize="lg"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            invalid={!!formError.username}
            required
          />
          <FormFeedback>{formError.username}</FormFeedback>
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
            invalid={!!formError.password}
            required
          />
          <FormFeedback>{formError.password}</FormFeedback>
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
            invalid={!!formError.firstName}
            required
          />
          <FormFeedback>{formError.firstName}</FormFeedback>
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
            invalid={!!formError.lastName}
            required
          />
          <FormFeedback>{formError.lastName}</FormFeedback>
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
            invalid={!!formError.email}
            required
          />
          <FormFeedback>{formError.email}</FormFeedback>
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
            invalid={!!formError.lifxToken}
            required
          />
          <FormFeedback>{formError.lifxToken}</FormFeedback>
        </FormGroup>

        <Button type="submit" size="lg" color="primary" block disabled={loading}>
          Signup
        </Button>
      </Form>
    </div>
  );
};

export default SignupForm;
