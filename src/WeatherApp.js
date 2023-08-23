import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherApp.css';

function WeatherApp() {
  const [city, setCity] = useState('');
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [monthlyForecast, setMonthlyForecast] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);

  const getDayOfWeek = (index) => {
    const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return daysOfWeek[index];
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const fetchWeeklyForecast = async () => {
    try {
      if (!city) {
        console.error('City is not provided.');
        return;
      }

      const weeklyApiUrl = `http://api.weatherapi.com/v1/forecast.json?key=bfcc526c13824636ade125204231008&q=${city}&days=7`;
      const weeklyResponse = await axios.get(weeklyApiUrl);

      setWeeklyForecast(weeklyResponse.data.forecast.forecastday);
    } catch (error) {
      console.error('Error fetching weekly forecast:', error);
    }
  };

  const fetchMonthlyForecast = async () => {
    try {
      if (!city) {
        console.error('City is not provided.');
        return;
      }

      const monthlyApiUrl = `http://api.weatherapi.com/v1/forecast.json?key=bfcc526c13824636ade125204231008&q=${city}&days=30`;
      const monthlyResponse = await axios.get(monthlyApiUrl);

      setMonthlyForecast(monthlyResponse.data.forecast.forecastday);
    } catch (error) {
      console.error('Error fetching monthly forecast:', error);
    }
  };

  const fetchCurrentWeather = async () => {
    try {
      if (!city) {
        console.error('City is not provided.');
        return;
      }

      const currentApiUrl = `http://api.weatherapi.com/v1/current.json?key=bfcc526c13824636ade125204231008&q=${city}&aqi=no`;
      const currentResponse = await axios.get(currentApiUrl);

      setCurrentWeather(currentResponse.data.current);
    } catch (error) {
      console.error('Error fetching current weather:', error);
    }
  };

  useEffect(() => {
    fetchWeeklyForecast();
    fetchMonthlyForecast();
  }, [city]);

  useEffect(() => {
    fetchCurrentWeather();
  }, [city]);

  return (
    <div className="WeatherApp">
      <h1>Погода</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Введите город"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={() => { fetchWeeklyForecast(); fetchMonthlyForecast(); }}>Получить погоду</button>
      </div>
      {/* Current weather */}
      {currentWeather && (
        <div className="forecast-section">
          <h2>Текущая погода</h2>
          <div className="forecast-icons">
            <div className="card">
              <div className="card-header">
                <span>Сегодня</span>
                <span>{currentWeather.temp_c}°C</span>
              </div>
              <img src={currentWeather.condition.icon} alt={currentWeather.condition.text} />
              <p>{currentWeather.condition.text}</p>
              <div className="temp">{currentWeather.temp_c}°C</div>
            </div>
          </div>
        </div>
      )}
      {/* Weekly forecast */}
      {weeklyForecast.length > 0 && (
        <div className="forecast-section">
          <h2>Прогноз на неделю</h2>
          <div className="forecast-icons">
            {weeklyForecast.map((forecast, index) => (
              <div className="forecast-item" key={index}>
                <p>{getDayOfWeek(new Date(forecast.date).getDay())}</p>
                <p>{formatDate(forecast.date)}</p>
                <img src={forecast.day.condition.icon} alt={forecast.day.condition.text} />
                <p>{forecast.day.avgtemp_c}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Monthly forecast */}
      {monthlyForecast.length > 0 && (
        <div className="forecast-section">
          <h2>Прогноз на месяц</h2>
          <div className="forecast-icons">
            {monthlyForecast.map((forecast, index) => (
              <div className="forecast-item" key={index}>
                <p>{getDayOfWeek(new Date(forecast.date).getDay())}</p>
                <p>{formatDate(forecast.date)}</p>
                <img src={forecast.day.condition.icon} alt={forecast.day.condition.text} />
                <p>{forecast.day.avgtemp_c}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
