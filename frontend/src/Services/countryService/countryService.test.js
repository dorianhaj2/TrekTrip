import countryService from './countryService'; // Adjust the import path as per your file structure
import axiosInstance from '../../axios/axiosInstance'; // Adjust the import path as per your file structure

// Mock axiosInstance
jest.mock('../../axios/axiosInstance');

describe('countryService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Mock data
  const mockCountries = [
    { id: 1, name: 'Country 1' },
    { id: 2, name: 'Country 2' },
  ];

  const mockCountry = { id: 1, name: 'Updated Country 1' };

  // Mock axiosInstance methods
  const mockGet = jest.fn();
  const mockPost = jest.fn();
  const mockPut = jest.fn();
  const mockDelete = jest.fn();

  axiosInstance.get.mockImplementation(mockGet);
  axiosInstance.post.mockImplementation(mockPost);
  axiosInstance.put.mockImplementation(mockPut);
  axiosInstance.delete.mockImplementation(mockDelete);

  // Test getAllCountries
  it('should fetch all countries', async () => {
    const response = { data: mockCountries };
    mockGet.mockResolvedValue(response);

    const result = await countryService.getAllCountries();

    expect(result).toEqual(response);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith('/country/all');
  });

  // Test getCountryById
  it('should fetch a country by id', async () => {
    const id = 1;
    const response = { data: mockCountry };
    mockGet.mockResolvedValue(response);

    const result = await countryService.getCountryById(id);

    expect(result).toEqual(response);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith(`/country/${id}`);
  });

  // Test createCountry
  it('should create a new country', async () => {
    const newCountry = { name: 'New Country' };
    const response = { data: mockCountry };
    mockPost.mockResolvedValue(response);

    const result = await countryService.createCountry(newCountry);

    expect(result).toEqual(response);
    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost).toHaveBeenCalledWith('/country', newCountry);
  });

  // Test updateCountry
  it('should update an existing country', async () => {
    const id = 1;
    const updatedCountry = { ...mockCountry };
    const response = { data: updatedCountry };
    mockPut.mockResolvedValue(response);

    const result = await countryService.updateCountry(id, updatedCountry);

    expect(result).toEqual(response);
    expect(mockPut).toHaveBeenCalledTimes(1);
    expect(mockPut).toHaveBeenCalledWith(`/country/${id}`, updatedCountry);
  });

  // Test deleteCountry
  it('should delete a country', async () => {
    const id = 1;
    const response = { status: 200 };
    mockDelete.mockResolvedValue(response);

    const result = await countryService.deleteCountry(id);

    expect(result).toEqual(response);
    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith(`/country/${id}`);
  });
});
