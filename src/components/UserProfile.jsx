import React, { useState, useContext } from "react";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import UserContext from "../UserContext"; 
import JoblyApi from "../api";
import {  Navigate } from "react-router-dom";
import "./UserProfile.css"
const UserProfile = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext); // Get current user and the function to update it
  if(!currentUser){
    return <Navigate to="/"/>;
  }
  const [formData, setFormData] = useState({
    firstName: currentUser.firstName || "",
    lastName: currentUser.lastName || "",
    email: currentUser.email || ""
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
    e.preventDefault();
    try {
      const updatedUser = await JoblyApi.updateProfile(currentUser.username, formData);
      setCurrentUser(updatedUser); 
      setSuccess(true);
    } catch (err) {
      console.error("Error updating profile", err);
      setError("Profile update failed");
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
       
        <Button type="submit" size="lg" color="primary" block>Save Changes</Button>
      </Form>
    </div>
  );
};

export default UserProfile;
