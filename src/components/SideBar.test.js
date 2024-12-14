import React from 'react';
import { BrowserRouter} from 'react-router-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SideBar from './SideBar';
import UserContext from '../UserContext';

describe('SideBar', () => {
  it('renders without crashing for guest users', () => {
    const { asFragment } = render(
      <BrowserRouter>
        <UserContext.Provider value={{ currentUser: null }}>
          <SideBar />
        </UserContext.Provider>
      </BrowserRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders without crashing for logged-in users', () => {
    const userContextValueLoggedIn = {
      currentUser: { username: 'testuser' },
    };

    const { asFragment } = render(
      <BrowserRouter>
        <UserContext.Provider value={userContextValueLoggedIn}>
          <SideBar />
        </UserContext.Provider>
      </BrowserRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('navigates to profile correctly', () => {
    const userContextValueLoggedIn = {
      currentUser: { username: 'testuser' },
    };

    render(
      <BrowserRouter>
        <UserContext.Provider value={userContextValueLoggedIn}>
          <SideBar />
        </UserContext.Provider>
      </BrowserRouter>
    );

    // Simulate a click on the "Profile" link
    fireEvent.click(screen.getByText(/Profile/i));
    // Check if the URL changes to "/profile" after clicking
    expect(window.location.pathname).toEqual('/profile');
  });
});
