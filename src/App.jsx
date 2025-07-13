import { useState } from 'react'
import WelcomeMessage from './components/WelcomeMessage'
import LeftBar from './components/LeftBar'
import HourlyWeather from './components/HourlyWeather'
import './App.css'
import SunnyWeather from './components/SunnyWeather'
import NightWeather from './components/NightWeather'
import SevenDayForecast from './components/SevenDayForecast'
import { motion } from "motion/react"

function App() {
  const [isDay, setIsDay] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  

  const handleDayChange = (dayStatus) => {
    setIsDay(dayStatus);
  }

  const getBackgroundClass = () => {
    if (isDay === null) return 'default-mode';
    if (isDay === 'Day') return 'day-mode';
    if (isDay === 'Night') return 'night-mode'; 
  }

  const renderBackgroundComponent = () => {
    if (isDay === 'Day') {
      return (
        <div className="background-component">
          <SunnyWeather />
        </div>
      );
    } else if (isDay === 'Night') {
      return (
        <div className="background-component">
          <NightWeather />
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {renderBackgroundComponent()}
      <motion.div className={'components'}>
        <motion.div className={`weatherInformation`}>
          <LeftBar 
            onDayChange={handleDayChange}
            onWeatherDataChange={setWeatherData}
          />
        </motion.div>
        <div className='detailedinformation'>
          <WelcomeMessage />
          <HourlyWeather weatherData={weatherData}/>
          <SevenDayForecast weatherData={weatherData}/>
        </div>
      </motion.div>
    </>
  )
}

export default App
