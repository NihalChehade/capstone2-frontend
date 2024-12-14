import React from 'react';
import { render } from '@testing-library/react';
import Instructions from './Instructions';

// Mock navigate function
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

describe('Instructions', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<Instructions />);
    expect(getByText(/Welcome to Your Smart Light Dashboard/i)).toBeInTheDocument();
    expect(getByText(/Important Initial Step/i)).toBeInTheDocument();
    expect(getByText(/Using the Dashboard/i)).toBeInTheDocument();
  });

  it('displays step-by-step instructions correctly', () => {
    const { getByText } = render(<Instructions />);
    expect(getByText(/Create LIFX Account:/i)).toBeInTheDocument();
    expect(getByText(/Obtain LIFX Token:/i)).toBeInTheDocument();
    expect(getByText(/Sign Up on Our Dashboard:/i)).toBeInTheDocument();
  });

  it('contains navigation button to dashboard', () => {
    const { getByText } = render(<Instructions />);
    const button = getByText(/Go to Dashboard/i);
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it('renders correctly', () => {
    const { asFragment } = render(    
        <Instructions />     
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
