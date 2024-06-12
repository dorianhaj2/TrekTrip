// src/__tests__/Profile.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import {act} from 'react';
import { MemoryRouter } from 'react-router-dom'; // Use MemoryRouter for testing routes
import Profile from '../Pages/Profile/Profile';
import { AuthProvider, useAuth } from '../context/AuthContext'; // adjust path as needed

jest.mock('../context/AuthContext', () => ({
    ...jest.requireActual('../context/AuthContext'), // use the actual implementation for AuthProvider
    useAuth: () => ({ isLoggedIn: true, login: jest.fn(), logout: jest.fn() }), // adjust this based on your test scenario
  }));

// Mocking useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
}));

// Mocking useNavigate and useAuth hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useAuth: () => ({ isLoggedIn: true }),
}));

// Mock axiosInstance methods
jest.mock('../axios/axiosInstance', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
}));

describe('Profile Component', () => {
    test('renders loading text initially', async () => {
        await act(async () => {
            render(
                <AuthProvider>
                    <Profile />
                </AuthProvider>,
            );
        });
        await waitFor(() => {
            expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
        });
    });

  test('renders profile information when user data is loaded', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      image: { url: '/path/to/image.jpg' },
      description: 'Lorem ipsum',
    };

    // Mock axiosInstance.get to return mockUser data
    require('../axios/axiosInstance').get.mockResolvedValueOnce({ data: mockUser });

    render(<Profile />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText(/testuser/i)).toBeInTheDocument();
      expect(screen.getByAltText('Profile')).toBeInTheDocument();
      expect(screen.getByText(/Lorem ipsum/i)).toBeInTheDocument();
    });
  });

  test('renders no user data available message when user is null', () => {
    require('../axios/axiosInstance').get.mockResolvedValueOnce({ data: null });

    render(<Profile />, { wrapper: MemoryRouter });

    expect(screen.getByText(/No user data available/i)).toBeInTheDocument();
  });

  // Add more tests as needed for different scenarios and interactions
});
