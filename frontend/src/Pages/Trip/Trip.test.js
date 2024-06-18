import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Trip from './Trip';
import tripService from '../../Services/tripService/tripService';
import axiosInstance from '../../axios/axiosInstance';

jest.mock('../../Services/tripService/tripService');
jest.mock('../../axios/axiosInstance');

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: key => key }),
  }));

describe('Trip Component', () => {
  const mockTrip = {
    id: 1,
    title: 'Trip Title',
    description: 'Trip Description',
    user: { username: 'User1', id: 1 },
    locations: [{ country: { name: 'Country1' }, destination: 'Destination1' }],
    tripMonth: 'January',
    lengthInDays: 5,
    price: 100,
    ratings: [{ user: { id: 1 }, rating: 4 }, { user: { id: 2 }, rating: 5 }],
    comments: [{ id: 1, user: { username: 'User2' }, content: 'Comment Content', timeOfPosting: '2023-06-15T10:30:00' }],
    images: [{ url: '/image-url' }],
  };

  beforeEach(() => {
    tripService.getTripById.mockResolvedValue({ data: mockTrip });
    axiosInstance.get.mockResolvedValue({ data: [{ id: 1, trip: { id: 1 }, title: 'Day Title', text: 'Day Text' }] });
    axiosInstance.get.mockResolvedValueOnce({ data: [{ id: 1, username: 'User1' }] });
    // Mock existing ratings
    axiosInstance.get.mockResolvedValueOnce({ data: [{ user: { id: 1 }, rating: 4 }] });
  });

  it('renders loading state initially', () => {
    render(
      <MemoryRouter initialEntries={['/trip/1']}>
        <Routes>
          <Route path="/trip/:id" element={<Trip />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('displays error message when trip fetch fails', async () => {
    const errorMessage = 'Error fetching trip data.';
    tripService.getTripById.mockRejectedValue(new Error(errorMessage));

    render(
      <MemoryRouter initialEntries={['/trip/1']}>
        <Routes>
          <Route path="/trip/:id" element={<Trip />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('renders trip details after successful data fetch', async () => {
    render(
      <MemoryRouter initialEntries={['/trip/1']}>
        <Routes>
          <Route path="/trip/:id" element={<Trip />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(mockTrip.title)).toBeInTheDocument();
      expect(screen.getByText(`trip.author: ${mockTrip.user.username}`)).toBeInTheDocument();
      expect(screen.getByText(mockTrip.description)).toBeInTheDocument();
      expect(screen.getByText(`trip.country: ${mockTrip.locations[0].country.name}`)).toBeInTheDocument();
      expect(screen.getByText(`trip.destination: ${mockTrip.locations[0].destination}`)).toBeInTheDocument();
      expect(screen.getByText(`trip.onth: ${mockTrip.tripMonth}`)).toBeInTheDocument();
      expect(screen.getByText(`trip.duration: ${mockTrip.lengthInDays} days`)).toBeInTheDocument();
      expect(screen.getByText(`trip.price: ${mockTrip.price} €`)).toBeInTheDocument();
    });
  });

  it('sets authentication and ratings state when user is logged in', async () => {
    // Mock localStorage getItem to return a username
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValueOnce('User1');

    render(
      <MemoryRouter initialEntries={['/trip/1']}>
        <Route path="/trip/:id">
          <Trip />
        </Route>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(mockTrip.title)).toBeInTheDocument();
      expect(screen.getByText(`trip.author: ${mockTrip.user.username}`)).toBeInTheDocument();
      expect(screen.getByText(mockTrip.description)).toBeInTheDocument();
      expect(screen.getByText(`trip.country: ${mockTrip.locations[0].country.name}`)).toBeInTheDocument();
      expect(screen.getByText(`trip.destination: ${mockTrip.locations[0].destination}`)).toBeInTheDocument();
      expect(screen.getByText(`trip.onth: ${mockTrip.tripMonth}`)).toBeInTheDocument();
      expect(screen.getByText(`trip.duration: ${mockTrip.lengthInDays} days`)).toBeInTheDocument();
      expect(screen.getByText(`trip.price: ${mockTrip.price} €`)).toBeInTheDocument();

      // Assert on isLoggedIn state
      expect(screen.getByText('Average Rating: 4.5')).toBeInTheDocument(); // Assuming average rating calculation

      // Assert on user rating and hasRated state
      // Example assertion assuming the component displays the user's rating
      expect(screen.getByText('Your Rating: 4')).toBeInTheDocument(); // Assuming user's rating is displayed
    });
  });

  it('updates rating and disables rating input after rating', async () => {
    render(
      <MemoryRouter initialEntries={['/trip/1']}>
        <Routes>
          <Route path="/trip/:id" element={<Trip trip={mockTrip} />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      // Simulate user clicking on the Rating component
      const ratingElement = screen.getByRole('img', { name: /4\.5 Stars/i }); // Adjust the accessible name as per your actual implementation
      fireEvent.click(ratingElement);

      // Optionally, you can assert on the updated UI state
      expect(screen.getByText(`Average Rating: 4.5`)).toBeInTheDocument();

      // Check if the Rating component is disabled after rating
      expect(ratingElement).toHaveAttribute('aria-disabled', 'true');
    });
  });

  it('submits a comment and updates the comments section', async () => {
    render(
      <MemoryRouter initialEntries={['/trip/1']}>
        <Routes>
          <Route path="/trip/:id" element={<Trip />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait until the Trip component finishes loading
    await waitFor(() => {
        // Mocking isLoggedIn to true to render comment section
        jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
  
        // Simulate typing into the textarea and submitting a comment
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New comment text' } });
        fireEvent.click(screen.getByText(/Submit Comment/i));
      });
  
      // Assert that the new comment appears in the comments section
      expect(screen.getByText('New comment text')).toBeInTheDocument();
    });
  
});
