import axiosInstance from './axiosInstance';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};

// Mock Axios
jest.mock('axios');

describe('Axios Instance', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should add Authorization header with access token', async () => {
    const accessToken = 'mockAccessToken';
    localStorageMock.getItem.mockReturnValueOnce(accessToken);

    // Mock Axios request
    axiosInstance.post = jest.fn().mockResolvedValueOnce({ data: { accessToken: 'newAccessToken' } });

    const response = await axiosInstance.get('/test');
    expect(response).toBeDefined();
    
    // Check if Authorization header was set
    expect(axiosInstance.post).toHaveBeenCalledWith('http://localhost:8080/auth/refreshToken', {
      token: accessToken,
    });
    expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', 'newAccessToken');
  });

  it('should retry request after token refresh', async () => {
    const accessToken = 'mockAccessToken';
    localStorageMock.getItem.mockReturnValueOnce(accessToken);

    // Mock Axios requests
    axiosInstance.post = jest.fn()
      .mockRejectedValueOnce({ response: { status: 403 } }) // Simulate 403 error
      .mockResolvedValueOnce({ data: { accessToken: 'newAccessToken' } }); // Simulate refresh token success

    axiosInstance.request = jest.fn().mockResolvedValueOnce({ data: 'responseAfterRefresh' });

    try {
      await axiosInstance.get('/protected');
    } catch (error) {
      // Check if the original request was retried with the new token
      expect(axiosInstance.request).toHaveBeenCalledWith({
        baseURL: 'http://localhost:8080',
        headers: { Authorization: `Bearer newAccessToken` },
        url: '/protected',
        method: 'GET',
      });
      // Check if token was refreshed
      expect(axiosInstance.post).toHaveBeenCalledWith('http://localhost:8080/auth/refreshToken', {
        token: accessToken,
      });
      // Check if localStorage was updated
      expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', 'newAccessToken');
    }
  });

  it('should handle maximum retry attempts for token refresh', async () => {
    const accessToken = 'mockAccessToken';
    localStorageMock.getItem.mockReturnValueOnce(accessToken);

    // Mock Axios requests
    axiosInstance.post = jest.fn()
      .mockRejectedValue({ response: { status: 403 } }) // Simulate 403 error repeatedly
      .mockRejectedValue({ message: 'Refresh token failed' }); // Simulate refresh token failure

    try {
      await axiosInstance.get('/protected');
    } catch (error) {
      // Check if maximum retry attempts reached
      expect(error.message).toBe('Refresh token failed');
      // Check if token refresh was attempted multiple times
      expect(axiosInstance.post).toHaveBeenCalledTimes(4); // 3 retries + initial attempt
    }
  });

  it('should handle other errors', async () => {
    // Mock Axios request to simulate other errors
    axiosInstance.get = jest.fn().mockRejectedValueOnce(new Error('Network Error'));

    try {
      await axiosInstance.get('/nonexistent');
    } catch (error) {
      // Check if network error was handled
      expect(error.message).toBe('Network Error');
    }
  });
});
