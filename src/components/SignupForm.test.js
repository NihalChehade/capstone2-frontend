import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter  } from 'react-router-dom';
import UserContext from '../UserContext';
import SignupForm from './SignupForm';

// Mock the navigation
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // preserve other exports from react-router-dom
  useNavigate: () => mockNavigate, // override useNavigate with a mock function
}));

describe('SignupForm', () => {
  const mockSignup = jest.fn();

  beforeEach(() => {
    mockSignup.mockClear();
    mockNavigate.mockClear();
  });


  it('renders correctly', () => {
    const { getByLabelText } = render(
      <BrowserRouter>
        <UserContext.Provider value={{ signup: mockSignup }}>
          <SignupForm />
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(getByLabelText(/username/i)).toBeInTheDocument();
    expect(getByLabelText(/password/i)).toBeInTheDocument();
    expect(getByLabelText(/first name/i)).toBeInTheDocument();
    expect(getByLabelText(/last name/i)).toBeInTheDocument();
    expect(getByLabelText(/email/i)).toBeInTheDocument();
    expect(getByLabelText(/lifx token/i)).toBeInTheDocument();
  });

  it('submits the form with correct values', async () => {
    const { getByLabelText, getByRole } = render(
      <BrowserRouter>
        <UserContext.Provider value={{ signup: mockSignup }}>
          <SignupForm />
        </UserContext.Provider>
      </BrowserRouter>
    );

    fireEvent.change(getByLabelText(/username/i), { target: { value: 'newuser' } });
    fireEvent.change(getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.submit(getByRole('form'));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        username: 'newuser',
        password: 'password123',
        firstName: '',
        lastName: '',
        email: 'test@example.com',
        lifxToken: '',
      });
    });
  });


  it('displays an error message on signup failure', async () => {
    const errorMessage = "Signup failed due to server error";
    mockSignup.mockRejectedValueOnce({ general: errorMessage });

    const { getByRole, findByText } = render(
      <BrowserRouter>
        <UserContext.Provider value={{ signup: mockSignup }}>
          <SignupForm />
        </UserContext.Provider>
      </BrowserRouter>
    );

    fireEvent.submit(getByRole('form'));

    const alertMessage = await findByText(errorMessage);
    expect(alertMessage).toBeInTheDocument();
  });

  it('navigates on successful signup', async () => {
    mockSignup.mockResolvedValueOnce(true); // Simulate a successful signup

    const { getByRole } = render(
      <BrowserRouter>
        <UserContext.Provider value={{ signup: mockSignup }}>
          <SignupForm />
        </UserContext.Provider>
      </BrowserRouter>
    );

    fireEvent.submit(getByRole('form')); // assuming the form has a role of 'form'

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});

