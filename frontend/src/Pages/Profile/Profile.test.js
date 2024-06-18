import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance';
import Profile from './Profile';
import { AuthContext } from '../../context/AuthContext';

// Mock AuthContext for testing purposes
const mockAuthContextValue = {
    isLoggedIn: true,
};

// Mock useAuth hook
jest.mock('../../context/AuthContext', () => ({
    useAuth: () => mockAuthContextValue,
}));

// Mock axiosInstance for testing purposes
jest.mock('../../axios/axiosInstance', () => ({
    get: jest.fn(),
}));

describe('Profile Component', () => {
  beforeEach(() => {
    // Mock axiosInstance responses
    axiosInstance.get.mockImplementation((url) => {
        switch (url) {
            case '/user/all':
                return Promise.resolve({
                    data: [{ id: 1, username: 'testuser' }],
                });
            case '/user/1':
                return Promise.resolve({
                    data: {
                        username: 'testuser',
                        description: 'Test user description',
                        image: { url: '/test-image.jpg' },
                    },
                });
            case '/trip/all':
                return Promise.resolve({
                    data: [
                        { id: 1, ratings: [{ rating: 4 }, { rating: 5 }] },
                        { id: 2, ratings: [{ rating: 3 }, { rating: 2 }] },
                        { id: 3, ratings: [{ rating: 5 }] },
                    ],
                });
            default:
                return Promise.reject(new Error('Unhandled request: ' + url));
        }
    });

        render(
            <Router>
                <Profile />
            </Router>
        );
    });

    it('redirects to login page when not logged in', async () => {
        // Update AuthContext to simulate not logged in state
        mockAuthContextValue.isLoggedIn = false;

        // Re-render component
        render(
            <Router>
                <Profile />
            </Router>
        );

        // Expect to be redirected to login page
        await waitFor(() => {
            expect(window.location.pathname).toBe('/prijava');
        });
    });

    it('renders loading state initially and then user profile after data fetch', async () => {
      render(<Profile />);

      // Assert loading state initially
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Wait for data to load (you can use waitFor if needed)
      await screen.findByText('testuser'); // Replace with actual expected content

      // Assert user profile information is rendered
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByAltText('Profile')).toBeInTheDocument(); // Example alt text for profile image
      expect(screen.getByText('Lorem ipsum dolor sit amet')).toBeInTheDocument(); // Example expected description text
      expect(screen.getByText('Trip 1')).toBeInTheDocument(); // Example expected trip name

      // Assert top trips are rendered
      expect(screen.getByText('Trip 1')).toBeInTheDocument();
      expect(screen.getByText('Trip 2')).toBeInTheDocument();
      expect(screen.getByText('Trip 3')).toBeInTheDocument();
  });

    it('displays user profile information when logged in', async () => {
      // Wait for loading to transition from true to false
      await waitFor(() => {
          expect(screen.queryByText('Loading...')).toBeNull();
      });

      // Expect profile page to be displayed
      expect(screen.getByText('testuser')).toBeInTheDocument(); // Assuming 'testuser' is the username displayed
      expect(screen.getByAltText('Profile')).toBeInTheDocument(); // Assuming 'Profile' is the alt text for the profile image
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
      expect(screen.getByText('Add Trip')).toBeInTheDocument();
      expect(screen.getByText('Test user description')).toBeInTheDocument(); // Assuming 'Test user description' is the description displayed
      expect(screen.getByText('Top Trips')).toBeInTheDocument();
      expect(screen.getAllByTestId('highlighted-trip-card')).toHaveLength(3); // Assuming HighlightedTripCard has a testId 'highlighted-trip-card'
  });

    it('handles error when fetching user data', async () => {
        // Mock axiosInstance.get to throw an error
        axiosInstance.get.mockRejectedValueOnce(new Error('Failed to fetch user data'));

        // Re-render component to trigger data fetching
        render(
            <Router>
                <Profile />
            </Router>
        );

        // Expect error message to be logged
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith('Error fetching user:', expect.any(Error));
        });

        // Expect error message to be displayed to the user
        expect(screen.getByText('No user data available')).toBeInTheDocument();
    });

    it('navigates to Edit Profile page when Edit Profile button is clicked', async () => {
        // Wait for user data to be fetched and displayed
        await waitFor(() => {
            expect(screen.getByText('testuser')).toBeInTheDocument();
        });

        // Click Edit Profile button
        const editProfileButton = screen.getByText('Edit Profile');
        userEvent.click(editProfileButton);

        // Expect navigation to '/uredi-profil'
        expect(window.location.pathname).toBe('/uredi-profil');
    });

    it('navigates to Add Trip page when Add Trip button is clicked', async () => {
        // Wait for user data to be fetched and displayed
        await waitFor(() => {
            expect(screen.getByText('testuser')).toBeInTheDocument();
        });

        // Click Add Trip button
        const addTripButton = screen.getByText('Add Trip');
        userEvent.click(addTripButton);

        // Expect navigation to '/dodaj-put'
        expect(window.location.pathname).toBe('/dodaj-put');
    });
});
