import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Weather() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDate = new Date();
      setCurrentDateTime(
        currentDate.toLocaleString("en-US", {
          weekday: "long",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        })
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function updateWeather(response) {
    console.log(response.data);
    setWeatherData(response.data);
  }

  function updateForecast(response) {
    console.log(response.data);

    const filteredForecast = response.data.list.filter(
      (forecast, index) => index % 8 === 0
    );
    setForecastData(filteredForecast);
  }

  function fetchWeather() {
    let apikey = "f8e6a9e3d6fde87cb38868da460b1371";
    let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}`;

    axios.get(weatherUrl).then(updateWeather);
    axios.get(forecastUrl).then(updateForecast);
  }

  function handleSubmit(event) {
    event.preventDefault();
    fetchWeather();
  }

  function handleInputChange(event) {
    setCity(event.target.value);
  }

  return (
    <div className="Weather">
      <div className="city-container">
        <ul className="city-list">
          <li>
            <a href="/"> Nairobi </a>
          </li>
          <li>
            <a href="/">London</a>
          </li>
          <li>
            <a href="/">Tokyo</a>
          </li>
          <li>
            <a href="/">New York</a>
          </li>
        </ul>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="search"
          placeholder="Enter city"
          value={city}
          onChange={handleInputChange}
        />
        <button type="submit" className="Search">
          Search
        </button>
        <button type="submit" className="Current">
          Current
        </button>
      </form>

      <div className="city-conditions">
        <p>{currentDateTime}</p>

        {weatherData && (
          <div>
            <div className="predictions">
              <p>
                <strong>{weatherData.name}</strong>
              </p>
              <p>Temperature: {Math.round(weatherData.main.temp - 273.15)}°C</p>
              <p>{weatherData.weather[0].main}</p>
            </div>

            <div className="container">
              <div className="column">
                <p className="current-temp">
                  <strong>
                    {" "}
                    {Math.round(weatherData.main.temp - 273.15)}°C
                  </strong>
                </p>
              </div>
              <div className="column">
                <p>Precipitation: 68%</p>
                <p>Wind Speed: {Math.round(weatherData.wind.speed)} m/s</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="forecast">
        {forecastData &&
          forecastData.map((day, index) => (
            <div key={index}>
              <p>
                {new Date(day.dt_txt).toLocaleString("en-US", {
                  weekday: "long",
                })}
              </p>{" "}
              <img
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                alt="Weather Icon"
              />{" "}
              <p>{Math.round(day.main.temp - 273.15)}°C</p>{" "}
            </div>
          ))}
      </div>
    </div>
  );
}
