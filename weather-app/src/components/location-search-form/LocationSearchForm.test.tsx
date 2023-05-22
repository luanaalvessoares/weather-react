import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios, { AxiosResponse } from 'axios';
import LocationSearchForm from './LocationSearchForm';

jest.mock('axios');

describe('LocationSearchForm', () => {
  test('displays weather information when location is searched', async () => {
    const mockData = {
      main: {
        temp: 22,
        temp_min: 18,
        temp_max: 25,
        humidity: 70,
      },
      name: 'London',
      sys: {
        country: 'GB',
      },
      weather: [
        {
          description: 'Cloudy',
        },
      ],
      wind: {
        speed: 10,
      },
      coord: {
        lat: 51.5074,
        lon: -0.1278,
      },
    };

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData } as AxiosResponse);

    render(<LocationSearchForm />);

    const input = screen.getByPlaceholderText('Informe a Cidade, Estado ou País');
    userEvent.type(input, 'London{enter}');

    expect(await screen.findByText(/London/)).toBeInTheDocument();
    expect(await screen.findByText(/GB/)).toBeInTheDocument();
    expect(await screen.findByText(/22°/)).toBeInTheDocument();
    expect(await screen.findByText(/Cloudy/)).toBeInTheDocument();
    expect(await screen.findByText(/51.5074/)).toBeInTheDocument();
    expect(await screen.findByText(/-0.1278/)).toBeInTheDocument();
    expect(await screen.findByText(/18°/)).toBeInTheDocument();
    expect(await screen.findByText(/25°/)).toBeInTheDocument();
    expect(await screen.findByText(/70%/)).toBeInTheDocument();
    expect(await screen.findByText(/10 Km\/h/)).toBeInTheDocument();
  });
});
