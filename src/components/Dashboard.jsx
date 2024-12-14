import React, { useContext } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import LightDevice from "./LightDevice";
import "./Dashboard.css";

function Dashboard() {
  const { currentUser, devices } = useContext(UserContext);
  const navigate = useNavigate();
 
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  const hasDevices = devices?.length > 0;
  // Functions to handle navigation
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Container className="text-center Dashboard">
      <Row className="align-items-center my-3">
        <Col>
          <h1 className="display-2 ">
            {getGreeting()}, {currentUser ? currentUser.username : "Guest"}!
          </h1>
        </Col>
      </Row>
      {currentUser ? (
        <Row>
          <Col>
            <h2>Your Devices</h2>
            {hasDevices ? (
              <Row>
                {devices.map((device) => (
                  <LightDevice key={device.serial_number} device={device} />
                ))}
              </Row>
            ) : (
              <h2>
                You have no LIFX lights registered! Please add some using <b>Add Devices</b> tab!
              </h2>
            )}
          </Col>
        </Row>
      ) : (
        <Row className="justify-content-center align-items-center">
          <Col md="8" className="text-center">
            <h1 className="display-3 text-white">
              Control Your Home, Effortlessly
            </h1>
            <p className="lead text-white">
              Experience the future of home automation today.
            </p>
            <div className="hero-buttons mt-4">
              <Button
                color="primary"
                size="lg"
                onClick={() => handleNavigate('/signup')}
              >
                Get Started
              </Button>{" "}
              <Button
                color="primary"
                size="lg"
                onClick={() => handleNavigate('/login')}
              >
                Sign In
              </Button>{" "}
              <Button
                color="secondary"
                size="lg"
                onClick={() => handleNavigate('/instructions')}
              >
                Learn More
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Dashboard;
