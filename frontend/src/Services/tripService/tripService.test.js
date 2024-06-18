import tripService from './tripService'; // Adjust the import path as per your file structure
import axiosInstance from '../../axios/axiosInstance'; // Adjust the import path as per your file structure

// Mock axiosInstance
jest.mock('../../axios/axiosInstance');

describe('tripService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Mock data
  const mockTrips = [
    { id: 1, name: 'Trip 1' },
    { id: 2, name: 'Trip 2' },
  ];

  const mockTrip = { id: 1, name: 'Updated Trip 1' };

  // Mock axiosInstance methods
  const mockGet = jest.fn();
  const mockPost = jest.fn();
  const mockPut = jest.fn();
  const mockDelete = jest.fn();

  axiosInstance.get.mockImplementation(mockGet);
  axiosInstance.post.mockImplementation(mockPost);
  axiosInstance.put.mockImplementation(mockPut);
  axiosInstance.delete.mockImplementation(mockDelete);

  // Test getAllTrips
  it('should fetch all trips', async () => {
    const response = { data: mockTrips };
    mockGet.mockResolvedValue(response);

    const result = await tripService.getAllTrips();

    expect(result).toEqual({data: mockTrips});
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith('/trip/all');
  });

  // Test getTripById
  it('should fetch a trip by id', async () => {
    const id = 1;
    const response = { data: mockTrip };
    mockGet.mockResolvedValue(response);

    const result = await tripService.getTripById(id);

    expect(result).toEqual(response);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith(`/trip/${id}`);
  });

  // Test createTrip
  it('should create a new trip', async () => {
    const newTrip = { name: 'New Trip' };
    const response = { data: mockTrip };
    mockPost.mockResolvedValue(response);

    const result = await tripService.createTrip(newTrip);

    expect(result).toEqual(response);
    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost).toHaveBeenCalledWith('/trip', newTrip);
  });

  // Test updateTrip
  it('should update an existing trip', async () => {
    const id = 1;
    const updatedTrip = { ...mockTrip };
    const response = { data: updatedTrip };
    mockPut.mockResolvedValue(response);

    const result = await tripService.updateTrip(id, updatedTrip);

    expect(result).toEqual(response);
    expect(mockPut).toHaveBeenCalledTimes(1);
    expect(mockPut).toHaveBeenCalledWith(`/trip/${id}`, updatedTrip);
  });

  // Test deleteTrip
  it('should delete a trip', async () => {
    const id = 1;
    const response = { status: 200 };
    mockDelete.mockResolvedValue(response);

    const result = await tripService.deleteTrip(id);

    expect(result).toEqual(response);
    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith(`/trip/${id}`);
  });
});
