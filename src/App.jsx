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
import Logout from "./components/Logout";
import PrivateRoute from "./components/PrivateRoute"; // A component to handle private routes
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Instructions from "./components/Instructions";

function App() {
  const [token, setToken] = useState(null); // Store token in state
  const [currentUser, setCurrentUser] = useState(null); // Store current user info in state
  const [devices, setDevices] = useState(null);

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
    async function getCurrentUser() {
      if (token) {
        try {
          const { username } = jwtDecode(token); // Decode the token to get the username
          const user = await HomeAutomationApi.getUser(username); // Fetch user details from backend
          setCurrentUser(user); // Set the user in state

          const devicesFetched = await HomeAutomationApi.getDevices();
          setDevices(devicesFetched); // Set the devices in state
        } catch (err) {
          console.error("Error loading user or invalid token", err);
          setCurrentUser(null);
          setToken(null);
          localStorage.removeItem("token");
        }
      } else {
        setCurrentUser(null);
      }
    }
    getCurrentUser();
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
      console.error(
        "Login failed: ",
        err.response ? err.response.data.error : "Server error"
      );
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
      console.error("Signup failed", err);
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
      console.error("User update failed", err);
      return false; // Return false if there's an error
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

  // add a new device function
  async function addDevice(deviceData) {
    try {
      // Get device data after adding the device
      const newDevice = await HomeAutomationApi.addADevice(deviceData);
      if (newDevice) {
        setDevices((devices) => [...devices, newDevice]);
        return true;
      }
    } catch (err) {
      console.error("Device add failed", err);
      return false;
    }
  }


    // remove a device function
async function removeDevice(deviceName) {
  try {
    const res = await HomeAutomationApi.removeADevice(deviceName);
    if (res.deleted) {
      setDevices(devices => devices.filter(device => device.name !== deviceName));
      return true;
    }
  } catch (err) {
    console.error("Device removal failed", err);
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
        controlLights
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
