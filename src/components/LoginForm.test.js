import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter, useNavigate  } from 'react-router-dom';
import UserContext from "../UserContext";
import LoginForm from './LoginForm';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('LoginForm', () => {
  let mockNavigate;
  const mockLogin = jest.fn();
  
  beforeEach(() => {
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  const providerProps = {
    currentUser: null,
    login: mockLogin
  };

  const Wrapper = ({ children }) => (
    <UserContext.Provider value={providerProps}>
      <BrowserRouter>{children}</BrowserRouter>
    </UserContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing and matches snapshot', () => {
    const { asFragment } = render(<LoginForm />, { wrapper: Wrapper });
    expect(asFragment()).toMatchSnapshot();
  });

  it('submits the form with entered values', async () => {
    mockLogin.mockResolvedValue(true);
    const { getByLabelText, getByRole } = render(<LoginForm />, { wrapper: Wrapper });

    fireEvent.change(getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123'
    }));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it('displays error message on failed login', async () => {
   
    mockLogin.mockRejectedValueOnce({general:'Invalid credentials'});
    const { getByLabelText, getByRole, findByText } = render(<LoginForm />, { wrapper: Wrapper });

    fireEvent.change(getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(getByRole('button', { name: /submit/i }));

    const errorMessage = await findByText(/invalid credentials/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('redirects if user is already logged in', () => {
    const { container } = render(
      <UserContext.Provider value={{ ...providerProps, currentUser: { name: 'John Doe' } }}>
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      </UserContext.Provider>
    );
    expect(container.innerHTML).toBe("");
  });
});
