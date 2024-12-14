import React, { useState, useContext  } from "react";
import { Form, FormGroup, Label, Input, Button, Alert, Spinner } from "reactstrap";
import UserContext from "../UserContext";
import { useNavigate, Navigate } from "react-router-dom";
import "./LoginForm.css"

const LoginForm = () => {
  const { currentUser, login, errorMessages} = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
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
    // Clear the specific field error when user changes the input
    if (formError[name]) {
      setFormError({ ...formError, [name]: undefined });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start spinner
    try{
      const success = await login(formData);
      if (success) {
        navigate("/"); // Redirect after successful login
      }
    } catch(error){
      setFormError(error);
    } finally{
      setLoading(false);
    }
     
  };

  if(currentUser){
    return <Navigate to="/"/>;
  }

  return (
    <div className="Login">
      <h1>Log In</h1>
      
      {loading && (
        <div className="text-center">
          <Spinner color="primary" />
        </div>
      )} {/* Display spinner when loading is true */}

      {/* Display error message if there's an error */}
       {formError.general && <Alert color="danger" >{formError.general}</Alert>}

      <Form  onSubmit={handleSubmit}>
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

        <Button type="submit" color="primary" block disabled={loading}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default LoginForm;
