import React, { useState } from 'react';
import axios from 'axios';
import './App.scss';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [address, setAddress] = useState('');

  const fetchWeatherData = async (latitude, longitude) => {
    const API_KEY = 'b300e5c756f3d0baeaffb67a5f994839';
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
    );
    setWeatherData(response.data);
  };
  
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleSearch = async () => {
    const API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
    const geocodeResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${API_KEY}`
    );
    const { lat, lng } = geocodeResponse.data.results[0].geometry.location;
    await fetchWeatherData(lat, lng);
  };
  
}

export default App;
