import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserContext from '../UserContext';
import PrivateRoute from './PrivateRoute';

// Helper component to simulate children
const TestComponent = () => <div>Protected Content</div>;

describe('PrivateRoute', () => {
  it('renders children for authenticated users', () => {
    // Mock user context with an authenticated user
    const mockUser = { currentUser: { username: "testUser" } };

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <UserContext.Provider value={mockUser}>
          <Routes>
            <Route path="/protected" element={
              <PrivateRoute>
                <TestComponent />
              </PrivateRoute>
            }/>
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it('redirects to login for unauthenticated users', () => {
    // Mock user context with no authenticated user
    const mockUser = { currentUser: null };

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <UserContext.Provider value={mockUser}>
          <Routes>
            <Route path="/protected" element={
              <PrivateRoute>
                <TestComponent />
              </PrivateRoute>
            }/>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </UserContext.Provider>
      </MemoryRouter>
    );

    // The test checks if the login page is rendered instead of the protected content
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
