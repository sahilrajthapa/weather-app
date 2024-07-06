import React, { useState, useEffect } from "react";
import { fetchWeather } from "./api/fetchWeather";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [unit, setUnit] = useState("C");

  const fetchData = async (e) => {
    if (e.key === "Enter") {
      setLoading(true);
      try {
        const data = await fetchWeather(cityName);
        setWeatherData(data);
        setRecentSearches((prevSearches) => {
          const recentSearches = [cityName, ...prevSearches];
          localStorage.setItem(
            "recentSearches",
            JSON.stringify(recentSearches)
          );
          return recentSearches;
        });
        setCityName("");
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRecentSearchClick = async (city) => {
    setLoading(true);
    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => {
      const unit = prevUnit === "C" ? "F" : "C";
      localStorage.setItem("unit", unit);
      return unit;
    });
  };

  useEffect(() => {
    const savedRecentSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    const savedUnit = localStorage.getItem("unit") || "C";
    setRecentSearches(savedRecentSearches);
    setUnit(savedUnit);
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Enter city name..."
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
        onKeyDown={fetchData}
      />
      {loading && <div style={{ marginTop: 20 }}>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div style={{ marginTop: 20 }}>
        <button onClick={toggleUnit}>
          {unit === "C" ? "Switch to Fahrenheit" : "Switch to Celsius"}
        </button>
      </div>
      {weatherData && (
        <div>
          <h2>
            {weatherData.location.name}, {weatherData.location.region},{" "}
            {weatherData.location.country}
          </h2>
          <p>
            Temperature:{" "}
            {unit === "C"
              ? weatherData.current.temp_c
              : weatherData.current.temp_f}{" "}
            °{unit}
          </p>
          <p>Condition: {weatherData.current.condition.text}</p>
          <img
            src={weatherData.current.condition.icon}
            alt={weatherData.current.condition.text}
          />
          <p>Humidity: {weatherData.current.humidity} %</p>
          <p>Pressure: {weatherData.current.pressure_mb} mb</p>
          <p>Visibility: {weatherData.current.vis_km} km</p>
        </div>
      )}
      <div>
        <h3>Recent Searches</h3>
        <ul>
          {recentSearches.map((city, index) => (
            <li key={index} onClick={() => handleRecentSearchClick(city)}>
              {city}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
