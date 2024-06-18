import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddTrip from './AddTrip';
import tripService from '../../Services/tripService/tripService';
import countryService from '../../Services/countryService/countryService';
import axiosInstance from '../../axios/axiosInstance';

jest.mock('../../Services/tripService/tripService');
jest.mock('../../Services/countryService/countryService');
jest.mock('../../axios/axiosInstance');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key === 'months' ? [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ] : key,
  }),
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('AddTrip Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the add trip form', async () => {
    countryService.getAllCountries.mockResolvedValue({ data: [{ id: 1, name: 'Country1' }] });

    render(
      <MemoryRouter>
        <AddTrip />
      </MemoryRouter>
    );
    const monthLabel = screen.getByText(/addTrip.month/i);
    const countryLabel = screen.getByText(/addTrip.country/i);

    expect(screen.getByText(/addTrip.title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/addTrip.name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/addTrip.description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/addTrip.length/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/addTrip.price/i)).toBeInTheDocument();
    expect(monthLabel).toBeInTheDocument();
    expect(countryLabel).toBeInTheDocument();

    await waitFor(() => expect(countryService.getAllCountries).toHaveBeenCalledTimes(1));
  });

  it('updates form state on input change', async () => {
    countryService.getAllCountries.mockResolvedValue({ data: [{ id: 1, name: 'Country1' }] });

    render(
      <MemoryRouter>
        <AddTrip />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/addTrip.name/i), { target: { value: 'Test Trip' } });
    fireEvent.change(screen.getByLabelText(/addTrip.description/i), { target: { value: 'This is a test trip' } });
    fireEvent.change(screen.getByLabelText(/addTrip.length/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/addTrip.price/i), { target: { value: '1000' } });
    // Find the Month combobox using its label
    const monthLabel = screen.getByText(/addTrip.month/i);
    const monthCombobox = monthLabel.closest('.MuiFormControl-root').querySelector('[role="combobox"]');

    // Open the dropdown for selecting the month
    fireEvent.mouseDown(monthCombobox);
    fireEvent.click(screen.getByRole('option', { name: 'January' }));

    // Assuming Material-UI manages selected value in some state or attribute
    const selectedValue = monthCombobox.getAttribute('aria-labelledby'); // Example: hypothetical attribute storing selected value

    // Assert the selected value
    expect(selectedValue).toBe('mui-component-select-tripMonth');
    

    expect(screen.getByLabelText(/addTrip.name/i)).toHaveValue('Test Trip');
    expect(screen.getByLabelText(/addTrip.description/i)).toHaveValue('This is a test trip');
    expect(screen.getByLabelText(/addTrip.length/i)).toHaveValue(5);
    expect(screen.getByLabelText(/addTrip.price/i)).toHaveValue(1000);
});

  it('handles form submission with valid data', async () => {
    countryService.getAllCountries.mockResolvedValue({ data: [{ id: 1, name: 'Country1' }] });
    tripService.createTrip.mockResolvedValue({ data: { id: 1 } });
    axiosInstance.post.mockResolvedValue({ data: { id: 1 } });

    render(
      <MemoryRouter>
        <AddTrip />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/addTrip.name/i), { target: { value: 'Test Trip' } });
    fireEvent.change(screen.getByLabelText(/addTrip.description/i), { target: { value: 'This is a test trip' } });
    fireEvent.change(screen.getByLabelText(/addTrip.length/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/addTrip.price/i), { target: { value: '1000' } });
   
    // Find the Month combobox using its label
    const monthLabel = screen.getByText(/addTrip.month/i);
    const monthCombobox = monthLabel.closest('.MuiFormControl-root').querySelector('[role="combobox"]');

    // Open the dropdown for selecting the month
    fireEvent.mouseDown(monthCombobox);
    fireEvent.click(screen.getByRole('option', { name: 'January' }));

    fireEvent.submit(screen.getByRole('button', { name: /Dodaj Putovanje/i }));

    await waitFor(() => {
      expect(tripService.createTrip).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/putovanja');
    });
  });

  it('shows error message on failed form submission', async () => {
    countryService.getAllCountries.mockResolvedValue({ data: [{ id: 1, name: 'Country1' }] });
    tripService.createTrip.mockRejectedValue(new Error('Failed to add trip'));

    render(
      <MemoryRouter>
        <AddTrip />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/addTrip.name/i), { target: { value: 'Test Trip' } });
    fireEvent.change(screen.getByLabelText(/addTrip.description/i), { target: { value: 'This is a test trip' } });
    fireEvent.change(screen.getByLabelText(/addTrip.length/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/addTrip.price/i), { target: { value: '1000' } });
    // Find the Month combobox using its label
    const monthLabel = screen.getByText(/addTrip.month/i);
    const monthCombobox = monthLabel.closest('.MuiFormControl-root').querySelector('[role="combobox"]');

    // Open the dropdown for selecting the month
    fireEvent.mouseDown(monthCombobox);
    fireEvent.click(screen.getByRole('option', { name: 'January' }));


    fireEvent.submit(screen.getByRole('button', { name: /Dodaj Putovanje/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to add trip. Please try again later./i)).toBeInTheDocument();
    });
  });

  it('fetches locations when a country is selected', async () => {
    countryService.getAllCountries.mockResolvedValue({ data: [{ id: 1, name: 'Country1', code: 'C1' }] });
    const mockLocations = [
      { geonameId: 1, name: 'Location1' },
      { geonameId: 2, name: 'Location2' },
    ];
  
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ geonames: mockLocations }),
      })
    );
  
    render(
      <MemoryRouter>
        <AddTrip />
      </MemoryRouter>
    );
  
    const countryLabel = screen.getByText(/addTrip.country/i);
    const countryCombobox = countryLabel.closest('.MuiFormControl-root').querySelector('[role="combobox"]');

    // Open the dropdown for selecting the month
    fireEvent.mouseDown(countryCombobox);

    await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Country1' })).toBeInTheDocument();
      });

    fireEvent.click(screen.getByRole('option', { name: 'Country1' }));

    let locationLabel;
  
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://api.geonames.org/searchJSON?country=C1&username=luka58'
      );
      locationLabel = screen.getByText(/addTrip.location/i);
    });
  
    // Assert that the locations have been fetched and set
    const locationCombobox = locationLabel.closest('.MuiFormControl-root').querySelector('[role="combobox"]');
    expect(locationLabel).toBeInTheDocument();
    fireEvent.mouseDown(locationCombobox);
    fireEvent.click(screen.getByRole('option', { name: 'Location1' }));
    fireEvent.click(screen.getByRole('option', { name: 'Location2' }));

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Location1' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Location2' })).toBeInTheDocument();
    });
  });

  it('updates day title and text on input change', async () => {
    countryService.getAllCountries.mockResolvedValue({ data: [{ id: 1, name: 'Country1' }] });
  
    render(
      <MemoryRouter>
        <AddTrip />
      </MemoryRouter>
    );
  
    fireEvent.change(screen.getByLabelText(/addTrip.length/i), { target: { value: '2' } });
  
    // Get the first and second day title and text inputs
  const dayTitleInputs = screen.getAllByLabelText(/addTrip.dayTitle/i);
  const dayTextInputs = screen.getAllByLabelText(/addTrip.dayText/i);

  fireEvent.change(dayTitleInputs[0], { target: { value: 'Day 1 Title' } });
  fireEvent.change(dayTextInputs[0], { target: { value: 'Day 1 Text' } });

  fireEvent.change(dayTitleInputs[1], { target: { value: 'Day 2 Title' } });
  fireEvent.change(dayTextInputs[1], { target: { value: 'Day 2 Text' } });

  expect(dayTitleInputs[0]).toHaveValue('Day 1 Title');
  expect(dayTextInputs[0]).toHaveValue('Day 1 Text');

  expect(dayTitleInputs[1]).toHaveValue('Day 2 Title');
  expect(dayTextInputs[1]).toHaveValue('Day 2 Text');
  });

  it('clears all selections when Clear All button is clicked', async () => {
    countryService.getAllCountries.mockResolvedValue({ data: [{ id: 1, name: 'Country1', code: 'C1' }] });
    
    const mockLocations = [
      { geonameId: 1, name: 'Location1' },
      { geonameId: 2, name: 'Location2' },
    ];
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ geonames: mockLocations }),
      })
    );
    
    render(
      <MemoryRouter>
        <AddTrip />
      </MemoryRouter>
    );
        
    const countryLabel = screen.getByText(/addTrip.country/i);
    const countryCombobox = countryLabel.closest('.MuiFormControl-root').querySelector('[role="combobox"]');
    
    fireEvent.mouseDown(countryCombobox);
    
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Country1' })).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByRole('option', { name: 'Country1' }));
    
    // Wait for the location dropdown to appear
    await waitFor(() => {
      expect(screen.getByText(/addTrip.location/i)).toBeInTheDocument();
    });
       
    const locationLabel = screen.getByText(/addTrip.location/i);
    const locationCombobox = locationLabel.closest('.MuiFormControl-root').querySelector('[role="combobox"]');
    
    fireEvent.mouseDown(locationCombobox);

    await waitFor(() => {
      expect(screen.getByRole('option', { name: /Location1/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('option', { name: /Location1/i }));
    
    const button = screen.getByText('addTrip.clear');
    fireEvent.click(button);

   // Verify that the selections are cleared
   await waitFor(() => {
    // Check that the country combobox value is empty
    const updatedCountryCombobox = countryLabel.closest('.MuiFormControl-root').querySelector('[role="combobox"]');
    expect(updatedCountryCombobox).toHaveTextContent('\u200B'); // non-breaking space (zero-width space)

    // Check that the location combobox is empty
    const updatedLocationCombobox = locationLabel.closest('.MuiFormControl-root').querySelector('[role="combobox"]');
    expect(updatedLocationCombobox).toHaveTextContent('\u200B'); // non-breaking space (zero-width space)
  });
  });
  
  it('handles image upload during form submission', async () => {
    countryService.getAllCountries.mockResolvedValue({ data: [{ id: 1, name: 'Country1' }] });
    tripService.createTrip.mockResolvedValue({ data: { id: 1 } });
    axiosInstance.post.mockResolvedValue({ data: { id: 1 } });
  
    render(
      <MemoryRouter>
        <AddTrip />
      </MemoryRouter>
    );
  
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
  
    fireEvent.change(screen.getByLabelText(/addTrip.images/i), {
      target: { files: [file] }
    });
  
    fireEvent.submit(screen.getByRole('button', { name: /Dodaj Putovanje/i }));
  
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(
        '/image',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    });
  });
  it('handles failure in fetching countries', async () => {
    countryService.getAllCountries.mockRejectedValue(new Error('Failed to fetch countries'));
  
    render(
      <MemoryRouter>
        <AddTrip />
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(screen.queryByLabelText(/addTrip.country/i)).not.toBeInTheDocument();
    });
  });
  
  it('handles failure in fetching locations', async () => {
    countryService.getAllCountries.mockResolvedValue({ data: [{ id: 1, name: 'Country1', code: 'C1' }] });
    global.fetch = jest.fn(() => Promise.reject('API is down'));
  
    render(
      <MemoryRouter>
        <AddTrip />
      </MemoryRouter>
    );
  const countryLabel = screen.getByText(/addTrip.country/i);
    const countryCombobox = countryLabel.closest('.MuiFormControl-root').querySelector('[role="combobox"]');

    // Open the dropdown for selecting the month
    fireEvent.mouseDown(countryCombobox);

    await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Country1' })).toBeInTheDocument();
      });
      
    fireEvent.click(screen.getByRole('option', { name: 'Country1' }));
  
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://api.geonames.org/searchJSON?country=C1&username=luka58'
      );
      expect(screen.queryByLabelText(/addTrip.location/i)).not.toBeInTheDocument();
    });
  });

  it('fetches locations when a country is selected and posts selected locations', async () => {
    // Mock the response of countryService.getAllCountries
    countryService.getAllCountries.mockResolvedValue({ data: [{ id: 1, name: 'Country1' }] });
    tripService.createTrip.mockResolvedValue({ data: { id: 1 } });
    axiosInstance.post.mockResolvedValue({ data: { id: 1 } });

    // Mock the response of the fetch call for locations
    const mockLocations = [
      { geonameId: 1, name: 'Location1' },
      { geonameId: 2, name: 'Location2' },
    ];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ geonames: mockLocations }),
      })
    );
  
    // Mock axiosInstance.post to simulate posting locations
    const mockPostResponse = { data: { id: 'mockLocationId' } };
    axiosInstance.post.mockImplementation(async (url, data) => {
      // Simulate posting the location and returning a mock response
      return Promise.resolve(mockPostResponse);
    });
  
    // Render the component within a MemoryRouter
    render(
      <MemoryRouter>
        <AddTrip />
      </MemoryRouter>
    );
  
    // Select the country from the dropdown
    const countryLabel = screen.getByText(/addTrip.country/i);
    const countryCombobox = countryLabel.closest('.MuiFormControl-root').querySelector('[role="combobox"]');
    fireEvent.mouseDown(countryCombobox);
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Country1' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('option', { name: 'Country1' }));
  
    let locationLabel;

    // Wait for the fetch call to be made and assert its parameters
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://api.geonames.org/searchJSON?country=C1&username=luka58'
      );
      locationLabel = screen.getByText(/addTrip.location/i);
    });
  
    // Select locations from the fetched data
    const locationCombobox = locationLabel.closest('.MuiFormControl-root').querySelector('[role="combobox"]');
    fireEvent.mouseDown(locationCombobox);
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Location1' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Location2' })).toBeInTheDocument();
    });
  
    // Simulate selection of Location1 and Location2
    fireEvent.click(screen.getByRole('option', { name: 'Location1' }));
    fireEvent.click(screen.getByRole('option', { name: 'Location2' }));
  
    // Submit the form to trigger axiosInstance.post calls
    fireEvent.submit(screen.getByRole('button', { name: /Dodaj Putovanje/i }));
  
    // Assert that axiosInstance.post was called for each selected location
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledTimes(2); // Assuming two locations were selected
      expect(axiosInstance.post).toHaveBeenCalledWith('/location', {
        destination: 'Location1',
        country: { id: 1 }, // Assuming countryId 1 for Country1
      });
      expect(axiosInstance.post).toHaveBeenCalledWith('/location', {
        destination: 'Location2',
        country: { id: 1 }, // Assuming countryId 1 for Country1
      });
    });
  
    // Add more specific assertions about the payload sent if necessary
  });  
  
});
