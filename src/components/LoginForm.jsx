import React, { useState, useContext  } from "react";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import UserContext from "../UserContext";
import { useNavigate, Navigate } from "react-router-dom";
import "./LoginForm.css"

const LoginForm = () => {
  const { currentUser, login } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
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
    const success = await login(formData);
    if (success) {
      navigate("/"); // Redirect after successful login
    } else {
      setError("Login failed.. Make sure your credentials are correct!");
    }
  };
  if(currentUser){
    return <Navigate to="/"/>;
  }

  return (
    <div className="Login">
      <h1>Log In</h1>
      
      {/* Display error message if there's an error */}
      {error && <Alert color="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="username">Username</Label>
          <Input
            type="text"
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
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <Button type="submit" color="primary" block>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default LoginForm;
