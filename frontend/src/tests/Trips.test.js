import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Trips from '../Pages/Trips/Trips';
import tripService from '../Services/tripService';
import countryService from '../Services/countryService';

jest.mock('../Services/tripService'); // Mock the tripService
jest.mock('../Services/countryService'); // Mock the countryService

describe('Trips Component', () => {
  beforeEach(() => {
    // Mock the responses of tripService and countryService methods
    tripService.getAllTrips.mockResolvedValue({ data: [{ id: 1, name: 'Trip 1' }, { id: 2, name: 'Trip 2' }] });
    countryService.getAllCountries.mockResolvedValue({ data: [{ id: 1, name: 'Country 1' }, { id: 2, name: 'Country 2' }] });
  });

  it('renders loading state initially', async () => {
    render(<Trips />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for async operations to complete
    await screen.findByText('Country 1'); // Use a text that appears after data loading
  });

  it('renders trips after loading', async () => {
    render(<Trips />);

    // Wait for async operations to complete
    await screen.findByText('Country 1');

    // Expect trips to be rendered
    expect(screen.getByText('Trip 1')).toBeInTheDocument();
    expect(screen.getByText('Trip 2')).toBeInTheDocument();
  });

  it('filters trips based on selected country', async () => {
    render(<Trips />);

    // Wait for async operations to complete
    await screen.findByText('Country 1');

    // Simulate selecting a country
    fireEvent.change(screen.getByLabelText('Country'), { target: { value: 'Country 1' } });

    // Expect filtered trips to be rendered
    expect(screen.getByText('Trip 1')).toBeInTheDocument();
    expect(screen.queryByText('Trip 2')).not.toBeInTheDocument(); // Trip 2 should not be visible
  });

  // Add more tests for sorting, clearing filters, etc.

});
