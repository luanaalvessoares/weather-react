import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import pinIcon from './pin.png';

import 'leaflet/dist/leaflet.css';
import './App.scss';

const API_KEY = 'b300e5c756f3d0baeaffb67a5f994839';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState({});
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch weather data for user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, []);

  const temperatureInCelsius = (weatherData.main?.temp - 273.15).toFixed(1);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetchWeatherData();
    setLoading(false);
  };

  const fetchWeatherData = async (latitude = null, longitude = null) => {
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${API_KEY}`;
      
      if (latitude && longitude) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
      }

      const response = await axios.get(url);
      setLocation(response.data.coord);
      setWeatherData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const renderWeatherForecast = () => {
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (!location || !weatherData || !weatherData.daily) {
      return null;
    }
  
    const forecastItems = weatherData.daily.slice(1, 7).map((day) => {
      const date = moment.unix(day.dt).format('MMM D');
      const temperature = day.temp.day.toFixed(1);
  
      return (
        <div className="forecast-item" key={day.dt}>
          <div>{moment.unix(day.dt).format('ddd')}</div>
          <div>{date}</div>
          <div>{temperature}°C</div>
        </div>
      );
    });
  
    return (
      <div className="weather-forecast">
        <div className="forecast-header">Weather Forecast</div>
        <div className="forecast-list">{forecastItems}</div>
      </div>
    );
  };  

  return (
    <div className="app">
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a location..."
          required
        />
        <button type="submit">Search</button>
      </form>

      {Object.keys(weatherData).length > 0 && Object.keys(location).length > 0 && (
        <div className="weather-container">
          <div className="weather-info">
            <div className="location">
              {weatherData.name}, {weatherData.sys?.country}
            </div>
            <div className="temperature">
              {temperatureInCelsius}°C
            </div>
            <div className="additional-info">
              <div>Humidity: {weatherData.main?.humidity}%</div>
              <div>Pressure: {weatherData.main?.pressure} hPa</div>
              <div>Wind: {weatherData.wind?.speed} m/s</div>
            </div>
          </div>

          <MapContainer
            className="map-container"
            center={[location.lat, location.lon]}
            zoom={10}
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker
              position={[location.lat, location.lon]}
              icon={L.icon({
                iconUrl: pinIcon,
                iconSize: [30, 30],
                iconAnchor: [15, 30]
              })}
            />

          </MapContainer>

          {renderWeatherForecast()}
        </div>
      )}
    </div>
  );
}

export default App;