import React from 'react';
import './HourlyWeather.css';
import rainicon from '/src/assets/rainicon.png';
import cloudySuny from '/src/assets/cloudySunny.png';
import cloudyNight from '/src/assets/cloudynight.png';
import sunny from '/src/assets/sunnyicon.png';
import nighty from '/src/assets/nightyicon.png';

function HourlyWeather({ weatherData }) {
  
  const renderHourlyWeather = () => {
    if (!weatherData || !weatherData.hourly) {
      return <div className='no-data'>No hourly weather data available</div>;
    } else {
      return weatherData.hourly.time.slice(0,24).map((time, index) => {
        const temperature = weatherData.hourly.temperature2m[index];
        const rain = weatherData.hourly.rain[index];
        const cloudCover = weatherData.hourly.cloudCover[index];
        
        // Use the timezone from the weather data
        const timezone = weatherData.timezone || 'UTC';
        console.log(`Timezone: ${timezone}`);
        // Create dates in the city's timezone
        const currentTime = new Date(time);
        const currentDate = currentTime.toLocaleDateString('en-US', { timeZone: timezone });
        
        // Find sunrise and sunset for the same date as currentTime
        let sunrise, sunset;
        
        // Check if we have daily data and find matching date
        if (weatherData.daily && weatherData.daily.time) {
          const dayIndex = weatherData.daily.time.findIndex(dayTime => {
            const dayDate = new Date(dayTime).toLocaleDateString('en-US', { timeZone: timezone });
            return dayDate === currentDate;
          });
          
          if (dayIndex !== -1) {
            sunrise = new Date(weatherData.daily.sunrise[dayIndex]);
            sunset = new Date(weatherData.daily.sunset[dayIndex]);
          } else {
            // Fallback to first day's data
            sunrise = new Date(weatherData.daily.sunrise[0]);
            sunset = new Date(weatherData.daily.sunset[0]);
          }
        } else {
          // Fallback if no daily data structure
          sunrise = new Date(weatherData.daily.sunrise[0]);
          sunset = new Date(weatherData.daily.sunset[0]);
        }
        // Check if current time is between sunrise and sunset
        const isDayTime = currentTime >= sunrise && currentTime <= sunset;

        return (
          <div key={index} className='hourly-item'>
            <div className='weather-icon'>
              {rain > 0 ? (
                <img src={rainicon} alt='Rain' />
              ) : isDayTime ? (
                cloudCover > 50 ? (
                  <img src={cloudySuny} alt='Cloudy Day' />
                ) : (
                  <img src={sunny} alt='Sunny' />
                )
              ) : (
                cloudCover > 50 ? (
                  <img src={cloudyNight} alt='Cloudy Night' />
                ) : (
                  <img src={nighty} alt='Clear Night' />
                )
              )}
            </div>
            <div className='time'>
              {new Date(time).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                timeZone: timezone 
              })}
            </div>
            <div className='hourtemperature'>{Math.round(temperature)}°C</div>
          </div>
        );
      });
    }
  }

  return (
    <div className='hourlyWeather'>
      <h2>Hourly Weather</h2>
      <div className='hourly-list'>
        {renderHourlyWeather()}
      </div>
    </div>
  );  
}

export default HourlyWeather