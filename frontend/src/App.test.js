import React from 'react';
import { render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PrivateRoute, PublicRoute } from './App';

// Mocking AuthProvider with mock context values
const MockedAuthProvider = ({ children, isLoggedIn }) => {
  const value = {
    isLoggedIn,
    login: jest.fn(),
    logout: jest.fn()
  };

  return (
    <AuthProvider value={value}>
      <HashRouter>
        {children}
      </HashRouter>
    </AuthProvider>
  );
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to }) => <div>{`Redirected to ${to}`}</div>,
}));

describe('PrivateRoute', () => {
  test('renders children when user is logged in', () => {
    render(
      <MockedAuthProvider isLoggedIn={true}>
        <PrivateRoute>
          <div data-testid="private-content">Private Content</div>
        </PrivateRoute>
      </MockedAuthProvider>
    );

    expect(screen.getByTestId('private-content')).toBeInTheDocument();
  });

  test('redirects to /prijava when user is not logged in', () => {
    render(
      <MockedAuthProvider isLoggedIn={false}>
        <PrivateRoute>
          <div data-testid="private-content">Private Content</div>
        </PrivateRoute>
      </MockedAuthProvider>
    );

    expect(screen.getByText('Redirected to /prijava')).toBeInTheDocument();
  });
});

describe('PublicRoute', () => {
  test('renders children when user is not logged in', () => {
    render(
      <MockedAuthProvider isLoggedIn={false}>
        <PublicRoute>
          <div data-testid="public-content">Public Content</div>
        </PublicRoute>
      </MockedAuthProvider>
    );

    expect(screen.getByTestId('public-content')).toBeInTheDocument();
  });

  test('redirects to /profil when user is logged in', () => {
    render(
      <MockedAuthProvider isLoggedIn={true}>
        <PublicRoute>
          <div data-testid="public-content">Public Content</div>
        </PublicRoute>
      </MockedAuthProvider>
    );

    expect(screen.getByText('Redirected to /profil')).toBeInTheDocument();
  });
});
