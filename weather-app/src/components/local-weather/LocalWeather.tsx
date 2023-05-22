import axios from "axios";
import { useEffect, useState } from "react";
import "./LocalWeather.scss";

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
}

function App() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [weather, setWeather] = useState("");
  const [temperature, setTemperature] = useState(0);
  const [cityName, setCityName] = useState("");
  const [pais, setPais] = useState("");
  const [tempMin, setTempMin] = useState(0);
  const [tempMax, setTempMax] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [velocity, setVelocity] = useState(0);

  const savePositionToState = (position: GeolocationPosition) => {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
  };

  const fetchWeather = async () => {
    try {
      await window.navigator.geolocation.getCurrentPosition(
        savePositionToState
      );
      const res = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=b300e5c756f3d0baeaffb67a5f994839&units=metric&lang=pt_br`
      );
      setTemperature(res.data.main.temp);
      setCityName(res.data.name);
      setPais(res.data.sys.country);
      setWeather(res.data.weather[0].description);
      setTempMin(res.data.main.temp_min);
      setTempMax(res.data.main.temp_max);
      setHumidity(res.data.main.humidity);
      setVelocity(res.data.wind.speed);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [latitude, longitude]);

  return (
    <div className="app">
      <div className="app__container">
        <div className="app__item">
          <div className="app__label">Cidade:</div>
          <div className="app__value">
            <h1>
              {cityName} - {pais}
            </h1>
          </div>
        </div>
        <div className="app__item">
          <div className="app__label">Temp. Atual:</div>
          <div className="app__value">
            <h2>{temperature}ºC</h2>
          </div>
        </div>
        <div className="app__item">
          <div className="app__label"></div>
          <div className="app__value">
            <h2>{weather}</h2>
          </div>
        </div>
        <div className="app__item">
          <div className="app__label">Mínima:</div>
          <div className="app__value">
            <h2>{tempMin}ºC</h2>
          </div>
        </div>
        <div className="app__item">
          <div className="app__label">Máxima:</div>
          <div className="app__value">
            <h2>{tempMax}ºC</h2>
          </div>
        </div>
        <div className="app__item">
          <div className="app__label">Latitude:</div>
          <div className="app__value">
            <h2>{latitude}</h2>
          </div>
        </div>
        <div className="app__item">
          <div className="app__label">Longitude:</div>
          <div className="app__value">
            <h2>{longitude}</h2>
          </div>
        </div>
        <div className="app__item">
          <div className="app__label">Umidade:</div>
          <div className="app__value">
            <h2>{humidity}%</h2>
          </div>
        </div>
        <div className="app__item">
          <div className="app__label">Velocidade do Vento:</div>
          <div className="app__value">
            <h2>{velocity}</h2> Km/h
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
