import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import UserContext from './UserContext';
import HomeAutomationApi from './api'; 

jest.mock('./api', () => ({
  login: jest.fn(),
  logout: jest.fn(),
  signup: jest.fn(),
  getUser: jest.fn(),
  getDevices: jest.fn(),
  addADevice: jest.fn(),
  controlALight: jest.fn(),
  controlLights: jest.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    HomeAutomationApi.login.mockResolvedValue({ token: 'fakeToken123' });
    HomeAutomationApi.signup.mockResolvedValue({ token: 'fakeToken123' });
    HomeAutomationApi.getUser.mockResolvedValue({ user: { username: 'testuser' } });
    HomeAutomationApi.getDevices.mockResolvedValue({ devices: [] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing and ensures navigation works for unauthorized access', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Assert that login is shown when not logged in
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });


  it('redirects to SignUp', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Navigate to Signup form
    fireEvent.click(screen.getByText(/SignUp/i));
    await waitFor(() => expect(screen.getByText(/Signup Form/i)).toBeInTheDocument());
  });
});
