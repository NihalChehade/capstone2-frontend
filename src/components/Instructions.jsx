import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
} from "reactstrap";

const Instructions = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/"); // Navigate to the dashboard
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col>
          <Card>
            <CardBody>
              <CardTitle tag="h1">
                Welcome to Your Smart Light Dashboard
              </CardTitle>
              <CardText>
                This platform allows you to control your LIFX lights from
                anywhere, enabling you to adjust the brightness, change colors,
                and switch your lights on or off with ease. Enhance your home
                lighting experience with intuitive controls designed for
                simplicity and convenience.
              </CardText>
              <CardTitle tag="h3">Getting Started</CardTitle>
              <CardText>
                Follow these steps to set up your account and start controlling
                your lights:
                <ol>
                  <li>
                    <strong>Sign Up:</strong> Visit our website and click the
                    "Signup" link to create a new account.
                  </li>
                  <li>
                    <strong>Complete the Registration Form:</strong> Provide
                    your email, create a password, and fill in your personal
                    details.
                  </li>
                  <li>
                    <strong>Log In:</strong> Use your new credentials to log
                    into the dashboard.
                  </li>
                </ol>
              </CardText>
              <CardTitle tag="h3">Adding Your LIFX Lights</CardTitle>
              <CardText>
                To integrate your LIFX lights with our dashboard, ensure each
                light is first registered and connected to the LIFX cloud via
                the LIFX mobile application:
                <ol>
                  <li>
                    <strong>Create LIFX Account:</strong> If not already done,
                    download the LIFX app and create an account.
                  </li>
                  <li>
                    <strong>Register Your Lights:</strong> Follow the app
                    instructions to connect your lights to your Wi-Fi network
                    and register them with your LIFX account.
                  </li>
                  <li>
                    <strong>Ensure Cloud Connectivity:</strong> Confirm that
                    your lights are connected to the cloud and controllable via
                    the LIFX app.
                  </li>
                  <li>
                    <strong>Add Lights to Dashboard:</strong> Once confirmed,
                    navigate to the "Add Device" section in our dashboard and
                    enter the required information for each light.
                  </li>
                </ol>
              </CardText>
              <CardTitle tag="h3">Using the Dashboard</CardTitle>
              <CardText>
                Learn how to interact with your lights through the dashboard:
                <ul>
                  <li>
                    <strong>Home Overview:</strong> View all connected lights
                    and their current status.
                  </li>
                  <li>
                    <strong>Light Control:</strong>
                    <ul>
                      <li>
                        <strong>Power:</strong> Click the power icon next to
                        each light to turn it on or off.
                      </li>
                      <li>
                        <strong>Brightness:</strong> Adjust the brightness
                        slider to increase or decrease light intensity.
                      </li>
                      <li>
                        <strong>Color:</strong> Click on the color preview next
                        to each light to open a color picker and select a new
                        color.
                      </li>
                    </ul>
                  </li>
                </ul>
              </CardText>

              <Button color="primary" onClick={handleNavigate}>
                Go to Dashboard
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Instructions;
