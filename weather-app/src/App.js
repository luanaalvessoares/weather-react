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



  
}

export default App;
