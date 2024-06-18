import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Trips from './Trips';
import tripService from '../../Services/tripService/tripService';
import countryService from '../../Services/countryService/countryService';

jest.mock('../../Services/tripService/tripService');
jest.mock('../../Services/countryService/countryService');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) =>
      key === 'months'
        ? [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ]
        : key,
  }),
}));

describe('Trips Component', () => {
    beforeEach(() => {
        tripService.getAllTrips.mockResolvedValue({
          data: [
            {
              id: 1,
              title: 'Trip to Country1',
              description: 'A nice trip',
              lengthInDays: 7,
              price: 1000,
              tripMonth: 'January',
              locations: [{ country: { name: 'Country1' } }],
              ratings: [],
            },
            {
              id: 2,
              title: 'Trip to Country2',
              description: 'Another nice trip',
              lengthInDays: 10,
              price: 1500,
              tripMonth: 'February',
              locations: [{ country: { name: 'Country2' } }],
              ratings: [],
            },
          ],
        });
    
        countryService.getAllCountries.mockResolvedValue({
          data: [
            { id: 1, name: 'Country1' },
            { id: 2, name: 'Country2' },
          ],
        });
      });
    
      afterEach(() => {
        jest.clearAllMocks();
      });

  it('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <Trips />
      </MemoryRouter>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays error message when trips fetch fails', async () => {
    const errorMessage = 'Failed to fetch trips. Please try again later.';
    tripService.getAllTrips.mockRejectedValue(new Error(errorMessage));

    render(
      <MemoryRouter>
        <Trips />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  it('renders trips without filters applied', async () => {
    render(
      <MemoryRouter>
        <Trips />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Country1/i)).toBeInTheDocument();
      expect(screen.queryByText(/Country2/i)).toBeInTheDocument();
    });
  });

  it('applies country filter correctly', async () => {
    render(
      <MemoryRouter>
        <Trips />
      </MemoryRouter>
    );

    await waitFor(() => {
      const countryLabel = screen.getByText(/filters.country/i);
      const countryCombobox = countryLabel.closest('.MuiFormControl-root').querySelector('[role="combobox"]');

      fireEvent.mouseDown(countryCombobox);
      fireEvent.click(screen.getByRole('option', { name: 'Country1' }));
    });

    expect(screen.queryAllByText(/Country1/i)).toHaveLength(1);
    expect(screen.queryByText(/Country2/i)).not.toBeInTheDocument();
  });

  it('applies month filter correctly', async () => {
    render(
      <MemoryRouter>
        <Trips />
      </MemoryRouter>
    );

    await waitFor(() => {
      const monthLabel = screen.getByText(/filters.month/i);
      const monthCombobox = monthLabel.closest('.MuiFormControl-root').querySelector('[role="combobox"]');

      fireEvent.mouseDown(monthCombobox);
      fireEvent.click(screen.getByRole('option', { name: 'January' }));
    });

    // After selecting January, assert that only trips for January are visible
  const januaryTrips = screen.queryAllByText(/January/i); // Adjust this selector as per your trip items
  const februaryTrips = screen.queryAllByText(/February/i); // Similarly adjust for February or other months

  // Assert that only January trips are visible
  expect(januaryTrips.length).toBeGreaterThan(0);
  expect(februaryTrips.length).toBe(0); // Ensure no February trips are visible
  });

  it('clears filters correctly', async () => {
    render(
      <MemoryRouter>
        <Trips />
      </MemoryRouter>
    );

    // Apply country filter first
    await waitFor(() => {
      const countryLabel = screen.getByText(/filters.country/i);
      const countryCombobox = countryLabel.closest('.MuiFormControl-root').querySelector('[role="combobox"]');

      fireEvent.mouseDown(countryCombobox);
      fireEvent.click(screen.getByRole('option', { name: 'Country1' }));
    });

    // Assert that Country1 is displayed and Country2 is not
    expect(screen.getByText(/Country1/i)).toBeInTheDocument();
    expect(screen.queryByText(/Country2/i)).not.toBeInTheDocument();

    // Clear filters
    fireEvent.click(screen.getByText(/Clear Filters/i));

    // Assert that both Country1 and Country2 are displayed again
    expect(screen.getByText(/Country1/i)).toBeInTheDocument();
    expect(screen.getByText(/Country2/i)).toBeInTheDocument();
  });
});
