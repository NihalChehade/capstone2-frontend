import React, { useState, useContext } from "react";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import UserContext from "../UserContext"; 
import { Navigate } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = () => {
  const { currentUser, setCurrentUser, updateUser } = useContext(UserContext); // Get current user and the function to update it
  if (!currentUser) {
    return <Navigate to="/" />;
  }

  const [formData, setFormData] = useState({
    firstName: currentUser.firstName || "",
    lastName: currentUser.lastName || "",
    email: currentUser.email || "",
    lifxToken: currentUser.lifxToken || "" // Initialize lifxToken
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      const updatedUser = await updateUser(formData); // Call the updateUser context function with form data
      if (updatedUser) {
        setCurrentUser(updatedUser); // Update currentUser in context with the updated user details
        setSuccess(true); // Set success state to true to display success message
        setError(null); // Ensure no error is shown on successful update
      } else {
        throw new Error("Update failed due to server error"); // Create an error if update returns false
      }
    } catch (err) {
      setSuccess(false); // Set success to false on catch
      setError(err.message || "Failed to update profile."); // Set error message to display
    }
  };


  return (
    <div className="UserProfile">
      <h1>Profile</h1>
      {success && <Alert>Profile updated successfully!</Alert>}
      {error && <Alert color="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="username">Username</Label>
          <Input
            type="text"
            bsSize="lg"
            id="username"
            name="username"
            value={currentUser.username}
            disabled // Username should not be editable
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
          />
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
          />
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
          />
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
          />
        </FormGroup>
        <Button type="submit" size="lg" color="primary" block>Save Changes</Button>
      </Form>
    </div>
  );
};

export default UserProfile;
