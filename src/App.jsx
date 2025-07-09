import { useState } from 'react'
import WelcomeMessage from './components/WelcomeMessage'
import LeftBar from './components/LeftBar'
import HourlyWeather from './components/HourlyWeather'
import './App.css'
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

  return (
    <>
      <motion.div className={`components ${getBackgroundClass()}`}>
        <motion.div className={`weatherInformation`}>
          <LeftBar 
            onDayChange={handleDayChange}
            onWeatherDataChange={setWeatherData}
          />
        </motion.div>
        <div className='detailedinformation'>
          <WelcomeMessage />
          <HourlyWeather weatherData={weatherData}/>
        </div>
      </motion.div>
    </>
  )
}

export default App
