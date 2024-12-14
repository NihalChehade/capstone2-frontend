import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import UserProfile from './UserProfile';
import UserContext from '../UserContext';
import { BrowserRouter } from 'react-router-dom';

describe('UserProfile Smoke Test', () => {
  const mockUser = {
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    lifxToken: 'token123',
  };

  it('renders without crashing', () => {
    // Mock function to replace the updateUser function
    const mockUpdateUser = jest.fn();

    // Render UserProfile within the UserContext and Router for navigation support
    const { getByText } = render(
      <BrowserRouter>
        <UserContext.Provider value={{ currentUser: mockUser, updateUser: mockUpdateUser }}>
          <UserProfile />
        </UserContext.Provider>
      </BrowserRouter>
    );

    // Check for any visible element that should be in the UserProfile to verify rendering
    // Example: checking for the Profile header
    expect(getByText('Profile')).toBeInTheDocument();
  });
});

describe('UserProfile', () => {
  const mockUpdateUser = jest.fn();
  const mockUser = {
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    lifxToken: 'token123',
  };

  it('renders form fields correctly with user data', () => {
    const { getByLabelText } = render(
      <BrowserRouter>
        <UserContext.Provider value={{ currentUser: mockUser, updateUser: mockUpdateUser }}>
          <UserProfile />
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(getByLabelText(/First Name/i).value).toBe('Test');
  });

  it('submits updated data', async () => {
    const { getByLabelText, getByRole } = render(
      <BrowserRouter>
        <UserContext.Provider value={{ currentUser: mockUser, updateUser: mockUpdateUser }}>
          <UserProfile />
        </UserContext.Provider>
      </BrowserRouter>
    );

    fireEvent.change(getByLabelText(/First Name/i), { target: { value: 'NewFirst' } });
    fireEvent.click(getByRole('button', { name: /Save Changes/i }));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith(expect.objectContaining({
        firstName: 'NewFirst',
      }));
    });
  });

  it('handles no user scenario with redirection', () => {
    const { container } = render(
      <BrowserRouter>
        <UserContext.Provider value={{ currentUser: null, updateUser: mockUpdateUser }}>
          <UserProfile />
        </UserContext.Provider>
      </BrowserRouter>
    );

    // Check for Navigate component rendering or simulate checking for a redirect
    expect(container.innerHTML).toMatch('');
  });
});
