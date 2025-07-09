import { fetchWeatherApi } from 'openmeteo';
import React, { useState, useEffect } from 'react';
import './LeftBar.css';
import { motion, time } from "motion/react";

function LeftBar({ onDayChange, onWeatherDataChange }) {
  const[cityName, setCityName] = useState('');
  const[display, setDisplay] = useState('');
  const [weather, setWeather] = useState(null);
  const [fetchingWeather, setFetchingWeather] = useState(false);
  const [isDay, setIsDay] = useState(null);

  const handleInputChange = (input) => {
    setDisplay(input.target.value);  // Only update display, not cityName
  };

  const fetchWeatherForCity = async (latitude, longitude, cityName, timezone) => {
    const params = {
      "latitude": latitude,
      "longitude": longitude,
      "daily": ["temperature_2m_max", "temperature_2m_min", "sunrise", "sunset"],
      "hourly": ["temperature_2m", "rain", "precipitation_probability", "relative_humidity_2m", "cloud_cover", "showers", "snowfall"],
      "current": ["is_day", "temperature_2m"]
    }
    const url = "https://api.open-meteo.com/v1/forecast";
    
    try {
      const responses = await fetchWeatherApi(url, params);
      const response = responses[0];
      const utcOffsetSeconds = response.utcOffsetSeconds();
      const timezoneAbbreviation = response.timezoneAbbreviation();
      const latitude = response.latitude();
      const longitude = response.longitude();
      const current = response.current();
      const hourly = response.hourly();
      const daily = response.daily();

      const sunrise = daily.variables(2);
      const sunset = daily.variables(3);
    
      const weatherData = {
        current: {
          time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
          isDay: current.variables(0).value(),
          temperature2m: current.variables(1).value(),
        },
        hourly: {
          time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
            (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
          ),
          temperature2m: hourly.variables(0).valuesArray(),
          rain: hourly.variables(1).valuesArray(),
          precipitationProbability: hourly.variables(2).valuesArray(),
          relativeHumidity2m: hourly.variables(3).valuesArray(),
          cloudCover: hourly.variables(4).valuesArray(),
          showers: hourly.variables(5).valuesArray(),
          snowfall: hourly.variables(6).valuesArray(),
        },
        daily: {
          time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
            (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
          ),
          temperature2mMax: daily.variables(0).valuesArray(),
          temperature2mMin: daily.variables(1).valuesArray(),
          sunrise: [...Array(sunrise.valuesInt64Length())].map(
            (_, i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
          ),
          sunset: [...Array(sunset.valuesInt64Length())].map(
            (_, i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
          ),
        },
        timezone: timezone,
      };

      if (onWeatherDataChange) {
        onWeatherDataChange(weatherData);
      }
 
      let dayStatus;
      if (weatherData.current.isDay) {
        dayStatus = 'Day';
      } else {
        dayStatus = 'Night';
      }
      setIsDay(dayStatus);
      if (onDayChange) {
        onDayChange(dayStatus);
      }
      setCityName(cityName);
      setWeather(Math.round(weatherData.current.temperature2m) + '°');
      setFetchingWeather(false);
      console.log('Weather data fetched successfully:', weatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }

  const getCityCoordinates = async (cityName) => {
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    try {
      const response = await fetch(geocodingUrl);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          latitude: result.latitude,
          longitude: result.longitude,
          timezone: result.timezone || 'UTC'
        }
      } else {
        throw new Error('City not found');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  const handleSearch = async () => { 
    setFetchingWeather(true);
    setDisplay('');  // Clear the input field aftr search
    try {
      const coordinates = await getCityCoordinates(display);
      if (coordinates === null) {
        setCityName('City not found');
        setWeather('N/A');
        if (onDayChange) {
          onDayChange(null); // Reset to null state
        }
        setFetchingWeather(false);
        return;
      }
      fetchWeatherForCity(coordinates.latitude, coordinates.longitude, display, coordinates.timezone);
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  return (
    <>
      <div className='searchBar'>
        <input className="inputbox" type="text" placeholder="Search for a city..." value={display} onChange={handleInputChange} onKeyDown={(e) => {
          if (e.key === 'Enter' && !fetchingWeather) { 
            handleSearch();
          }
        }}/>
        <motion.input
          key={cityName} 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className='cityname'
          type='text' 
          readOnly 
          value={cityName} 
        />
        <motion.input 
          key={weather}  // Re-trigger animation when weather changes
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={fetchingWeather ? 'temperature loading' : 'temperature'} 
          type="text" 
          value={fetchingWeather ? 'Loading...' : weather} 
          readOnly
        />
      </div>
    </>
  );
}

export default LeftBar;