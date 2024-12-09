import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import UserContext from "./UserContext";
import { jwtDecode } from "jwt-decode";
import HomeAutomationApi from "./api";
import SideBar from "./components/SideBar";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import AddDeviceForm from "./components/AddDeviceForm";
import UserProfile from "./components/UserProfile";
import Instructions from "./components/Instructions";
import Logout from "./components/Logout";
import PrivateRoute from "./components/PrivateRoute"; // A component to handle private routes
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [token, setToken] = useState(null); // Store token in state
  const [currentUser, setCurrentUser] = useState(null); // Store current user info in state
  const [devices, setDevices] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        jwtDecode(storedToken); // Validates token and throws an error if invalid
        HomeAutomationApi.token = storedToken;
        setToken(storedToken);
      } catch (err) {
        console.error("Invalid token in localStorage, clearing...", err);
        localStorage.removeItem("token"); // If the token is invalid, clear it
      }
    }
  }, []);

  useEffect(() => {
    async function fetchInitialData(storedToken) {
      if (token) {
        try {
          const { username } = jwtDecode(storedToken);
          const user = await HomeAutomationApi.getUser(username);
          setCurrentUser(user);
          const devicesFetched = await HomeAutomationApi.getDevices();
          setDevices(devicesFetched);
        } catch (err) {
          console.error("Error loading user or invalid token", err);
          setCurrentUser(null);
          setToken(null);
          localStorage.removeItem("token");
        }
      } else {
        setCurrentUser(null);
        setDevices(null);
      }
    }
    fetchInitialData(token);
  }, [token]); // Run this effect whenever the token changes

  // Login function
  async function login(credentials) {
    try {
      const token = await HomeAutomationApi.login(credentials);
      if (token) {
        setToken(token);
        HomeAutomationApi.token = token;
        localStorage.setItem("token", token);
        return true;
      }
    } catch (err) {
      const errorDetail = err.response?.data.error || "Server error";
      setErrorMessages(prevErrors => ({...prevErrors, login: errorDetail}));
      console.error("Login failed: ", errorDetail);
      return false;
    } 
  }

  // Signup function
  async function signup(userData) {
    try {
      // Get token from backend after signup
      const token = await HomeAutomationApi.signup(userData);
      if (token) {
        setToken(token);
        HomeAutomationApi.token = token;
        // store the token in localStorage
        localStorage.setItem("token", token);
        return true;
      }
    } catch (err) {
      const errorDetail = err.response?.data.error || "Server error";
      setErrorMessages(prevErrors => ({...prevErrors, signup: errorDetail}));
      console.error("signup failed: ", errorDetail);
      return false;
    } 
  }
  // Function to update user information
  async function updateUser(userData) {
    try {
      const updatedUser = await HomeAutomationApi.updateProfile(
        currentUser.username,
        userData
      );
      setCurrentUser(updatedUser); // Update current user state with the response
      return true; // Return true on successful update
    } catch (err) {
      const errorDetail = err.response?.data.error || "Server error";
      setErrorMessages(prevErrors => ({...prevErrors, updateUser: errorDetail}));
      console.error("update user failed: ", errorDetail);
      return false;
    } 
  }

  // Logout function
  function logout() {
    setToken(null);
    setCurrentUser(null);
    setDevices([]);
    HomeAutomationApi.token = null;
    localStorage.removeItem("token");
  }

  // Function to add a new device
async function addDevice(deviceData) {
  try {
    const newDevice = await HomeAutomationApi.addADevice(deviceData);
    if (newDevice) {
      setDevices((devices) => [...devices, newDevice]);
      return true;
    } else {
      throw new Error("Failed to add device. Please try again.");
    }
  } catch (err) {
    // Capture any structured error message from the API and propagate it
    const errorDetail = err.message || "Adding device failed due to server error.";
    setErrorMessages(prevErrors => ({...prevErrors, addDevice: errorDetail}));
    console.error("Adding device failed: ", errorDetail);
    throw new Error(errorDetail); // Throw an error to be caught by the form
  }
}


  // remove a device function
  async function removeDevice(deviceName){
    try {
      const res = await HomeAutomationApi.removeADevice(deviceName);
      if (res.deleted) {
        setDevices((devices) =>
          devices.filter((device) => device.name !== deviceName)
        );
        return true;
      }
    } catch (err) {
      const errorDetail = err.response?.data.error || "Server error";
      setErrorMessages(prevErrors => ({...prevErrors, removeDevice: errorDetail}));
      console.error("Device removal failed: ", errorDetail);
      return false;
    } 
  }

  const controlLight = async (deviceName, action) => {
    try {
      const message = await HomeAutomationApi.controlALight(deviceName, action);
      return message;
    } catch (err) {
      console.error("Error controlling light:", err);
      throw err;
    } 
  };

  const controlLights = async (action) => {
    try {
      const message = await HomeAutomationApi.controlLights(action);
      return message;
    } catch (err) {
      console.error("Error controlling multiple lights:", err);
      throw err;
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        devices,
        setDevices,
        setCurrentUser,
        addDevice,
        login,
        signup,
        logout,
        updateUser,
        removeDevice,
        controlLight,
        controlLights,
        errorMessages
      }}
    >
      <SideBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route
            path="/devices/add"
            element={
              <PrivateRoute>
                <AddDeviceForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </UserContext.Provider>
  );
}

export default App;
