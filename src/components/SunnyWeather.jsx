import './SunnyWeather.css';

function SunnyWeather() {
  return (
    <div className="sunny-weather">
      <div className="sun"></div>
      <div className="clouds">
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
        <div className="cloud cloud3"></div>
      </div>
      <div className="birds">
        <div className="bird bird1"></div>
        <div className="bird bird2"></div>
      </div>
      <div className="sparkles">
        <div className="sparkle sparkle1"></div>
        <div className="sparkle sparkle2"></div>
        <div className="sparkle sparkle3"></div>
        <div className="sparkle sparkle4"></div>
        <div className="sparkle sparkle5"></div>
      </div>
    </div>
  );
}

export default SunnyWeather;