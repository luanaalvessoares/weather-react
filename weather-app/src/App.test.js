import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import App from './App';

jest.mock('axios');

describe('App', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        name: 'City',
        sys: { country: 'Country' },
        main: { temp: 300, humidity: 50, pressure: 1013 },
        wind: { speed: 3 },
        coord: { lat: 10, lon: 20 },
        daily: [
          { dt: 12345, temp: { day: 301 } },
          { dt: 23456, temp: { day: 302 } },
          { dt: 34567, temp: { day: 303 } },
          { dt: 45678, temp: { day: 304 } },
          { dt: 56789, temp: { day: 305 } },
          { dt: 67890, temp: { day: 306 } }
        ]
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders search form', () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText('Search for a location...');
    const searchButton = screen.getByText('Search');
    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  test('fetches weather data for user\'s current location', async () => {
    const geolocationMock = {
      getCurrentPosition: jest.fn().mockImplementationOnce((success) =>
        Promise.resolve(
          success({
            coords: { latitude: 40, longitude: -70 }
          })
        )
      )
    };
    global.navigator.geolocation = geolocationMock;

    render(<App />);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather?lat=40&lon=-70&appid=b300e5c756f3d0baeaffb67a5f994839'
      );
    });
  });

  test('fetches weather data for a searched location', async () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText('Search for a location...');
    const searchButton = screen.getByText('Search');

    fireEvent.change(searchInput, { target: { value: 'London' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather?q=London&appid=b300e5c756f3d0baeaffb67a5f994839'
      );
    });
  });

  test('displays weather information after fetching data', async () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText('Search for a location...');
    const searchButton = screen.getByText('Search');
  
    fireEvent.change(searchInput, { target: { value: 'London' } });
    fireEvent.click(searchButton);
  
    await waitFor(() => {
      expect(screen.getByText('City, Country')).toBeInTheDocument();
    });
  
    expect(screen.getByText('27.9°C')).toBeInTheDocument();
    expect(screen.getByText('Humidity: 50%')).toBeInTheDocument();
    expect(screen.getByText('Pressure: 1013 hPa')).toBeInTheDocument();
    expect(screen.getByText('Wind: 3 m/s')).toBeInTheDocument();
  });
  

  test('displays weather forecast after fetching data', async () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText('Search for a location...');
    const searchButton = screen.getByText('Search');

    fireEvent.change(searchInput, { target: { value: 'London' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      const forecastItems = screen.getAllByTestId('forecast-item');
      expect(forecastItems).toHaveLength(6);
    });
  });

  test('displays loading state during data fetching', async () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText('Search for a location...');
    const searchButton = screen.getByText('Search');

    fireEvent.change(searchInput, { target: { value: 'London' } });
    fireEvent.click(searchButton);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });
  });
});
