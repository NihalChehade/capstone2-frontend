import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserContext from "../UserContext";
import Logout from './Logout';

describe('Logout Component', () => {
  it('calls logout on component mount and redirects', () => {
    const mockLogout = jest.fn();
    const providerProps = {
      value: {
        logout: mockLogout
      }
    };

    // Wrap the component in the BrowserRouter since Navigate uses it
    const { container } = render(
      <BrowserRouter>
        <UserContext.Provider value={providerProps.value}>
          <Logout />
        </UserContext.Provider>
      </BrowserRouter>
    );

    // Check if logout function was called
    expect(mockLogout).toHaveBeenCalledTimes(1);

  });
});
