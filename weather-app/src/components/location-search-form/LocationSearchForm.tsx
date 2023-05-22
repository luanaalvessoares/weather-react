import React, { useState } from 'react';
import axios from 'axios';
import './LocationSearchForm.scss';

interface WeatherData {
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  name: string;
  sys: {
    country: string;
  };
  weather: [
    {
      description: string;
    }
  ];
  wind: {
    speed: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
}

const LocationSearchForm: React.FC = () => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState('');

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&lang=pt_br&appid=b300e5c756f3d0baeaffb67a5f994839`;

  const searchLocation = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      try {
        const response = await axios.get<WeatherData>(url);
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
      setLocation('');
    }
  };

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Informe a Cidade, Estado ou País"
          type="text"
        />
      </div>
      {data && (
        <div className="container">
          <div className="titulo">
            <div className="local">
              <p className="bold">{data.name}</p>
              <p className="text_desc">Local</p>
            </div>
            <div className="pais">
              <p className="bold">{data.sys.country}</p>
              <p className="text_desc">País</p>
            </div>
            <div className="temp">
              <h1>{data.main.temp.toFixed()}°</h1>
            </div>
            <div className="description">
              <p>{data.weather[0].description}</p>
            </div>
          </div>
          <div className="titulo">
            <div className="local">
              <p className="bold">{data.coord.lat}</p>
              <p className="text_desc">Latitude</p>
            </div>
            <div className="pais">
              <p className="bold">{data.coord.lon}</p>
              <p className="text_desc">Longitude</p>
            </div>
          </div>
          <div className="rodape">
            <div className="temp_maximo">
              <p className="bold">{data.main.temp_min.toFixed()}°</p>
              <p className="text_desc">Mínima</p>
            </div>
            <div className="temp_maximo">
              <p className="bold">{data.main.temp_max.toFixed()}°</p>
              <p className="text_desc">Máxima</p>
            </div>
            <div className="humidade">
              <p className="bold">{data.main.humidity}%</p>
              <p className="text_desc">Humidade</p>
            </div>
            <div className="vento">
              <p className="bold">{Math.round(data.wind.speed * 1.60934)} Km/h</p>
              <p className="text_desc">Velocidade do Vento</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearchForm;