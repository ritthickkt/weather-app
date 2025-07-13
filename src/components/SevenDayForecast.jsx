import './SevenDayForecast.css';

function SevenDayForecast({ weatherData }) {
  
  const renderSevenDayForecast = () => {
    if (!weatherData || !weatherData.daily) {
      return <div className='no-data'>No forecast weather data available</div>;
    } else {
      return weatherData.daily.time.slice(0, 7).map((time, index) => {
        const temperatureMax = Math.round(weatherData.daily.temperature2mMax[index]);
        const temperatureMin = Math.round(weatherData.daily.temperature2mMin[index]);

        // const rainSum = weatherData.daily.rainSum[index];
        // const precipitationSum = weatherData.daily.precipitationSum[index];
        // const snowfallSum = weatherData.daily.snowfallSum[index];
        
        // Use the timezone from the weather data
        const timezone = weatherData.timezone || 'UTC';
        console.log(`Timezone: ${timezone}`);
        
        // Create dates in the city's timezone
        const currentTime = new Date(time);
        const currentDate = currentTime.toLocaleDateString('en-US', { 
          timeZone: timezone,
          weekday: 'short',
        });
        
        return (
          <div key={index} className='day'>
            <div className='date'>{currentDate}</div>
            <div></div>
            <div className='temperatureMin'>{temperatureMin}°C</div>
            <div className='line'></div>
            <div className='temperatureMax'>{temperatureMax}°C</div>
          
            {/* <div className='rain'>Rain: {rainSum}mm</div>
            <div className='cloud-cover'>Precipitation: {precipitationSum}%</div>
            <div className='cloud-cover'>Snowfall: {snowfallSum}%</div> */}
          </div>
        );
      });
    }
  }

  return (
    <div className='seven-day-forecast'>
      <div className='title'>Seven Day Forecast</div>
      {renderSevenDayForecast()}
    </div>
  )
}

export default SevenDayForecast;