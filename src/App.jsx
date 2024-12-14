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
  const [devices, setDevices] = useState([]);

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
          const userResp = await HomeAutomationApi.getUser(username);
          setCurrentUser(userResp.user);
          const devicesResp = await HomeAutomationApi.getDevices();
          setDevices(devicesResp.devices);
        } catch (err) {
          console.error("Error loading user or invalid token", err);
          setCurrentUser(null);
          setToken(null);
          localStorage.removeItem("token");
        }
      } else {
        setCurrentUser(null);
        setDevices([]);
      }
    }
    fetchInitialData(token);
  }, [token]); // Run this effect whenever the token changes

  // Login function
  async function login(credentials) {
    try {
      const resp = await HomeAutomationApi.login(credentials);
      if (resp.token) {
        setToken(resp.token);
        HomeAutomationApi.token = resp.token;
        localStorage.setItem("token", resp.token);
        return true;
      }
    } catch (err) {
      throw err;
    }
  }

  // Signup function
  async function signup(userData) {
    try {
      // Get token from backend after signup
      const resp = await HomeAutomationApi.signup(userData);
      if (resp.token) {
        setToken(resp.token);
        HomeAutomationApi.token = resp.token;
        // store the token in localStorage
        localStorage.setItem("token", resp.token);
        return true;
      }
    } catch (err) {
      throw err;
    }
  }
  // Function to update user information
  async function updateUser(userData) {
    try {
      const resp = await HomeAutomationApi.updateProfile(
        currentUser.username,
        userData
      );
      setCurrentUser(resp.user); // Update current user state with the response
      return true; // Return true on successful update
    } catch (err) {
      throw err;
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
      if (newDevice.device) {
        setDevices((devices) => [...devices, newDevice.device]);
        return true;
      } else {
        throw new Error("Failed to add device. Please try again.");
      }
    } catch (err) {
      throw err;
    }
  }

  // remove a device function
  async function removeDevice(deviceName) {
    try {
      const res = await HomeAutomationApi.removeADevice(deviceName);
      if (res.deleted) {
        setDevices((devices) =>
          devices.filter((device) => device.name !== deviceName)
        );
        return true;
      }
    } catch (err) {      
      console.error("Device removal failed: ", err);
      return false;
    }
  }

  const controlLight = async (deviceName, action) => {
    try {
      const resp = await HomeAutomationApi.controlALight(deviceName, action);
      return resp.message;
    } catch (err) {
      console.error("Error controlling light:", err);
      throw err;
    }
  };

  const controlLights = async (action) => {
    try {
      const resp = await HomeAutomationApi.controlLights(action);
      return resp.message;
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
